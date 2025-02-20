"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Save, Trash2 } from "lucide-react";
import type { Exercise, JournalEntry } from "@/types";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Initialize user and load entries
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await fetch("/api/setup", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to initialize user");
        }

        const { data } = await response.json();
        setUserId(data.userId);

        // Load entries for the user
        const entriesResponse = await fetch(
          `/api/entries?userId=${data.userId}`
        );
        if (!entriesResponse.ok) {
          throw new Error("Failed to load entries");
        }

        const { data: entriesData } = await entriesResponse.json();
        setJournalEntries(entriesData);
      } catch (error) {
        console.error("Error initializing:", error);
        setError("Failed to initialize application");
      }
    };

    initializeUser();
  }, []);

  const exercises: Exercise[] = [
    {
      title: "Mental Screen Exercise",
      description:
        "Imagine a blank movie screen in your mind. Practice making it bigger, smaller, closer, and further away.",
      duration: 600,
      difficulty: "Beginner",
      prompts: [
        "How clear was your mental screen?",
        "Could you adjust its size easily?",
      ],
    },
    {
      title: "Object Visualization",
      description:
        "Visualize a simple object like an apple. Focus on its color, texture, and try rotating it in your mind.",
      duration: 900,
      difficulty: "Intermediate",
      prompts: [
        "What details could you see clearly?",
        "How stable was the image?",
      ],
    },
    {
      title: "Scene Construction",
      description:
        "Build a peaceful scene piece by piece - start with the sky, add trees, water, and other elements gradually.",
      duration: 1200,
      difficulty: "Advanced",
      prompts: ["What elements did you include?", "How vivid were the colors?"],
    },
  ];

  // Get current exercise
  const currentEx = exercises[currentExercise];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
        setProgress((prev) => prev + 100 / currentEx.duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentEx.duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = (): void => {
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
    setProgress(0);
    setTimeRemaining(
      exercises[(currentExercise + 1) % exercises.length].duration
    );
    setJournalEntry("");
  };

  const handlePrevious = (): void => {
    setCurrentExercise(
      (prev) => (prev - 1 + exercises.length) % exercises.length
    );
    setProgress(0);
    setTimeRemaining(
      exercises[(currentExercise - 1 + exercises.length) % exercises.length]
        .duration
    );
    setJournalEntry("");
  };

  const handleSaveJournal = async (): Promise<void> => {
    if (!journalEntry.trim() || !userId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          exercise: currentEx.title,
          content: journalEntry,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save entry");
      }

      const { data: newEntry } = await response.json();
      setJournalEntries((prev) => [newEntry, ...prev]);
      setJournalEntry("");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setError(error instanceof Error ? error.message : "Failed to save entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete entry");
      }

      // Remove the deleted entry from the state
      setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete entry"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="card-hover">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg dark:from-primary/5">
            <CardTitle className="text-3xl font-bold text-primary">
              MindVision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2 text-primary">
                  {currentEx.title}
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {currentEx.description}
                </p>
                <div className="flex items-center justify-between text-sm text-primary/80">
                  <span className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    Duration: {formatTime(currentEx.duration)}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">📈</span>
                    Level: {currentEx.difficulty}
                  </span>
                </div>
              </div>

              <div className="timer-display text-center text-primary">
                {formatTime(timeRemaining)}
              </div>

              <div className="flex items-center justify-center space-x-6">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  className="w-12 h-12"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button variant="outline" size="icon" onClick={handleNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-background dark:from-primary/5">
            <CardTitle className="text-2xl text-primary">
              Reflection Journal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {currentEx.prompts.map((prompt, index) => (
                  <p key={index} className="text-muted-foreground italic">
                    "{prompt}"
                  </p>
                ))}
              </div>
              <textarea
                className="w-full h-32 p-3 rounded-lg bg-muted border-muted-foreground/20 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-none"
                placeholder="Record your experience..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                disabled={isLoading}
              />
              <Button
                className="w-full"
                onClick={handleSaveJournal}
                disabled={isLoading || !journalEntry.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⌛</span>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
          </CardContent>
        </Card>

        {journalEntries.length > 0 && (
          <Card className="card-hover">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-background dark:from-primary/5">
              <CardTitle className="text-2xl text-primary">
                Previous Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {journalEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="border-b border-border pb-4 hover:bg-muted p-3 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-primary/80">
                          {entry.date} - {entry.exercise}
                        </div>
                        <p className="mt-2 text-foreground">{entry.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteEntry(entry.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
