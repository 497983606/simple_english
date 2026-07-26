// ============================================================
// 设置 Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/db';
import type { UserSettings, HideMode } from '@/types';

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

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaults);
  const [loaded, setLoaded] = useState(false);

  // 加载设置
  useEffect(() => {
    db.getSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
      // 应用深色模式
      if (s.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // 应用字号
      applyFontSize(s.fontSize);
    });
  }, []);

  /** 更新设置 */
  const update = useCallback(async (partial: Partial<UserSettings>) => {
    await db.updateSettings(partial);
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      // 应用设置变更
      if ('darkMode' in partial) {
        if (partial.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      if ('fontSize' in partial && partial.fontSize) {
        applyFontSize(partial.fontSize);
      }
      return next;
    });
  }, []);

  return { settings, loaded, update };
}

function applyFontSize(size: 'normal' | 'large' | 'xlarge'): void {
  const root = document.documentElement;
  root.classList.remove('text-normal', 'text-large', 'text-xlarge');
  switch (size) {
    case 'normal':
      root.style.fontSize = '16px';
      break;
    case 'large':
      root.style.fontSize = '20px';
      break;
    case 'xlarge':
      root.style.fontSize = '24px';
      break;
  }
}
