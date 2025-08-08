import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import { useFirestoreQuery, getAvatarUrl, useRequireUsername } from './hooks.js';
import Loader from './components/Loader.jsx';
import MessageRenderer from './components/MessageRenderer.jsx';
import SigmaIcon from './components/SigmaIcon.jsx';
import AdBanner1 from './components/AdBanner1.jsx';
import AdBanner2 from './components/AdBanner2.jsx';
import { containsProfanity, getBadWordWarning } from './utils/profanityFilter';
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

const PRESENCE_TIMEOUT = 30 * 1000; // 30 seconds - faster timeout for more real-time presence
const HEARTBEAT_INTERVAL = 10 * 1000; // 10 seconds - more frequent heartbeat

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
  const [spamPenalty, setSpamPenalty] = useState(0); // Penalty end time
  const [spamStrikes, setSpamStrikes] = useState(0); // Number of spam violations
  const [penaltyCountdown, setPenaltyCountdown] = useState(0); // Real-time countdown
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);
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
  // Chronological order: oldest at top, newest at bottom - increased limit for more history
  const messagesQuery = useMemo(() =>
    query(messagesRef, orderBy('createdAt', 'asc'), limit(200)),
    [messagesRef]
  );
  const messages = useFirestoreQuery(messagesQuery);
  const bottomListRef = useRef();
  const chatContainerRef = useRef();
  const inputRef = useRef();
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

  // Listen for active users in presence collection - real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(presenceRef, snapshot => {
      const now = Date.now();
      const users = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.lastActive && now - u.lastActive < PRESENCE_TIMEOUT)
        .sort((a, b) => a.username.localeCompare(b.username)); // Sort alphabetically
      setActiveUsers(users);
    }, error => {
      console.error('Error listening to presence:', error);
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
      // Use setTimeout to ensure DOM is updated - reduced delay for faster scroll
      setTimeout(() => {
        if (bottomListRef.current) {
          bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }

    // Show new message indicator briefly when not at bottom
    if (!isAtBottom && messages && messages.length > 0) {
      setNewMessageIndicator(true);
      setTimeout(() => setNewMessageIndicator(false), 3000);
    }
  }, [messages?.length, isAtBottom]);

  // Handle spam penalty countdown
  useEffect(() => {
    if (spamPenalty > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (spamPenalty > now) {
          const remaining = Math.ceil((spamPenalty - now) / 1000);
          setPenaltyCountdown(remaining);

          // Update error message with countdown
          const minutes = Math.floor(remaining / 60);
          const seconds = remaining % 60;
          const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
          setError(`Spam cooldown: ${timeDisplay} remaining`);
        } else {
          // Penalty expired
          setSpamPenalty(0);
          setPenaltyCountdown(0);
          setError('');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [spamPenalty]);

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

      // Check if user is currently penalized (skip for admins)
      if (!isAdmin && spamPenalty > now) {
        const remainingTime = Math.ceil((spamPenalty - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        setError(`🚫 Spam cooldown: ${timeDisplay} remaining`);
        return;
      }

      // Check rate limits
      if (timeSinceLastMessage < 1000) { // 1 second minimum between messages
        setError('Please wait before sending another message.');
        return;
      }

      // Reset message count if more than 60 seconds have passed
      if (timeSinceLastMessage >= 60000) {
        setMessageCount(1); // Reset to 1 (current message)
        // Also reset spam strikes after 5 minutes of good behavior
        if (timeSinceLastMessage >= 300000) {
          setSpamStrikes(0);
        }
      } else {
        // Skip spam penalties for admins
        if (!isAdmin && messageCount >= 8) { // 8 messages in 60 seconds triggers penalty
          // Progressive penalties
          const newStrikes = spamStrikes + 1;
          setSpamStrikes(newStrikes);

          let penaltyDuration;
          if (newStrikes === 1) {
            penaltyDuration = 30000; // 30 seconds
            setError('Slow down. 30 second cooldown for spamming.');
          } else if (newStrikes === 2) {
            penaltyDuration = 60000; // 1 minute
            setError('Spam detected. 1 minute cooldown.');
          } else if (newStrikes === 3) {
            penaltyDuration = 300000; // 5 minutes
            setError('Excessive spam. 5 minute cooldown.');
          } else {
            penaltyDuration = 600000; // 10 minutes
            setError('Severe spam violation. 10 minute cooldown.');
          }

          setSpamPenalty(now + penaltyDuration);
          setMessageCount(0); // Reset count
          return;
        }
        setMessageCount(prev => prev + 1);
      }

      setLastMessageTime(now);
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
      // Refocus input after command
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    // Handle admin logout
    if (trimmedMessage === '/logout' && isAdmin) {
      clearAdminSession();
      setNewMessage('');
      setError('Admin mode deactivated');
      setTimeout(() => setError(''), 3000);
      // Refocus input after command
      setTimeout(() => inputRef.current?.focus(), 100);
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
          responseMessage = `Commands

\`/help\` - Show commands
\`/info\` - About SigmaChat
\`/ping\` - Test response
\`/rules\` - Chat rules
\`/bold\` - Bold text help
\`/italic\` - Italic text help
\`/code\` - Code format help${isAdmin ? '\n\nAdmin:\n`/clear` - Clear chat\n`/kick [user]` - Kick user\n`/logout` - End admin' : ''}`;
          break;

        case 'info':
          responseMessage = `SigmaChat\n\nA shit chat app for my frds\n• Real-time messaging\n• Markdown support\n• No registration needed\n\nVersion: 1.0.0`;
          break;

        case 'ping':
          const startTime = Date.now();
          responseMessage = `Pong! ${Date.now() - startTime}ms`;
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

        case 'rules':
          responseMessage = `Chat Rules:\n\n• Be respectful to everyone\n• No spam or flooding\n• No bad language or profanity\n• Keep conversations friendly`;
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
        // Refocus input after command
        setTimeout(() => inputRef.current?.focus(), 100);
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
          commandMessage = 'Admin cleared the chat';
          shouldClearChat = true;
          break;
        case 'kick':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `Admin kicked user: ${targetUser}`;
          } else {
            setError('Usage: /kick [username]');
            setNewMessage('');
            return;
          }
          break;
        case 'ban':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `Admin banned user: ${targetUser}`;
          } else {
            commandMessage = 'Admin used ban command';
          }
          break;
        case 'mute':
          if (args.length > 0) {
            const targetUser = args[0];
            commandMessage = `Admin muted user: ${targetUser}`;
          } else {
            commandMessage = 'Admin used mute command';
          }
          break;
        default:
          commandMessage = `Admin executed: /${trimmedMessage.slice(1)}`;
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
      // Refocus input after admin command
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    if (trimmedMessage.length > 500) {
      setError('Message too long (max 500 characters).');
      return;
    }

    // Check for profanity (skip for admin users)
    if (!isAdmin) {
      const hasProfanity = containsProfanity(trimmedMessage);

      if (hasProfanity) {
        const warningMessage = getBadWordWarning();
        setError(warningMessage);
        console.log('Profanity detected for user:', username, 'Message blocked');

        // Clear error after 3 seconds (reduced from 4)
        setTimeout(() => {
          setError('');
        }, 3000);

        // Refocus input after profanity warning
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
        return;
      }
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

    // Refocus input after sending message
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleLogout = () => {
    clearAdminSession();
    setUsername('');
    localStorage.removeItem('sigmachat-username');
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

      {/* Main content with sidebar */}
      <main className="flex-1 flex h-full pt-16 relative">
        {/* Left Sidebar - Ad */}
        <aside className="hidden lg:block w-44 bg-gray-950 border-r border-gray-800">
          <div className="sticky top-20 p-2 space-y-2 max-h-screen overflow-hidden">
            {/* Main Ad - 160x600 */}
            <AdBanner1 className="mx-auto" />

            {/* Small Ad Below - 160x300 */}
            <AdBanner2 className="mx-auto" />
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col h-full relative">
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
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className={classNames(
                      'rounded-lg px-4 py-3 max-w-md',
                      msg.username === username
                        ? 'bg-gray-900 text-white border border-gray-700'
                        : 'bg-black text-white border border-gray-800'
                    )}>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2 text-sm text-gray-300 tracking-wide">{msg.username}</span>
                        {msg.createdAt?.seconds && (
                          <span className="text-xs text-gray-500">
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
            className={`fixed bottom-20 right-6 bg-gray-900 border border-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all z-40 ${newMessageIndicator ? 'ring-2 ring-blue-500' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {newMessageIndicator && (
              <span className="sr-only">New messages</span>
            )}
          </button>
        )}
        {/* Message input */}
        <form
          onSubmit={handleOnSubmit}
          className="flex items-center p-4 border-t border-gray-800 bg-black"
        >
          <div className="flex-1 relative">
            {isAdmin && (
              <div className="absolute -top-8 left-0 border border-red-600 text-red-400 px-2 py-1 rounded text-xs tracking-wider">
                ADMIN MODE
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              className={classNames(
                "w-full bg-gray-900 text-white rounded-lg px-4 py-3 mr-4 focus:outline-none focus:ring-1 border",
                isAdmin
                  ? "focus:ring-red-500 border-red-600"
                  : "focus:ring-gray-500 border-gray-700"
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
            className="bg-gray-800 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 border border-gray-700"
            disabled={loading || !newMessage.trim()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        {error && <div className="text-red-400 text-center py-2 text-sm border border-red-800 bg-red-950 rounded-lg mx-4 mb-2">{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;