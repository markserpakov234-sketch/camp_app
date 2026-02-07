import { useState } from 'react';
import { Check } from 'lucide-react';
import { modules } from '../learning/training';
import { moduleMeta } from '../learning/training/moduleMeta';
import { completeModule } from '../learning/training/progress';
import type { LessonBlock } from '../learning/training';

type Props = {
  moduleId: string;
  onBack: () => void;
};

export default function ModuleView({ moduleId, onBack }: Props) {
  const module = modules.find((m) => m.id === moduleId);
  const meta = moduleMeta[moduleId];

  const [step, setStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  if (!module) return null;

  const block = module.blocks[step];

  const progress = Math.min(
    ((step + 1) / module.blocks.length) * 100,
    100
  );

  function toggleChecklist(index: number) {
    setCheckedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }

  function handleNext() {
    setSelectedChoice(null);
    setCheckedItems([]);

    if (step + 1 < module.blocks.length) {
      setStep((s) => s + 1);
    } else {
      completeModule(moduleId);
      setCompleted(true);
    }
  }

  const canProceed =
    !('type' in block) ||
    block.type === 'tip' ||
    block.type === 'example' ||
    (block.type === 'choice' && selectedChoice !== null) ||
    (block.type === 'checklist' &&
      checkedItems.length === block.items.length);

  function renderBlock(block: LessonBlock) {
    if (!('type' in block)) {
      return (
        <p className="whitespace-pre-line text-neutral-800 text-lg leading-relaxed tracking-wide">
          {block.text}
        </p>
      );
    }

    if (block.type === 'tip') {
      return (
        <div className="rounded-3xl bg-amber-50/80 border border-amber-200/60 p-6 shadow-inner">
          <p className="whitespace-pre-line text-amber-900 leading-relaxed">
            {block.text}
          </p>
        </div>
      );
    }

    if (block.type === 'example') {
      return (
        <div className="rounded-3xl bg-sky-50/80 border border-sky-200/60 p-6 shadow-inner">
          <p className="whitespace-pre-line text-sky-900 leading-relaxed">
            {block.text}
          </p>
        </div>
      );
    }

    if (block.type === 'choice') {
      return (
        <div className="space-y-6">
          <p className="font-semibold text-neutral-900 text-lg">
            {block.question}
          </p>

          <div className="space-y-3">
            {block.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedChoice(i)}
                className={`
                  w-full rounded-2xl px-5 py-4 text-left transition-all duration-200
                  ${
                    selectedChoice === i
                      ? `bg-gradient-to-r ${meta?.gradient} text-white shadow-lg scale-[1.02]`
                      : 'bg-white/80 hover:bg-white shadow-md hover:shadow-lg'
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'checklist') {
      return (
        <div className="space-y-5">
          <h3 className="font-semibold text-neutral-900 text-lg">
            {block.title}
          </h3>

          <div className="space-y-3">
            {block.items.map((item: string, i: number) => {
              const checked = checkedItems.includes(i);

              return (
                <div
                  key={i}
                  onClick={() => toggleChecklist(i)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200
                    ${
                      checked
                        ? `bg-gradient-to-r ${meta?.gradient} text-white shadow-lg scale-[1.01]`
                        : 'bg-white/80 shadow hover:shadow-md'
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center transition
                      ${
                        checked
                          ? 'bg-white text-neutral-900'
                          : 'border border-neutral-300'
                      }
                    `}
                  >
                    {checked && <Check size={16} />}
                  </div>

                  <span className="leading-relaxed">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-10 text-center space-y-6 border border-white/60">
          <h2 className="text-2xl font-bold text-neutral-900">
            Модуль завершён
          </h2>

          <button
            onClick={onBack}
            className={`px-8 py-3 rounded-2xl text-white shadow-lg transition hover:scale-105 bg-gradient-to-r ${meta?.gradient}`}
          >
            Вернуться к обучению
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      {/* фоновые blur-пятна */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* градиентная линия */}
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${meta?.gradient}`}
        />

        {/* заголовок */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-neutral-900">
            {module.title}
          </h1>

          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${meta?.gradient} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-neutral-500">
            {step + 1} из {module.blocks.length}
          </p>
        </div>

        {/* карточка контента */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 transition-all duration-300">
          {renderBlock(block)}
        </div>

        {/* навигация */}
        <div className="flex justify-between items-center">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-3 rounded-2xl bg-white shadow-md hover:shadow-lg transition disabled:opacity-40"
          >
            Назад
          </button>

          <button
            disabled={!canProceed}
            onClick={handleNext}
            className={`
              px-8 py-3 rounded-2xl text-white shadow-lg transition-all duration-200
              ${
                canProceed
                  ? `bg-gradient-to-r ${meta?.gradient} hover:scale-105`
                  : 'bg-neutral-300 cursor-not-allowed'
              }
            `}
          >
            {step + 1 === module.blocks.length
              ? 'Завершить'
              : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
}
