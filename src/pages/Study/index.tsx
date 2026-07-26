// ============================================================
// 短句学习 - 全屏沉浸式 + 错题模式
// ============================================================

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { speak, stopSpeaking } from '@/services/speech';
import { recordCorrect, recordWrong } from '@/services/spacedRepetition';
import {
  recordWordView,
  recordWordPractice,
  recordWrong as saveWrong,
  incrementPracticesDone,
  incrementSentencesStudied,
  toggleFavorite,
  isFavorite,
  getWrongRecords,
} from '@/services/study';
import { generatePractice } from '@/services/study';
import confetti from 'canvas-confetti';
import type { Sentence, PracticeState, HideMode } from '@/types';

// ============================================================
// 背景图：单词 → 图片种子 映射表
// 覆盖 850 Basic English 中所有能产生视觉画面的词
// ============================================================
const WORD_TO_IMAGE: Record<string, string> = {
  // 自然
  sun: 'sunshine+sky', moon: 'full+moon+night', star: 'starry+sky', sky: 'blue+sky',
  cloud: 'clouds+sky', rain: 'rain+weather', snow: 'snow+winter', wind: 'wind+trees',
  storm: 'storm+clouds', thunder: 'thunder+lightning', mist: 'mist+fog',
  earth: 'earth+planet', mountain: 'mountain+landscape', river: 'river+nature',
  sea: 'sea+ocean', ocean: 'ocean+waves', water: 'water+reflection',
  wave: 'ocean+waves', island: 'tropical+island', lake: 'lake+reflection',
  ice: 'ice+frozen', fire: 'fire+flame', flame: 'flame+fire', smoke: 'smoke+dark',
  // 植物
  tree: 'tree+nature', flower: 'flower+bloom', leaf: 'green+leaf',
  grass: 'green+grass', garden: 'garden+flowers', wood: 'wood+forest',
  forest: 'forest+trees', seed: 'seed+plant', root: 'tree+roots',
  fruit: 'fresh+fruit', apple: 'apple+fruit', orange: 'orange+fruit',
  berry: 'berries+fruit', potato: 'potato+food', rice: 'rice+food',
  grain: 'grain+wheat', plant: 'green+plant', branch: 'tree+branch',
  // 动物
  bird: 'bird+nature', dog: 'dog+pet', cat: 'cat+pet', horse: 'horse+animal',
  fish: 'fish+underwater', sheep: 'sheep+farm', cow: 'cow+farm',
  goat: 'goat+animal', pig: 'pig+farm', monkey: 'monkey+animal',
  snake: 'snake+reptile', rat: 'rat+animal', ant: 'ant+insect',
  bee: 'bee+flower', fly: 'fly+insect', worm: 'worm+soil',
  fowl: 'bird+poultry', butterfly: 'butterfly+nature',
  // 人
  boy: 'boy+child', girl: 'girl+child', man: 'man+portrait', woman: 'woman+portrait',
  baby: 'baby+cute', child: 'child+playing', family: 'family+happy',
  mother: 'mother+child', father: 'father+family', brother: 'brothers',
  sister: 'sisters', son: 'son+family', daughter: 'daughter+family',
  friend: 'friends+group', person: 'person+portrait',
  // 身体
  eye: 'eye+closeup', face: 'face+portrait', hand: 'hand+gesture',
  head: 'head+profile', hair: 'hair+beauty', mouth: 'mouth+lips',
  heart: 'heart+love', foot: 'feet+walking', arm: 'arm+strength',
  leg: 'legs+running', finger: 'finger+hand', ear: 'ear+closeup',
  nose: 'nose+face', tongue: 'tongue', tooth: 'teeth+smile',
  // 建筑
  house: 'house+home', building: 'building+architecture', room: 'room+interior',
  door: 'door+design', window: 'window+view', wall: 'brick+wall',
  roof: 'roof+house', floor: 'wooden+floor', church: 'church+architecture',
  hospital: 'hospital+building', school: 'school+building', library: 'library+books',
  store: 'store+shop', station: 'train+station', prison: 'prison+bars',
  bridge: 'bridge+architecture', road: 'road+landscape', street: 'street+city',
  town: 'town+cityscape', city: 'city+skyline', farm: 'farm+landscape',
  // 物品
  book: 'book+reading', table: 'table+furniture', chair: 'chair+design',
  bed: 'bed+bedroom', cup: 'cup+coffee', glass: 'glass+drink',
  knife: 'knife+kitchen', fork: 'fork+food', spoon: 'spoon+silver',
  plate: 'plate+food', bottle: 'bottle+glass', box: 'box+package',
  key: 'key+lock', clock: 'clock+time', bell: 'bell+ring',
  lamp: 'lamp+light', camera: 'camera+photography', picture: 'picture+art',
  pen: 'pen+writing', pencil: 'pencil+drawing', paper: 'paper+texture',
  map: 'map+travel', ring: 'ring+jewelry', money: 'money+cash',
  boat: 'boat+water', ship: 'ship+ocean', train: 'train+railway',
  plane: 'airplane+sky', car: 'car+road', wheel: 'wheel+closeup',
  flag: 'flag+wind', umbrella: 'umbrella+rain', hat: 'hat+fashion',
  coat: 'coat+winter', shoe: 'shoes+leather', dress: 'dress+fashion',
  shirt: 'shirt+cloth', skirt: 'skirt+fashion', boot: 'boots+leather',
  glove: 'gloves+hand', sock: 'socks+colorful', stocking: 'stockings',
  trousers: 'trousers+style', collar: 'collar+shirt', pocket: 'pocket+closeup',
  bag: 'bag+leather', basket: 'basket+woven', bucket: 'bucket+water',
  brush: 'brush+paint', comb: 'comb+hair', curtain: 'curtain+window',
  cushion: 'cushion+soft', nail: 'nail+metal', needle: 'needle+thread',
  net: 'fishing+net', pin: 'pin+sewing', pipe: 'pipe+metal',
  pump: 'water+pump', rail: 'railway+tracks', rod: 'fishing+rod',
  screw: 'screw+metal', spade: 'spade+garden', sponge: 'sponge+texture',
  stamp: 'stamp+postage', stick: 'stick+wood', thread: 'thread+spool',
  ticket: 'ticket+travel', tray: 'tray+serving', watch: 'watch+time',
  whip: 'whip+leather', whistle: 'whistle+sound', wire: 'wire+metal',
  // 食物
  bread: 'bread+bakery', cake: 'cake+dessert', food: 'food+delicious',
  meat: 'meat+grill', milk: 'milk+glass', butter: 'butter+spread',
  cheese: 'cheese+board', egg: 'egg+breakfast', soup: 'soup+bowl',
  sugar: 'sugar+sweet', salt: 'salt+crystal', drink: 'drink+beverage',
  coffee: 'coffee+cup', wine: 'wine+glass', jelly: 'jelly+dessert',
  // 音乐/艺术
  music: 'music+notes', song: 'song+singer', art: 'art+gallery',
  paint: 'paint+colorful', verse: 'poetry+book',
  // 抽象但有视觉关联
  love: 'love+heart', peace: 'peace+nature', hope: 'hope+light',
  joy: 'joy+smile', fear: 'fear+dark', sleep: 'sleep+bed',
  dream: 'dream+sky', anger: 'anger+red', smile: 'smile+happy',
  laugh: 'laugh+joy', kiss: 'kiss+couple', knowledge: 'knowledge+books',
  learning: 'learning+study', work: 'work+desk', play: 'play+children',
  rest: 'rest+relax', journey: 'journey+travel', discovery: 'discovery+explore',
};

