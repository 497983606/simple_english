// ============================================================
// 键盘快捷键 Hook
// ============================================================

import { useEffect, useCallback } from 'react';

interface KeyboardHandlers {
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onQ?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
}

/**
 * 全局键盘快捷键管理
 * 键盘优先设计原则
 */
export function useKeyboard(handlers: KeyboardHandlers, enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // 如果焦点在输入框中，只处理 Enter 和 Escape
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) {
        if (e.key === 'Enter' && handlers.onEnter) {
          e.preventDefault();
          handlers.onEnter();
        }
        if (e.key === 'Escape' && handlers.onEscape) {
          e.preventDefault();
          handlers.onEscape();
        }
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onSpace?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.onArrowDown?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onArrowRight?.();
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          handlers.onQ?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onEscape?.();
          break;
        case 'Enter':
          e.preventDefault();
          handlers.onEnter?.();
          break;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
