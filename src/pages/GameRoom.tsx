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

  const gameOfDay = useMemo(() => {
    return games[Math.floor(Math.random() * games.length)];
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteGames');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteGames', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setOpened([]);
  }, [activeCategory, ageFilter]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  const toggleOpen = (id: string) => {
    setOpened((prev) =>
      prev.includes(id)
        ? prev.filter((o) => o !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);
  const isOpen = (id: string) => opened.includes(id);

  let visibleGames =
    activeCategory === '❤️ Избранное'
      ? games.filter((g) => favorites.includes(g.id))
      : games.filter((g) => g.category === activeCategory);

  if (ageFilter !== 'Все') {
    visibleGames = visibleGames.filter((g) =>
      g.age.includes(ageFilter)
    );
  }

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
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎨 фон */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-25" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* 🟧 Шапка */}
        <div className="rounded-3xl p-6 bg-white/70 backdrop-blur-md shadow-sm border border-white/40">
          <div className="text-sm font-semibold text-orange-500">
            ИГРОТЕКА · ТОЧКА СБОРКИ
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mt-1">
            Во что играем сегодня?
          </h1>
        </div>

        {/* 🍀 Игра дня */}
        <div
          onClick={openGameOfDay}
          className="rounded-3xl p-5 bg-gradient-to-br from-emerald-100 to-green-200 cursor-pointer transition hover:shadow-xl hover:-translate-y-1"
        >
          <div className="text-xs font-bold text-emerald-700 tracking-wide">
            ИГРА ДНЯ
          </div>
          <div className="text-xl font-extrabold text-emerald-900">
            {gameOfDay.title}
          </div>
          <div className="text-sm text-emerald-700">
            Нажми — откроется описание
          </div>
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                rounded-2xl px-4 py-2 text-sm font-semibold transition
                ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-300 text-white shadow'
                    : 'bg-white/70 text-gray-700'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Возраст */}
        <div className="flex flex-wrap gap-2">
          {ageFilters.map((age) => (
            <button
              key={age}
              onClick={() => setAgeFilter(age)}
              className={`
                rounded-2xl px-3 py-1 text-xs font-semibold transition
                ${
                  ageFilter === age
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow'
                    : 'bg-white/70 text-gray-700'
                }
              `}
            >
              {age}
            </button>
          ))}
        </div>

        {/* Карточки */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGames.map((game) => {
            const open = isOpen(game.id);
            const fav = isFavorite(game.id);

            return (
              <div
                key={game.id}
                ref={(el) => {
                  gameRefs.current[game.id] = el;
                }}
                className="rounded-3xl p-5 bg-white shadow-md hover:shadow-xl transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">
                    {game.title}
                  </h3>

                  <button
                    onClick={() => toggleFavorite(game.id)}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-lg transition
                      ${
                        fav
                          ? 'bg-rose-100'
                          : 'bg-gray-100'
                      }
                    `}
                  >
                    {fav ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                    {game.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                    {game.age}
                  </span>
                </div>

                <button
                  onClick={() => toggleOpen(game.id)}
                  className="text-sm font-semibold text-orange-500"
                >
                  {open ? 'Скрыть' : 'Подробнее'}
                </button>

                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <p className="text-sm text-gray-600 whitespace-pre-line pt-2">
                    {game.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

