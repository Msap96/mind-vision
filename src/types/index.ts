export interface Exercise {
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prompts: string[];
}

export interface JournalEntry {
  date: string;
  exercise: string;
  entry: string;
} 