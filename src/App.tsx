import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Загрузка…
      </div>
    );
  }

  if (!user) {
    return (
      <Login
        onLogin={(u: any) => {
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
        }}
      />
    );
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
