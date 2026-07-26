// ============================================================
// 间隔重复学习算法 (Spaced Repetition)
// ============================================================

import { db } from '@/db';
import type { Memory } from '@/types';

/** 记忆等级范围 */
const MIN_LEVEL = 0;
const MAX_LEVEL = 10;

/** 根据记忆等级计算下次复习间隔（小时） */
function getInterval(level: number): number {
  const intervals: Record<number, number> = {
    0: 0.05, // 3 分钟
    1: 0.17, // 10 分钟
    2: 0.5, // 30 分钟
    3: 1, // 1 小时
    4: 4, // 4 小时
    5: 8, // 8 小时
    6: 24, // 1 天
    7: 72, // 3 天
    8: 168, // 7 天
    9: 336, // 14 天
    10: 720, // 30 天
  };
  return (intervals[level] ?? 1) * 3600 * 1000; // 转换为毫秒
}

/** 获取或创建单词记忆 */
export async function getMemory(wordId: number): Promise<Memory> {
  const mem = await db.memories.get(wordId);
  if (mem) return mem;
  const now = Date.now();
  const newMem: Memory = {
    wordId,
    memoryLevel: 0,
    correct: 0,
    wrong: 0,
    lastStudy: now,
    nextReview: now, // 立即可复习
  };
  await db.memories.put(newMem);
  return newMem;
}

/** 获取所有单词记忆 */
export async function getAllMemories(): Promise<Memory[]> {
  return db.memories.toArray();
}

/** 记录答对 */
export async function recordCorrect(wordId: number): Promise<Memory> {
  const mem = await getMemory(wordId);
  const now = Date.now();
  mem.correct++;
  mem.memoryLevel = Math.min(MAX_LEVEL, mem.memoryLevel + 1);
  mem.lastStudy = now;
  mem.nextReview = now + getInterval(mem.memoryLevel);
  await db.memories.put(mem);
  return mem;
}

/** 记录答错 */
export async function recordWrong(wordId: number): Promise<Memory> {
  const mem = await getMemory(wordId);
  const now = Date.now();
  mem.wrong++;
  mem.memoryLevel = Math.max(MIN_LEVEL, mem.memoryLevel - 1);
  mem.lastStudy = now;
  mem.nextReview = now + getInterval(mem.memoryLevel);
  await db.memories.put(mem);
  return mem;
}

/** 获取需要复习的单词（nextReview 已过期的） */
export async function getDueWords(): Promise<number[]> {
  const now = Date.now();
  const due = await db.memories
    .where('nextReview')
    .belowOrEqual(now)
    .toArray();
  return due.map((m) => m.wordId);
}

/** 按记忆等级排序单词（等级低的优先） */
export async function getWordsByPriority(): Promise<number[]> {
  const memories = await db.memories
    .orderBy('memoryLevel')
    .toArray();
  return memories.map((m) => m.wordId);
}

/** 获取长期未学习的单词 */
export async function getForgottenWords(daysThreshold: number = 7): Promise<number[]> {
  const threshold = Date.now() - daysThreshold * 24 * 3600 * 1000;
  const forgotten = await db.memories
    .where('lastStudy')
    .below(threshold)
    .toArray();
  return forgotten.map((m) => m.wordId);
}

/** 重置单词记忆 */
export async function resetMemory(wordId: number): Promise<void> {
  await db.memories.delete(wordId);
}
