import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { modules } from '../learning/training';
import type {
  LessonBlock,
  TextBlock,
  ChecklistBlock,
  ChoiceBlock,
} from '../learning/training/types';

type Props = {
  moduleId: string;
};

export default function ModuleView({ moduleId }: Props) {
  const module = modules.find((m) => m.id === moduleId);

  const [checkProgress, setCheckProgress] = useState<
    Record<string, boolean>
  >({});

  if (!module) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Модуль не найден
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* ЗАГОЛОВОК МОДУЛЯ */}
      <div
        className="rounded-3xl p-6 text-white shadow"
        style={{
          background: module.meta.gradient,
        }}
      >
        <h1 className="text-xl font-bold">{module.title}</h1>
        {module.subtitle && (
          <p className="text-sm opacity-90 mt-1">
            {module.subtitle}
          </p>
        )}
      </div>

      {/* БЛОКИ */}
      <div className="space-y-4">
        {module.blocks.map((block, index) => (
          <BlockRenderer
            key={index}
            block={block}
            index={index}
            progress={checkProgress}
            setProgress={setCheckProgress}
            moduleId={module.id}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================= */
/* 🧩 РЕНДЕРЕР БЛОКОВ */
/* ================================================= */

function BlockRenderer({
  block,
  index,
  progress,
  setProgress,
  moduleId,
}: {
  block: LessonBlock;
  index: number;
  progress: Record<string, boolean>;
  setProgress: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  moduleId: string;
}) {
  switch (block.type) {
    case 'text':
      return <TextBlockView block={block} />;

    case 'tip':
      return <TipBlockView block={block} />;

    case 'example':
      return <ExampleBlockView block={block} />;

    case 'checklist':
      return (
        <ChecklistBlockView
          block={block}
          index={index}
          progress={progress}
          setProgress={setProgress}
          moduleId={moduleId}
        />
      );

    case 'choice':
      return <ChoiceBlockView block={block} />;

    default:
      return null;
  }
}

/* ================================================= */
/* 📄 TEXT */
/* ================================================= */

function TextBlockView({ block }: { block: TextBlock }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-4 text-gray-800">
      <p className="text-sm leading-relaxed whitespace-pre-line">
        {block.text}
      </p>
    </div>
  );
}

/* ================================================= */
/* 💡 TIP */
/* ================================================= */

function TipBlockView({ block }: { block: TextBlock }) {
  return (
    <div className="bg-orange-50 rounded-3xl p-4 border-l-4 border-orange-400">
      <p className="text-sm text-orange-900 whitespace-pre-line">
        {block.text}
      </p>
    </div>
  );
}

/* ================================================= */
/* 📘 EXAMPLE */
/* ================================================= */

function ExampleBlockView({ block }: { block: TextBlock }) {
  return (
    <div className="bg-purple-50 rounded-3xl p-4 border-l-4 border-purple-400">
      <p className="text-sm text-purple-900 whitespace-pre-line">
        {block.text}
      </p>
    </div>
  );
}

/* ================================================= */
/* ☑️ CHECKLIST */
/* ================================================= */

function ChecklistBlockView({
  block,
  index,
  progress,
  setProgress,
  moduleId,
}: {
  block: ChecklistBlock;
  index: number;
  progress: Record<string, boolean>;
  setProgress: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  moduleId: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
      <h3 className="font-medium text-gray-800">
        {block.title}
      </h3>

      <div className="space-y-2">
        {block.items.map((item, i) => {
          const id = `${moduleId}:${index}:${i}`;
          const checked = progress[id];

          return (
            <label
              key={id}
              className="flex items-start gap-3 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={!!checked}
                onChange={() =>
                  setProgress((prev) => ({
                    ...prev,
                    [id]: !prev[id],
                  }))
                }
                className="mt-1"
              />

              <span
                className={
                  checked
                    ? 'line-through text-gray-400'
                    : 'text-gray-700'
                }
              >
                {item}
              </span>

              {checked && (
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================= */
/* ❓ CHOICE */
/* ================================================= */

function ChoiceBlockView({ block }: { block: ChoiceBlock }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
      <p className="font-medium text-gray-800">
        {block.question}
      </p>

      <div className="space-y-2">
        {block.options.map((option) => (
          <button
            key={option.id}
            className="w-full text-left px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
