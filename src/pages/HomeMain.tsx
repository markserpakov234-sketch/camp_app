import { Bell, Clock, MapPin, CloudSun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  user: {
    name: string;
    squad: string;
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

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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
    if (weather.feels <= 10) return ' Холодно';
    if (weather.feels >= 30) return ' Жарко';
    return '😊 Комфортно';
  };

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative min-h-screen p-4 space-y-4 overflow-hidden bg-[#FDFBF7]">

      {/* ГЛУБОКИЙ ВЕСЕННИЙ ФОН */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-[#FFD6A5]/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] bg-[#A78BFA]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-[#34D399]/40 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white
        bg-gradient-to-br from-[#FF8A3D] via-[#F97316] to-[#A855F7]
        shadow-[0_25px_70px_rgba(249,115,22,0.45)]
        space-y-4">

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                {user.name}
              </h1>
              <p className="text-sm text-white/80">
                № города {user.squad}
              </p>
            </div>
          </div>
          <Bell className="opacity-90" />
        </div>

        <div className="flex justify-between items-center bg-white/15 backdrop-blur-md rounded-2xl p-4">
          <div>
            <div className="text-2xl font-bold">
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
              <div className="flex items-center gap-1 justify-end text-2xl font-bold">
                <CloudSun className="w-5 h-5 text-yellow-300" />
                {weather.temp}°
              </div>
              <div className="text-xs text-white/80">
                ощущается {weather.feels}°
              </div>
              <div className="text-xs text-white/70">
                Витязево
              </div>
            </div>
          )}
        </div>

        {weather && (
          <div className="text-sm text-white/90">
            {weatherStatus()}
          </div>
        )}
      </div>

      {/* МЕРОПРИЯТИЯ */}
      <div className="space-y-3">

        {current.map((e, i) => (
          <div
            key={i}
            className="rounded-3xl p-4 bg-white shadow-md border-l-4 border-emerald-500"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">
                {e.title}
              </p>
              <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Идёт сейчас
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {e.start} – {e.end}
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {e.place}
            </div>
          </div>
        ))}

        {next && (
          <div className="rounded-3xl p-4 bg-white shadow-md space-y-2">
            <p className="font-semibold text-gray-800">
              Следующее: {next.title}
            </p>
            <p className="text-sm text-gray-500">
              Начнётся через {minutesToNext} мин
            </p>

            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-violet-500 transition-all"
                style={{
                  width: `${Math.max(0, 100 - minutesToNext! * 5)}%`,
                }}
              />
            </div>
          </div>
        )}

        {!loading && !current.length && !next && (
          <div className="text-sm text-gray-400 text-center py-6">
            На сегодня мероприятий больше нет
          </div>
        )}
      </div>

      {/* ЭКСКУРСИИ */}
      <div className="rounded-3xl p-5 text-white shadow-lg
        bg-gradient-to-br from-emerald-500 to-violet-500">
        <div className="font-semibold text-lg">
          Экскурсии
        </div>
        <p className="text-sm text-white/90">
          Скоро будут добавлены экскурсии в этот раздел
        </p>
      </div>

    </div>
  );
}
