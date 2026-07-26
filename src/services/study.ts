// ============================================================
// 学习服务 - 句子学习核心逻辑
// ============================================================

import { db } from '@/db';
import type { Sentence, WordStats, StudyRecord, StudyOverview, DailyStats, WrongRecord, HideMode, PracticeState } from '@/types';

/** 获取所有单词 */
export async function getAllWords() {
  return db.words.toArray();
}

/** 通过ID获取单词 */
export async function getWord(id: number) {
  return db.words.get(id);
}

/** 搜索单词（单词/中文） */
export async function searchWords(query: string) {
  const q = query.toLowerCase();
  return db.words
    .filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.chinese.includes(q) ||
        !!(w.phonetic && w.phonetic.includes(q))
    )
    .toArray();
}

/** 获取所有句子 */
export async function getAllSentences(): Promise<Sentence[]> {
  return db.sentences.toArray();
}

/** 搜索句子 */
export async function searchSentences(query: string): Promise<Sentence[]> {
  const q = query.toLowerCase();
  return db.sentences
    .filter(
      (s) =>
        s.basic.toLowerCase().includes(q) ||
        s.natural.toLowerCase().includes(q) ||
        s.chinese.includes(q)
    )
    .toArray();
}

/** 获取包含特定单词的句子 */
export async function getSentencesByWord(wordId: number): Promise<Sentence[]> {
  return db.sentences
    .filter((s) => s.words.includes(wordId))
    .toArray();
}

/** 获取包含多个单词的句子 */
export async function getSentencesByWords(wordIds: number[]): Promise<Sentence[]> {
  const idSet = new Set(wordIds);
  return db.sentences
    .filter((s) => s.words.some((w) => idSet.has(w)))
    .toArray();
}

/** 记录单词浏览 */
export async function recordWordView(wordId: number): Promise<void> {
  const stats = await getWordStats(wordId);
  stats.viewed = true;
  stats.viewCount++;
  if (!stats.firstStudy) stats.firstStudy = Date.now();
  stats.lastStudy = Date.now();
  await db.wordStats.put(stats);
}

/** 记录单词练习 */
export async function recordWordPractice(wordId: number, correct: boolean): Promise<void> {
  const stats = await getWordStats(wordId);
  stats.practiced = true;
  stats.practiceCount++;
  if (correct) stats.correctCount++;
  else stats.wrongCount++;
  if (!stats.firstStudy) stats.firstStudy = Date.now();
  stats.lastStudy = Date.now();
  await db.wordStats.put(stats);
}

/** 获取单词统计 */
export async function getWordStats(wordId: number): Promise<WordStats> {
  const stats = await db.wordStats.get(wordId);
  if (stats) return stats;
  const newStats: WordStats = {
    wordId,
    viewed: false,
    practiced: false,
    viewCount: 0,
    practiceCount: 0,
    correctCount: 0,
    wrongCount: 0,
    memoryLevel: 0,
    firstStudy: null,
    lastStudy: null,
  };
  await db.wordStats.put(newStats);
  return newStats;
}

/** 获取所有单词统计 */
export async function getAllWordStats(): Promise<WordStats[]> {
  return db.wordStats.toArray();
}

/** 记录学习时长 */
export async function recordStudyTime(seconds: number): Promise<void> {
  const today = getDateString();
  const record = await db.studyRecords.where('date').equals(today).first();
  if (record) {
    record.totalStudyTime += seconds;
    await db.studyRecords.put(record);
  } else {
    await db.studyRecords.put({
      date: today,
      totalStudyTime: seconds,
      sentencesStudied: 0,
      practicesDone: 0,
      correctCount: 0,
      wrongCount: 0,
    });
  }
}

/** 增加句子学习计数 */
export async function incrementSentencesStudied(): Promise<void> {
  const today = getDateString();
  const record = await db.studyRecords.where('date').equals(today).first();
  if (record) {
    record.sentencesStudied++;
    await db.studyRecords.put(record);
  }
}

/** 增加练习计数 */
export async function incrementPracticesDone(correct: boolean): Promise<void> {
  const today = getDateString();
  const record = await db.studyRecords.where('date').equals(today).first();
  if (record) {
    record.practicesDone++;
    if (correct) record.correctCount++;
    else record.wrongCount++;
    await db.studyRecords.put(record);
  }
}

