// ============================================================
// 数据初始化 - 将 JSON 数据导入 IndexedDB
// ============================================================

import { db } from '@/db';
import type { Word, Sentence } from '@/types';

/**
 * 初始化数据：检查数据库是否已有数据，若没有则导入
 * 该函数在应用启动时调用
 */
export async function initializeData(): Promise<boolean> {
  try {
    // 检查单词是否已导入
    const wordCount = await db.words.count();
    if (wordCount >= 850) {
      console.log(`[InitData] Words already loaded: ${wordCount}`);
      return true;
    }

    console.log('[InitData] Importing word data...');
    const wordsModule = await import('@/assets/words.json');
    const words: Word[] = (wordsModule as any).default || wordsModule;
    await db.words.bulkPut(words);
    console.log(`[InitData] Imported ${words.length} words`);

    // 导入句子
    console.log('[InitData] Importing sentence data...');
    const sentencesModule = await import('@/assets/sentences.json');
    const sentences: Sentence[] = (sentencesModule as any).default || sentencesModule;
    await db.sentences.bulkPut(sentences);
    console.log(`[InitData] Imported ${sentences.length} sentences`);

    return true;
  } catch (error) {
    console.error('[InitData] Data initialization failed:', error);
    return false;
  }
}
