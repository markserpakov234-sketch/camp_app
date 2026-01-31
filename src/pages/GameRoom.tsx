import { useEffect, useMemo, useRef, useState } from 'react';
import { games } from '../data/games';

type Category =
  | 'Знакомство'
  | 'Сплочение'
  | 'Лидерство'
  | 'КТД'
  | 'Взбодряки'
  | 'Помещение'
  | '❤️ Избранное';

type AgeFilter = 'Все' | '6–9' | '9–10' | '11–13' | '14–17';

const categories: Category[] = [
  'Знакомство',
  'Сплочение',
  'Лидерство',
  'КТД',
  'Взбодряки',
  'Помещение',
  '❤️ Избранное',
];

const ageFilters: AgeFilter[] = ['Все', '6–9', '9–10', '11–13', '14–17'];

export default function GameRoom() {
  const [activeCategory, setActiveCategory] =
    useState<Category>('Знакомство');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('Все');

  const [favorites, setFavorites] = useState<string[]>([]);
  const [opened, setOpened] = useState<string[]>([]);

  const gameRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ---------- ИГРА ДНЯ ---------- */
  const gameOfDay = useMemo(() => {
    return games[Math.floor(Math.random() * games.length)];
  }, []);

  /* ---------- localStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('favoriteGames');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteGames', JSON.stringify(favorites));
  }, [favorites]);

  /* ---------- АВТОСВОРАЧИВАНИЕ ---------- */
  useEffect(() => {
    setOpened([]);
  }, [activeCategory, ageFilter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleOpen = (id: string) => {
    setOpened((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);
  const isOpen = (id: string) => opened.includes(id);

  /* ---------- фильтрация ---------- */
  let visibleGames =
    activeCategory === '❤️ Избранное'
      ? games.filter((g) => favorites.includes(g.id))
      : games.filter((g) => g.category === activeCategory);

  if (ageFilter !== 'Все') {
    visibleGames = visibleGames.filter((g) => g.age.includes(ageFilter));
  }

  /* ---------- клик по игре дня ---------- */
  function openGameOfDay() {
    setActiveCategory(gameOfDay.category as Category);
    setAgeFilter('Все');
    setOpened([gameOfDay.id]);

    setTimeout(() => {
      gameRefs.current[gameOfDay.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 120);
  }

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      {/* 🟧 ВЕРХНЯЯ ПЛАШКА */}
      <div
        style={{
          background: '#f97316',
          color: '#fff',
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.9 }}>
          ИГРОТЕКА · ТОЧКА СБОРКИ
        </div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>
          Во что играем сегодня?
        </div>
      </div>

      {/* 🍀 ИГРА ДНЯ */}
      <div
        onClick={openGameOfDay}
        style={{
          borderRadius: 22,
          padding: 18,
          marginBottom: 26,
          cursor: 'pointer',
          background: '#ecfdf5',
          boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 14px 30px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 10px 24px rgba(0,0,0,0.08)';
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#16a34a',
            letterSpacing: 0.6,
          }}
        >
          ИГРА ДНЯ
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#065f46',
          }}
        >
          {gameOfDay.title}
        </div>
        <div style={{ fontSize: 13, color: '#047857' }}>
          Нажми — откроется описание
        </div>
      </div>

      {/* ---------- Категории ---------- */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background:
                activeCategory === cat ? '#f97316' : '#ffedd5',
              color:
                activeCategory === cat ? '#ffffff' : '#9a3412',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------- Возраст ---------- */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {ageFilters.map((age) => (
          <button
            key={age}
            onClick={() => setAgeFilter(age)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: 'none',
              fontSize: 13,
              cursor: 'pointer',
              background:
                ageFilter === age ? '#22c55e' : '#dcfce7',
              color: '#166534',
              fontWeight: 600,
            }}
          >
            {age}
          </button>
        ))}
      </div>

      {/* ---------- Карточки ---------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {visibleGames.map((game) => {
          const open = isOpen(game.id);
          const fav = isFavorite(game.id);

          return (
            <div
              key={game.id}
              ref={(el) => {
                gameRefs.current[game.id] = el;
              }}
              style={{
                background: '#ffffff',
                borderRadius: 22,
                padding: 16,
                boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{game.title}</h3>
                <button
                  onClick={() => toggleFavorite(game.id)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: 'none',
                    fontSize: 20,
                    background: fav ? '#fee2e2' : '#f3f4f6',
                    cursor: 'pointer',
                  }}
                >
                  {fav ? '❤️' : '🤍'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 12,
                    background: '#ffedd5',
                    color: '#9a3412',
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {game.category}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {game.age}
                </span>
              </div>

              <button
                onClick={() => toggleOpen(game.id)}
                style={{
                  alignSelf: 'flex-start',
                  padding: '6px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#ffedd5',
                  color: '#9a3412',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {open ? 'Скрыть' : 'Подробнее'}
              </button>

              <div
                style={{
                  maxHeight: open ? 500 : 0,
                  opacity: open ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    margin: '8px 0 0',
                  }}
                >
                  {game.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