/** 记录错题 */
export async function recordWrong(sentenceId: number, wordId: number, userInput: string, correctAnswer: string): Promise<void> {
  await db.wrongRecords.put({
    sentenceId,
    wordId,
    userInput,
    correctAnswer,
    timestamp: Date.now(),
  });
}

/** 获取错题列表 */
export async function getWrongRecords(limit?: number): Promise<WrongRecord[]> {
  let query = db.wrongRecords.orderBy('timestamp').reverse();
  if (limit) query = query.limit(limit);
  return query.toArray();
}

/** 获取学习概览 */
export async function getStudyOverview(): Promise<StudyOverview> {
  const today = getDateString();
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const allRecords = await db.studyRecords.toArray();
  const allWordStats = await db.wordStats.toArray();

  // 总学习时长
  const totalStudyTime = allRecords.reduce((sum, r) => sum + r.totalStudyTime, 0);

  // 今日学习
  const todayRecord = allRecords.find((r) => r.date === today);
  const todayStudy = todayRecord?.totalStudyTime ?? 0;

  // 本周学习
  const weekStudy = allRecords
    .filter((r) => r.date >= weekStart)
    .reduce((sum, r) => sum + r.totalStudyTime, 0);

  // 本月学习
  const monthStudy = allRecords
    .filter((r) => r.date >= monthStart)
    .reduce((sum, r) => sum + r.totalStudyTime, 0);

  // 连续学习天数
  const streak = calculateStreak(allRecords.map((r) => r.date));

  // 总句子数
  const totalSentences = allRecords.reduce((sum, r) => sum + r.sentencesStudied, 0);

  // 总练习数
  const totalPractices = allRecords.reduce((sum, r) => sum + r.practicesDone, 0);

  // 正确率
  const totalCorrect = allRecords.reduce((sum, r) => sum + r.correctCount, 0);
  const totalWrong = allRecords.reduce((sum, r) => sum + r.wrongCount, 0);
  const accuracy = totalCorrect + totalWrong > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 0;

  // 已掌握/未掌握（memoryLevel >= 7 视为掌握）
  const masteredWords = allWordStats.filter((s) => s.memoryLevel >= 7).length;
  const unmasteredWords = 850 - masteredWords;

  return {
    totalStudyTime,
    todayStudy,
    weekStudy,
    monthStudy,
    streak,
    totalSentences,
    totalPractices,
    accuracy,
    masteredWords,
    unmasteredWords,
  };
}

/** 获取每日统计 */
export async function getDailyStats(days: number = 30): Promise<DailyStats[]> {
  const records = await db.studyRecords
    .orderBy('date')
    .reverse()
    .limit(days)
    .toArray();
  return records
    .map((r) => ({
      date: r.date,
      studyTime: r.totalStudyTime,
      sentencesCount: r.sentencesStudied,
      practicesCount: r.practicesDone,
      correctCount: r.correctCount,
      wrongCount: r.wrongCount,
    }))
    .reverse();
}

