import { Clock, Bell } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  user: any;
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

/* 🔗 ВСТАВЬ СВОЮ ССЫЛКУ APPS SCRIPT */
const SCHEDULE_URL =
  'https://script.google.com/macros/s/AKfycbwY7Ddk6Wahkcq4ZtED4sQ61mvQdr5EJ03GINAlRHNpDd9GgpqH8r5OCxu0tcTYUZbo9g/exec';

export default function HomeMain({ user }: Props) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<Weather | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  /* ⏱ часы */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* 🌤 погода */
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

  /* 📅 расписание + кеш */
  useEffect(() => {
    async function loadSchedule() {
      try {
        const cached = localStorage.getItem('schedule');
        if (cached) {
          setSchedule(JSON.parse(cached));
        }

        const res = await fetch(SCHEDULE_URL);
        const data = await res.json();

        setSchedule(data);
        localStorage.setItem('schedule', JSON.stringify(data));
      } catch {
        // если офлайн — остаётся кеш
      } finally {
        setLoadingSchedule(false);
      }
    }

    loadSchedule();
  }, []);

  /* 🛠 утилиты */
  function timeToMinutes(t: string) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  function todayString() {
    return time.toLocaleDateString('ru-RU');
  }

  /* 📌 расписание на сегодня */
  const todaySchedule = useMemo(() => {
    return schedule.filter(
      (i) => new Date(i.date).toLocaleDateString('ru-RU') === todayString()
    );
  }, [schedule, time]);

  const nowMinutes = time.getHours() * 60 + time.getMinutes();

  const currentEvents = todaySchedule.filter(
    (i) =>
      nowMinutes >= timeToMinutes(i.start) && nowMinutes <= timeToMinutes(i.end)
  );

  const futureEvents = todaySchedule.filter(
    (i) => timeToMinutes(i.start) > nowMinutes
  );

  const nextEvent =
    futureEvents.length > 0
      ? futureEvents.reduce((a, b) =>
          timeToMinutes(a.start) < timeToMinutes(b.start) ? a : b
        )
      : null;

  const minutesToNext = nextEvent
    ? timeToMinutes(nextEvent.start) - nowMinutes
    : null;

  function warning() {
    if (!weather) return '';
    if (weather.feels <= 5) return '🥶 Холодно';
    if (weather.feels >= 30) return '🥵 Жарко';
    return '😊 Комфортно';
  }

  return (
    <div className="p-4 space-y-4">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-6 text-white shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Привет, {user.name} 👋</h1>
            <p className="text-green-100">Отряд № {user.squad} • Витязево</p>
          </div>
          <Bell />
        </div>

        <div className="flex justify-between items-center bg-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Clock />
            <div>
              <div className="text-xl font-bold">
                {time.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-sm text-green-100">
                {time.toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>
          </div>

          {weather && (
            <div className="text-right">
              <div className="text-3xl font-bold">{weather.temp}°</div>
              <div className="text-sm text-green-100">
                ощущается {weather.feels}°
              </div>
            </div>
          )}
        </div>

        {weather && (
          <div className="mt-3 text-sm bg-white/10 rounded-xl px-3 py-2">
            {warning()}
          </div>
        )}
      </div>

      {/* 📅 Ближайшее / текущее */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <h3 className="font-bold mb-2">
          📅{' '}
          {currentEvents.length > 0 ? 'Сейчас идёт' : 'Ближайшее мероприятие'}
        </h3>

        {loadingSchedule && (
          <p className="text-sm text-gray-400">Загрузка расписания…</p>
        )}

        {/* 🟢 СЕЙЧАС */}
        {currentEvents.length > 0 && (
          <div className="space-y-3">
            {currentEvents.map((e, i) => (
              <div key={i} className="border-l-4 border-green-500 pl-3">
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-gray-500">
                  {e.start} – {e.end} • {e.place}
                </p>
                {e.note && (
                  <p className="text-xs text-gray-400 mt-1">💬 {e.note}</p>
                )}
              </div>
            ))}

            {minutesToNext !== null && (
              <p className="text-sm text-gray-400">
                ⏭ Следующее через {minutesToNext} мин
              </p>
            )}
          </div>
        )}

        {/* 🟡 БЛИЖАЙШЕЕ */}
        {currentEvents.length === 0 && nextEvent && (
          <div className="border-l-4 border-yellow-400 pl-3">
            <p className="font-semibold">{nextEvent.title}</p>
            <p className="text-sm text-gray-500">
              {nextEvent.start} – {nextEvent.end} • {nextEvent.place}
            </p>
            {nextEvent.note && (
              <p className="text-xs text-gray-400 mt-1">💬 {nextEvent.note}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              🧭 Начнётся через {minutesToNext} мин
            </p>
          </div>
        )}

        {/* ❌ НИЧЕГО */}
        {!loadingSchedule && currentEvents.length === 0 && !nextEvent && (
          <p className="text-sm text-gray-400">На сегодня больше ничего нет</p>
        )}
      </div>
    </div>
  );
}
