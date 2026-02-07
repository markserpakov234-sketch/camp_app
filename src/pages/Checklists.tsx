import React, { useEffect, useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  Sun,
  CalendarDays,
  HeartPulse,
  AlertTriangle,
  Users,
  ChevronDown,
} from 'lucide-react';

import { checklistSections } from '../checklists';
import type { ChecklistSection } from '../checklists/types';

type Progress = Record<string, boolean>;

/* 🎨 иконки секций */
const sectionIcons: Record<ChecklistSection['id'], React.ReactNode> = {
  day: <Sun className="w-4 h-4 text-orange-400" />,
  events: <CalendarDays className="w-4 h-4 text-purple-400" />,
  state: <HeartPulse className="w-4 h-4 text-pink-400" />,
  emergency: <AlertTriangle className="w-4 h-4 text-red-400" />,
  team: <Users className="w-4 h-4 text-blue-400" />,
};

export default function Checklists() {
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem('checklist-progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('checklist-progress', JSON.stringify(progress));
  }, [progress]);

  const filteredSections = useMemo<ChecklistSection[]>(() => {
    const q = query.toLowerCase();

    return checklistSections
      .map((section) => ({
        ...section,
        checklists: section.checklists.filter(
          (list) =>
            list.title.toLowerCase().includes(q) ||
            list.items.some((item) => item.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.checklists.length > 0);
  }, [query]);

  return (
    <div className="space-y-6">
      {/* 🧠 ШАПКА */}
      <div className="rounded-3xl p-5 bg-white/70 backdrop-blur shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-orange-500 font-medium">
          <ClipboardCheck className="w-5 h-5" />
          <span>Проверь себя</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          Не страшно не знать.
          <br />
          Страшно не интересоваться.
        </p>

        <p className="text-xs text-gray-500">
          Чеклисты на все случаи лагерной жизни
        </p>
      </div>

      {/* 🔍 ПОИСК */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по чеклистам и пунктам…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur shadow-sm text-sm outline-none"
        />
      </div>

      {/* 📋 СЕКЦИИ */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <ChecklistSectionBlock
            key={section.id}
            section={section}
            progress={progress}
            setProgress={setProgress}
            isOpen={query ? true : openSections[section.id] ?? false}
            toggleOpen={() =>
              setOpenSections((prev) => ({
                ...prev,
                [section.id]: !prev[section.id],
              }))
            }
          />
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-10">
            Ничего не найдено 🤍
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- */
/* 🧩 СЕКЦИЯ */
/* -------------------- */

function ChecklistSectionBlock({
  section,
  progress,
  setProgress,
  isOpen,
  toggleOpen,
}: {
  section: ChecklistSection;
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
  isOpen: boolean;
  toggleOpen: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-3">
      {/* SECTION HEADER */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            {sectionIcons[section.id]}
            <h2 className="text-lg font-medium text-gray-900">
              {section.title}
            </h2>
          </div>

          {section.subtitle && (
            <p className="text-sm text-gray-500">{section.subtitle}</p>
          )}
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* SECTION BODY */}
      {isOpen && (
        <div className="space-y-4">
          {section.checklists.map((checklist) => {
            const isChecklistOpen = open[checklist.id] ?? false;

            const completedCount = checklist.items.filter((_, index) => {
              const id = `${section.id}:${checklist.id}:${index}`;
              return progress[id];
            }).length;

            const completed =
              checklist.items.length > 0 &&
              completedCount === checklist.items.length;

            return (
              <div
                key={checklist.id}
                className={`rounded-3xl bg-white shadow-sm transition ${
                  completed ? 'opacity-60' : ''
                }`}
              >
                {/* CHECKLIST HEADER */}
                <button
                  onClick={() =>
                    setOpen((prev) => ({
                      ...prev,
                      [checklist.id]: !prev[checklist.id],
                    }))
                  }
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="space-y-0.5">
                    <h3 className="text-base font-normal text-gray-800">
                      {checklist.title}
                    </h3>

                    {checklist.description && (
                      <p className="text-xs text-gray-500">
                        {checklist.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition ${
                        isChecklistOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* CHECKLIST BODY */}
                {isChecklistOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    {checklist.items.map((item, index) => {
                      const itemId = `${section.id}:${checklist.id}:${index}`;

                      return (
                        <label
                          key={itemId}
                          className="flex items-start gap-3 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!progress[itemId]}
                            onChange={() =>
                              setProgress((prev) => ({
                                ...prev,
                                [itemId]: !prev[itemId],
                              }))
                            }
                            className="mt-1"
                          />

                          <span
                            className={
                              progress[itemId]
                                ? 'line-through text-gray-400'
                                : 'text-gray-700'
                            }
                          >
                            {item}
                          </span>
                        </label>
                      );
                    })}

                    <div className="pt-2 text-xs text-gray-400">
                      {completedCount} / {checklist.items.length} выполнено
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
