export interface Exercise {
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prompts: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  exercise: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 