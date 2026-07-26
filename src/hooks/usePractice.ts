// ============================================================
// 练习模式 Hook
// ============================================================

import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { speak } from '@/services/speech';
import { recordCorrect, recordWrong } from '@/services/spacedRepetition';
import { recordWordPractice, recordWrong as saveWrongRecord, incrementPracticesDone } from '@/services/study';
import type { PracticeState, HideMode } from '@/types';
import type { Sentence } from '@/types';

export function usePractice() {
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 提交答案 */
  const submitAnswer = useCallback(
    async (practice: PracticeState, sentence: Sentence) => {
      const trimmed = userInput.trim().toLowerCase();
      const correctAnswer = practice.hiddenWord.toLowerCase();
      const correct = trimmed === correctAnswer;

      setIsCorrect(correct);
      setShowResult(true);

      // 记录
      await incrementPracticesDone(correct);
      const wordId = sentence.words[practice.hiddenWordIndex] ?? sentence.words[0];

      if (correct) {
        await recordCorrect(wordId);
        await recordWordPractice(wordId, true);
        // 撒花动画
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
        });
        // 自动播放发音
        await speak(sentence.basic);
        // 延迟后自动下一题
        return { correct: true };
      } else {
        await recordWrong(wordId);
        await recordWordPractice(wordId, false);
        await saveWrongRecord(sentence.id, wordId, trimmed, correctAnswer);
        return { correct: false };
      }
    },
    [userInput]
  );

  /** 重置练习状态 */
  const resetPractice = useCallback(() => {
    setUserInput('');
    setShowResult(false);
    setIsCorrect(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  return {
    userInput,
    setUserInput,
    showResult,
    isCorrect,
    inputRef,
    submitAnswer,
    resetPractice,
    setShowResult,
  };
}