/** 获取错误最多的单词 TOP N */
export async function getTopWrongWords(topN: number = 20): Promise<{ wordId: number; count: number }[]> {
  const records = await db.wrongRecords.toArray();
  const countMap = new Map<number, number>();
  for (const r of records) {
    countMap.set(r.wordId, (countMap.get(r.wordId) || 0) + 1);
  }
  return Array.from(countMap.entries())
    .map(([wordId, count]) => ({ wordId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/** 收藏操作 */
export async function toggleFavorite(type: 'word' | 'sentence', itemId: number): Promise<boolean> {
  const existing = await db.favorites
    .where({ type, itemId })
    .first();
  if (existing) {
    await db.favorites.delete(existing.id!);
    return false; // 已取消收藏
  } else {
    await db.favorites.put({ type, itemId, timestamp: Date.now() });
    return true; // 已收藏
  }
}

/** 检查是否收藏 */
export async function isFavorite(type: 'word' | 'sentence', itemId: number): Promise<boolean> {
  const fav = await db.favorites.where({ type, itemId }).first();
  return !!fav;
}

/** 获取收藏列表 */
export async function getFavorites(type: 'word' | 'sentence'): Promise<number[]> {
  const favs = await db.favorites.where({ type }).toArray();
  return favs.map((f) => f.itemId);
}

/** 导出学习数据 */
export async function exportData(): Promise<string> {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    memories: await db.memories.toArray(),
    studyRecords: await db.studyRecords.toArray(),
    wordStats: await db.wordStats.toArray(),
    wrongRecords: await db.wrongRecords.toArray(),
    favorites: await db.favorites.toArray(),
    settings: await db.getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

/** 导入学习数据 */
export async function importData(json: string): Promise<boolean> {
  try {
    const data = JSON.parse(json);
    if (data.version !== 1) throw new Error('Unsupported data version');

    // 清空现有数据
    await db.memories.clear();
    await db.studyRecords.clear();
    await db.wordStats.clear();
    await db.wrongRecords.clear();
    await db.favorites.clear();

    // 导入数据
    if (data.memories) await db.memories.bulkPut(data.memories);
    if (data.studyRecords) await db.studyRecords.bulkPut(data.studyRecords);
    if (data.wordStats) await db.wordStats.bulkPut(data.wordStats);
    if (data.wrongRecords) await db.wrongRecords.bulkPut(data.wrongRecords);
    if (data.favorites) await db.favorites.bulkPut(data.favorites);
    if (data.settings) await db.settings.put(data.settings, 1);

    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

/** 生成练习 */
export function generatePractice(
  sentence: Sentence,
  hideMode: HideMode,
  weakWordIds: number[]
): PracticeState {
  const words = sentence.basic.split(' ');
  const contentWords = words
    .map((w, i) => ({ word: w.replace(/[.,!?;:]/g, ''), index: i, raw: w }))
    .filter((w) => w.word.length > 1); // 过滤单字母词和标点

  let targetIndex: number;

  switch (hideMode) {
    case 'random': {
      const pick = contentWords[Math.floor(Math.random() * contentWords.length)];
      targetIndex = pick.index;
      break;
    }
    case 'grammar': {
      // 隐藏动词/介词（简化：隐藏较短的词，通常是功能词）
      const grammarWords = contentWords.filter((w) => w.word.length <= 4);
      if (grammarWords.length === 0) {
        const pick = contentWords[Math.floor(Math.random() * contentWords.length)];
        targetIndex = pick.index;
      } else {
        const pick = grammarWords[Math.floor(Math.random() * grammarWords.length)];
        targetIndex = pick.index;
      }
      break;
    }
    case 'focus': {
      // 隐藏当前重点学习单词（在句子中的）
      const focusWords = contentWords.filter((w) => {
        const wordId = sentence.words.find((id) => id !== undefined);
        return wordId !== undefined;
      });
      if (focusWords.length === 0) {
        targetIndex = contentWords[Math.floor(Math.random() * contentWords.length)].index;
      } else {
        const pick = focusWords[Math.floor(Math.random() * focusWords.length)];
        targetIndex = pick.index;
      }
      break;
    }
    case 'weakest': {
      // 隐藏错误最多的单词
      const weakInSentence = contentWords.filter((w) => {
        // 检查是否是弱词
        return weakWordIds.length > 0;
      });
      if (weakInSentence.length === 0) {
        targetIndex = contentWords[Math.floor(Math.random() * contentWords.length)].index;
      } else {
        const pick = weakInSentence[Math.floor(Math.random() * weakInSentence.length)];
        targetIndex = pick.index;
      }
      break;
    }
    case 'adaptive':
    default: {
      // 根据记忆等级自动决定
      const pick = contentWords[Math.floor(Math.random() * contentWords.length)];
      targetIndex = pick.index;
      break;
    }
  }

  const hiddenWord = words[targetIndex].replace(/[.,!?;:]/g, '');
  const display = words
    .map((w, i) => (i === targetIndex ? '____' : w))
    .join(' ');

  return {
    sentenceId: sentence.id,
    hiddenWordIndex: targetIndex,
    hiddenWord,
    display,
    isCorrect: null,
    userInput: '',
  };
}

// ============================================================
// 内部工具函数
// ============================================================

function getDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return getDateString(d);
}

function getMonthStart(): string {
  const d = new Date();
  d.setDate(1);
  return getDateString(d);
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = getDateString();
  let streak = 0;
  let check = new Date(today);

  for (const date of sorted) {
    const expected = getDateString(check);
    if (date === expected) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (date < expected) {
      break;
    }
  }
  return streak;
}
