import type { ChecklistSection } from './types';

import day from './data/day';
import events from './data/events';
import state from './data/state';
import emergency from './data/emergency';
import team from './data/team';

export const checklistSections: ChecklistSection[] = [
  day,
  events,
  state,
  emergency,
  team,
];
