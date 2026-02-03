import { useState } from 'react';
import { trainingContent, completeModule } from '../learning/training';
import { moduleMeta } from '../learning/training/moduleMeta';
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export default function ModuleView({
  moduleId,
  onBack,
}: {
  moduleId: string;
  onBack: () => void;
}) {
  const module = (trainingContent as any)[moduleId];
  const meta = moduleMeta[moduleId];

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);

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
  const block = blocks[step] as any;
  const progress = Math.round(((step + 1) / total) * 100);

  function next() {
    setChoice(null);
    setStep((s) => s + 1);
  }

  function finishModule() {
    completeModule(moduleId);
    setCompleted(true);
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4">
      {/* назад */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ArrowLeft size={16} /> К обучению
      </button>

      <div className="max-w-xl mx-auto space-y-4">
        {/* прогресс */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${meta.gradient} transition-all`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">
            {step + 1} / {total}
          </span>
        </div>

        {!completed ? (
          <div className="rounded-3xl bg-white p-6 shadow-md animate-fade-in">
            <h2 className="text-xl font-bold mb-4">{module.title}</h2>

            {/* TEXT */}
            {!block.type && (
              <p className="text-gray-700 leading-relaxed">
                {block.text}
              </p>
            )}

            {/* TIP */}
            {block.type === 'tip' && (
              <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2 text-yellow-700">
                  <Lightbulb size={18} /> Подсказка
                </div>
                <p className="text-gray-700 text-sm">{block.text}</p>
              </div>
            )}

            {/* EXAMPLE */}
            {block.type === 'example' && (
              <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2 text-purple-700">
                  <BookOpen size={18} /> Пример из смены
                </div>
                <p className="text-gray-700 text-sm">{block.text}</p>
              </div>
            )}

            {/* CHOICE */}
            {block.type === 'choice' && (
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
                <div className="flex items-center gap-2 font-semibold mb-3 text-orange-700">
                  <HelpCircle size={18} /> Что бы ты сделал?
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  {block.question}
                </p>

                <div className="space-y-2">
                  {block.options.map((o: string) => (
                    <button
                      key={o}
                      onClick={() => setChoice(o)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl border transition
                        ${
                          choice === o
                            ? 'bg-orange-200 border-orange-400'
                            : 'bg-white border-orange-200 hover:bg-orange-100'
                        }
                      `}
                    >
                      {o}
                    </button>
                  ))}
                </div>

                {choice && (
                  <p className="mt-3 text-xs text-gray-600">
                    Нет правильного ответа. Важно, что ты думаешь.
                  </p>
                )}
              </div>
            )}

            {/* навигация */}
            <div className="flex gap-3 mt-6">
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
                  disabled={block.type === 'choice' && !choice}
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
          /* финал */
          <div className="rounded-3xl bg-green-50 border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="text-green-600" />
              <h3 className="text-lg font-bold text-green-700">
                Модуль засчитан
              </h3>
            </div>

            <p className="text-gray-700 mb-4">
              Ты стал на шаг ближе к образу
              <span className="font-semibold text-green-700">
                {' '}топ-вожатого
              </span>.
            </p>

            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Вернуться к обучению
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

