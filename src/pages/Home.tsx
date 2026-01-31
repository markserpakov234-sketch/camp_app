import { useState } from 'react';
import {
  Home as HomeIcon,
  Calendar,
  Waves,
  MapPin,
  AlertTriangle,
  Dice5,
  User,
} from 'lucide-react';

import HomeMain from './HomeMain';
import Schedule from './Schedule';
import Pool from './Pool';
import Map from './Map';
import Emergency from './Emergency';
import Profile from './Profile';
import GameRoom from './GameRoom';

type Tab =
  | 'home'
  | 'schedule'
  | 'pool'
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
      case 'pool':
        return <Pool />;
      case 'map':
        return <Map />;
      case 'emergency':
        return <Emergency />;
      case 'games':
        return <GameRoom />;
      case 'profile':
        return <Profile user={user} onLogout={onLogout} />;
      default:
        return <HomeMain user={user} />;
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-100">
      {render()}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-2 text-xs">
          <Menu
            icon={HomeIcon}
            label="Главная"
            onClick={() => setTab('home')}
          />
          <Menu
            icon={Calendar}
            label="Расписание"
            onClick={() => setTab('schedule')}
          />
          <Menu icon={Waves} label="Бассейн" onClick={() => setTab('pool')} />
          <Menu icon={Dice5} label="Игротека" onClick={() => setTab('games')} />
          <Menu icon={MapPin} label="Карта" onClick={() => setTab('map')} />
          <Menu
            icon={AlertTriangle}
            label="SOS"
            onClick={() => setTab('emergency')}
          />
          <Menu icon={User} label="Профиль" onClick={() => setTab('profile')} />
        </div>
      </div>
    </div>
  );
}

function Menu({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-gray-600"
    >
      <Icon className="w-5 h-5 mb-1" />
      {label}
    </button>
  );
}
