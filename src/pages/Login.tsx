import { useState } from 'react';

type Props = {
  onLogin: (user: { name: string; squad: string }) => void;
};

export default function Login({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [squad, setSquad] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // ⬇️ КОД СМЕНЫ БЕРЁМ ИЗ .env
  const SHIFT_CODE = import.meta.env.VITE_SHIFT_CODE;

  function handleLogin() {
    setError('');

    if (!name.trim() || !squad.trim() || !code.trim()) {
      setError('Заполните все поля');
      return;
    }

    if (code !== SHIFT_CODE) {
      setError('Неверный код смены');
      return;
    }

    const user = {
      name: name.trim(),
      squad: squad.trim(),
    };

    // 💾 сохраняем в браузере
    localStorage.setItem('user', JSON.stringify(user));

    onLogin(user);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">
          Вход для вожатого
        </h1>

        <input
          type="text"
          placeholder="ФИО"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Отряд"
          value={squad}
          onChange={(e) => setSquad(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Код смены"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {error && (
          <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
