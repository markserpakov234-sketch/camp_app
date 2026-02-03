import { TrainingModuleContent } from '../types';

import manifest from './manifest';
import age from './age';
import conflicts from './conflicts';
import creativity from './creativity';
import game from './game';
import pedagogy from './pedagogy';
import shiftLogic from './shiftLogic';

export const trainingContent: Record<string, TrainingModuleContent> = {
  manifest,
  age,
  conflicts,
  creativity,
  game,
  pedagogy,
  shiftLogic,
};

export type TrainingContentKey = keyof typeof trainingContent;
