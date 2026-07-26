// ============================================================
// App - 全屏沉浸式学习，弹窗式辅助功能
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { initializeData } from '@/utils/initData';
import { StudyPage } from '@/pages/Study';
import { HistoryModal } from '@/pages/History';
import { KeyboardHelp } from '@/components/KeyboardHelp';

const App: React.FC = () => {
  const { settings, loaded } = useSettings();
  const [dataReady, setDataReady] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    initializeData().then(() => setDataReady(true));
  }, []);

  // 全局键盘快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 输入框中不处理
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.isContentEditable) return;

    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      setShowHistory(prev => !prev);
    }
    if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      setShowKeyboard(prev => !prev);
    }
    if (e.key === 'Escape') {
      setShowHistory(false);
      setShowKeyboard(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!loaded || !dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center animate-pulse">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 主学习区域 - 全屏 */}
      <StudyPage />

      {/* 右下角控制按钮组 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* 历史记录 */}
        <button
          onClick={() => setShowHistory(true)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     flex items-center justify-center text-xl transition-all duration-200
                     hover:scale-110 border border-white/10"
          title="学习记录 (H)"
        >
          📊
        </button>

        {/* 键盘快捷键 */}
        <button
          onClick={() => setShowKeyboard(true)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     flex items-center justify-center text-xl transition-all duration-200
                     hover:scale-110 border border-white/10"
          title="快捷键 (K)"
        >
          ⌨
        </button>
      </div>

      {/* 弹窗：学习记录 */}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}

      {/* 弹窗：键盘快捷键 */}
      {showKeyboard && <KeyboardHelp onClose={() => setShowKeyboard(false)} />}
    </div>
  );
};

export default App;
