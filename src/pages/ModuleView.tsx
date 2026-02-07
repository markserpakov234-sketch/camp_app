import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import type { TrainingModuleContent } from '../learning/training/types';
import { modules } from '../learning/training'; // ✅ named export

type Props = {
  moduleId: string;
  onBack: () => void;
};

export default function ModuleView({ moduleId, onBack }: Props) {
  const module = useMemo<TrainingModuleContent | undefined>(
    () => modules.find((m) => m.id === moduleId),
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
            onClick={() => setStep((s) => s + 1)}
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

/* ---------------- BLOCK RENDER ---------------- */

function renderBlock(block: any) {
  if (!block) return null;

  // TEXT (без type)
  if (!block.type) {
    return (
      <p className="text-lg leading-relaxed whitespace-pre-line">
        {block.text}
      </p>
    );
  }

  if (block.type === 'tip') {
    return (
      <div className="rounded-2xl bg-white/20 p-4">
        <p className="font-semibold mb-2">💡 Подсказка</p>
        <p className="whitespace-pre-line">{block.text}</p>
      </div>
    );
  }

  if (block.type === 'example') {
    return (
      <div className="rounded-2xl bg-white/10 p-4">
        <p className="font-semibold mb-2">Пример</p>
        <p className="whitespace-pre-line">{block.text}</p>
      </div>
    );
  }

  if (block.type === 'choice') {
    return (
      <div>
        <p className="mb-4 font-semibold">{block.question}</p>
        <div className="space-y-2">
          {block.options.map((option: string, i: number) => (
            <button
              key={i}
              className="w-full rounded-xl bg-white/20 px-4 py-3 text-left"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === 'checklist') {
    return (
      <div>
        <p className="mb-4 font-semibold">{block.title}</p>
        <div className="space-y-3">
          {block.items.map((item: string, i: number) => (
            <label
              key={i}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3"
            >
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
