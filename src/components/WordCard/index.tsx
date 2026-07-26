// ============================================================
// 单词卡片组件
// ============================================================

import React from 'react';
import type { Word, WordStats, Memory } from '@/types';

interface Props {
  word: Word;
  stats?: WordStats;
  memory?: Memory;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSpeak?: () => void;
}

export const WordCard: React.FC<Props> = ({
  word,
  stats,
  memory,
  isFavorite = false,
  onToggleFavorite,
  onSpeak,
}) => {
  const memoryColor = getMemoryColor(memory?.memoryLevel ?? 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 单词和音标 */}
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {word.word}
            </h3>
            {word.phonetic && (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                /{word.phonetic}/
              </span>
            )}
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
              {word.partOfSpeech}
            </span>
          </div>

          {/* 中文含义 */}
          <p className="text-gray-600 dark:text-gray-300">
            {word.chinese}
          </p>

          {/* 统计信息 */}
          {stats && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>浏览 {stats.viewCount} 次</span>
              <span>练习 {stats.practiceCount} 次</span>
              <span className="text-green-500">正确 {stats.correctCount}</span>
              <span className="text-red-500">错误 {stats.wrongCount}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center gap-2 ml-4">
          {/* 记忆等级指示器 */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: memoryColor }}
            title={`记忆等级: ${memory?.memoryLevel ?? 0}/10`}
          >
            {memory?.memoryLevel ?? 0}
          </div>

          {onSpeak && (
            <button
              onClick={onSpeak}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="播放发音"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M12 6v12" />
              </svg>
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isFavorite ? '取消收藏' : '收藏'}
            >
              <span className="text-sm">{isFavorite ? '⭐' : '☆'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/** 根据记忆等级返回颜色 */
function getMemoryColor(level: number): string {
  if (level >= 8) return '#10B981'; // 绿色 - 已掌握
  if (level >= 6) return '#3B82F6'; // 蓝色 - 良好
  if (level >= 4) return '#F59E0B'; // 黄色 - 一般
  if (level >= 2) return '#F97316'; // 橙色 - 较弱
  return '#EF4444'; // 红色 - 未掌握
}
