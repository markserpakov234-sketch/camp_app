import { useEffect, useMemo, useState } from 'react';
import { Clock, Bus, CheckCircle, XCircle } from 'lucide-react';

const API_URL =
  'https://script.google.com/macros/s/AKfycbwVrJY0yFWnt9mB376U9gXRmwa4nlRJpe9JS74_31IfIUrC_g8VUl_imuScD9ieKH4n/exec';

type ExcursionRow = {
  child_name: string;
  squad: string;
  food_block: string;
  event_title: string;
  date: string;
  start_time: string;
  meeting_offset_min: number;
};

type EventGroup = {
  eventTitle: string;
  squad: string;
  startTime: string;
  meetingTime: Date;
  startDateTime: Date;
  endDateTime: Date;
  children: string[];
};

function normalizeDateISO(date: string) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function getISODate(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function normalizeTime(time: string) {
  return time.trim().slice(0, 5);
}

function buildDateTime(dateISO: string, time: string) {
  const d = new Date(dateISO);
  const [h, m] = time.split(':').map(Number);
  d.setHours(h, m, 0);
  return d;
}

function minutesDiff(target: Date) {
  return Math.ceil((target.getTime() - Date.now()) / 60000);
}

export default function Excursions() {
  const [rows, setRows] = useState<ExcursionRow[]>([]);
  const [city, setCity] = useState('ВСЕ');
  const [dayOffset, setDayOffset] = useState<0 | 1>(0);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'soon' | 'going' | 'done'
  >('all');

  const [, forceTick] = useState(0);

  /* ⏱ обновление раз в минуту */
  useEffect(() => {
    const t = setInterval(() => forceTick(v => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then((data: ExcursionRow[]) =>
        setRows(data.map(r => ({ ...r, start_time: normalizeTime(r.start_time) })))
      );
  }, []);

  const events = useMemo(() => {
    const map = new Map<string, EventGroup>();
    const dateNeed = getISODate(dayOffset);
    const cityNorm = city.trim().toLowerCase();

    rows
      .filter(r => r.food_block === 'Вита')
      .filter(r => normalizeDateISO(r.date) === dateNeed)
      .filter(r => cityNorm === 'все' || r.squad.toLowerCase() === cityNorm)
      .forEach(r => {
        const start = buildDateTime(r.date, r.start_time);
        const end = new Date(start.getTime() + 60 * 60000);
        const meeting = new Date(
          start.getTime() - (r.meeting_offset_min || 60) * 60000
        );

        const key = `${r.start_time}|${r.event_title}|${r.squad}`;

        if (!map.has(key)) {
          map.set(key, {
            eventTitle: r.event_title,
            squad: r.squad,
            startTime: r.start_time,
            startDateTime: start,
            endDateTime: end,
            meetingTime: meeting,
            children: [],
          });
        }

        map.get(key)!.children.push(r.child_name);
      });

    return Array.from(map.values()).sort(
      (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
    );
  }, [rows, city, dayOffset]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();

    return events.filter(e => {
      const isBefore = now < e.startDateTime.getTime();
      const isGoing =
        now >= e.startDateTime.getTime() &&
        now <= e.endDateTime.getTime();
      const isDone = now > e.endDateTime.getTime();

      if (statusFilter === 'soon') return isBefore;
      if (statusFilter === 'going') return isGoing;
      if (statusFilter === 'done') return isDone;

      return true;
    });
  }, [events, statusFilter]);

  return (
    <div className="relative min-h-screen overflow-hidden font-[450]">
      {/* 🎨 фон-пятна */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 p-4 space-y-4">
        {/* 🧭 верх */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 shadow-sm space-y-3">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Экскурсии
          </h1>

          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Город или ВСЕ"
            className="w-full px-4 py-2 rounded-xl border text-center text-base font-normal"
          />

          <div className="flex gap-2">
            {['Сегодня', 'Завтра'].map((d, i) => (
              <button
                key={d}
                onClick={() => setDayOffset(i as 0 | 1)}
                className={`flex-1 py-2 rounded-full text-sm font-medium ${
                  dayOffset === i
                    ? 'bg-orange-500 text-white'
                    : 'bg-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* 🔀 фильтр статусов */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Все' },
              { id: 'soon', label: 'Скоро' },
              { id: 'going', label: 'Идёт' },
              { id: 'done', label: 'Завершено' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id as any)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                  statusFilter === s.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 📋 события */}
        <div className="space-y-4">
          {filteredEvents.map((e, idx) => {
            const now = Date.now();
            const minsToStart = minutesDiff(e.startDateTime);

            const isBefore = now < e.startDateTime.getTime();
            const isGoing =
              now >= e.startDateTime.getTime() &&
              now <= e.endDateTime.getTime();
            const isDone = now > e.endDateTime.getTime();

            return (
              <div
                key={idx}
                className={`rounded-3xl p-5 shadow bg-white/70 backdrop-blur-md space-y-3 border-l-4 ${
                  isBefore
                    ? 'border-yellow-400'
                    : isGoing
                    ? 'border-orange-400'
                    : 'border-green-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {e.startTime} · {e.eventTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      Город {e.squad}
                    </p>
                  </div>
                  <Bus className="text-orange-500" />
                </div>

                <div className="space-y-1">
                  {e.children.map(child => {
                    const key = `${e.eventTitle}-${child}`;
                    const present = attendance[key];

                    return (
                      <div
                        key={child}
                        className="flex justify-between items-center bg-white rounded-xl px-3 py-2 text-sm"
                      >
                        <span>{child}</span>
                        <button
                          onClick={() =>
                            setAttendance(a => ({
                              ...a,
                              [key]: !a[key],
                            }))
                          }
                          className={present ? 'text-green-600' : 'text-gray-400'}
                        >
                          {present ? <CheckCircle /> : <XCircle />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isBefore && `Начало через ${minsToStart} мин`}
                  {isGoing && 'Экскурсия идёт'}
                  {isDone && 'Завершено'}
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
