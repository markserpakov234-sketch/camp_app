import type { TrainingModuleContent } from './types';

import manifest from './content/manifest';
import age from './content/age';
import state from './content/state';
import language from './content/language';
import conflicts from './content/conflicts';
import creativity from './content/creativity';
import game from './content/game';
import borders from './content/borders';
import pedagogy from './content/pedagogy';
import shiftLogic from './content/shiftLogic';
import team from './content/team';

export const modules: TrainingModuleContent[] = [
  manifest,
  age,
  state,
  language,
  conflicts,
  creativity,
  game,
  borders,
  pedagogy,
  shiftLogic,
  team,
];

// 👇 ВАЖНО
export * from './progress';
export * from './structure';
export type {
  LessonBlock,
  TrainingModuleContent,
  TextBlock,
  TipBlock,
  ExampleBlock,
  ChoiceBlock,
  ChecklistBlock,
} from './types';
