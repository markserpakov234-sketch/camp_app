export const moduleMeta: Record<
  string,
  {
    gradient: string;
    accent: 'orange' | 'blue' | 'purple' | 'green';
  }
> = {
  manifest: {
    gradient: 'from-orange-400 via-yellow-400 to-green-400',
    accent: 'orange',
  },

  pedagogy: {
    gradient: 'from-indigo-400 via-blue-400 to-cyan-400',
    accent: 'blue',
  },

  age: {
    gradient: 'from-sky-400 via-blue-400 to-indigo-400',
    accent: 'blue',
  },

  shiftLogic: {
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    accent: 'orange',
  },

  game: {
    gradient: 'from-emerald-400 via-green-400 to-lime-400',
    accent: 'green',
  },

  creativity: {
    gradient: 'from-purple-400 via-pink-400 to-fuchsia-400',
    accent: 'purple',
  },

  conflicts: {
    gradient: 'from-red-400 via-rose-400 to-orange-400',
    accent: 'orange',
  },

  language: {
    gradient: 'from-cyan-400 via-sky-400 to-blue-500',
    accent: 'blue',
  },

  borders: {
    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
    accent: 'orange',
  },

  team: {
    gradient: 'from-green-400 via-emerald-400 to-teal-400',
    accent: 'green',
  },

  state: {
    gradient: 'from-purple-400 via-indigo-400 to-blue-500',
    accent: 'purple',
  },
};
