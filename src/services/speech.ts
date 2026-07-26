// ============================================================
// 发音服务 - 支持 Web Speech API 和 JS TTS 回退
// ============================================================

import { db } from '@/db';

/** 检查浏览器是否支持 Web Speech API */
export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

/** 获取可用语音列表 */
export function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices();
}

/** 播放文本发音 */
export async function speak(
  text: string,
  options?: { rate?: number; pitch?: number; voice?: string }
): Promise<void> {
  const settings = await db.getSettings();
  const rate = options?.rate ?? settings.ttsRate;
  const pitch = options?.pitch ?? settings.ttsPitch;

  if (isSpeechSupported() && !settings.jsTtsFallback) {
    return speakWithWebSpeech(text, { rate, pitch, voice: options?.voice ?? settings.ttsVoice });
  } else {
    return speakWithJsTts(text);
  }
}

/** 使用 Web Speech API 播放 */
function speakWithWebSpeech(
  text: string,
  options: { rate: number; pitch: number; voice: string }
): Promise<void> {
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate;
    utterance.pitch = options.pitch;
    utterance.lang = 'en-US';

    // 尝试选择英文语音
    if (options.voice) {
      const voices = getVoices();
      const selected = voices.find((v) => v.name === options.voice);
      if (selected) utterance.voice = selected;
    } else {
      const voices = getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && v.name.includes('Google')
      ) || voices.find((v) => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/** JS TTS 回退 - 使用简单的提示 */
function speakWithJsTts(_text: string): Promise<void> {
  return new Promise((resolve) => {
    // JS TTS 回退方案
    // 实际项目可集成 meSpeak.js 或 Speak.js
    // 此处作为占位，提示用户浏览器不支持
    console.warn('Web Speech API not supported. Consider using a modern browser.');
    resolve();
  });
}

/** 停止播放 */
export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
