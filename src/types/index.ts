// ============================================================
// 类型定义 - Basic English 850 学习系统
// ============================================================

/** 单词 */
export interface Word {
  id: number;
  word: string;
  chinese: string;
  phonetic: string;
  partOfSpeech: string;
  basicMeaning: string;
}

/** 句子 */
export interface Sentence {
  id: number;
  basic: string;
  natural: string;
  chinese: string;
  words: number[]; // 包含的单词 ID 列表
}

/** 记忆状态（间隔重复） */
export interface Memory {
  wordId: number;
  memoryLevel: number; // 0-10
  correct: number;
  wrong: number;
  lastStudy: number; // timestamp
  nextReview: number; // timestamp
}

/** 学习记录 */
export interface StudyRecord {
  id?: number;
  date: string; // YYYY-MM-DD
  totalStudyTime: number; // seconds
  sentencesStudied: number;
  practicesDone: number;
  correctCount: number;
  wrongCount: number;
}

/** 单词学习统计 */
export interface WordStats {
  wordId: number;
  viewed: boolean;
  practiced: boolean;
  viewCount: number;
  practiceCount: number;
  correctCount: number;
  wrongCount: number;
  memoryLevel: number;
  firstStudy: number | null;
  lastStudy: number | null;
}

/** 错题记录 */
export interface WrongRecord {
  id?: number;
  sentenceId: number;
  wordId: number;
  userInput: string;
  correctAnswer: string;
  timestamp: number;
}

/** 收藏 */
export interface Favorite {
  id?: number;
  type: 'word' | 'sentence';
  itemId: number;
  timestamp: number;
}

/** 用户设置 */
export interface UserSettings {
  ttsRate: number; // 0.5 - 2.0
  ttsPitch: number; // 0.5 - 2.0
  ttsVoice: string; // 为空则使用默认
  hideMode: HideMode;
  darkMode: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  autoPlay: boolean;
  jsTtsFallback: boolean;
}

/** 练习隐藏模式 */
export type HideMode = 'random' | 'grammar' | 'focus' | 'weakest' | 'adaptive';

/** 练习状态 */
export interface PracticeState {
  sentenceId: number;
  hiddenWordIndex: number;
  hiddenWord: string;
  display: string; // 带空格的显示文本
  isCorrect: boolean | null;
  userInput: string;
}

/** 学习统计概览 */
export interface StudyOverview {
  totalStudyTime: number;
  todayStudy: number;
  weekStudy: number;
  monthStudy: number;
  streak: number;
  totalSentences: number;
  totalPractices: number;
  accuracy: number;
  masteredWords: number;
  unmasteredWords: number;
}

/** 每日统计 */
export interface DailyStats {
  date: string;
  studyTime: number;
  sentencesCount: number;
  practicesCount: number;
  correctCount: number;
  wrongCount: number;
}

/** 导航菜单项 */
export interface NavItem {
  icon: string;
  label: string;
  path: string;
}
