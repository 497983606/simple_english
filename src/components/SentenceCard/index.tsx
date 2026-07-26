// ============================================================
// 句子卡片组件 - 展示学习句子
// ============================================================

import React from 'react';
import type { Sentence } from '@/types';

interface Props {
  sentence: Sentence;
  onPlay: () => void;
  isPlaying: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const SentenceCard: React.FC<Props> = ({
  sentence,
  onPlay,
  isPlaying,
  isFavorite = false,
  onToggleFavorite,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-6">
        {/* Basic English 句子 */}
        <div className="text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">
            {sentence.basic}
          </p>
        </div>

        {/* 中文翻译 */}
        <div className="text-center">
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
            {sentence.chinese}
          </p>
        </div>

        {/* Natural English */}
        <div className="text-center border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
            Natural English
          </p>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 italic">
            {sentence.natural}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onPlay}
            disabled={isPlaying}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              isPlaying
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-md'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-8.464a5 5 0 000 7.072" />
            </svg>
            {isPlaying ? '播放中...' : '播放'}
          </button>
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isFavorite ? '取消收藏' : '收藏'}
            >
              <span className="text-xl">{isFavorite ? '⭐' : '☆'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
