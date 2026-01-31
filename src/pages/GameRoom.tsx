import { useEffect, useState } from 'react';
import { games } from '../data/games';

type Category =
  | 'Знакомство'
  | 'Сплочение'
  | 'Лидерство'
  | 'КТД'
  | 'Взбодряки'
  | 'Помещение'
  | '⭐ Избранное';

type AgeFilter = 'Все' | '6–9' | '9–10' | '11–13' | '14–17';

const categories: Category[] = [
  'Знакомство',
  'Сплочение',
  'Лидерство',
  'КТД',
  'Взбодряки',
  'Помещение',
  '⭐ Избранное',
];

const ageFilters: AgeFilter[] = ['Все', '6–9', '9–10', '11–13', '14–17'];

export default function GameRoom() {
  const [activeCategory, setActiveCategory] = useState<Category>('Знакомство');

  const [ageFilter, setAgeFilter] = useState<AgeFilter>('Все');

  const [favorites, setFavorites] = useState<string[]>([]);
  const [opened, setOpened] = useState<string[]>([]);

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
    setOpened([]); // 👈 закрываем все карточки
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
    activeCategory === '⭐ Избранное'
      ? games.filter((g) => favorites.includes(g.id))
      : games.filter((g) => g.category === activeCategory);

  if (ageFilter !== 'Все') {
    visibleGames = visibleGames.filter((g) => g.age.includes(ageFilter));
  }

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>🎲 Игротека</h1>

      {/* ---------- Категории ---------- */}
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: activeCategory === cat ? '#2563eb' : '#e5e7eb',
              color: activeCategory === cat ? '#fff' : '#111827',
              transition: '0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------- Возраст ---------- */}
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}
      >
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
              background: ageFilter === age ? '#16a34a' : '#dcfce7',
              color: '#14532d',
              transition: '0.2s',
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

          return (
            <div
              key={game.id}
              style={{
                background: '#f9fafb',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Заголовок */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{game.title}</h3>
                <button
                  onClick={() => toggleFavorite(game.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: 'none',
                    background: isFavorite(game.id) ? '#fde68a' : '#e5e7eb',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                >
                  ⭐
                </button>
              </div>

              {/* Бейджи */}
              <div style={{ display: 'flex', gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    background: '#e0f2fe',
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
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {game.age}
                </span>
              </div>

              {/* Кнопка */}
              <button
                onClick={() => toggleOpen(game.id)}
                style={{
                  alignSelf: 'flex-start',
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#e5e7eb',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {open ? 'Скрыть' : 'Подробнее'}
              </button>

              {/* ---------- АНИМАЦИЯ ---------- */}
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
