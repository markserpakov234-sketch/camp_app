import { useEffect, useRef, useState } from 'react';

interface ScheduleItem {
  date: string;
  start: string;
  end: string;
  title: string;
  place: string;
  note?: string;
}

const API_URL =
  'https://script.google.com/macros/s/AKfycbwY7Ddk6Wahkcq4ZtED4sQ61mvQdr5EJ03GINAlRHNpDd9GgpqH8r5OCxu0tcTYUZbo9g/exec';

const STORAGE_KEY = 'schedule-cache-v1';

/* ================= helpers ================= */

function timeToMinutes(t: string): number {
  if (!t) return -1;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isoToLocalKey(iso: string): string {
  return getLocalDateKey(new Date(iso));
}

/* ================= component ================= */

export default function Schedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const todayKey = getLocalDateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const currentRef = useRef<HTMLDivElement | null>(null);
  const notifiedRef = useRef<Set<string>>(new Set());

  /* ---------- load data (API + cache) ---------- */

  useEffect(() => {
    // 1️⃣ сначала пробуем кеш
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setItems(parsed);
        setLoading(false);
      } catch {}
    }

    // 2️⃣ затем обновляем с сервера
    fetch(API_URL)
      .then((r) => r.json())
      .then((data: ScheduleItem[]) => {
        const todayItems = data
          .filter((i) => isoToLocalKey(i.date) === todayKey)
          .filter((i) => i.title && i.start && i.end)
          .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

        setItems(todayItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todayItems));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------- автоскролл ---------- */

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [items]);

  /* ---------- уведомление за 10 минут ---------- */

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const timer = setInterval(() => {
      const now = new Date();
      const minutesNow = now.getHours() * 60 + now.getMinutes();

      items.forEach((item) => {
        const startMin = timeToMinutes(item.start);
        const diff = startMin - minutesNow;

        const key = `${item.title}-${item.start}`;

        if (
          diff === 10 &&
          !notifiedRef.current.has(key) &&
          Notification.permission === 'granted'
        ) {
          new Notification('⏰ Скоро мероприятие', {
            body: `${item.title} — через 10 минут`,
          });
          notifiedRef.current.add(key);
        }
      });
    }, 60_000);

    return () => clearInterval(timer);
  }, [items]);

  /* ---------- render ---------- */

  let nextFound = false;

  return (
    <div style={styles.container}>
      <div style={styles.date}>
        Сегодня,{' '}
        {now.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>

      {loading && <div style={styles.loading}>Загружаю расписание…</div>}

      {!loading && items.length === 0 && (
        <div style={styles.empty}>На сегодня ничего не запланировано</div>
      )}

      {items.map((item, index) => {
        const startMin = timeToMinutes(item.start);
        const endMin = timeToMinutes(item.end);

        const isCurrent =
          currentMinutes >= startMin && currentMinutes <= endMin;

        const isNext = !isCurrent && !nextFound && currentMinutes < startMin;

        if (isNext) nextFound = true;

        return (
          <div
            key={index}
            ref={isCurrent ? currentRef : null}
            style={{
              ...styles.card,
              ...(isCurrent ? styles.current : {}),
              ...(isNext ? styles.next : {}),
            }}
          >
            <div style={styles.time}>
              {item.start} – {item.end}
            </div>
            <div style={styles.title}>{item.title}</div>
            <div style={styles.place}>{item.place}</div>
            {item.note && <div style={styles.note}>💬 {item.note}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ================= styles ================= */

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    padding: 16,
    maxWidth: 420,
    margin: '0 auto',
  },
  date: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  loading: {
    fontSize: 14,
    opacity: 0.6,
    animation: 'pulse 1.2s infinite',
  },
  empty: {
    fontSize: 14,
    opacity: 0.6,
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform .2s ease, box-shadow .2s ease',
  },
  time: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  place: {
    fontSize: 14,
    opacity: 0.8,
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    background: '#F3F4F6',
    padding: '6px 8px',
    borderRadius: 8,
  },
  current: {
    borderLeft: '6px solid #4CAF50',
    transform: 'scale(1.02)',
  },
  next: {
    borderLeft: '6px solid #FFC107',
  },
};
