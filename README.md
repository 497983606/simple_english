# simple_english
C.K. Ogden simple english learn

AI prompt 

# Basic English 850 学习系统 PRD（产品需求文档）

> **项目名称：** Basic English 850 Learning
>
> **目标：** 基于 C.K. Ogden《Basic English》的 850 个核心单词，开发一个纯前端英语学习网站，通过大量短句和智能练习帮助学习者掌握 Basic English，并最终具备阅读、写作和日常表达能力。

---

# 一、项目目标

请开发一个**纯前端**的 Basic English 学习系统。

整个系统无需任何后端服务器，可直接部署到 **GitHub Pages**。

系统所有数据均保存在浏览器 **IndexedDB** 中，一个浏览器默认视为一个独立用户。

本项目不是一个普通背单词软件，而是利用 **Basic English 的 850 个核心单词 + 大量短句 + 间隔重复学习算法（Spaced Repetition，按照记忆曲线安排复习时间的学习方法）**，帮助用户真正掌握 Basic English。

---

# 二、设计原则

整个系统遵循以下原则：

- 极简 UI
- 键盘优先
- 无登录
- 无服务器
- 完全离线可运行
- 数据全部本地保存
- 响应速度快
- 学习成本低

参考产品：

- Duolingo
- Anki
- LingQ
- TypingClub

但整体更加轻量。

---

# 三、数据来源

所有单词均来自：

> C.K. Ogden《Basic English》850 Core Words

每个单词至少包含：

```ts
interface Word {

  id:number

  word:string

  chinese:string

  phonetic:string

  partOfSpeech:string

  basicMeaning:string

}
```

例如：

```json
{
  "id":1,
  "word":"boy",
  "chinese":"男孩",
  "phonetic":"bɔɪ",
  "partOfSpeech":"noun",
  "basicMeaning":"男孩"
}
```

---

# 四、句子数据

## 数量

目标：

> 3000 ~ 5000 条短句

优先级：

1. 优先使用真实 Basic English 例句
2. AI 根据 Basic English 语法自动生成
3. 保证自然表达
4. 每个单词至少出现 15~30 次

---

## 每条句子包含

```ts
interface Sentence{

    id:number

    basic:string

    natural:string

    chinese:string

    words:number[]

}
```

例如：

```json
{
  "id":1,
  "basic":"The boy gave me a book.",
  "natural":"The boy handed me a book.",
  "chinese":"那个男孩给了我一本书。",
  "words":[15,62,88]
}
```

---

# 五、首页

左侧菜单：

- 📖 短句学习
- ✍ 练习模式
- 🎯 错词强化
- 📊 学习记录
- ⚙ 设置

---

# 六、短句学习

整个系统的核心页面。

页面布局：

```
────────────────────────────

The boy gave me a book.

那个男孩给了我一本书。

Natural English：

The boy handed me a book.

────────────────────────────

Space：播放

↑：上一句

↓：下一句

Q：练习

```

---

## 发音

支持两种方式：

### 浏览器 TTS

优先：

Web Speech API（浏览器原生语音合成）

优点：

- 无需联网
- API 简单
- GitHub Pages 可直接运行

---

### JS TTS

支持切换：

例如：

- meSpeak.js
- Speak.js

保证浏览器不支持 Speech API 时仍可发音。

---

## 键盘快捷键

| 按键 | 功能 |
|-------|------|
| Space | 播放发音 |
| ↑ | 上一句 |
| ↓ | 下一句 |
| ← | 上一个未掌握句子 |
| → | 下一个未掌握句子 |
| Q | 进入练习模式 |
| Esc | 返回学习 |

---

# 七、练习模式

快捷键：

Q

进入。

---

进入后自动隐藏句子中的部分单词。

例如：

```
The boy ____ me a book.
```

或者：

```
The ____ gave me a book.
```

或者：

```
____ boy gave me a book.
```

---

## 隐藏策略

支持：

### 模式一

随机隐藏。

---

### 模式二

只隐藏：

- 动词
- 介词

方便理解语法。

---

### 模式三

只隐藏：

当前正在重点学习的单词。

---

### 模式四

只隐藏：

历史错误最多的单词。

---

### 模式五

根据记忆等级自动决定隐藏对象。

---

## 输入

用户输入：

```
gave
```

按：

Enter

提交。

---

## 判断

正确：

- 撒花动画（Canvas Confetti）
- 自动播放发音
- 自动下一题

错误：

显示：

```
正确答案：

gave
```

并高亮：

```
The boy [gave] me a book.
```

记录错误。

---

# 八、错词强化

根据统计：

自动生成：

- 最近错误
- 正确率最低
- 连续错误
- 长时间未掌握

组成新的学习列表。

仅学习这些句子。

---

# 九、学习算法

采用：

Spaced Repetition（间隔重复学习算法）

每个单词维护：

```ts
interface Memory{

    wordId:number

    memoryLevel:number

    correct:number

    wrong:number

    lastStudy:number

    nextReview:number

}
```

