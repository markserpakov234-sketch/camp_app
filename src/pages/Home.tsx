import { useState } from 'react';
import {
  Home as HomeIcon,
  Calendar,
  MapPin,
  AlertTriangle,
  Dice5,
  BookOpen,
} from 'lucide-react';

import HomeMain from './HomeMain';
import Schedule from './Schedule';
import Map from './Map';
import Emergency from './Emergency';
import Profile from './Profile';
import GameRoom from './GameRoom';
import Education from './Education';

type Tab =
  | 'home'
  | 'schedule'
  | 'education'
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
    <div className="min-h-screen pb-20 bg-gray-100">
      {render()}

      {/* 🔻 НИЖНЕЕ МЕНЮ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
        <div className="flex justify-around py-2 text-xs">

          <Menu
            icon={HomeIcon}
            label="Точка"
            active={tab === 'home'}
            onClick={() => setTab('home')}
          />

          <Menu
            icon={Calendar}
            label="День"
            active={tab === 'schedule'}
            onClick={() => setTab('schedule')}
          />

          <Menu
            icon={BookOpen}
            label="Обучение"
            active={tab === 'education'}
            onClick={() => setTab('education')}
          />

          <Menu
            icon={Dice5}
            label="Игры"
            active={tab === 'games'}
            onClick={() => setTab('games')}
          />

          <Menu
            icon={MapPin}
            label="Карта"
            active={tab === 'map'}
            onClick={() => setTab('map')}
          />

          <Menu
            icon={AlertTriangle}
            label="SOS"
            active={tab === 'emergency'}
            onClick={() => setTab('emergency')}
          />

          {/* 👤 ПРОФИЛЬ */}
          <ProfileMenu
            user={user}
            active={tab === 'profile'}
            onClick={() => setTab('profile')}
          />

        </div>
      </div>
    </div>
  );
}

/* 🔘 Обычный пункт меню */
function Menu({ icon: Icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition
        ${
          active
            ? 'text-orange-500'
            : 'text-gray-500'
        }`}
    >
      <Icon
        className={`w-5 h-5 mb-1 ${
          active ? 'stroke-[2.5]' : ''
        }`}
      />
      {label}
    </button>
  );
}

/* 👤 Профиль с инициалами */
function ProfileMenu({ user, onClick, active }: any) {
  const [name = '', surname = ''] = (user?.name || '').split(' ');

  const initials =
    (name[0] || '').toUpperCase() +
    (surname[0] || '').toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition
        ${
          active
            ? 'text-orange-500'
            : 'text-gray-500'
        }`}
    >
      <div
        className={`w-6 h-6 mb-1 rounded-full flex items-center justify-center text-xs font-bold
          ${
            active
              ? 'bg-orange-500 text-white'
              : 'bg-gray-300 text-white'
          }`}
      >
        {initials}
      </div>
      Я
    </button>
  );
}
