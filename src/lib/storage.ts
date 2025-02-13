import type { JournalEntry } from '@/types';

const STORAGE_KEY = 'mindvision_journal';

export const saveJournalEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
};

export const loadJournalEntries = (): JournalEntry[] => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
}; 