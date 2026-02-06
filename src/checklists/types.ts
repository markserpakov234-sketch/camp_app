export type ChecklistItem = string;

export type Checklist = {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
};

export type ChecklistSection = {
  id: 'day' | 'events' | 'state' | 'emergency' | 'team';
  title: string;
  subtitle?: string;
  checklists: Checklist[];
};


