export type LessonBlock =
  | {
      /** обычный текстовый блок */
      text: string;
      type?: undefined;
    }
  | {
      type: 'tip';
      text: string;
    }
  | {
      type: 'example';
      text: string;
    }
  | {
      type: 'choice';
      question: string;
      options: string[];
    };

export type TrainingModuleContent = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};
