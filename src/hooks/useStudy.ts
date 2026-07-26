// ============================================================
// 学习页面 Hook
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { getAllSentences, incrementSentencesStudied } from '@/services/study';
import { speak } from '@/services/speech';
import type { Sentence, HideMode } from '@/types';
import type { PracticeState } from '@/types';
import { generatePractice, recordWordView } from '@/services/study';

export function useStudy() {
  const sentences = useLiveQuery(() => getAllSentences(), []) ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [practice, setPractice] = useState<PracticeState | null>(null);
  const [hideMode, setHideMode] = useState<HideMode>('random');
  const [weakWords, setWeakWords] = useState<number[]>([]);
  const studyTimerRef = useRef<number>(0);
  const timerStartRef = useRef<number>(0);

  const currentSentence: Sentence | undefined = sentences[currentIndex];

  // 学习计时器
  useEffect(() => {
    timerStartRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
      studyTimerRef.current += elapsed;
      timerStartRef.current = Date.now();
    }, 10000);
    return () => {
      clearInterval(interval);
      const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
      studyTimerRef.current += elapsed;
    };
  }, []);

  // 记录浏览
  useEffect(() => {
    if (currentSentence) {
      currentSentence.words.forEach((wid) => {
        recordWordView(wid);
      });
      incrementSentencesStudied();
    }
  }, [currentIndex, currentSentence]);

  /** 播放发音 */
  const playAudio = useCallback(async () => {
    if (!currentSentence) return;
    setIsPlaying(true);
    await speak(currentSentence.basic);
    setIsPlaying(false);
  }, [currentSentence]);

  /** 下一句 */
  const nextSentence = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % sentences.length);
  }, [sentences.length]);

  /** 上一句 */
  const prevSentence = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + sentences.length) % sentences.length);
  }, [sentences.length]);

  /** 跳转到指定索引 */
  const goToSentence = useCallback((index: number) => {
    if (index >= 0 && index < sentences.length) {
      setCurrentIndex(index);
    }
  }, [sentences.length]);

  /** 进入练习模式 */
  const startPractice = useCallback(() => {
    if (!currentSentence) return;
    const p = generatePractice(currentSentence, hideMode, weakWords);
    setPractice(p);
  }, [currentSentence, hideMode, weakWords]);

  /** 退出练习模式 */
  const endPractice = useCallback(() => {
    setPractice(null);
  }, []);

  /** 更新隐藏模式 */
  const changeHideMode = useCallback((mode: HideMode) => {
    setHideMode(mode);
  }, []);

  return {
    sentences,
    currentIndex,
    currentSentence,
    isPlaying,
    practice,
    hideMode,
    playAudio,
    nextSentence,
    prevSentence,
    goToSentence,
    startPractice,
    endPractice,
    setPractice,
    changeHideMode,
    setWeakWords,
  };
}
