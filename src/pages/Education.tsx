import { useState } from 'react';
import { structure, isModuleCompleted, resetProgress } from '../learning/training';
import ModuleView from './ModuleView';
import { Sparkles, Users, Gamepad2, Palette, AlertTriangle, Compass, Lock, CheckCircle2, BookOpen } from 'lucide-react';

const ICONS: Record<string, any> = {
  manifest: Sparkles,
  pedagogy: BookOpen,
  age: Users,
  game: Gamepad2,
  creativity: Palette,
  conflicts: AlertTriangle,
  shiftLogic: Compass,
};

/** 🎨 уникальные градиенты по смыслу */
const GRADIENTS: Record<string, string> = {
  manifest: 'from-orange-400 to-yellow-300',      // энергия, вдохновение
  pedagogy: 'from-blue-400 to-indigo-400',        // база, знания
  age: 'from-green-400 to-emerald-300',           // рост, дети
  game: 'from-pink-400 to-fuchsia-400',           // игра, драйв
  creativity: 'from-purple-400 to-pink-400',      // креатив
  conflicts: 'from-red-400 to-orange-400',        // напряжение → решение
  shiftLogic: 'from-teal-400 to-cyan-400',         // структура, маршрут
};

export default function Education() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (activeModule) {
    return (
      <ModuleView moduleId={activeModule} onBack={() => setActiveModule(null)} />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎨 фон-пятна */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 px-4 py-6 space-y-6">
        {/* 🧭 верхняя плашка */}
        <div className="rounded-3xl p-5 bg-white/70 backdrop-blur-md shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Точка сборки</span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-800">
            Образ вожатого будущего
          </h1>

          <p className="text-sm text-gray-600">
            Твой путь к уровню{' '}
            <span className="text-green-600 font-semibold">
              топ-вожатого
            </span>
          </p>

          <button
            onClick={() => {
              resetProgress();
              location.reload();
            }}
            className="text-xs text-purple-500 underline"
          >
            Сбросить прогресс (dev)
          </button>
        </div>

        {/* 📚 модули */}
        <div className="space-y-4">
          {structure.map((m, index) => {
            const prev = structure[index - 1];
            const unlocked = !prev || isModuleCompleted(prev.id);
            const completed = isModuleCompleted(m.id);

            const Icon = ICONS[m.id] ?? Sparkles;
            const gradient = GRADIENTS[m.id] ?? 'from-orange-400 to-yellow-300';

            return (
              <button
                key={m.id}
                disabled={!unlocked}
                onClick={() => unlocked && setActiveModule(m.id)}
                className={`
                  w-full rounded-3xl p-5 text-left transition
                  bg-white
                  ${
                    completed
                      ? 'opacity-60'
                      : unlocked
                      ? 'ring-2 ring-orange-300 shadow-lg'
                      : 'opacity-40 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* иконка */}
                  <div
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      ${
                        completed
                          ? 'bg-gray-200 text-gray-400'
                          : unlocked
                          ? `bg-gradient-to-br ${gradient} text-white`
                          : 'bg-gray-200 text-gray-400'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* текст */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {m.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {completed
                        ? 'Модуль пройден'
                        : unlocked
                        ? 'Можно начинать'
                        : 'Откроется позже'}
                    </p>

                    {/* прогресс */}
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 transition-all"
                        style={{
                          width: completed ? '100%' : unlocked ? '40%' : '0%',
                        }}
                      />
                    </div>
                  </div>

                  {/* статус */}
                  {!unlocked && <Lock className="w-5 h-5 text-gray-400" />}
                  {completed && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
