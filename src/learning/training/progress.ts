const STORAGE_KEY = 'training_progress';

export type TrainingProgress = {
  [moduleId: string]: boolean;
};

function loadProgress(): TrainingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: TrainingProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isModuleCompleted(moduleId: string): boolean {
  const progress = loadProgress();
  return progress[moduleId] === true;
}

export function completeModule(moduleId: string): void {
  const progress = loadProgress();
  progress[moduleId] = true;
  saveProgress(progress);
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
