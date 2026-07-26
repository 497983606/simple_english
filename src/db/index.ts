// ============================================================
// IndexedDB 数据层 - 使用 Dexie.js
// ============================================================

import Dexie, { type Table } from 'dexie';
import type {
  Word,
  Sentence,
  Memory,
  StudyRecord,
  WordStats,
  WrongRecord,
  Favorite,
  UserSettings,
} from '@/types';

/** 扩展 Dexie 类型 */
export class SimpleEnglishDB extends Dexie {
  words!: Table<Word, number>;
  sentences!: Table<Sentence, number>;
  memories!: Table<Memory, number>; // key: wordId
  studyRecords!: Table<StudyRecord, number>;
  wordStats!: Table<WordStats, number>; // key: wordId
  wrongRecords!: Table<WrongRecord, number>;
  favorites!: Table<Favorite, number>;
  settings!: Table<UserSettings, number>; // key: 1 (单例)

  constructor() {
    super('SimpleEnglishDB');

    this.version(1).stores({
      words: 'id, word, partOfSpeech',
      sentences: 'id, basic, *words',
      memories: 'wordId, memoryLevel, nextReview',
      studyRecords: '++id, date',
      wordStats: 'wordId',
      wrongRecords: '++id, wordId, sentenceId, timestamp',
      favorites: '++id, type, itemId',
      settings: '',
    });
  }

  /** 获取或初始化设置 */
  async getSettings(): Promise<UserSettings> {
    const s = await this.settings.get(1);
    if (s) return s;
    const defaults: UserSettings = {
      ttsRate: 0.9,
      ttsPitch: 1.0,
      ttsVoice: '',
      hideMode: 'random',
      darkMode: false,
      fontSize: 'normal',
      autoPlay: true,
      jsTtsFallback: false,
    };
    await this.settings.put(defaults, 1);
    return defaults;
  }

  /** 更新设置 */
  async updateSettings(partial: Partial<UserSettings>): Promise<void> {
    await this.settings.update(1, partial);
  }
}

/** 单例数据库实例 */
export const db = new SimpleEnglishDB();
