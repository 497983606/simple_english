// ============================================================
// 学习记录 - 弹窗模式
// ============================================================

import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getStudyOverview, getDailyStats, getTopWrongWords } from '@/services/study';
import { getAllMemories } from '@/services/spacedRepetition';
import { db } from '@/db';
import ReactECharts from 'echarts-for-react';

interface Props {
  onClose: () => void;
}

export const HistoryModal: React.FC<Props> = ({ onClose }) => {
  const overview = useLiveQuery(() => getStudyOverview(), []);
  const dailyStats = useLiveQuery(() => getDailyStats(30), []) ?? [];
  const topWrongRaw = useLiveQuery(() => getTopWrongWords(20), []) ?? [];
  const memories = useLiveQuery(() => getAllMemories(), []) ?? [];
  const words = useLiveQuery(() => db.words.toArray(), []) ?? [];

  const topWrongWords = topWrongRaw.map((w) => ({
    ...w,
    word: words.find((word) => word.id === w.wordId)?.word || `#${w.wordId}`,
  }));

  const formatTime = (s: number): string => {
    if (s < 60) return `${s}s`;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // 每日图表
  const dailyOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 20, right: 20, top: 10, bottom: 20 },
    xAxis: {
      type: 'category' as const,
      data: dailyStats.map((d) => d.date.slice(5)),
      axisLabel: { color: '#666', fontSize: 10 },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#666', fontSize: 10 },
      splitLine: { lineStyle: { color: '#222' } },
    },
    series: [
      {
        type: 'bar',
        data: dailyStats.map((d) => Math.round(d.studyTime / 60 * 10) / 10),
        itemStyle: { color: '#60a5fa', borderRadius: [4, 4, 0, 0] },
        name: '学习(分)',
      },
      {
        type: 'line',
        data: dailyStats.map((d) => d.practicesCount),
        lineStyle: { color: '#4ade80' },
        itemStyle: { color: '#4ade80' },
        name: '练习',
      },
    ],
  };

  // 错误词
  const wrongOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 80, right: 20, top: 10, bottom: 20 },
    xAxis: {
      type: 'value' as const,
      axisLabel: { color: '#666', fontSize: 10 },
      splitLine: { lineStyle: { color: '#222' } },
    },
    yAxis: {
      type: 'category' as const,
      data: topWrongWords.map((w) => w.word).reverse(),
      axisLabel: { color: '#aaa', fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: topWrongWords.map((w) => w.count).reverse(),
      itemStyle: { color: '#f87171', borderRadius: [0, 4, 4, 0] },
    }],
  };

  // 记忆等级
  const levelCounts = Array.from({ length: 11 }, (_, i) =>
    memories.filter((m) => m.memoryLevel === i).length
  );
  const maxCount = Math.max(...levelCounts, 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#111] border-b border-white/5 px-6 py-5 flex items-center justify-between z-10 rounded-t-3xl">
          <h2 className="text-xl font-semibold text-white/90">📊 学习记录</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 text-2xl leading-none transition-colors">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 概览 */}
          {overview && (
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="学习总时长" value={formatTime(overview.totalStudyTime)} />
              <StatBox label="今日" value={formatTime(overview.todayStudy)} />
              <StatBox label="连续学习" value={`${overview.streak}d`} />
              <StatBox label="练习正确率" value={`${overview.accuracy}%`} highlight />
              <StatBox label="已掌握" value={`${overview.masteredWords}/850`} />
              <StatBox label="总练习" value={`${overview.totalPractices}`} />
            </div>
          )}

          {/* 每日学习曲线 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4">
            <h3 className="text-sm font-medium text-white/50 mb-3">每日学习曲线</h3>
            <ReactECharts option={dailyOption} style={{ height: 200 }} />
          </div>

          {/* 记忆等级分布 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4">
            <h3 className="text-sm font-medium text-white/50 mb-3">单词掌握分布</h3>
            <div className="space-y-1.5">
              {levelCounts.map((count, level) => (
                <div key={level} className="flex items-center gap-2">
                  <span className="w-8 text-right text-xs text-white/30">Lv{level}</span>
                  <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: level >= 8 ? '#4ade80' : level >= 6 ? '#60a5fa' : level >= 4 ? '#facc15' : level >= 2 ? '#f97316' : '#f87171',
                      }}
                    />
                  </div>
                  <span className="w-8 text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 高频错误词 */}
          {topWrongWords.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-4">
              <h3 className="text-sm font-medium text-white/50 mb-3">高频错误词 TOP 20</h3>
              <ReactECharts option={wrongOption} style={{ height: 300 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label, value, highlight,
}) => (
  <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
    <div className={`text-lg font-bold ${highlight ? 'text-green-400' : 'text-white/80'}`}>
      {value}
    </div>
    <div className="text-xs text-white/30 mt-1">{label}</div>
  </div>
);
