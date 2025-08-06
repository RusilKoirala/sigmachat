import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import { onSnapshot } from 'firebase/firestore';

export function useFirestoreQuery(query) {
  const [docs, setDocs] = useState([]);
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    if (!queryRef.current) return;

    const unsubscribe = onSnapshot(
      queryRef.current,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log('Real-time update received:', data.length, 'messages');
        setDocs(data);
      },
      (error) => {
        console.error('Error in real-time listener:', error);
      }
    );

    return unsubscribe;
  }, [query]);

  return docs;
}

export function useRequireUsername() {
  const { username } = useContext(UsernameContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) {
      navigate('/', { replace: true });
    }
  }, [username, navigate]);
}

export function getAvatarUrl(username) {
  if (username === 'System' || username === 'Server') {
    return '/server-avatar.svg';
  }
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;
}

export function useDarkMode() {
  const [enabled, setEnabled] = useState(true); // Always dark mode by default
  useEffect(() => {
    if (enabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [enabled]);
  return [enabled, setEnabled];
}