规则：

答对：

```
memoryLevel++
```

答错：

```
memoryLevel--
```

最低：

0

最高：

10

memoryLevel 越高：

出现频率越低。

memoryLevel 越低：

出现频率越高。

长期未学习：

自动重新加入学习。

---

# 十、学习记录

统计：

## 单词统计

850 个单词分别记录：

- 是否浏览
- 是否练习
- 浏览次数
- 练习次数
- 正确次数
- 错误次数
- 当前记忆等级
- 首次学习时间
- 最近学习时间

---

## 总体统计

展示：

- 学习总时长
- 今日学习
- 本周学习
- 本月学习
- 连续学习天数
- 总句子数
- 总练习数
- 正确率
- 已掌握单词
- 未掌握单词

---

## 图表

建议：

ECharts

展示：

- 每日学习曲线
- 每日练习数量
- 高频错误词 TOP20
- 学习热力图
- 单词掌握率

---

# 十一、搜索

支持搜索：

- 单词
- 中文
- 句子

例如：

```
book
```

即可定位所有相关句子。

---

# 十二、收藏

支持：

⭐ 收藏句子

⭐ 收藏单词

方便反复学习。

---

# 十三、数据存储

全部保存在：

IndexedDB

建议：

Dexie.js

保存：

- 单词记录
- 学习记录
- 设置
- 收藏
- 错题
- 统计
- 历史

无需服务器。

---

## 导入导出

支持：

导出：

```
learning.json
```

导入：

恢复全部学习记录。

---

# 十四、技术要求

必须满足：

- React
- TypeScript
- Vite
- TailwindCSS
- IndexedDB（Dexie.js）
- ECharts
- Canvas Confetti
- Web Speech API

全部纯前端。

禁止：

- Node Server
- Express
- Java
- PHP
- Python
- MySQL
- PostgreSQL
- Redis

---

# 十五、目录结构

```
src/

    assets/

        words.json

        sentences.json

    db/

        index.ts

    hooks/

    utils/

    pages/

        Study/

        Practice/

        WrongWords/

        History/

        Settings/

    components/

        SentenceCard/

        PracticeInput/

        KeyboardHelp/

        ProgressChart/

        WordCard/

    services/

        speech.ts

        study.ts

        practice.ts

    types/

    App.tsx

```

---

# 十六、UI 风格

整体：

- 极简
- 白色背景
- 深色模式
- 大字号
- 无复杂动画
- 类似 Duolingo + Anki

支持：

- PC
- 平板
- 手机

---

# 十七、性能要求

首次加载：

< 2 秒

切换句子：

< 50ms

IndexedDB 查询：

< 20ms

页面滚动：

60 FPS

支持离线运行。

---

# 十八、未来可扩展功能（预留）

后续版本可扩展：

- AI 自动生成更多 Basic English 句子
- AI 语法解析
- Shadowing（跟读）
- 发音评分
- ChatGPT 对话练习
- AI 写作纠错
- 导入自己的句子
- PWA（渐进式 Web 应用，可安装到桌面）
- 多语言界面

---

# 十九、开发要求

请严格按照以下顺序开发：

1. 初始化 React + TypeScript + Vite 项目
2. 建立目录结构
3. 创建 IndexedDB 数据层
4. 导入 850 单词数据
5. 导入 3000~5000 条句子数据
6. 完成短句学习页面
7. 完成发音模块
8. 完成练习模式
9. 完成间隔重复算法
10. 完成学习记录统计
11. 完成图表
12. 完成错词强化
13. 完成设置页面
14. 支持学习记录导入/导出
15. 进行 UI 优化
16. 进行性能优化
17. 确保可直接部署到 GitHub Pages

---

# 二十、代码规范

所有代码必须满足以下要求：

- 使用 TypeScript。
- 使用 React Hooks。
- 禁止使用类组件。
- 模块职责单一，避免重复代码。
- 保持高内聚、低耦合。
- 所有业务逻辑封装为 Hook 或 Service。
- 类型定义集中管理。
- 必须包含必要注释。
- 遵循 ESLint 与 Prettier 规范。
- 便于后续扩展和维护。

---

# 二十一、验收标准

项目完成后应满足以下条件：

- ✅ 可直接部署到 GitHub Pages
- ✅ 无需任何后端服务
- ✅ 支持离线运行
- ✅ IndexedDB 持久化学习记录
- ✅ 支持 850 个 Basic English 单词学习
- ✅ 提供 3000~5000 条高质量短句
- ✅ 支持发音播放
- ✅ 支持键盘快捷键操作
- ✅ 支持练习模式与智能隐藏单词
- ✅ 实现间隔重复学习算法
- ✅ 支持错词强化训练
- ✅ 提供学习统计与可视化图表
- ✅ 支持学习记录导入与导出
- ✅ 代码结构清晰、模块化程度高、可长期维护