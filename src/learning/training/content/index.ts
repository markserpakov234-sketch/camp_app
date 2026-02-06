import type { TrainingModuleContent } from '../types';

import manifest from './manifest';
import pedagogy from './pedagogy';
import age from './age';
import shiftLogic from './shiftLogic';
import game from './game';
import creativity from './creativity';
import conflicts from './conflicts';

import language from './language';
import borders from './borders';
import team from './team';
import state from './state';

export const trainingContent: Record<string, TrainingModuleContent> = {
  manifest,
  pedagogy,
  age,
  shiftLogic,
  game,
  creativity,
  conflicts,

  language,
  borders,
  team,
  state,
};

export type TrainingContentKey = keyof typeof trainingContent;
