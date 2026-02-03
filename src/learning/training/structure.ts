export type TrainingModule = {
  id: string;
  title: string;
  description: string;
};

export const structure: TrainingModule[] = [
  {
    id: 'manifest',
    title: 'Точка сборки вожатого',
    description:
      'Ценности проекта, живой подход к детям и практичные инструменты вожатого будущего',
  },
  {
    id: 'pedagogy',
    title: 'Как дети нас чувствуют',
    description:
      'Эмоции, доверие и то, что дети считывают быстрее слов',
  },
  {
    id: 'age',
    title: 'Они разные — и это нормально',
    description:
      'Возраст, реакции и реальные ожидания от детей',
  },
  {
    id: 'game',
    title: 'Через игру — к команде',
    description:
      'Игры как инструмент сплочения и вовлечения',
  },
  {
    id: 'creativity',
    title: 'Креатив, который работает',
    description:
      'Идеи, импровизация и приёмы, которые зажигают отряд',
  },
  {
    id: 'conflicts',
    title: 'Когда что-то пошло не так',
    description:
      'Конфликты, сложные моменты и спокойные решения',
  },
  {
    id: 'shiftLogic',
    title: 'Логика смены',
    description:
      'Как всё устроено: ритм, роли и жизнь отряда изнутри',
  },
];
