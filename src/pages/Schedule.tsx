import { useEffect, useMemo, useRef, useState } from 'react';

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

const SCHEDULE_CACHE = 'schedule-day-v1';

/* ===================== HELPERS ===================== */

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString('ru-RU');
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/* ===================== COMPONENT ===================== */

export default function Schedule() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [tab, setTab] = useState<'events'>('events');
  const [dayOffset, setDayOffset] = useState<0 | 1>(0);

  const selectedDate = addDays(now, dayOffset);
  const selectedDateShort = formatShortDate(selectedDate);

  /* ----------- мероприятия ----------- */

  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(SCHEDULE_CACHE);
    if (cached) {
      setItems(JSON.parse(cached));
      setLoadingSchedule(false);
    }

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
        localStorage.setItem(
          SCHEDULE_CACHE,
          JSON.stringify(filtered)
        );
        setLoadingSchedule(false);
      })
      .catch(() => setLoadingSchedule(false));
  }, [selectedDateShort]);

  useEffect(() => {
    if (tab === 'events' && dayOffset === 0) {
      currentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [items, tab, dayOffset]);

  /* ===================== RENDER ===================== */

  let nextFound = false;

  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* ===== ЛИПКАЯ ВЕРХНЯЯ ЧАСТЬ ===== */}
      <div className="sticky top-0 z-20 bg-gray-100 px-4 pt-4 space-y-3">
        {/* ДАТА */}
        <div className="text-lg font-semibold">
          {dayOffset === 0 ? 'Сегодня' : 'Завтра'},{' '}
          {formatLongDate(selectedDate)}
        </div>

        {/* ПЕРЕКЛЮЧЕНИЕ ДНЯ */}
        <div className="flex bg-white rounded-2xl p-1 shadow">
          <button
            onClick={() => setDayOffset(0)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold
              ${
                dayOffset === 0
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500'
              }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setDayOffset(1)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold
              ${
                dayOffset === 1
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500'
              }`}
          >
            Завтра
          </button>
        </div>

        {/* ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛА */}
        <div className="flex bg-white rounded-2xl p-1 shadow">
          <button
            onClick={() => setTab('events')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold
              ${
                tab === 'events'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500'
              }`}
          >
            МЕРОПРИЯТИЯ
          </button>
        </div>
      </div>

      {/* ===== КОНТЕНТ ===== */}
      <div className="p-4 space-y-4">

        {tab === 'events' && (
          <>
            {loadingSchedule && (
              <div className="text-sm text-gray-400 animate-pulse">
                Загружаю расписание…
              </div>
            )}

            {!loadingSchedule &&
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

                return (
                  <div
                    key={i}
                    ref={isCurrent ? currentRef : null}
                    className={`rounded-2xl p-4 shadow
                      ${
                        isCurrent
                          ? 'bg-green-50 border-l-4 border-green-500 scale-[1.02]'
                          : isNext
                          ? 'bg-orange-50 border-l-4 border-orange-400'
                          : 'bg-white'
                      }`}
                  >
                    <div className="text-xs text-gray-500">
                      {item.start} – {item.end}
                    </div>

                    <div className="font-semibold">
                      {item.title}
                    </div>

                    <div className="text-sm text-gray-600">
                      {item.place}
                    </div>

                    {item.note && (
                      <div className="mt-2 text-xs bg-gray-100 rounded-lg px-2 py-1">
                        💬 {item.note}
                      </div>
                    )}

                    {isCurrent && (
                      <span className="inline-block mt-2 text-xs font-bold bg-green-600 text-white px-3 py-1 rounded-full">
                        ИДЁТ СЕЙЧАС
                      </span>
                    )}
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
