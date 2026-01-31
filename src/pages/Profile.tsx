import { useMemo } from 'react';
import {
  MapPin,
  Trophy,
  Star,
  Heart,
  LogOut,
} from 'lucide-react';

const quotes = [
  'Каждый день — новая возможность 🌱',
  'Ты важен. Ты нужен. Ты на своём месте.',
  'Маленькие шаги тоже путь вперёд',
  'Лагерь — это про людей ❤️',
  'Сегодня ты можешь больше, чем вчера',
];

export default function Profile({ user, onLogout }: any) {
  const [name = '', surname = ''] = user.name.split(' ');

  const initials =
    (name[0] || '').toUpperCase() +
    (surname[0] || '').toUpperCase();

  const quote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      {/* 🟧 ВЕРХНЯЯ ПЛАШКА */}
      <div className="bg-orange-500 text-white rounded-3xl p-6 shadow-lg mb-6">
        <div className="flex items-center gap-4">
          {/* 👤 Аватар */}
          <div className="w-16 h-16 rounded-full bg-white text-orange-500 flex items-center justify-center text-2xl font-extrabold">
            {initials}
          </div>

          <div>
            <div className="text-sm opacity-90">Профиль</div>
            <div className="text-xl font-extrabold leading-tight">
              {user.name}
            </div>
          </div>
        </div>
      </div>

      {/* 🌱 МОТИВАЦИЯ */}
      <div className="bg-white rounded-2xl p-4 shadow mb-6">
        <div className="text-sm text-gray-500 mb-1">
          Сегодняшняя мысль
        </div>
        <div className="text-lg font-semibold text-gray-800">
          {quote}
        </div>
      </div>

      {/* 📍 ИНФОРМАЦИЯ */}
      <div className="bg-white rounded-2xl p-4 shadow mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-xs text-gray-500">Город</div>
            <div className="font-semibold text-gray-800">
              {user.city || 'Не указан'}
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 ДОСТИЖЕНИЯ */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-600 mb-2">
          Достижения
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow flex flex-col items-center gap-1">
            <Star className="w-6 h-6 text-yellow-400" />
            <div className="text-xs text-center">
              Активный участник
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow flex flex-col items-center gap-1">
            <Heart className="w-6 h-6 text-pink-500" />
            <div className="text-xs text-center">
              Любимчик детей
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow flex flex-col items-center gap-1">
            <Trophy className="w-6 h-6 text-orange-500" />
            <div className="text-xs text-center">
              Первый день
            </div>
          </div>
        </div>
      </div>

      {/* 🚪 ВЫХОД */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
      >
        <LogOut className="w-5 h-5" />
        Выйти
      </button>
    </div>
  );
}
