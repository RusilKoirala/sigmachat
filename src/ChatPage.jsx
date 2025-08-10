import { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import { useFirestoreQuery, getAvatarUrl, useRequireUsername } from './hooks.js';
import Loader from './components/Loader.jsx';
import MessageRenderer from './components/MessageRenderer.jsx';
import SigmaIcon from './components/SigmaIcon.jsx';
import { AdBanner1, AdBanner2 } from './components/AdManager.jsx';

import { containsProfanity, getBadWordWarning } from './utils/profanityFilter';
import { getFirestore, collection, addDoc, doc, serverTimestamp, query, orderBy, limit, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
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
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [spamPenalty, setSpamPenalty] = useState(0); // Penalty end time
  const [spamStrikes, setSpamStrikes] = useState(0); // Number of spam violations
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);
  const navigate = useNavigate();

  // Admin password (obfuscated)
  const getAdminPassword = () => {
    const encoded = 'c2lnbWExMjM='; // Base64 encoded
    return atob(encoded);
  };

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
      if (password === getAdminPassword()) {
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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:text-blue-400 transition-colors group">
            <SigmaIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
            <span className="font-bold text-lg sm:text-xl tracking-tight">SIGMA</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-8">
            <Link to="/chat" className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-1 text-sm sm:text-base">Chat</Link>
            <Link to="/codes" className="text-slate-300 hover:text-white transition-colors font-medium text-sm sm:text-base hidden sm:inline">Codes</Link>
            <Link to="/bhailang" className="text-slate-300 hover:text-white transition-colors font-medium text-sm sm:text-base hidden sm:inline">Bhai Lang</Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs text-slate-400 font-bold hidden md:block">
                {username}
              </span>
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm font-medium"
              >
                Users ({activeUsers.length})
              </button>
              <button
                onClick={handleLogout}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-black hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Active users modal/dropdown */}
      {showUsers && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowUsers(false)}></div>
          <div className="fixed top-20 right-6 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 z-60 w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">Active Users ({activeUsers.length})</h3>
              <button
                onClick={() => setShowUsers(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-3">
              {activeUsers.map(u => (
                <li key={u.username} className="flex items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <img src={u.avatarUrl} alt={u.username} className="w-10 h-10 rounded-full mr-3 border-2 border-slate-600" />
                  <div className="flex-1">
                    <span className="text-white font-medium">{u.username}</span>
                    <div className="text-xs text-slate-400">Online</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Main content with sidebar */}
      <main className="flex-1 flex h-full pt-16 relative">
        {/* Responsive Ad Sidebar */}
        <aside className="hidden lg:block w-44 xl:w-48 bg-slate-900/50 border-r border-slate-800 fixed left-0 top-14 sm:top-16 z-10" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="p-2 xl:p-3 space-y-2 xl:space-y-3 h-full overflow-hidden flex flex-col">
            {/* Main Ad - Responsive */}
            <div className="flex-shrink-0">
              <AdBanner1 className="mx-auto rounded-lg overflow-hidden" show={true} />
            </div>

            {/* Small Ad Below - Responsive */}
            <div className="flex-shrink-0">
              <AdBanner2 className="mx-auto rounded-lg overflow-hidden" show={true} />
            </div>
          </div>
        </aside>

        {/* Mobile Ad Bar (shown on small screens) */}
        <div className="md:hidden w-full bg-gray-950 border-b border-gray-800 fixed top-14 left-0 z-10 h-16">
          <div className="flex justify-center items-center h-full px-2 space-x-2">
            <div className="w-24 h-12 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
              Ad 1
            </div>
            <div className="w-24 h-12 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
              Ad 2
            </div>
          </div>
        </div>

        {/* Chat area - Responsive margins */}
        <div className="flex-1 flex flex-col h-full relative lg:ml-44 xl:ml-48 pt-14 sm:pt-16">
        <div
          ref={chatContainerRef}
          className="flex-1 px-4 sm:px-6 py-4 sm:py-6 flex flex-col space-y-3 sm:space-y-4 overflow-y-auto scrollbar-hide"
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
          className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm"
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
                "w-full bg-gray-900 text-slate-100 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 focus:outline-none focus:ring-2 border transition-all duration-200 placeholder-gray-500 text-sm sm:text-base",
                isAdmin
                  ? "focus:ring-red-500 border-red-600/50 focus:border-red-500"
                  : "focus:ring-blue-500 border-gray-900 focus:border-blue-500"
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
            className={classNames(
              "flex items-center justify-center py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 border shadow-lg text-sm sm:text-base",
              loading || !newMessage.trim()
                ? "bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed"
                : isAdmin
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-600 hover:border-red-700 hover:shadow-red-500/25"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-600 hover:border-blue-700 hover:shadow-blue-500/25"
            )}
            disabled={loading || !newMessage.trim()}
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        {error && <div className="text-red-400 text-center py-2 text-sm border border-red-800 bg-red-950 rounded-lg mx-4 mb-2">{error}</div>}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;