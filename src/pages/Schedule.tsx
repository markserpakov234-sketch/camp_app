import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Info,
} from 'lucide-react';

/* ===================== ТИПЫ ===================== */

interface ScheduleItem {
  date: string;
  start: string;
  end: string;
  title: string;
  place: string;
  note?: string;
}

/* ===================== API ===================== */

const SCHEDULE_API =
  'https://script.google.com/macros/s/AKfycbwY7Ddk6Wahkcq4ZtED4sQ61mvQdr5EJ03GINAlRHNpDd9GgpqH8r5OCxu0tcTYUZbo9g/exec';

/* ===================== HELPERS ===================== */

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString('ru-RU');
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatCountdown(diff: number) {
  if (diff <= 0) return 'начинается';

  const h = Math.floor(diff / 60);
  const m = diff % 60;

  if (h > 0) return `через ${h} ч ${m.toString().padStart(2, '0')} мин`;
  return `через ${m} мин`;
}

/* ===================== COMPONENT ===================== */

export default function Schedule() {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setTick(Date.now()), 60_000);
    return () => clearInterval(i);
  }, []);

  const now = new Date(tick);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [dayOffset, setDayOffset] = useState<0 | 1>(0);
  const selectedDate = addDays(now, dayOffset);
  const selectedDateShort = formatShortDate(selectedDate);

  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(SCHEDULE_API)
      .then((r) => r.json())
      .then((data: ScheduleItem[]) => {
        const filtered = data
          .filter(
            (i) =>
              formatShortDate(new Date(i.date)) ===
              selectedDateShort
          )
          .sort(
            (a, b) =>
              timeToMinutes(a.start) -
              timeToMinutes(b.start)
          );

        setItems(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDateShort]);

  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [items, dayOffset]);

  let nextFound = false;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-orange-100 via-white to-white">

      {/* ===== ШАПКА ===== */}
      <div className="sticky top-0 z-20 p-4 bg-white/80 backdrop-blur">
        <div className="rounded-3xl bg-white shadow-sm p-4 space-y-1">
          <div className="flex items-center gap-2 text-orange-500 font-medium">
            <CalendarDays className="w-5 h-5" />
            {dayOffset === 0 ? 'Сегодня' : 'Завтра'}
          </div>
          <div className="text-sm text-gray-600">
            {formatLongDate(selectedDate)}
          </div>
        </div>

        <div className="mt-3 flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setDayOffset(0)}
            className={`flex-1 py-2 rounded-xl text-sm ${
              dayOffset === 0
                ? 'bg-orange-400 text-white'
                : 'text-gray-500'
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setDayOffset(1)}
            className={`flex-1 py-2 rounded-xl text-sm ${
              dayOffset === 1
                ? 'bg-orange-400 text-white'
                : 'text-gray-500'
            }`}
          >
            Завтра
          </button>
        </div>
      </div>

      {/* ===== СПИСОК ===== */}
      <div className="p-4 space-y-4">
        {loading && (
          <div className="text-sm text-gray-400">
            Загружаю расписание…
          </div>
        )}

        {!loading &&
          items.map((item, i) => {
            const start = timeToMinutes(item.start);
            const end = timeToMinutes(item.end);

            const isCurrent =
              dayOffset === 0 &&
              currentMinutes >= start &&
              currentMinutes <= end;

            const isNext =
              dayOffset === 0 &&
              !isCurrent &&
              !nextFound &&
              currentMinutes < start;

            if (isNext) nextFound = true;

            const diff = start - currentMinutes;

            const progress =
              isNext && diff <= 60
                ? Math.min(100, ((60 - diff) / 60) * 100)
                : 0;

            return (
              <div
                key={i}
                ref={isCurrent ? currentRef : null}
                className={`rounded-3xl p-4 shadow-sm transition
                  ${
                    isCurrent
                      ? 'bg-green-50'
                      : isNext
                      ? 'bg-violet-50'
                      : 'bg-white'
                  }`}
              >
                {/* BADGE */}
                {isCurrent && (
                  <div className="mb-2 inline-block text-xs px-3 py-1 rounded-full bg-green-200 text-green-800">
                    Идёт сейчас
                  </div>
                )}

                {isNext && !isCurrent && (
                  <div className="mb-2 inline-block text-xs px-3 py-1 rounded-full bg-violet-200 text-violet-800">
                    Следующее
                  </div>
                )}

                {/* TIME */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {item.start} – {item.end}
                </div>

                <div className="mt-1 text-base font-medium text-gray-800">
                  {item.title}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  {item.place}
                </div>

                {/* ⏱ ТАЙМЕР */}
                {isNext && (
                  <>
                    <div className="mt-3 text-xs text-violet-700">
                      Начнётся {formatCountdown(diff)}
                    </div>

                    <div className="mt-2 h-1.5 rounded-full bg-violet-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )}

                {/* NOTE */}
                {item.note && (
                  <div className="mt-3 flex items-start gap-2 text-xs bg-gray-100 text-gray-700 rounded-xl px-3 py-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{item.note}</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
