// ============================================================
// 键盘快捷键帮助 - 弹窗
// ============================================================

import React from 'react';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', label: '播放发音' },
  { key: '↑ / ↓', label: '上一句 / 下一句' },
  { key: '← / →', label: '上一句 / 下一句' },
  { key: 'Q', label: '进入/退出练习模式' },
  { key: 'Enter', label: '提交答案' },
  { key: 'H', label: '学习记录' },
  { key: 'K', label: '快捷键帮助' },
  { key: 'Esc', label: '关闭弹窗' },
];

export const KeyboardHelp: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">⌨ 快捷键</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6">
          <div className="space-y-1">
            {SHORTCUTS.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <span className="text-white/60 text-sm">{s.label}</span>
                <kbd className="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-sm font-mono font-medium border border-white/10">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-6 py-4 text-center">
          <p className="text-xs text-white/20">键盘优先 · 沉浸式学习</p>
        </div>
      </div>
    </div>
  );
};
