// --- БАЗОВЫЙ ТЕКСТ (БЕЗ type !!!)
export type TextBlock = {
  text: string;
};

// --- TIP
export type TipBlock = {
  type: 'tip';
  text: string;
};

// --- EXAMPLE
export type ExampleBlock = {
  type: 'example';
  text: string;
};

// --- CHOICE
export type ChoiceBlock = {
  type: 'choice';
  question: string;
  options: string[];
  correctIndex?: number;
};

// --- CHECKLIST
export type ChecklistBlock = {
  type: 'checklist';
  title: string;
  items: string[];
};

// --- UNION
export type LessonBlock =
  | TextBlock
  | TipBlock
  | ExampleBlock
  | ChoiceBlock
  | ChecklistBlock;

// --- МОДУЛЬ
export type TrainingModuleContent = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};
