// ============================================================
// 练习输入组件 - 填空练习
// ============================================================

import React, { useEffect } from 'react';
import type { PracticeState, Sentence } from '@/types';

interface Props {
  practice: PracticeState;
  sentence: Sentence;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isCorrect: boolean | null;
  showResult: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const PracticeInput: React.FC<Props> = ({
  practice,
  sentence,
  userInput,
  onInputChange,
  onSubmit,
  isCorrect,
  showResult,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [practice.sentenceId, inputRef]);

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-6">
        {/* 题目 */}
        <div className="text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">
            {showResult && isCorrect === false
              ? renderCorrectedSentence(practice, sentence)
              : practice.display}
          </p>
        </div>

        {/* 中文提示 */}
        <div className="text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {sentence.chinese}
          </p>
        </div>

        {/* 输入框 */}
        {!showResult || isCorrect === true ? (
          <div className="flex justify-center">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="输入缺失的单词..."
              className="w-64 px-6 py-3 text-xl text-center bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none font-medium transition-colors duration-200"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-red-500 font-medium">
              正确答案：
              <span className="text-xl font-bold text-green-600 dark:text-green-400 ml-2">
                {practice.hiddenWord}
              </span>
            </p>
          </div>
        )}

        {/* 结果反馈 */}
        {showResult && (
          <div className="text-center animate-fade-in">
            {isCorrect ? (
              <div className="text-green-500 font-bold text-xl animate-bounce">
                ✅ 正确！
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-500 font-medium">
                  ❌ 再试一次
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/** 渲染纠正后的句子，高亮正确答案 */
function renderCorrectedSentence(practice: PracticeState, sentence: Sentence): React.ReactNode {
  const words = sentence.basic.split(' ');
  return (
    <span>
      {words.map((w, i) => {
        if (i === practice.hiddenWordIndex) {
          return (
            <span
              key={i}
              className="text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-1 rounded"
            >
              {practice.hiddenWord}
            </span>
          );
        }
        return <span key={i}> {w} </span>;
      })}
    </span>
  );
}