function pickImageSeed(s?: Sentence): string {
  if (!s) return 'nature+landscape';
  const text = s.basic.toLowerCase().replace(/[.,!?;:'"()\-—]/g, '');
  const words = text.split(/\s+/);

  // 1. 精确匹配映射表（优先长词）
  const sorted = [...words].sort((a, b) => b.length - a.length);
  for (const w of sorted) {
    if (WORD_TO_IMAGE[w]) return WORD_TO_IMAGE[w];
    // 去掉复数/动词变位后再试
    const bare = w.replace(/(s|es|ed|ing|er|est)$/, '');
    if (bare !== w && WORD_TO_IMAGE[bare]) return WORD_TO_IMAGE[bare];
    if (w.endsWith('ies') && WORD_TO_IMAGE[w.slice(0, -3) + 'y']) return WORD_TO_IMAGE[w.slice(0, -3) + 'y'];
  }

  // 2. 回退：用句子中文提取主题词
  const chinese = s.chinese;
  for (const [en, seed] of Object.entries(WORD_TO_IMAGE)) {
    // 查单词表里是否有对应中文
    const idx = words.indexOf(en);
    if (idx >= 0) return seed;
  }

  // 3. 最终回退：基于 sentence id 选稳定图片
  const fallbacks = ['nature+landscape', 'ocean+sunset', 'forest+path', 'mountain+view',
    'city+night', 'garden+flower', 'sky+clouds', 'river+reflection'];
  return fallbacks[s.id % fallbacks.length];
}

// ============================================================
// Fisher-Yates 洗牌
// ============================================================
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function smartShuffle(list: Sentence[]): Sentence[] {
  const groups = new Map<string, Sentence[]>();
  for (const s of list) {
    const first = s.basic.split(' ')[0].toLowerCase();
    if (!groups.has(first)) groups.set(first, []);
    groups.get(first)!.push(s);
  }
  const buckets = [...groups.values()].map(shuffle);
  const result: Sentence[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const b of buckets) {
      if (b.length > 0) { result.push(b.pop()!); added = true; }
    }
  }
  return result;
}

// ============================================================
// 组件
// ============================================================
export const StudyPage: React.FC = () => {
  const raw = useLiveQuery(() => db.sentences.toArray(), []) ?? [];
  const wrongRecords = useLiveQuery(() => getWrongRecords(500), []) ?? [];

  // 错词 ID 集合
  const wrongWordIds = useMemo(() => {
    const set = new Set<number>();
    for (const r of wrongRecords) set.add(r.wordId);
    return set;
  }, [wrongRecords]);

  // 洗牌
  const [allSentences, setAllSentences] = useState<Sentence[]>([]);
  const initDone = useRef(false);
  useEffect(() => {
    if (!initDone.current && raw.length > 0) {
      setAllSentences(smartShuffle(raw));
      initDone.current = true;
    }
  }, [raw]);

  // 错题模式：只保留含错词的句子
  const [wrongMode, setWrongMode] = useState(false);
  const sentences = useMemo(() => {
    if (!wrongMode || wrongWordIds.size === 0) return allSentences;
    const filtered = allSentences.filter(s => s.words.some(wid => wrongWordIds.has(wid)));
    return filtered.length > 0 ? filtered : allSentences;
  }, [allSentences, wrongMode, wrongWordIds]);

  const [index, setIndex] = useState(0);
  const sentencesRef = useRef(sentences);
  sentencesRef.current = sentences;
  const indexRef = useRef(index);
  indexRef.current = index;

  const [isPlaying, setIsPlaying] = useState(false);
  const [practice, setPractice] = useState<PracticeState | null>(null);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [fav, setFav] = useState(false);
  const [hideMode] = useState<HideMode>('random');
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIdxRef = useRef(-1);

  const sentence = sentences[index];
  const bgSeed = useMemo(() => pickImageSeed(sentence), [sentence]);

  // 记录浏览 & 自动播放
  useEffect(() => {
    if (!sentence) return;
    sentence.words.forEach(wid => recordWordView(wid));
    incrementSentencesStudied();
    isFavorite('sentence', sentence.id).then(setFav);
    if (prevIdxRef.current !== -1 && !practice) {
      speak(sentence.basic);
    }
    prevIdxRef.current = index;
  }, [sentence, index]); // eslint-disable-line react-hooks/exhaustive-deps

  // 聚焦输入
  useEffect(() => {
    if (practice) setTimeout(() => inputRef.current?.focus(), 100);
  }, [practice]);

  // 模式切换时重置 index
  useEffect(() => {
    setIndex(0);
  }, [wrongMode]);

  const handlePlay = useCallback(async () => {
    if (!sentence || isPlaying) return;
    setIsPlaying(true);
    await speak(sentence.basic);
    setIsPlaying(false);
  }, [sentence, isPlaying]);

  const prev = useCallback(() => {
    stopSpeaking();
    setIndex(i => (i - 1 + sentences.length) % sentences.length);
  }, [sentences.length]);
  const next = useCallback(() => {
    stopSpeaking();
    setIndex(i => (i + 1) % sentences.length);
  }, [sentences.length]);

  const handleFav = useCallback(async () => {
    if (!sentence) return;
    setFav(await toggleFavorite('sentence', sentence.id));
  }, [sentence]);

  const togglePractice = useCallback(() => {
    if (practice) {
      setPractice(null); setUserInput(''); setResult(null); stopSpeaking();
    } else if (sentence) {
      setPractice(generatePractice(sentence, hideMode, []));
      setUserInput(''); setResult(null);
    }
  }, [practice, sentence, hideMode]);

  const submitPractice = useCallback(async () => {
    if (!practice || !sentence || !userInput.trim()) return;
    const answer = userInput.trim().toLowerCase();
    const correctAnswer = practice.hiddenWord.toLowerCase();
    const ok = answer === correctAnswer;
    const wordId = sentence.words[practice.hiddenWordIndex] ?? sentence.words[0];

    setResult(ok ? 'correct' : 'wrong');
    await incrementPracticesDone(ok);
    await recordWordPractice(wordId, ok);

    if (ok) {
      await recordCorrect(wordId);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#4ade80','#60a5fa','#facc15','#f87171'] });
      await speak(sentence.basic);
      setTimeout(() => {
        const all = sentencesRef.current;
        if (!all.length) return;
        const ni = (indexRef.current + 1) % all.length;
        setIndex(ni);
        const ns = all[ni];
        if (ns) {
          setPractice(generatePractice(ns, hideMode, []));
          setUserInput(''); setResult(null);
        }
      }, 1000);
    } else {
      await recordWrong(wordId);
      await saveWrong(sentence.id, wordId, answer, correctAnswer);
      setTimeout(() => {
        setPractice(generatePractice(sentence, hideMode, []));
        setUserInput(''); setResult(null);
      }, 2000);
    }
  }, [practice, sentence, userInput, hideMode]);

  // 键盘
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;

      // 输入框中：只拦截 Q/E（模式切换）和 Enter，其余交给浏览器
      if (isInput) {
        const key = e.key.toLowerCase();
        if (key === 'q' || key === 'e') {
          // 只有当输入框为空时才切换模式，避免误触发
          const inputVal = (el as HTMLInputElement).value || '';
          if (inputVal.trim() === '') {
            e.preventDefault();
            if (key === 'q') togglePractice();
            else toggleWrongMode();
          }
        }
        return; // 其他按键全部放行，不拦截
      }

      // 非输入框：处理快捷键
      const k = e.key.toLowerCase();
      if (k === ' ' && !practice) { e.preventDefault(); handlePlay(); return; }
      if ((k === 'arrowup' || k === 'arrowleft') && !practice) { e.preventDefault(); prev(); return; }
      if ((k === 'arrowdown' || k === 'arrowright') && !practice) { e.preventDefault(); next(); return; }
      if (k === 'q') { e.preventDefault(); togglePractice(); return; }
      if (k === 'e' && !practice) { e.preventDefault(); toggleWrongMode(); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [practice, handlePlay, prev, next, togglePractice]);

  // 错题模式切换
  const toggleWrongMode = useCallback(() => {
    setWrongMode(w => !w);
    // 退出练习模式
    setPractice(null);
    setUserInput('');
    setResult(null);
  }, []);

  if (!sentence) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white/30 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* 全屏背景图 */}
      <div className="fixed inset-0 z-0">
        <img
          src={`https://picsum.photos/seed/${bgSeed}/1920/1080`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          loading="eager"
          onError={(e) => {
            // 图片加载失败时隐藏
            (e.target as HTMLImageElement).style.opacity = '0';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/65 to-black" />
      </div>

      {/* 顶部状态栏 */}
      <div className="fixed top-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white/20 text-xs font-mono">
            {index + 1}/{sentences.length}
          </span>
          {wrongMode && (
            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-medium">
              错题模式 · {sentences.length} 句
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWrongMode}
            className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
              wrongMode
                ? 'bg-red-500/30 text-red-300 border border-red-500/30'
                : 'text-white/20 hover:text-white/50 border border-white/10'
            }`}
          >
            错题 (E)
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="fixed top-0 left-0 right-0 h-px bg-white/5 z-30">
        <div
          className="h-full bg-white/30 transition-all duration-500"
          style={{ width: `${((index + 1) / Math.max(sentences.length, 1)) * 100}%` }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 pt-16 pb-24">
        {!practice ? (
          <div className="w-full max-w-3xl text-center space-y-8 animate-fade-in">
            <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-wide text-white/90">
              {sentence.basic}
            </p>
            <p className="text-lg md:text-xl text-white/30">{sentence.chinese}</p>
            {sentence.natural !== sentence.basic && (
              <p className="text-sm md:text-base text-white/15 italic">{sentence.natural}</p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-3xl text-center space-y-8 animate-slide-up">
            <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-wide">
              {result === 'wrong' ? renderCorrected(practice, sentence) : renderPractice(practice)}
            </p>
            <p className="text-lg text-white/30">{sentence.chinese}</p>
            {result !== 'wrong' && (
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); submitPractice(); }
                }}
                placeholder="______"
                className="w-48 md:w-64 px-6 py-4 text-xl md:text-2xl text-center
                           bg-white/5 border-2 border-white/10 rounded-2xl
                           focus:border-white/30 focus:outline-none
                           text-white placeholder-white/15 transition-all"
                autoComplete="off" autoCapitalize="off" spellCheck={false}
              />
            )}
            {result === 'correct' && <div className="text-green-400 text-xl font-medium animate-bounce">✓ Correct!</div>}
            {result === 'wrong' && (
              <p className="text-white/50">
                Answer: <span className="text-green-400 font-bold text-xl">{practice.hiddenWord}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* 底部栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-white/15 text-xs font-mono hidden sm:block">
            {practice ? '练习中' : wrongMode ? '错题复习' : '短句学习'}
          </span>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <NavBtn onClick={prev} label="←" title="上一句 (↑)" />
            <NavBtn onClick={handlePlay} label={isPlaying ? '⏸' : '▶'} title="播放 (Space)" highlight />
            <NavBtn onClick={togglePractice} label={practice ? '✕' : '✎'} title={practice ? '退出练习 (Q)' : '练习 (Q)'} active={!!practice} />
            <NavBtn onClick={next} label="→" title="下一句 (↓)" />
          </div>
          <button onClick={handleFav} className="text-xl transition-transform hover:scale-110 active:scale-90"
            title={fav ? '取消收藏' : '收藏'}>
            {fav ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="fixed bottom-20 left-6 z-20 hidden lg:block">
        <span className="text-white/10 text-xs font-mono">
          Space·播放 ↑↓·切换 Q·练习 E·错题模式
        </span>
      </div>
    </div>
  );
};

// ============================================================
const NavBtn: React.FC<{ onClick: () => void; label: string; title: string; highlight?: boolean; active?: boolean }> =
  ({ onClick, label, title, highlight, active }) => (
    <button onClick={onClick} title={title}
      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl
        transition-all duration-200 active:scale-90
        ${highlight ? 'bg-white/15 text-white hover:bg-white/25'
          : active ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
          : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
      {label}
    </button>
  );

function renderPractice(p: PracticeState) {
  return (
    <span className="text-white/90">
      {p.display.split(' ').map((part, i) =>
        part === '____'
          ? <span key={i} className="inline-block mx-1 px-3 py-1 bg-white/10 rounded-lg text-amber-400 border-b-2 border-amber-400/50">{' '.repeat(4)}</span>
          : <span key={i}> {part} </span>
      )}
    </span>
  );
}

function renderCorrected(p: PracticeState, s: Sentence) {
  return (
    <span className="text-white/90">
      {s.basic.split(' ').map((w, i) =>
        i === p.hiddenWordIndex
          ? <span key={i} className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded">{p.hiddenWord}</span>
          : <span key={i}> {w} </span>
      )}
    </span>
  );
}
