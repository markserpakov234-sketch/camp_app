import { useState } from 'react';
import { trainingContent, completeModule } from '../learning/training';
import { moduleMeta } from '../learning/training/moduleMeta';
import { LessonBlock } from '../learning/training/types';
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  HelpCircle,
  CheckSquare,
} from 'lucide-react';

type Props = {
  moduleId: string;
  onBack: () => void;
};

export default function ModuleView({ moduleId, onBack }: Props) {
  const module = trainingContent[moduleId];
  const meta = moduleMeta[moduleId];

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  if (!module || !meta) {
    return (
      <div className="p-4">
        <button onClick={onBack}>← Назад</button>
        <p className="mt-4 text-red-500">Модуль не найден</p>
      </div>
    );
  }

  const blocks = module.blocks;
  const total = blocks.length;
  const block = blocks[step];
  const progress = Math.round(((step + 1) / total) * 100);

  function next() {
    setChoice(null);
    setChecked([]);
    setStep((s) => s + 1);
  }

  function finishModule() {
    completeModule(moduleId);
    setCompleted(true);
  }

  function canContinue(block: LessonBlock) {
    switch (block.type) {
      case 'choice':
        return !!choice;
      case 'checklist':
        return checked.length === block.items.length;
      default:
        return true;
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ArrowLeft size={16} /> К обучению
      </button>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Прогресс */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${meta.gradient}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">
            {step + 1} / {total}
          </span>
        </div>

        {!completed ? (
          <div className="rounded-3xl bg-white p-6 shadow-md space-y-4">
            <h2 className="text-xl font-bold">{module.title}</h2>

            {/* ===== BLOCK RENDER ===== */}
            {(() => {
              switch (block.type) {
                case undefined:
                  return (
                    <p className="text-gray-700 leading-relaxed">
                      {block.text}
                    </p>
                  );

                case 'tip':
                  return (
                    <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
                      <div className="flex items-center gap-2 font-semibold text-yellow-700 mb-2">
                        <Lightbulb size={18} /> Подсказка
                      </div>
                      <p className="text-sm text-gray-700">{block.text}</p>
                    </div>
                  );

                case 'example':
                  return (
                    <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4">
                      <div className="flex items-center gap-2 font-semibold text-purple-700 mb-2">
                        <BookOpen size={18} /> Пример из смены
                      </div>
                      <p className="text-sm text-gray-700">{block.text}</p>
                    </div>
                  );

                case 'choice':
                  return (
                    <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
                      <div className="flex items-center gap-2 font-semibold text-orange-700 mb-3">
                        <HelpCircle size={18} /> Что бы ты сделал?
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {block.question}
                      </p>

                      <div className="space-y-2">
                        {block.options.map((o) => (
                          <button
                            key={o}
                            onClick={() => setChoice(o)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                              choice === o
                                ? 'bg-orange-200 border-orange-400'
                                : 'bg-white border-orange-200 hover:bg-orange-100'
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'checklist':
                  return (
                    <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                        <CheckSquare size={18} /> {block.title}
                      </div>

                      <div className="space-y-2">
                        {block.items.map((item) => {
                          const active = checked.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() =>
                                setChecked((prev) =>
                                  active
                                    ? prev.filter((i) => i !== item)
                                    : [...prev, item]
                                )
                              }
                              className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                                active
                                  ? 'bg-green-200 border-green-400'
                                  : 'bg-white border-green-200 hover:bg-green-100'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
              }
            })()}

            {/* Навигация */}
            <div className="flex gap-3 pt-4">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-40"
              >
                Назад
              </button>

              {step < total - 1 ? (
                <button
                  onClick={next}
                  disabled={!canContinue(block)}
                  className={`flex-1 py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${meta.gradient} disabled:opacity-40`}
                >
                  Далее
                </button>
              ) : (
                <button
                  onClick={finishModule}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold"
                >
                  Завершить модуль
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-green-50 border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="text-green-600" />
              <h3 className="text-lg font-bold text-green-700">
                Модуль пройден
              </h3>
            </div>

            <p className="text-gray-700 mb-4">
              Супер. Теперь ты в точке сборки — можно идти дальше.
            </p>

            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              Вернуться к обучению
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
