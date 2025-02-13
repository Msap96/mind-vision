"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Save } from "lucide-react";
import type { Exercise, JournalEntry } from "@/types";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

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

  const handleSaveJournal = (): void => {
    if (journalEntry.trim()) {
      setJournalEntries((prev) => [
        ...prev,
        {
          date: new Date().toLocaleString(),
          exercise: currentEx.title,
          entry: journalEntry,
        },
      ]);
      setJournalEntry("");
    }
  };

  return (
    <main className="min-h-screen mind-vision-gradient p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="card-hover shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-primary-700">
              MindVision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-primary-50 rounded-lg p-6 shadow-inner">
                <h2 className="text-xl font-semibold mb-2 text-primary-700">
                  {currentEx.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {currentEx.description}
                </p>
                <div className="flex items-center justify-between text-sm text-primary-600">
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

              <div className="timer-display text-center">
                {formatTime(timeRemaining)}
              </div>

              <div className="flex items-center justify-center space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary-50 transition-colors"
                  onClick={handlePrevious}
                >
                  <SkipBack className="h-5 w-5 text-primary-600" />
                </Button>

                <Button
                  size="icon"
                  className="bg-primary-600 hover:bg-primary-700 transition-colors w-12 h-12"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary-50 transition-colors"
                  onClick={handleNext}
                >
                  <SkipForward className="h-5 w-5 text-primary-600" />
                </Button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="journal-card card-hover shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
            <CardTitle className="text-2xl text-primary-700">
              Reflection Journal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {currentEx.prompts.map((prompt, index) => (
                  <p key={index} className="text-gray-600 italic">
                    "{prompt}"
                  </p>
                ))}
              </div>
              <textarea
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-shadow"
                placeholder="Record your experience..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              />
              <Button
                className="w-full bg-primary-600 hover:bg-primary-700 transition-colors"
                onClick={handleSaveJournal}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {journalEntries.length > 0 && (
          <Card className="journal-card card-hover shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
              <CardTitle className="text-2xl text-primary-700">
                Previous Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {journalEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 hover:bg-primary-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-sm text-primary-600">
                      {entry.date} - {entry.exercise}
                    </div>
                    <p className="mt-2 text-gray-700">{entry.entry}</p>
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
