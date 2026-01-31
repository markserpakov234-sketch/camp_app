import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Home
      user={user}
      onLogout={() => {
        localStorage.removeItem('user');
        setUser(null);
      }}
    />
  );
}
