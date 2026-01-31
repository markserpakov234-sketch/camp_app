import { useEffect, useMemo, useState } from 'react';

type RawSlot = {
  date: string;
  time_from: string;
  time_to: string;
  squad: string;
};

type Slot = {
  date: string;
  timeFrom: string;
  timeTo: string;
  squad: string;
};

const API_URL =
  'https://script.google.com/macros/s/AKfycbwkx4Sf8SB13IWT5Ir2iy_C6XdnQP589jK5Ry3cmNPOOkH2FLHUniDtqvlzqowG03yk/exec';

// ---------- helpers ----------
function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function parseSheetDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return formatDate(d);
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
// ----------------------------

export default function Pool() {
  const today = useMemo(() => new Date(), []);
  const [dayOffset, setDayOffset] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // обновляем время раз в минуту
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const dates = {
    yesterday: formatDate(addDays(today, -1)),
    today: formatDate(today),
    tomorrow: formatDate(addDays(today, 1)),
  };

  const activeDate =
    dayOffset === -1
      ? dates.yesterday
      : dayOffset === 1
      ? dates.tomorrow
      : dates.today;

  const isToday = dayOffset === 0;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_URL);
        const raw: RawSlot[] = await res.json();

        const normalized: Slot[] = raw.map((s) => ({
          date: parseSheetDate(s.date),
          timeFrom: s.time_from,
          timeTo: s.time_to,
          squad: s.squad,
        }));

        setSlots(normalized);
      } catch (e) {
        console.error('Ошибка загрузки бассейна', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const daySlots = slots
    .filter((s) => s.date === activeDate)
    .sort((a, b) => timeToMinutes(a.timeFrom) - timeToMinutes(b.timeFrom));

  // --- вычисляем следующий сеанс ---
  const nextSlotIndex = isToday
    ? daySlots.findIndex((s) => timeToMinutes(s.timeFrom) > currentMinutes)
    : -1;

  const NavButton = ({
    label,
    date,
    active,
    onClick,
  }: {
    label: string;
    date: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl p-2 border
        ${
          active
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-700 border-gray-200'
        }
      `}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className={`text-xs ${active ? 'text-green-100' : 'text-gray-400'}`}>
        {date}
      </div>
    </button>
  );

  return (
    <div className="p-4 pb-24 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Бассейн</h1>

      {/* Навигация */}
      <div className="flex gap-2 mb-4">
        <NavButton
          label="Вчера"
          date={dates.yesterday}
          active={dayOffset === -1}
          onClick={() => setDayOffset(-1)}
        />
        <NavButton
          label="Сегодня"
          date={dates.today}
          active={dayOffset === 0}
          onClick={() => setDayOffset(0)}
        />
        <NavButton
          label="Завтра"
          date={dates.tomorrow}
          active={dayOffset === 1}
          onClick={() => setDayOffset(1)}
        />
      </div>

      {loading && <p className="text-gray-500">Загрузка…</p>}

      {!loading && daySlots.length === 0 && (
        <p className="text-gray-500">Нет занятий</p>
      )}

      <div className="space-y-2">
        {daySlots.map((slot, i) => {
          const start = timeToMinutes(slot.timeFrom);
          const end = timeToMinutes(slot.timeTo);

          const isCurrent =
            isToday && currentMinutes >= start && currentMinutes < end;

          const isNext = isToday && !isCurrent && i === nextSlotIndex;

          const isPast = isToday && end <= currentMinutes;

          return (
            <div
              key={i}
              className={`p-4 rounded-xl flex justify-between items-center shadow transition
                ${
                  isCurrent
                    ? 'bg-green-50 border-2 border-green-500'
                    : isNext
                    ? 'bg-blue-50 border-2 border-blue-400'
                    : 'bg-white'
                }
                ${isPast ? 'opacity-60' : ''}
              `}
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {slot.timeFrom}–{slot.timeTo}
                </div>
                <div className="text-sm text-gray-600">
                  Отряд № {slot.squad || '—'}
                </div>
              </div>

              {isCurrent && (
                <span className="text-xs font-bold bg-green-600 text-white px-3 py-1 rounded-full">
                  СЕЙЧАС
                </span>
              )}

              {isNext && (
                <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
                  ДАЛЕЕ
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
