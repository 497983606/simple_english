// ============================================================
// 学习图表组件 - 使用 ECharts
// ============================================================

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { DailyStats } from '@/types';

interface Props {
  dailyStats: DailyStats[];
  topWrongWords: { wordId: number; word?: string; count: number }[];
  accuracy: number;
}

export const ProgressChart: React.FC<Props> = ({ dailyStats, topWrongWords, accuracy }) => {
  /** 每日学习曲线 */
  const dailyOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['学习时长(分)', '练习数'], textStyle: { color: '#888' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: dailyStats.map((d) => d.date.slice(5)), // MM-DD
      axisLabel: { color: '#888' },
    },
    yAxis: [
      {
        type: 'value' as const,
        name: '分钟',
        axisLabel: { color: '#888' },
      },
      {
        type: 'value' as const,
        name: '次数',
        axisLabel: { color: '#888' },
      },
    ],
    series: [
      {
        name: '学习时长(分)',
        type: 'bar',
        data: dailyStats.map((d) => Math.round(d.studyTime / 60 * 10) / 10),
        itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '练习数',
        type: 'line',
        yAxisIndex: 1,
        data: dailyStats.map((d) => d.practicesCount),
        lineStyle: { color: '#10B981' },
        itemStyle: { color: '#10B981' },
      },
    ],
  }), [dailyStats]);

  /** 高频错误词 */
  const wrongWordsOption = useMemo(() => {
    const data = topWrongWords.slice(0, 20);
    return {
      tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value' as const,
        axisLabel: { color: '#888' },
      },
      yAxis: {
        type: 'category' as const,
        data: data.map((w) => w.word || `#${w.wordId}`).reverse(),
        axisLabel: { color: '#888' },
      },
      series: [
        {
          type: 'bar',
          data: data.map((w) => w.count).reverse(),
          itemStyle: {
            color: '#EF4444',
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    };
  }, [topWrongWords]);

  /** 正确率仪表盘 */
  const gaugeOption = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#EF4444'],
              [0.6, '#F59E0B'],
              [0.8, '#10B981'],
              [1, '#3B82F6'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '60%',
          width: 12,
          offsetCenter: [0, '-10%'],
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: { distance: -20, length: 6, lineStyle: { width: 1, color: '#999' } },
        splitLine: { distance: -26, length: 16, lineStyle: { width: 3, color: '#999' } },
        axisLabel: { color: '#999', distance: 30, fontSize: 12 },
        anchor: { show: true, showAbove: true, size: 18 },
        title: { show: true, offsetCenter: [0, '65%'], fontSize: 14, color: '#888' },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          offsetCenter: [0, '40%'],
          formatter: '{value}%',
          color: 'auto',
        },
        data: [{ value: accuracy, name: '练习正确率' }],
      },
    ],
  }), [accuracy]);

  return (
    <div className="space-y-6">
      {/* 正确率仪表盘 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
          练习正确率
        </h3>
        <ReactECharts option={gaugeOption} style={{ height: 250 }} />
      </div>

      {/* 每日学习曲线 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          每日学习曲线
        </h3>
        <ReactECharts option={dailyOption} style={{ height: 300 }} />
      </div>

      {/* 高频错误词 */}
      {topWrongWords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            高频错误词 TOP 20
          </h3>
          <ReactECharts option={wrongWordsOption} style={{ height: 400 }} />
        </div>
      )}
    </div>
  );
};
