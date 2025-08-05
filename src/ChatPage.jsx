import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import { useFirestoreQuery, getAvatarUrl, useRequireUsername } from './hooks.js';
import Loader from './components/Loader.jsx';
import MessageRenderer from './components/MessageRenderer.jsx';
import SigmaIcon from './components/SigmaIcon.jsx';
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, arrayUnion, query, orderBy, limit, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AUTH_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, 'messages');
const presenceRef = collection(db, 'presence');

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PRESENCE_TIMEOUT = 60 * 1000; // 60 seconds
const HEARTBEAT_INTERVAL = 20 * 1000; // 20 seconds

const ChatPage = () => {
  useRequireUsername();
  const { username, setUsername } = useContext(UsernameContext);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSessionId, setAdminSessionId] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const navigate = useNavigate();

  // Admin password (in a real app, this would be server-side)
  const ADMIN_PASSWORD = 'sigma123';

  // Check admin session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem(`sigmachat-admin-${username}`);
    const sessionTime = localStorage.getItem(`sigmachat-admin-time-${username}`);

    if (sessionId && sessionTime) {
      const timeDiff = Date.now() - parseInt(sessionTime);
      // Admin session expires after 30 minutes
      if (timeDiff < 30 * 60 * 1000) {
        setIsAdmin(true);
        setAdminSessionId(sessionId);
      } else {
        // Clear expired session
        localStorage.removeItem(`sigmachat-admin-${username}`);
        localStorage.removeItem(`sigmachat-admin-time-${username}`);
      }
    }
  }, [username]);

  // Clear admin session on logout
  const clearAdminSession = () => {
    setIsAdmin(false);
    setAdminSessionId(null);
    localStorage.removeItem(`sigmachat-admin-${username}`);
    localStorage.removeItem(`sigmachat-admin-time-${username}`);
  };
  // Chronological order: oldest at top, newest at bottom
  const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));
  const messages = useFirestoreQuery(messagesQuery);
  const bottomListRef = useRef();
  const chatContainerRef = useRef();
  const [loading, setLoading] = useState(false);

  // Presence: add/update on mount, remove on unmount, heartbeat
  useEffect(() => {
    if (!username) return;
    const userDoc = doc(presenceRef, username);
    const updatePresence = () => setDoc(userDoc, {
      username,
      avatarUrl: getAvatarUrl(username),
      lastActive: Date.now(),
    });
    updatePresence();
    const interval = setInterval(updatePresence, HEARTBEAT_INTERVAL);
    // Remove presence on unload
    const removePresence = () => deleteDoc(userDoc);
    window.addEventListener('beforeunload', removePresence);
    return () => {
      clearInterval(interval);
      removePresence();
      window.removeEventListener('beforeunload', removePresence);
    };
  }, [username]);

  // Listen for active users in presence collection
  useEffect(() => {
    const unsubscribe = onSnapshot(presenceRef, snapshot => {
      const now = Date.now();
      const users = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.lastActive && now - u.lastActive < PRESENCE_TIMEOUT);
      setActiveUsers(users);
    });
    return unsubscribe;
  }, []);

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isNearBottom);
      setShowScrollButton(!isNearBottom && messages && messages.length > 0);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle auto-scroll only for new messages when user is at bottom
  useEffect(() => {
    if (isAtBottom && bottomListRef.current && messages && messages.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (bottomListRef.current) {
          bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [messages?.length, isAtBottom]);

  const scrollToBottom = () => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsAtBottom(true);
      setShowScrollButton(false);
    }
  };

  const handleOnChange = e => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;
    if (!username) {
      setError('You must set a username to send messages.');
      return;
    }

    // Skip spam prevention for commands and admin users
    const isCommand = trimmedMessage.startsWith('/');

    // Spam prevention (skip for admin and commands)
    if (!isAdmin && !isCommand) {
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime;

      // Reset message count if more than 60 seconds have passed
      if (timeSinceLastMessage > 60000) {
        setMessageCount(0);
      }

      // Check rate limits
      if (timeSinceLastMessage < 1000) { // Less than 1 second
        setError('Please wait before sending another message.');
        return;
      }

      if (messageCount >= 5 && timeSinceLastMessage < 60000) { // More than 5 messages in 60 seconds
        setError('Too many messages. Please wait a moment.');
        return;
      }

      setLastMessageTime(now);
      setMessageCount(prev => prev + 1);
    }

    // Handle admin login
    if (trimmedMessage.startsWith('/login ')) {
      const password = trimmedMessage.slice(7).trim();
      if (password === ADMIN_PASSWORD) {
        const sessionId = Date.now().toString();
        setIsAdmin(true);
        setAdminSessionId(sessionId);
        localStorage.setItem(`sigmachat-admin-${username}`, sessionId);
        localStorage.setItem(`sigmachat-admin-time-${username}`, Date.now().toString());
        setNewMessage('');
        setError('Admin mode activated (session-based)');
        setTimeout(() => setError(''), 3000);
      } else {
        setError('Invalid admin password');
        setTimeout(() => setError(''), 3000);
      }
      setNewMessage('');
      return;
    }

    // Handle admin logout
    if (trimmedMessage === '/logout' && isAdmin) {
      clearAdminSession();
      setNewMessage('');
      setError('Admin mode deactivated');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Handle public commands
    if (trimmedMessage.startsWith('/')) {
      const command = trimmedMessage.slice(1).toLowerCase();
      const args = command.split(' ');
      const cmd = args[0];

      let responseMessage = '';
      let isPublicCommand = true;

      switch (cmd) {
        case 'help':
        case 'commands':
          responseMessage = `📋 **Commands**

\`/help\` - Show commands
\`/info\` - About SigmaChat
\`/ping\` - Test response
\`/bold\` - Bold text help
\`/italic\` - Italic text help
\`/code\` - Code format help${isAdmin ? '\n\n**Admin:**\n`/clear` - Clear chat\n`/kick [user]` - Kick user\n`/logout` - End admin' : ''}`;
          break;

        case 'info':
          responseMessage = `ℹ️ **SigmaChat**

A shit chat app for my frds
• Real-time messaging
• Markdown support
• No registration needed

Version: 1.0.0`;
          break;

        case 'ping':
          const startTime = Date.now();
          responseMessage = `🏓 Pong! ${Date.now() - startTime}ms`;
          break;

        case 'bold':
          responseMessage = `**Bold Text:**
Use \`**text**\` → **text**`;
          break;

        case 'italic':
          responseMessage = `*Italic Text:*
Use \`*text*\` → *text*`;
          break;

        case 'code':
          responseMessage = `\`Code Formatting:\`

Inline: \`\`code\`\`
Blocks: \`\`\`code\`\`\``;
          break;

        default:
          isPublicCommand = false;
      }

      if (isPublicCommand) {
        setLoading(true);
        setError('');
        try {
          await addDoc(messagesRef, {
            username: 'Server',
            avatarUrl: getAvatarUrl('Server'),
            text: responseMessage,
            createdAt: serverTimestamp(),
            seenBy: [username],
          });
          setNewMessage('');
        } catch (err) {
          setError('Failed to execute command.');
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    // Handle admin commands (visible to all)
    if (isAdmin && trimmedMessage.startsWith('/')) {
      const commandParts = trimmedMessage.slice(1).split(' ');
      const command = commandParts[0].toLowerCase();
      const args = commandParts.slice(1);
      let commandMessage = '';
      let shouldClearChat = false;

      switch (command) {
        case 'clear':
          commandMessage = '🔧 Admin cleared the chat';
          shouldClearChat = true;
          break;
        case 'kick':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `🔧 Admin kicked user: ${targetUser}`;
          } else {
            setError('Usage: /kick [username]');
            setNewMessage('');
            return;
          }
          break;
        case 'ban':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `🔧 Admin banned user: ${targetUser}`;
          } else {
            commandMessage = '🔧 Admin used ban command';
          }
          break;
        case 'mute':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `🔧 Admin muted user: ${targetUser}`;
          } else {
            commandMessage = '🔧 Admin used mute command';
          }
          break;
        default:
          commandMessage = `🔧 Admin executed: /${trimmedMessage.slice(1)}`;
      }

      setLoading(true);
      setError('');
      try {
        // Clear all messages if it's a clear command
        if (shouldClearChat) {
          const snapshot = await getDocs(messagesRef);
          const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
        }

        // Add the command message
        await addDoc(messagesRef, {
          username: 'Server',
          avatarUrl: getAvatarUrl('Server'),
          text: commandMessage,
          createdAt: serverTimestamp(),
          seenBy: [username],
        });
        setNewMessage('');
      } catch (err) {
        setError('Failed to execute command.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (trimmedMessage.length > 500) {
      setError('Message too long (max 500 characters).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDoc(messagesRef, {
        username,
        avatarUrl: getAvatarUrl(username),
        text: trimmedMessage,
        createdAt: serverTimestamp(),
        seenBy: [username],
      });
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setUsername('');
    localStorage.removeItem('sigmachat-username');
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
                <SigmaIcon className="w-6 h-6" />
                <span>SIGMA</span>
              </Link>
              <div className="flex space-x-6">
                <Link
                  to="/chat"
                  className="text-white font-medium border-b-2 border-white"
                >
                  Chat
                </Link>
                <Link
                  to="/codes"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Code
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 font-bold hidden sm:block">
                Made By OG Rusil
              </span>
              <button
                onClick={() => setShowUsers(v => !v)}
                className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Users ({activeUsers.length})
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Active users modal/dropdown */}
      {showUsers && (
        <div className="fixed top-16 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-6 z-60 w-72 max-h-80 overflow-y-auto">
          <div className="font-bold mb-4 text-white text-lg">Active Users</div>
          <ul className="space-y-3">
            {activeUsers.map(u => (
              <li key={u.username} className="flex items-center">
                <img src={u.avatarUrl} alt={u.username} className="w-8 h-8 rounded-full mr-3" />
                <span className="text-white">{u.username}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowUsers(false)}
            className="mt-4 w-full px-4 py-2 border border-gray-600 text-white hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      )}

      {/* Chat area */}
      <main className="flex-1 flex flex-col h-full pt-16 relative">
        <div
          ref={chatContainerRef}
          className="flex-1 px-4 py-4 flex flex-col space-y-3 overflow-y-auto scrollbar-hide"
          style={{
            minHeight: 0,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {messages && messages.length > 0 ? (
            messages.map(msg => (
              <div
                key={msg.id}
                className={classNames(
                  "mb-2",
                  msg.isSystemMessage
                    ? "flex justify-center"
                    : "flex items-end"
                )}
              >
                {msg.isSystemMessage ? (
                  <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-600">
                    <MessageRenderer text={msg.text} />
                  </div>
                ) : (
                  <>
                    <img
                      src={msg.avatarUrl}
                      alt={msg.username}
                      className="w-10 h-10 rounded-full mr-3 shadow-lg"
                    />
                    <div className={classNames(
                      'rounded-2xl px-4 py-3 max-w-md shadow-lg',
                      msg.username === username
                        ? 'bg-gray-900 text-white border border-gray-700 rounded-br-md'
                        : 'bg-black text-white border border-gray-800 rounded-bl-md'
                    )}>
                      <div className="flex items-center mb-1">
                        <span className="font-bold mr-2 text-sm">{msg.username}</span>
                        {msg.createdAt?.seconds && (
                          <span className="text-xs opacity-60">
                            {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <MessageRenderer text={msg.text} />
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <Loader size="lg" />
              <span className="ml-4">No messages yet.</span>
            </div>
          )}
          <div ref={bottomListRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-6 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all transform hover:scale-110 z-40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        {/* Message input */}
        <form
          onSubmit={handleOnSubmit}
          className="flex items-center p-4 border-t border-gray-800 bg-black"
        >
          <div className="flex-1 relative">
            {isAdmin && (
              <div className="absolute -top-8 left-0 bg-red-600 text-white px-2 py-1 rounded text-xs">
                ADMIN MODE
              </div>
            )}
            <input
              type="text"
              className={classNames(
                "w-full bg-gray-900 text-white rounded-full px-6 py-3 mr-4 focus:outline-none focus:ring-2 border",
                isAdmin
                  ? "focus:ring-red-500 border-red-600"
                  : "focus:ring-white border-gray-700"
              )}
              placeholder={isAdmin ? "Type message or /command..." : "Type your message..."}
              value={newMessage}
              onChange={handleOnChange}
              maxLength={500}
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={loading || !newMessage.trim()}
          >
            Send
          </button>
        </form>
        {error && <div className="text-red-500 text-center py-2">{error}</div>}
      </main>
    </div>
  );
};

export default ChatPage;