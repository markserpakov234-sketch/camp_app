export type TextBlock = {
  type: 'text';
  text: string;
};

export type TipBlock = {
  type: 'tip';
  text: string;
};

export type ExampleBlock = {
  type: 'example';
  text: string;
};

export type ChoiceBlock = {
  type: 'choice';
  question: string;
  options: string[];
  correctIndex?: number;
};

export type ChecklistBlock = {
  type: 'checklist';
  title: string;
  items: string[];
};

export type LessonBlock =
  | TextBlock
  | TipBlock
  | ExampleBlock
  | ChoiceBlock
  | ChecklistBlock;

export type TrainingModuleContent = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};
