import { useState } from 'react';

type Props = {
  onLogin: (user: { name: string; squad: string }) => void;
};

export default function Login({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [squad, setSquad] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const SHIFT_CODE = import.meta.env.VITE_SHIFT_CODE;

  function handleLogin() {
    setError('');

    if (!name.trim() || !squad.trim() || !code.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (code !== SHIFT_CODE) {
      setError('Код смены введён неверно');
      return;
    }

    const user = {
      name: name.trim(),
      squad: squad.trim(),
    };

    localStorage.setItem('user', JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Бренд */}
        <div className="text-center mb-8">
          <div className="text-[26px] font-extrabold tracking-wide text-gray-800">
            ТОЧКА СБОРКИ
          </div>
          <div className="text-[13px] font-bold tracking-widest text-orange-500">
            ДЕТСКИЙ КУРОРТ ВИТА
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Вход для сотрудников смены
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Пожалуйста, введите данные для входа
        </p>

        {/* Форма */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Фамилия и имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            placeholder="№ города"
            value={squad}
            onChange={(e) => setSquad(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Код смены"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mt-4 text-sm text-center text-red-500">
            {error}
          </div>
        )}

        {/* Кнопка */}
        <button
          onClick={handleLogin}
          className="mt-6 w-full py-3 rounded-xl
            bg-orange-500 text-white font-semibold
            hover:bg-orange-600 transition"
        >
          Войти в систему
        </button>
      </div>
    </div>
  );
}
