import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import type {
  TrainingModuleContent,
  TrainingBlock,
  TextBlock,
  TipBlock,
  ExampleBlock,
  ChoiceBlock,
  ChecklistBlock,
} from '../learning/training/types';

import { trainingModules } from '../learning/training'; // ✅ правильный источник

type Props = {
  moduleId: string;
  onBack: () => void;
};

export default function ModuleView({ moduleId, onBack }: Props) {
  const module = useMemo<TrainingModuleContent | undefined>(
    () => trainingModules.find(m => m.id === moduleId),
    [moduleId]
  );

  const [step, setStep] = useState(0);

  if (!module) {
    return (
      <div className="p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-2">
          <ArrowLeft size={18} /> Назад
        </button>
        <p>Модуль не найден</p>
      </div>
    );
  }

  const block = module.blocks[step];

  const next = () => {
    if (step < module.blocks.length - 1) {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-purple-800 p-4 text-white">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">{module.title}</h1>
      </div>

      {/* CONTENT */}
      <div className="rounded-3xl bg-white/15 backdrop-blur p-6">
        {renderBlock(block)}
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm opacity-80">
          {step + 1} / {module.blocks.length}
        </span>

        {step < module.blocks.length - 1 && (
          <button
            onClick={next}
            className="rounded-xl bg-white text-purple-700 px-5 py-2 font-semibold"
          >
            Следующее
          </button>
        )}

        {step === module.blocks.length - 1 && (
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle2 /> Модуль пройден
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- RENDER BLOCK ---------------- */

function renderBlock(block: TrainingBlock) {
  // TEXT (без type)
  if (!('type' in block)) {
    const b = block as TextBlock;
    return <p className="text-lg leading-relaxed whitespace-pre-line">{b.text}</p>;
  }

  switch (block.type) {
    case 'tip': {
      const b = block as TipBlock;
      return (
        <div className="rounded-2xl bg-white/20 p-4">
          <p className="font-semibold">💡 Подсказка</p>
          <p className="mt-2 whitespace-pre-line">{b.text}</p>
        </div>
      );
    }

    case 'example': {
      const b = block as ExampleBlock;
      return (
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="font-semibold">Пример</p>
          <p className="mt-2 whitespace-pre-line">{b.text}</p>
        </div>
      );
    }

    case 'choice': {
      const b = block as ChoiceBlock;
      return (
        <div>
          <p className="mb-4 font-semibold">{b.question}</p>
          <div className="space-y-2">
            {b.options.map(option => (
              <button
                key={option.id}
                className="w-full rounded-xl bg-white/20 px-4 py-3 text-left"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    }

    case 'checklist': {
      const b = block as ChecklistBlock;
      return (
        <div>
          <p className="mb-4 font-semibold">{b.title}</p>
          <div className="space-y-3">
            {b.items.map(item => (
              <label
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3"
              >
                <input type="checkbox" />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
