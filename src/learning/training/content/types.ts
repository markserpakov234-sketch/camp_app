// 🔹 типы блоков обучения

export type TextBlock = {
    type?: 'text';
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
  };
  
  export type TrainingBlock =
    | TextBlock
    | TipBlock
    | ExampleBlock
    | ChoiceBlock;
  
  // 🔹 модуль обучения
  export type TrainingModuleContent = {
    id: string;
    title: string;
    blocks: TrainingBlock[];
  };
  