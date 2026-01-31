import { Bell } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  user: {
    name: string;
    squad: string; // ГОРОД
  };
};

type Weather = {
  temp: number;
  feels: number;
};

type ScheduleItem = {
  date: string;
  start: string;
  end: string;
  title: string;
  place: string;
  note?: string;
};

const SCHEDULE_URL =
  'https://script.google.com/macros/s/AKfycbwY7Ddk6Wahkcq4ZtED4sQ61mvQdr5EJ03GINAlRHNpDd9GgpqH8r5OCxu0tcTYUZbo9g/exec';

export default function HomeMain({ user }: Props) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<Weather | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const warned10 = useRef(false);
  const warned5 = useRef(false);

  /* ⏱ Часы */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* 🌤 Погода — Витязево */
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=45&longitude=37.28&current_weather=true&hourly=apparent_temperature'
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          feels: Math.round(data.hourly.apparent_temperature[0]),
        });
      } catch {}
    }
    loadWeather();
  }, []);

  /* 📅 Расписание */
  useEffect(() => {
    async function loadSchedule() {
      try {
        const cached = localStorage.getItem('schedule');
        if (cached) setSchedule(JSON.parse(cached));

        const res = await fetch(SCHEDULE_URL);
        const data = await res.json();
        setSchedule(data);
        localStorage.setItem('schedule', JSON.stringify(data));
      } catch {}
      finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  /* 🛠 Утилиты */
  const timeToMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const today = time.toLocaleDateString('ru-RU');
  const nowMin = time.getHours() * 60 + time.getMinutes();

  const todaySchedule = useMemo(
    () =>
      schedule.filter(
        i => new Date(i.date).toLocaleDateString('ru-RU') === today
      ),
    [schedule, today]
  );

  const current = todaySchedule.filter(
    i => nowMin >= timeToMin(i.start) && nowMin <= timeToMin(i.end)
  );

  const next = todaySchedule
    .filter(i => timeToMin(i.start) > nowMin)
    .sort((a, b) => timeToMin(a.start) - timeToMin(b.start))[0];

  const minutesToNext = next
    ? timeToMin(next.start) - nowMin
    : null;

  const weatherStatus = () => {
    if (!weather) return '';
    if (weather.feels <= 10) return '🥶 Холодно';
    if (weather.feels >= 30) return '🥵 Жарко';
    return '😊 Комфортно';
  };

  /* 🧠 ИНИЦИАЛЫ */
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="p-4 space-y-4">

      {/* локальная анимация — БЕЗ tailwind.config */}
      <style>{`
        @keyframes breathe {
          0%   { background-color: rgb(220 252 231); }
          50%  { background-color: rgb(187 247 208); }
          100% { background-color: rgb(220 252 231); }
        }
      `}</style>

      {/* 🧡 ФИРМЕННАЯ ШАПКА */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow space-y-4">

        <div className="text-center leading-tight">
          <div className="font-extrabold text-xl tracking-wide">
            ТОЧКА СБОРКИ
          </div>
          <div className="text-xs text-white/80">
            Республика Виталия
          </div>
        </div>

        {/* АВАТАР + ИМЯ */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-white/80">
                № города {user.squad}
              </p>
            </div>
          </div>
          <Bell className="opacity-80" />
        </div>

        <div className="flex justify-between items-center bg-white/15 rounded-2xl p-4">
          <div>
            <div className="text-xl font-bold">
              {time.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="text-sm text-white/80">
              {time.toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
          </div>

          {weather && (
            <div className="text-right">
              <div className="text-3xl font-bold">
                {weather.temp}°
              </div>
              <div className="text-sm text-white/80">
                ощущается как {weather.feels}°
              </div>
              <div className="text-xs text-white/70">
                Витязево
              </div>
            </div>
          )}
        </div>

        {weather && (
          <div className="bg-white/15 rounded-xl px-3 py-2 text-sm">
            {weatherStatus()}
          </div>
        )}
      </div>

      {/* 📅 МЕРОПРИЯТИЯ */}
      <div className="bg-white rounded-2xl p-5 shadow space-y-3">

        {/* 🔥 АКТИВНЫЕ — ЗЕЛЁНЫЕ + ДЫХАНИЕ */}
        {current.map((e, i) => (
          <div
            key={i}
            className="border-l-4 border-green-500 pl-3 py-2 rounded-r-xl"
            style={{
              animation: 'breathe 4s ease-in-out infinite',
            }}
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-green-900">
                {e.title}
              </p>
              <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
                ИДЁТ СЕЙЧАС
              </span>
            </div>
            <p className="text-sm text-green-700">
              {e.start} – {e.end} • {e.place}
            </p>
          </div>
        ))}

        {next && (
          <div className="space-y-2">
            <p className="font-semibold">
              Следующее: {next.title}
            </p>
            <p className="text-sm text-gray-500">
              Начнётся через {minutesToNext} мин
            </p>

            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${Math.max(0, 100 - minutesToNext! * 5)}%` }}
              />
            </div>
          </div>
        )}

        {!loading && !current.length && !next && (
          <p className="text-sm text-gray-400">
            На сегодня мероприятий больше нет
          </p>
        )}
      </div>
    </div>
  );
}
