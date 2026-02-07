import { useState } from 'react';
import {
  Home as HomeIcon,
  Calendar,
  MapPin,
  AlertTriangle,
  Tent,
  BookOpen,
  Bus,
} from 'lucide-react';

import HomeMain from './HomeMain';
import Schedule from './Schedule';
import Map from './Map';
import Emergency from './Emergency';
import Profile from './Profile';
import GameRoom from './GameRoom';
import Education from './Education';
import Excursions from './Excursions';

type Tab =
  | 'home'
  | 'schedule'
  | 'education'
  | 'excursions'
  | 'map'
  | 'emergency'
  | 'games'
  | 'profile';

export default function Home({ user, onLogout }: any) {
  const [tab, setTab] = useState<Tab>('home');

  function render() {
    switch (tab) {
      case 'schedule':
        return <Schedule />;
      case 'education':
        return <Education />;
      case 'excursions':
        return <Excursions />;
      case 'games':
        return <GameRoom />;
      case 'map':
        return <Map />;
      case 'emergency':
        return <Emergency />;
      case 'profile':
        return <Profile user={user} onLogout={onLogout} />;
      default:
        return <HomeMain user={user} />;
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-100">
      {render()}

      {/* 🔻 НИЖНЕЕ МЕНЮ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">

          {/* 🌅 Весенний световой фон */}
          <div className="absolute inset-0">

            {/* Основной градиент */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-orange-200 to-pink-200 opacity-70" />

            {/* Мягкий свет слева */}
            <div className="absolute -top-10 -left-20 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl" />

            {/* Тёплый луч справа */}
            <div className="absolute -bottom-16 right-0 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl" />

            {/* Глубина снизу */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          </div>

          {/* 🌿 Подсветка активной вкладки */}
          <ActiveGlow tab={tab} />

          {/* 🧊 Glass слой */}
          <div className="relative backdrop-blur-2xl bg-white/75 border border-white/60 rounded-3xl">
            <div className="relative flex justify-around py-4 text-xs">

              <Menu icon={HomeIcon} label="Точка" active={tab === 'home'} onClick={() => setTab('home')} />
              <Menu icon={Calendar} label="День" active={tab === 'schedule'} onClick={() => setTab('schedule')} />
              <Menu icon={BookOpen} label="Обучение" active={tab === 'education'} onClick={() => setTab('education')} />
              <Menu icon={Bus} label="Экскурсии" active={tab === 'excursions'} onClick={() => setTab('excursions')} />
              <Menu icon={Tent} label="Игры" active={tab === 'games'} onClick={() => setTab('games')} />
              <Menu icon={MapPin} label="Карта" active={tab === 'map'} onClick={() => setTab('map')} />
              <Menu icon={AlertTriangle} label="SOS" active={tab === 'emergency'} onClick={() => setTab('emergency')} />
              <ProfileMenu user={user} active={tab === 'profile'} onClick={() => setTab('profile')} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🌿 Подсветка активной вкладки */
function ActiveGlow({ tab }: { tab: string }) {
  const positions: Record<string, string> = {
    home: 'left-[5%]',
    schedule: 'left-[17%]',
    education: 'left-[29%]',
    excursions: 'left-[41%]',
    games: 'left-[53%]',
    map: 'left-[65%]',
    emergency: 'left-[77%]',
    profile: 'left-[89%]',
  };

  return (
    <div
      className={`
        absolute
        bottom-0
        ${positions[tab] || 'left-0'}
        -translate-x-1/2
        w-28
        h-16
        bg-emerald-300/40
        blur-2xl
        transition-all duration-500
      `}
    />
  );
}

/* 🔘 Пункт меню */
function Menu({ icon: Icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? 'text-orange-600 scale-105' : 'text-gray-700'
      }`}
    >
      <Icon className={`w-5 h-5 mb-1 ${active ? 'stroke-[2.5]' : ''}`} />
      {label}
    </button>
  );
}

/* 👤 Профиль */
function ProfileMenu({ user, onClick, active }: any) {
  const [name = '', surname = ''] = (user?.name || '').split(' ');
  const initials =
    (name[0] || '').toUpperCase() +
    (surname[0] || '').toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? 'text-orange-600 scale-105' : 'text-gray-700'
      }`}
    >
      <div
        className={`w-7 h-7 mb-1 rounded-full flex items-center justify-center text-xs font-bold ${
          active
            ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md'
            : 'bg-gray-300 text-white'
        }`}
      >
        {initials}
      </div>
      Я
    </button>
  );
}
