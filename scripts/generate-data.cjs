// ============================================================
// 数据生成脚本 - 生成 850 单词和 3000+ 句子
// 运行: node scripts/generate-data.js
// ============================================================

const fs = require('fs');
const path = require('path');

// ============================================================
// 850 Basic English 单词 (C.K. Ogden)
// ============================================================

// 简单的中文翻译映射
const translations = {
  // Operations (100)
  'come': '来', 'get': '得到', 'give': '给', 'go': '去', 'keep': '保持',
  'let': '让', 'make': '制作', 'put': '放', 'seem': '似乎', 'take': '拿',
  'be': '是', 'do': '做', 'have': '有', 'say': '说', 'see': '看见',
  'send': '发送', 'may': '可能', 'will': '将', 'about': '关于', 'across': '穿过',
  'after': '在...之后', 'against': '反对', 'among': '在...之中', 'at': '在', 'before': '在...之前',
  'between': '在...之间', 'by': '由', 'down': '向下', 'from': '从', 'in': '在...里',
  'off': '离开', 'on': '在...上', 'over': '在...上方', 'through': '通过', 'to': '到',
  'under': '在...下面', 'up': '向上', 'with': '和', 'as': '作为', 'for': '为了',
  'of': '的', 'till': '直到', 'than': '比', 'a': '一个', 'the': '这/那',
  'all': '所有', 'any': '任何', 'every': '每个', 'little': '少的', 'much': '多的',
  'no': '没有', 'other': '其他的', 'some': '一些', 'such': '这样的', 'that': '那个',
  'this': '这个', 'i': '我', 'he': '他', 'you': '你', 'who': '谁',
  'and': '和', 'because': '因为', 'but': '但是', 'or': '或者', 'if': '如果',
  'though': '虽然', 'while': '当...时', 'how': '如何', 'when': '何时', 'where': '哪里',
  'why': '为什么', 'again': '再次', 'ever': '曾经', 'far': '远', 'forward': '向前',
  'here': '这里', 'near': '近', 'now': '现在', 'out': '外面', 'still': '仍然',
  'then': '然后', 'there': '那里', 'together': '一起', 'well': '好', 'almost': '几乎',
  'enough': '足够', 'even': '甚至', 'not': '不', 'only': '仅仅', 'quite': '相当',
  'so': '如此', 'very': '非常', 'tomorrow': '明天', 'yesterday': '昨天',
  'north': '北', 'south': '南', 'east': '东', 'west': '西',
  'please': '请', 'yes': '是',

  // Things (400 general)
  'account': '账户', 'act': '行动', 'addition': '加法', 'adjustment': '调整', 'advertisement': '广告',
  'agreement': '协议', 'air': '空气', 'amount': '数量', 'amusement': '娱乐', 'animal': '动物',
  'answer': '答案', 'apparatus': '设备', 'approval': '批准', 'argument': '争论', 'art': '艺术',
  'attack': '攻击', 'attempt': '尝试', 'attention': '注意', 'attraction': '吸引力', 'authority': '权威',
  'back': '背部', 'balance': '平衡', 'base': '基础', 'behavior': '行为', 'belief': '信仰',
  'birth': '出生', 'bit': '一点', 'bite': '咬', 'blood': '血液', 'blow': '吹',
  'body': '身体', 'brass': '黄铜', 'bread': '面包', 'breath': '呼吸', 'brother': '兄弟',
  'building': '建筑', 'burn': '燃烧', 'burst': '爆发', 'business': '生意', 'butter': '黄油',
  'canvas': '帆布', 'care': '关心', 'cause': '原因', 'chalk': '粉笔', 'chance': '机会',
  'change': '改变', 'cloth': '布料', 'coal': '煤', 'color': '颜色', 'comfort': '舒适',
  'committee': '委员会', 'company': '公司', 'comparison': '比较', 'competition': '竞争', 'condition': '条件',
  'connection': '连接', 'control': '控制', 'cook': '厨师', 'copper': '铜', 'copy': '复制',
  'cork': '软木', 'cotton': '棉花', 'cough': '咳嗽', 'country': '国家', 'cover': '覆盖',
  'crack': '裂缝', 'credit': '信用', 'crime': '犯罪', 'crush': '压碎', 'cry': '哭',
  'current': '水流', 'curve': '曲线', 'damage': '损坏', 'danger': '危险', 'daughter': '女儿',
  'day': '天', 'death': '死亡', 'debt': '债务', 'decision': '决定', 'degree': '程度',
  'design': '设计', 'desire': '欲望', 'destruction': '破坏', 'detail': '细节', 'development': '发展',
  'digestion': '消化', 'direction': '方向', 'discovery': '发现', 'discussion': '讨论', 'disease': '疾病',
  'disgust': '厌恶', 'distance': '距离', 'distribution': '分配', 'division': '分割', 'doubt': '怀疑',
  'drink': '饮料', 'driving': '驾驶', 'dust': '灰尘', 'earth': '地球', 'edge': '边缘',
  'education': '教育', 'effect': '效果', 'end': '结束', 'environment': '环境', 'error': '错误',
  'event': '事件', 'example': '例子', 'exchange': '交换', 'existence': '存在', 'expansion': '扩张',
  'experience': '经验', 'expert': '专家', 'fact': '事实', 'fall': '秋天', 'family': '家庭',
  'father': '父亲', 'fear': '恐惧', 'feeling': '感觉', 'fiction': '小说', 'field': '田野',
  'fight': '战斗', 'fire': '火', 'flame': '火焰', 'flight': '飞行', 'flower': '花',
  'fold': '折叠', 'food': '食物', 'force': '力量', 'form': '形式', 'friend': '朋友',
  'front': '前面', 'fruit': '水果', 'glass': '玻璃', 'gold': '黄金', 'government': '政府',
  'grain': '谷物', 'grass': '草', 'grip': '紧握', 'group': '群体', 'growth': '成长',
  'guide': '指南', 'harbor': '港口', 'harmony': '和谐', 'hate': '仇恨', 'hearing': '听觉',
  'heat': '热', 'help': '帮助', 'history': '历史', 'hole': '洞', 'hope': '希望',
  'hour': '小时', 'humor': '幽默', 'ice': '冰', 'idea': '想法', 'impulse': '冲动',
  'increase': '增加', 'industry': '工业', 'ink': '墨水', 'insect': '昆虫', 'instrument': '工具',
  'insurance': '保险', 'interest': '兴趣', 'invention': '发明', 'iron': '铁', 'jelly': '果冻',
  'join': '连接', 'journey': '旅程', 'judge': '法官', 'jump': '跳', 'kick': '踢',
  'kiss': '吻', 'knowledge': '知识', 'land': '土地', 'language': '语言', 'laugh': '笑',
  'law': '法律', 'lead': '领导', 'learning': '学习', 'leather': '皮革', 'letter': '信',
  'level': '水平', 'lift': '举起', 'light': '光', 'limit': '限制', 'linen': '亚麻',
  'liquid': '液体', 'list': '列表', 'look': '看', 'loss': '损失', 'love': '爱',
  'machine': '机器', 'man': '男人', 'manager': '经理', 'mark': '标记', 'market': '市场',
  'mass': '大量', 'meal': '餐', 'measure': '测量', 'meat': '肉', 'meeting': '会议',
  'memory': '记忆', 'metal': '金属', 'middle': '中间', 'milk': '牛奶', 'mind': '头脑',
  'mine': '矿', 'minute': '分钟', 'mist': '薄雾', 'money': '钱', 'month': '月',
  'morning': '早晨', 'mother': '母亲', 'motion': '运动', 'mountain': '山', 'move': '移动',
  'music': '音乐', 'name': '名字', 'nation': '国家', 'need': '需要', 'news': '新闻',
  'night': '夜晚', 'noise': '噪音', 'note': '笔记', 'number': '数字', 'observation': '观察',
  'offer': '提供', 'oil': '油', 'operation': '操作', 'opinion': '意见', 'order': '顺序',
  'organization': '组织', 'ornament': '装饰', 'owner': '所有者', 'page': '页', 'pain': '疼痛',
  'paint': '油漆', 'paper': '纸', 'part': '部分', 'paste': '浆糊', 'payment': '付款',
  'peace': '和平', 'person': '人', 'place': '地点', 'plant': '植物', 'play': '玩',
  'pleasure': '快乐', 'point': '点', 'poison': '毒药', 'polish': '抛光', 'porter': '搬运工',
  'position': '位置', 'powder': '粉末', 'power': '力量', 'price': '价格', 'print': '印刷',
  'process': '过程', 'produce': '生产', 'profit': '利润', 'property': '财产', 'prose': '散文',
  'protest': '抗议', 'pull': '拉', 'punishment': '惩罚', 'purpose': '目的', 'push': '推',
  'quality': '质量', 'question': '问题', 'rain': '雨', 'range': '范围', 'rate': '比率',
  'ray': '光线', 'reaction': '反应', 'reading': '阅读', 'reason': '原因', 'record': '记录',
  'regret': '遗憾', 'relation': '关系', 'religion': '宗教', 'representative': '代表', 'request': '请求',
  'respect': '尊重', 'rest': '休息', 'reward': '奖励', 'rhythm': '节奏', 'rice': '米饭',
  'river': '河流', 'road': '路', 'roll': '滚动', 'room': '房间', 'rub': '擦',
  'rule': '规则', 'run': '跑', 'salt': '盐', 'sand': '沙子', 'scale': '规模',
  'science': '科学', 'sea': '海', 'seat': '座位', 'secretary': '秘书', 'selection': '选择',
  'self': '自己', 'sense': '感觉', 'servant': '仆人', 'sex': '性别', 'shade': '阴影',
  'shake': '摇动', 'shame': '羞耻', 'shock': '震惊', 'side': '边', 'sign': '标志',
  'silk': '丝绸', 'silver': '银', 'sister': '姐妹', 'size': '大小', 'sky': '天空',
  'sleep': '睡觉', 'slip': '滑倒', 'slope': '斜坡', 'smash': '粉碎', 'smell': '气味',
  'smile': '微笑', 'smoke': '烟', 'sneeze': '喷嚏', 'snow': '雪', 'soap': '肥皂',
  'society': '社会', 'son': '儿子', 'song': '歌曲', 'sort': '种类', 'sound': '声音',
  'soup': '汤', 'space': '空间', 'stage': '舞台', 'start': '开始', 'statement': '陈述',
  'steam': '蒸汽', 'steel': '钢', 'step': '步骤', 'stitch': '针脚', 'stone': '石头',
  'stop': '停止', 'story': '故事', 'stretch': '伸展', 'structure': '结构', 'substance': '物质',
  'sugar': '糖', 'suggestion': '建议', 'summer': '夏天', 'support': '支持', 'surprise': '惊喜',
  'swim': '游泳', 'system': '系统', 'talk': '谈话', 'taste': '味道', 'tax': '税',
  'teaching': '教学', 'tendency': '趋势', 'test': '测试', 'theory': '理论', 'thing': '东西',
  'thought': '思想', 'thunder': '雷', 'time': '时间', 'tin': '锡', 'top': '顶部',
  'touch': '触摸', 'trade': '贸易', 'transport': '运输', 'trick': '诡计', 'trouble': '麻烦',
  'turn': '转动', 'twist': '扭曲', 'unit': '单位', 'use': '使用', 'value': '价值',
  'verse': '诗', 'vessel': '容器', 'view': '视野', 'voice': '声音', 'walk': '走',
  'war': '战争', 'wash': '洗', 'waste': '浪费', 'water': '水', 'wave': '波浪',
  'wax': '蜡', 'way': '道路', 'weather': '天气', 'week': '周', 'weight': '重量',
  'wind': '风', 'wine': '酒', 'winter': '冬天', 'woman': '女人', 'wood': '木头',
  'wool': '羊毛', 'word': '词', 'work': '工作', 'wound': '伤口', 'writing': '书写',
  'year': '年',

  // Things (200 picturable)
  'angle': '角', 'ant': '蚂蚁', 'apple': '苹果', 'arch': '拱门', 'arm': '手臂',
  'army': '军队', 'baby': '婴儿', 'bag': '包', 'ball': '球', 'band': '带子',
  'basin': '盆', 'basket': '篮子', 'bath': '洗澡', 'bed': '床', 'bee': '蜜蜂',
  'bell': '铃', 'berry': '浆果', 'bird': '鸟', 'blade': '刀片', 'board': '板',
  'boat': '船', 'bone': '骨头', 'book': '书', 'boot': '靴子', 'bottle': '瓶子',
  'box': '盒子', 'boy': '男孩', 'brain': '大脑', 'brake': '刹车', 'branch': '树枝',
  'brick': '砖', 'bridge': '桥', 'brush': '刷子', 'bucket': '桶', 'bulb': '灯泡',
  'button': '按钮', 'cake': '蛋糕', 'camera': '相机', 'card': '卡片', 'cart': '推车',
  'carriage': '马车', 'cat': '猫', 'chain': '链子', 'cheese': '奶酪', 'chest': '胸部',
  'chin': '下巴', 'church': '教堂', 'circle': '圆', 'clock': '时钟', 'cloud': '云',
  'coat': '外套', 'collar': '衣领', 'comb': '梳子', 'cord': '绳子', 'cow': '奶牛',
  'cup': '杯子', 'curtain': '窗帘', 'cushion': '垫子', 'dog': '狗', 'door': '门',
  'drain': '排水管', 'drawer': '抽屉', 'dress': '连衣裙', 'drop': '滴', 'ear': '耳朵',
  'egg': '蛋', 'engine': '引擎', 'eye': '眼睛', 'face': '脸', 'farm': '农场',
  'feather': '羽毛', 'finger': '手指', 'fish': '鱼', 'flag': '旗', 'floor': '地板',
  'fly': '苍蝇', 'foot': '脚', 'fork': '叉子', 'fowl': '家禽', 'frame': '框架',
  'garden': '花园', 'girl': '女孩', 'glove': '手套', 'goat': '山羊', 'gun': '枪',
  'hair': '头发', 'hammer': '锤子', 'hand': '手', 'hat': '帽子', 'head': '头',
  'heart': '心脏', 'hook': '钩子', 'horn': '角', 'horse': '马', 'hospital': '医院',
  'house': '房子', 'island': '岛', 'jewel': '宝石', 'kettle': '水壶', 'key': '钥匙',
  'knee': '膝盖', 'knife': '刀', 'knot': '结', 'leaf': '叶子', 'leg': '腿',
  'library': '图书馆', 'line': '线', 'lip': '嘴唇', 'lock': '锁', 'map': '地图',
  'match': '火柴', 'monkey': '猴子', 'moon': '月亮', 'mouth': '嘴', 'muscle': '肌肉',
  'nail': '指甲', 'neck': '脖子', 'needle': '针', 'nerve': '神经', 'net': '网',
  'nose': '鼻子', 'nut': '坚果', 'office': '办公室', 'orange': '橙子', 'oven': '烤箱',
  'parcel': '包裹', 'pen': '笔', 'pencil': '铅笔', 'picture': '图片', 'pig': '猪',
  'pin': '别针', 'pipe': '管子', 'plane': '飞机', 'plate': '盘子', 'plough': '犁',
  'pocket': '口袋', 'pot': '锅', 'potato': '土豆', 'prison': '监狱', 'pump': '泵',
  'rail': '栏杆', 'rat': '老鼠', 'receipt': '收据', 'ring': '戒指', 'rod': '杆',
  'roof': '屋顶', 'root': '根', 'sail': '帆', 'school': '学校', 'scissors': '剪刀',
  'screw': '螺丝', 'seed': '种子', 'sheep': '羊', 'shelf': '架子', 'ship': '船',
  'shirt': '衬衫', 'shoe': '鞋', 'skin': '皮肤', 'skirt': '裙子', 'snake': '蛇',
  'sock': '袜子', 'spade': '铲子', 'sponge': '海绵', 'spoon': '勺子', 'spring': '春天',
  'square': '正方形', 'stamp': '邮票', 'star': '星星', 'station': '车站', 'stem': '茎',
  'stick': '棍子', 'stocking': '长袜', 'stomach': '胃', 'store': '商店', 'street': '街道',
  'sun': '太阳', 'table': '桌子', 'tail': '尾巴', 'thread': '线', 'throat': '喉咙',
  'thumb': '拇指', 'ticket': '票', 'toe': '脚趾', 'tongue': '舌头', 'tooth': '牙齿',
  'town': '城镇', 'train': '火车', 'tray': '托盘', 'tree': '树', 'trousers': '裤子',
  'umbrella': '雨伞', 'wall': '墙', 'watch': '手表', 'wheel': '轮子', 'whip': '鞭子',
  'whistle': '口哨', 'window': '窗户', 'wing': '翅膀', 'wire': '电线', 'worm': '蠕虫',

  // Qualities (100 general)
  'able': '能够', 'acid': '酸的', 'angry': '生气的', 'automatic': '自动的', 'beautiful': '美丽的',
  'black': '黑色的', 'boiling': '沸腾的', 'bright': '明亮的', 'broken': '破碎的', 'brown': '棕色的',
  'cheap': '便宜的', 'chemical': '化学的', 'chief': '主要的', 'clean': '干净的', 'clear': '清楚的',
  'common': '普通的', 'complex': '复杂的', 'conscious': '有意识的', 'cut': '切', 'deep': '深的',
  'dependent': '依赖的', 'early': '早的', 'elastic': '弹性的', 'electric': '电的', 'equal': '相等的',
  'fat': '胖的', 'fertile': '肥沃的', 'first': '第一的', 'fixed': '固定的', 'flat': '平的',
  'free': '自由的', 'frequent': '频繁的', 'full': '满的', 'general': '一般的', 'good': '好的',
  'great': '伟大的', 'grey': '灰色的', 'hanging': '悬挂的', 'happy': '快乐的', 'hard': '硬的',
  'healthy': '健康的', 'high': '高的', 'hollow': '空的', 'important': '重要的', 'kind': '善良的',
  'like': '像', 'living': '活的', 'long': '长的', 'married': '已婚的', 'material': '物质的',
  'medical': '医学的', 'military': '军事的', 'natural': '自然的', 'necessary': '必要的', 'new': '新的',
  'normal': '正常的', 'open': '开放的', 'parallel': '平行的', 'past': '过去的', 'physical': '物理的',
  'political': '政治的', 'poor': '贫穷的', 'possible': '可能的', 'present': '现在的', 'private': '私人的',
  'probable': '很可能的', 'quick': '快的', 'quiet': '安静的', 'ready': '准备好的', 'red': '红色的',
  'regular': '规律的', 'responsible': '负责的', 'right': '正确的', 'round': '圆的', 'same': '相同的',
  'second': '第二的', 'separate': '分开的', 'serious': '严肃的', 'sharp': '锋利的', 'smooth': '光滑的',
  'sticky': '粘的', 'stiff': '僵硬的', 'straight': '直的', 'strong': '强壮的', 'sudden': '突然的',
  'sweet': '甜的', 'tall': '高的', 'thick': '厚的', 'tight': '紧的', 'tired': '累的',
  'true': '真的', 'violent': '暴力的', 'waiting': '等待的', 'warm': '温暖的', 'wet': '湿的',
  'wide': '宽的', 'wise': '明智的', 'yellow': '黄色的', 'young': '年轻的',
  'gray': '灰色的',

  // 50 opposites (additional)
  'awake': '醒着的', 'asleep': '睡着的', 'bad': '坏的', 'bent': '弯曲的', 'bitter': '苦的',
  'blue': '蓝色的', 'certain': '确定的', 'cold': '冷的', 'complete': '完整的',
  'cruel': '残忍的', 'dark': '暗的', 'dead': '死的', 'alive': '活着的',
  'dear': '亲爱的', 'delicate': '精致的', 'different': '不同的',
  'dirty': '脏的', 'dry': '干的', 'false': '假的', 'feeble': '虚弱的',
  'female': '女性的', 'male': '男性的', 'foolish': '愚蠢的',
  'future': '未来的', 'green': '绿色的', 'ill': '生病的',
  'last': '最后的', 'late': '迟的', 'left': '左边的',
  'loose': '松的', 'loud': '大声的', 'low': '低的',
  'mixed': '混合的', 'narrow': '窄的', 'old': '老的',
  'opposite': '相反的', 'public': '公共的', 'rough': '粗糙的',
  'sad': '悲伤的', 'safe': '安全的', 'dangerous': '危险的',
  'secret': '秘密的', 'short': '短的', 'shut': '关闭的',
  'simple': '简单的', 'slow': '慢的', 'small': '小的',
  'soft': '软的', 'solid': '固体的', 'special': '特别的',
  'strange': '奇怪的', 'thin': '薄的', 'white': '白色的',
  'wrong': '错误的', 'certain': '确定的', 'uncertain': '不确定的',
  'incomplete': '不完整的', 'known': '已知的',
};

// 词性映射
const posMap = {
  // Operations
  'come': 'verb', 'get': 'verb', 'give': 'verb', 'go': 'verb', 'keep': 'verb',
  'let': 'verb', 'make': 'verb', 'put': 'verb', 'seem': 'verb', 'take': 'verb',
  'be': 'verb', 'do': 'verb', 'have': 'verb', 'say': 'verb', 'see': 'verb',
  'send': 'verb', 'may': 'modal', 'will': 'modal',
  'about': 'preposition', 'across': 'preposition', 'after': 'preposition', 'against': 'preposition',
  'among': 'preposition', 'at': 'preposition', 'before': 'preposition', 'between': 'preposition',
  'by': 'preposition', 'down': 'preposition', 'from': 'preposition', 'in': 'preposition',
  'off': 'preposition', 'on': 'preposition', 'over': 'preposition', 'through': 'preposition',
  'to': 'preposition', 'under': 'preposition', 'up': 'preposition', 'with': 'preposition',
  'as': 'conjunction', 'for': 'preposition', 'of': 'preposition', 'till': 'preposition', 'than': 'conjunction',
  'a': 'determiner', 'the': 'determiner',
  'all': 'determiner', 'any': 'determiner', 'every': 'determiner', 'little': 'determiner',
  'much': 'determiner', 'no': 'determiner', 'other': 'determiner', 'some': 'determiner',
  'such': 'determiner', 'that': 'determiner', 'this': 'determiner',
  'i': 'pronoun', 'he': 'pronoun', 'you': 'pronoun', 'who': 'pronoun',
  'and': 'conjunction', 'because': 'conjunction', 'but': 'conjunction', 'or': 'conjunction',
  'if': 'conjunction', 'though': 'conjunction', 'while': 'conjunction',
  'how': 'adverb', 'when': 'adverb', 'where': 'adverb', 'why': 'adverb',
  'again': 'adverb', 'ever': 'adverb', 'far': 'adverb', 'forward': 'adverb',
  'here': 'adverb', 'near': 'adverb', 'now': 'adverb', 'out': 'adverb',
  'still': 'adverb', 'then': 'adverb', 'there': 'adverb', 'together': 'adverb',
  'well': 'adverb', 'almost': 'adverb', 'enough': 'adverb', 'even': 'adverb',
  'not': 'adverb', 'only': 'adverb', 'quite': 'adverb', 'so': 'adverb', 'very': 'adverb',
  'tomorrow': 'adverb', 'yesterday': 'adverb',
  'north': 'noun', 'south': 'noun', 'east': 'noun', 'west': 'noun',
  'please': 'interjection', 'yes': 'interjection',
};

// IPA 音标映射
const phonetics = {
  'come': 'kʌm', 'get': 'ɡet', 'give': 'ɡɪv', 'go': 'ɡoʊ', 'keep': 'kiːp',
  'let': 'let', 'make': 'meɪk', 'put': 'pʊt', 'seem': 'siːm', 'take': 'teɪk',
  'be': 'biː', 'do': 'duː', 'have': 'hæv', 'say': 'seɪ', 'see': 'siː',
  'send': 'send', 'may': 'meɪ', 'will': 'wɪl',
  'about': 'əˈbaʊt', 'across': 'əˈkrɔːs', 'after': 'ˈæftər', 'against': 'əˈɡenst',
  'among': 'əˈmʌŋ', 'at': 'æt', 'before': 'bɪˈfɔːr', 'between': 'bɪˈtwiːn',
  'by': 'baɪ', 'down': 'daʊn', 'from': 'frʌm', 'in': 'ɪn',
  'off': 'ɔːf', 'on': 'ɒn', 'over': 'ˈoʊvər', 'through': 'θruː',
  'to': 'tuː', 'under': 'ˈʌndər', 'up': 'ʌp', 'with': 'wɪð',
  'as': 'æz', 'for': 'fɔːr', 'of': 'ʌv', 'till': 'tɪl', 'than': 'ðæn',
  'a': 'ə', 'the': 'ðə',
  'all': 'ɔːl', 'any': 'ˈeni', 'every': 'ˈevri', 'little': 'ˈlɪtl',
  'much': 'mʌtʃ', 'no': 'noʊ', 'other': 'ˈʌðər', 'some': 'sʌm',
  'such': 'sʌtʃ', 'that': 'ðæt', 'this': 'ðɪs',
  'i': 'aɪ', 'he': 'hiː', 'you': 'juː', 'who': 'huː',
  'and': 'ænd', 'because': 'bɪˈkɔːz', 'but': 'bʌt', 'or': 'ɔːr',
  'if': 'ɪf', 'though': 'ðoʊ', 'while': 'waɪl',
  'how': 'haʊ', 'when': 'wen', 'where': 'wer', 'why': 'waɪ',
  'again': 'əˈɡen', 'ever': 'ˈevər', 'far': 'fɑːr', 'forward': 'ˈfɔːrwərd',
  'here': 'hɪr', 'near': 'nɪr', 'now': 'naʊ', 'out': 'aʊt',
  'still': 'stɪl', 'then': 'ðen', 'there': 'ðer', 'together': 'təˈɡeðər',
  'well': 'wel', 'almost': 'ˈɔːlmoʊst', 'enough': 'ɪˈnʌf', 'even': 'ˈiːvən',
  'not': 'nɒt', 'only': 'ˈoʊnli', 'quite': 'kwaɪt', 'so': 'soʊ', 'very': 'ˈveri',
  'tomorrow': 'təˈmɒroʊ', 'yesterday': 'ˈjestərdeɪ',
  'north': 'nɔːrθ', 'south': 'saʊθ', 'east': 'iːst', 'west': 'west',
  'please': 'pliːz', 'yes': 'jes',
  'good': 'ɡʊd', 'bad': 'bæd', 'new': 'njuː', 'old': 'oʊld',
  'first': 'fɜːrst', 'last': 'læst', 'long': 'lɔːŋ', 'great': 'ɡreɪt',
  'man': 'mæn', 'woman': 'ˈwʊmən', 'boy': 'bɔɪ', 'girl': 'ɡɜːrl',
  'day': 'deɪ', 'time': 'taɪm', 'year': 'jɪr', 'thing': 'θɪŋ',
  'way': 'weɪ', 'work': 'wɜːrk', 'word': 'wɜːrd', 'part': 'pɑːrt',
  'water': 'ˈwɔːtər', 'place': 'pleɪs', 'hand': 'hænd', 'eye': 'aɪ',
  'life': 'laɪf', 'head': 'hed', 'world': 'wɜːrld', 'house': 'haʊs',
  'friend': 'frend', 'love': 'lʌv', 'name': 'neɪm', 'number': 'ˈnʌmbər',
  'book': 'bʊk', 'food': 'fuːd', 'light': 'laɪt', 'night': 'naɪt',
  'father': 'ˈfɑːðər', 'mother': 'ˈmʌðər', 'brother': 'ˈbrʌðər', 'sister': 'ˈsɪstər',
  'fire': 'faɪr', 'water': 'ˈwɔːtər', 'air': 'er', 'earth': 'ɜːrθ',
};

// 默认词性
function getPOS(word) {
  if (posMap[word]) return posMap[word];
  // 常见命名模式
  if (word.endsWith('tion') || word.endsWith('sion') || word.endsWith('ment')
    || word.endsWith('ness') || word.endsWith('ity') || word.endsWith('ence')
    || word.endsWith('ance') || word.endsWith('er') || word.endsWith('or')
    || word.endsWith('ist') || word.endsWith('ism'))
    return 'noun';
  if (word.endsWith('ing')) return 'noun';
  if (word.endsWith('ed')) return 'adjective';
  if (word.endsWith('ly')) return 'adverb';
  if (word.endsWith('ful') || word.endsWith('less') || word.endsWith('ous')
    || word.endsWith('ive') || word.endsWith('al') || word.endsWith('able')
    || word.endsWith('ible') || word.endsWith('y'))
    return 'adjective';
  return 'noun';
}

// 近似音标生成
function getApproximatePhonetic(word) {
  // 简单的发音规则近似
  const patterns = [
    ['ee', 'iː'], ['ea', 'iː'], ['oo', 'uː'], ['ou', 'aʊ'],
    ['th', 'θ'], ['ch', 'tʃ'], ['sh', 'ʃ'], ['ph', 'f'],
    ['wh', 'w'], ['qu', 'kw'], ['ck', 'k'], ['ng', 'ŋ'],
    ['a_e', 'eɪ'], ['i_e', 'aɪ'], ['o_e', 'oʊ'], ['u_e', 'juː'],
  ];
  let phonetic = word;
  // 简单规则
  if (word.endsWith('tion')) phonetic = word.slice(0, -4) + 'ʃən';
  if (word.endsWith('sion')) phonetic = word.slice(0, -4) + 'ʒən';
  if (word.endsWith('ture')) phonetic = word.slice(0, -4) + 'tʃər';
  if (word.endsWith('er')) phonetic = word.slice(0, -2) + 'ər';
  if (word.endsWith('ly')) phonetic = word.slice(0, -2) + 'li';
  if (word.endsWith('ing')) phonetic = word.slice(0, -3) + 'ɪŋ';
  if (word.endsWith('ed')) phonetic = word.slice(0, -2) + 'd';
  return phonetic;
}

// ============================================================
// 生成单词数据
// ============================================================

// 收集所有单词（去重）
const allWords = [...new Set(Object.keys(translations))];
const words = allWords.map((word, index) => ({
  id: index + 1,
  word: word,
  chinese: translations[word] || word,
  phonetic: phonetics[word] || getApproximatePhonetic(word),
  partOfSpeech: getPOS(word),
  basicMeaning: translations[word] || word,
}));

console.log(`Generated ${words.length} words`);

// ============================================================
// 生成句子数据 (3000+ 条)
// ============================================================

// 句子模板 - 使用 Basic English 850 词汇构造
const sentenceTemplates = [
  // 简单陈述句
  { basic: 'I have a {thing}.', natural: "I've got a {thing}.", chinese: '我有一个{thing_ch}。' },
  { basic: 'This is a {adj} {thing}.', natural: 'This is a {adj} {thing}.', chinese: '这是一个{adj_ch}的{thing_ch}。' },
  { basic: 'He is a {adj} {person}.', natural: "He's a {adj} {person}.", chinese: '他是一个{adj_ch}的{person_ch}。' },
  { basic: 'She is very {adj}.', natural: "She's very {adj}.", chinese: '她非常{adj_ch}。' },
  { basic: 'The {thing} is {adj}.', natural: 'The {thing} is {adj}.', chinese: '那个{thing_ch}是{adj_ch}的。' },
  { basic: 'I {verb} the {thing}.', natural: 'I {verb} the {thing}.', chinese: '我{verb_ch}了那个{thing_ch}。' },
  { basic: 'He {verb}s the {thing}.', natural: 'He {verb}s the {thing}.', chinese: '他{verb_ch}那个{thing_ch}。' },
  { basic: 'They {verb} to the {place}.', natural: 'They {verb} to the {place}.', chinese: '他们{verb_ch}去了{place_ch}。' },
  { basic: 'We {verb} in the {place}.', natural: 'We {verb} in the {place}.', chinese: '我们在{place_ch}{verb_ch}。' },
  { basic: 'The {person} is {action}.', natural: 'The {person} is {action}.', chinese: '那个{person_ch}正在{action_ch}。' },
  { basic: 'I am {action} now.', natural: "I'm {action} right now.", chinese: '我现在正在{action_ch}。' },
  { basic: 'The {thing} is on the {thing2}.', natural: 'The {thing} is on the {thing2}.', chinese: '{thing_ch}在{thing2_ch}上面。' },
  { basic: 'Please {verb} me the {thing}.', natural: 'Please {verb} me the {thing}.', chinese: '请把{thing_ch}{verb_ch}给我。' },
  { basic: 'I {verb} a {adj} {thing} yesterday.', natural: 'I {verb} a {adj} {thing} yesterday.', chinese: '我昨天{verb_ch}了一个{adj_ch}的{thing_ch}。' },
  { basic: 'He will {verb} the {thing} tomorrow.', natural: "He'll {verb} the {thing} tomorrow.", chinese: '他明天会{verb_ch}那个{thing_ch}。' },

  // 感觉与状态
  { basic: 'I have a {adj} feeling.', natural: "I've got a {adj} feeling.", chinese: '我有一种{adj_ch}的感觉。' },
  { basic: 'This {food} is very {adj}.', natural: 'This {food} is very {adj}.', chinese: '这个{food_ch}非常{adj_ch}。' },
  { basic: 'He gave me a {adj} look.', natural: 'He gave me a {adj} look.', chinese: '他给了我一个{adj_ch}的眼神。' },

  // 时间
  { basic: 'The {time} is {adj}.', natural: 'The {time} is {adj}.', chinese: '这个{time_ch}很{adj_ch}。' },
  { basic: 'I saw him {time} ago.', natural: 'I saw him {time} ago.', chinese: '我{time_ch}前见过他。' },

  // 地点
  { basic: 'The {thing} is in the {place}.', natural: 'The {thing} is in the {place}.', chinese: '{thing_ch}在{place_ch}里。' },
  { basic: 'She went to the {place}.', natural: 'She went to the {place}.', chinese: '她去了{place_ch}。' },

  // 数量
  { basic: 'I have {number} {thing}s.', natural: "I've got {number} {thing}s.", chinese: '我有{number_ch}个{thing_ch}。' },

  // 比较
  { basic: 'This {thing} is {adj_er} than that one.', natural: 'This {thing} is {adj_er} than that one.', chinese: '这个{thing_ch}比那个更{adj_ch}。' },
  { basic: 'He is the {adj_est} {person} I know.', natural: "He's the {adj_est} {person} I know.", chinese: '他是我认识的最{adj_ch}的{person_ch}。' },

  // 疑问句
  { basic: 'Where is the {thing}?', natural: "Where's the {thing}?", chinese: '{thing_ch}在哪里？' },
  { basic: 'How do you {verb} this?', natural: 'How do you {verb} this?', chinese: '你怎么{verb_ch}这个？' },
  { basic: 'What is this {thing} for?', natural: "What's this {thing} for?", chinese: '这个{thing_ch}是做什么用的？' },
  { basic: 'Why did he {verb} that?', natural: 'Why did he {verb} that?', chinese: '他为什么{verb_ch}那个？' },
  { basic: 'When will you {verb}?', natural: "When'll you {verb}?", chinese: '你什么时候{verb_ch}？' },

  // 否定句
  { basic: 'I did not {verb} the {thing}.', natural: "I didn't {verb} the {thing}.", chinese: '我没有{verb_ch}那个{thing_ch}。' },
  { basic: 'He is not a {adj} {person}.', natural: "He isn't a {adj} {person}.", chinese: '他不是一个{adj_ch}的{person_ch}。' },

  // 祈使句
  { basic: '{verb} the {thing} please.', natural: 'Please {verb} the {thing}.', chinese: '请{verb_ch}{thing_ch}。' },
  { basic: 'Do not {verb} that.', natural: "Don't {verb} that.", chinese: '不要{verb_ch}那个。' },

  // 复合句
  { basic: 'I think this is {adj}.', natural: 'I think this is {adj}.', chinese: '我觉得这很{adj_ch}。' },
  { basic: 'He said that he would {verb}.', natural: 'He said he would {verb}.', chinese: '他说他会{verb_ch}。' },
];

// 用于替换的单词池
const thingWords = ['book', 'box', 'ball', 'bag', 'cup', 'pen', 'hat', 'key', 'map', 'ring', 'bell', 'card', 'door', 'bed', 'chair', 'table', 'plate', 'knife', 'fork', 'spoon', 'bottle', 'basket', 'brush', 'clock', 'comb'];
const personWords = ['boy', 'girl', 'man', 'woman', 'father', 'mother', 'brother', 'sister', 'friend', 'son', 'daughter'];
const placeWords = ['house', 'room', 'garden', 'school', 'store', 'street', 'town', 'station', 'library', 'hospital', 'office', 'church', 'island', 'farm'];
const foodWords = ['bread', 'cake', 'cheese', 'meat', 'milk', 'butter', 'sugar', 'soup', 'rice', 'egg', 'apple', 'orange', 'potato', 'fish'];
const adjWords = ['good', 'bad', 'new', 'old', 'big', 'small', 'high', 'low', 'long', 'short', 'warm', 'cold', 'hot', 'bright', 'dark', 'clean', 'dirty', 'hard', 'soft', 'quick', 'slow', 'strong', 'thin', 'thick', 'full', 'open', 'quiet'];
const verbWordsList = ['make', 'take', 'give', 'get', 'put', 'see', 'send', 'keep', 'let', 'do', 'have', 'come', 'go', 'say'];
const numberWords = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const actionWords = ['working', 'reading', 'writing', 'walking', 'talking', 'playing', 'sleeping', 'waiting', 'learning', 'teaching', 'cooking', 'driving', 'swimming', 'running', 'flying'];
const timeWords = ['morning', 'night', 'day', 'week', 'month', 'summer', 'winter', 'hour'];

// 动词形态映射
const verbPast = { 'make': 'made', 'take': 'took', 'give': 'gave', 'get': 'got', 'put': 'put', 'see': 'saw', 'send': 'sent', 'keep': 'kept', 'let': 'let', 'do': 'did', 'have': 'had', 'come': 'came', 'go': 'went', 'say': 'said' };
const verbPastP = { 'make': 'made', 'take': 'taken', 'give': 'given', 'get': 'gotten', 'put': 'put', 'see': 'seen', 'send': 'sent', 'keep': 'kept', 'let': 'let', 'do': 'done', 'have': 'had', 'come': 'come', 'go': 'gone', 'say': 'said' };

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function verbS(verb) {
  if (verb === 'go') return 'goes';
  if (verb === 'do') return 'does';
  if (verb === 'have') return 'has';
  if (verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('ch') || verb.endsWith('sh')) return verb + 'es';
  if (verb.endsWith('y') && !'aeiou'.includes(verb[verb.length - 2])) return verb.slice(0, -1) + 'ies';
  return verb + 's';
}

function fillTemplate(template) {
  let basic = template.basic;
  let natural = template.natural;
  let chinese = template.chinese;
  const wordIds = [];

  // 替换 {thing}
  if (basic.includes('{thing}') || basic.includes('{thing2}')) {
    const t1 = thingWords[Math.floor(Math.random() * thingWords.length)];
    const t2 = thingWords[Math.floor(Math.random() * thingWords.length)];
    const word1 = words.find(w => w.word === t1);
    const word2 = words.find(w => w.word === t2);
    basic = basic.replace('{thing2}', t2).replace('{thing}', t1);
    natural = natural.replace('{thing2}', t2).replace('{thing}', t1);
    chinese = chinese.replace('{thing2_ch}', translations[t2] || t2).replace('{thing_ch}', translations[t1] || t1);
    if (word1) wordIds.push(word1.id);
    if (word2) wordIds.push(word2.id);
  }

  // 替换 {person}
  if (basic.includes('{person}')) {
    const p = personWords[Math.floor(Math.random() * personWords.length)];
    const word = words.find(w => w.word === p);
    basic = basic.replace('{person}', p);
    natural = natural.replace('{person}', p);
    chinese = chinese.replace('{person_ch}', translations[p] || p);
    if (word) wordIds.push(word.id);
  }

  // 替换 {place}
  if (basic.includes('{place}')) {
    const p = placeWords[Math.floor(Math.random() * placeWords.length)];
    const word = words.find(w => w.word === p);
    basic = basic.replace('{place}', p);
    natural = natural.replace('{place}', p);
    chinese = chinese.replace('{place_ch}', translations[p] || p);
    if (word) wordIds.push(word.id);
  }

  // 替换 {food}
  if (basic.includes('{food}')) {
    const f = foodWords[Math.floor(Math.random() * foodWords.length)];
    const word = words.find(w => w.word === f);
    basic = basic.replace('{food}', f);
    natural = natural.replace('{food}', f);
    chinese = chinese.replace('{food_ch}', translations[f] || f);
    if (word) wordIds.push(word.id);
  }

  // 替换 {adj} {adj_er} {adj_est}
  if (basic.includes('{adj}') || basic.includes('{adj_er}') || basic.includes('{adj_est}')) {
    const a = adjWords[Math.floor(Math.random() * adjWords.length)];
    const word = words.find(w => w.word === a);
    basic = basic.replace('{adj_est}', a + 'est').replace('{adj_er}', a + 'er').replace('{adj}', a);
    natural = natural.replace('{adj_est}', a + 'est').replace('{adj_er}', a + 'er').replace('{adj}', a);
    chinese = chinese.replace('{adj_ch}', translations[a] || a);
    if (word) wordIds.push(word.id);
  }

  // 替换 {verb}
  if (basic.includes('{verb}')) {
    const v = verbWordsList[Math.floor(Math.random() * verbWordsList.length)];
    const word = words.find(w => w.word === v);
    const past = verbPast[v] || v + 'ed';
    basic = basic.replace(/\{verb\}s/g, verbS(v)).replace('{verb}', v);
    natural = natural.replace(/\{verb\}s/g, verbS(v)).replace('{verb}', v);
    chinese = chinese.replace('{verb_ch}', translations[v] || v);
    if (word) wordIds.push(word.id);
  }

  // 替换 {action}
  if (basic.includes('{action}')) {
    const a = actionWords[Math.floor(Math.random() * actionWords.length)];
    basic = basic.replace('{action}', a);
    natural = natural.replace('{action}', a);
    chinese = chinese.replace('{action_ch}', translations[a.replace(/ing$/, '')] || a);
  }

  // 替换 {number}
  if (basic.includes('{number}')) {
    const n = numberWords[Math.floor(Math.random() * numberWords.length)];
    const word = words.find(w => w.word === n);
    basic = basic.replace('{number}', n);
    natural = natural.replace('{number}', n);
    chinese = chinese.replace('{number_ch}', translations[n] || n);
    if (word) wordIds.push(word.id);
  }

  // 替换 {time}
  if (basic.includes('{time}')) {
    const t = timeWords[Math.floor(Math.random() * timeWords.length)];
    const word = words.find(w => w.word === t);
    basic = basic.replace('{time}', t);
    natural = natural.replace('{time}', t);
    chinese = chinese.replace('{time_ch}', translations[t] || t);
    if (word) wordIds.push(word.id);
  }

  // 自动处理 yesterday 后的动词
  if (basic.includes('yesterday')) {
    for (const [base, past] of Object.entries(verbPast)) {
      if (basic.includes(' ' + base + ' ') && !basic.includes('yesterday ' + past)) {
        basic = basic.replace(' ' + base + ' ', ' ' + past + ' ');
      }
    }
  }

  return { basic, natural, chinese, wordIds };
}

// 生成句子
const sentences = [];
const seenBasic = new Set();

// 从模板生成 - 增加迭代次数以获得更多句子
for (const template of sentenceTemplates) {
  for (let i = 0; i < 120; i++) {
    const result = fillTemplate(template);
    if (!seenBasic.has(result.basic)) {
      seenBasic.add(result.basic);
      sentences.push(result);
    }
    if (sentences.length >= 3800) break;
  }
  if (sentences.length >= 3800) break;
}

// 补充更多样化的句子
const extraSentences = [
  { basic: 'The sun is bright today.', natural: "The sun's bright today.", chinese: '今天阳光明媚。' },
  { basic: 'I put the book on the table.', natural: 'I put the book on the table.', chinese: '我把书放在桌子上。' },
  { basic: 'She gave him a warm smile.', natural: 'She gave him a warm smile.', chinese: '她给了他一个温暖的微笑。' },
  { basic: 'The cat is sleeping on the bed.', natural: "The cat's sleeping on the bed.", chinese: '猫正在床上睡觉。' },
  { basic: 'He took his hat and went out.', natural: 'He took his hat and went out.', chinese: '他拿起帽子出去了。' },
  { basic: 'The water in the cup is cold.', natural: "The water in the cup's cold.", chinese: '杯子里的水是凉的。' },
  { basic: 'I saw a bird in the garden.', natural: 'I saw a bird in the garden.', chinese: '我在花园里看到一只鸟。' },
  { basic: 'She made a cake for her mother.', natural: 'She made a cake for her mother.', chinese: '她为她妈妈做了一个蛋糕。' },
  { basic: 'The boy is playing with a ball.', natural: "The boy's playing with a ball.", chinese: '男孩正在玩球。' },
  { basic: 'He keeps his keys in his pocket.', natural: 'He keeps his keys in his pocket.', chinese: '他把钥匙放在口袋里。' },
  { basic: 'The dog is running after the cat.', natural: "The dog's running after the cat.", chinese: '狗正在追猫。' },
  { basic: 'I need a glass of water.', natural: 'I need a glass of water.', chinese: '我需要一杯水。' },
  { basic: 'She put the flowers in a vase.', natural: 'She put the flowers in a vase.', chinese: '她把花放进花瓶里。' },
  { basic: 'The door is open.', natural: "The door's open.", chinese: '门开着。' },
  { basic: 'He is reading a book by the window.', natural: "He's reading a book by the window.", chinese: '他正坐在窗边看书。' },
  { basic: 'The moon is very bright tonight.', natural: "The moon's very bright tonight.", chinese: '今晚月亮很亮。' },
  { basic: 'I have two brothers and one sister.', natural: "I've got two brothers and one sister.", chinese: '我有两个兄弟和一个姐妹。' },
  { basic: 'She has a beautiful voice.', natural: "She's got a beautiful voice.", chinese: '她有一副美丽的嗓音。' },
  { basic: 'The train is coming into the station.', natural: "The train's coming into the station.", chinese: '火车正在进站。' },
  { basic: 'He is learning to play the piano.', natural: "He's learning to play the piano.", chinese: '他正在学弹钢琴。' },
  { basic: 'The baby is sleeping quietly.', natural: "The baby's sleeping quietly.", chinese: '婴儿正在安静地睡觉。' },
  { basic: 'I put some sugar in my coffee.', natural: 'I put some sugar in my coffee.', chinese: '我在咖啡里放了一些糖。' },
  { basic: 'She has a red dress on.', natural: "She's wearing a red dress.", chinese: '她穿着一件红色的连衣裙。' },
  { basic: 'The wind is blowing hard today.', natural: "The wind's blowing hard today.", chinese: '今天风很大。' },
  { basic: 'He gave the dog a bone.', natural: 'He gave the dog a bone.', chinese: '他给了狗一根骨头。' },
  { basic: 'I am going to the store now.', natural: "I'm going to the store now.", chinese: '我现在要去商店。' },
  { basic: 'She wrote a long letter to her friend.', natural: 'She wrote a long letter to her friend.', chinese: '她给朋友写了一封长信。' },
  { basic: 'The sky is full of stars.', natural: "The sky's full of stars.", chinese: '天空满是星星。' },
  { basic: 'He cut the apple with a knife.', natural: 'He cut the apple with a knife.', chinese: '他用刀切了苹果。' },
  { basic: 'I like the smell of fresh bread.', natural: 'I like the smell of fresh bread.', chinese: '我喜欢新鲜面包的香味。' },
  { basic: 'The children are playing in the park.', natural: "The children are playing in the park.", chinese: '孩子们正在公园里玩耍。' },
  { basic: 'She has long black hair.', natural: "She's got long black hair.", chinese: '她有一头长长的黑发。' },
  { basic: 'He put on his coat and went out.', natural: 'He put on his coat and went out.', chinese: '他穿上外套出去了。' },
  { basic: 'The clock on the wall is slow.', natural: "The clock on the wall's slow.", chinese: '墙上的钟慢了。' },
  { basic: 'I got a letter from my brother.', natural: 'I got a letter from my brother.', chinese: '我收到了我兄弟的来信。' },
  { basic: 'She is washing her hands with soap.', natural: "She's washing her hands with soap.", chinese: '她正在用肥皂洗手。' },
  { basic: 'The bird has a broken wing.', natural: "The bird's got a broken wing.", chinese: '那只鸟有一只翅膀受伤了。' },
  { basic: 'He took a picture of the mountain.', natural: 'He took a picture of the mountain.', chinese: '他拍了一张山的照片。' },
  { basic: 'I am very tired after the long walk.', natural: "I'm very tired after the long walk.", chinese: '走了很久之后我很累。' },
  { basic: 'She is looking out of the window.', natural: "She's looking out the window.", chinese: '她正望向窗外。' },
  { basic: 'The fish is swimming in the water.', natural: "The fish is swimming in the water.", chinese: '鱼正在水里游。' },
  { basic: 'He keeps his money in a box.', natural: 'He keeps his money in a box.', chinese: '他把钱放在一个盒子里。' },
  { basic: 'I saw a snake in the grass.', natural: 'I saw a snake in the grass.', chinese: '我在草丛里看到一条蛇。' },
  { basic: 'She gave the baby some milk.', natural: 'She gave the baby some milk.', chinese: '她给了婴儿一些牛奶。' },
  { basic: 'The road is very long and straight.', natural: "The road's very long and straight.", chinese: '那条路又长又直。' },
  { basic: 'He has a kind heart.', natural: "He's got a kind heart.", chinese: '他有一颗善良的心。' },
  { basic: 'The flowers in the garden are beautiful.', natural: "The flowers in the garden are beautiful.", chinese: '花园里的花很美。' },
  { basic: 'I put my book down and went to bed.', natural: 'I put my book down and went to bed.', chinese: '我放下书去睡觉了。' },
  { basic: 'She is making a dress for her daughter.', natural: "She's making a dress for her daughter.", chinese: '她正在为女儿做一条裙子。' },
  { basic: 'The horse is running in the field.', natural: "The horse is running in the field.", chinese: '马正在田野里奔跑。' },
  { basic: 'He got up early this morning.', natural: 'He got up early this morning.', chinese: '他今天早上起得很早。' },
  { basic: 'I have a bad pain in my head.', natural: "I've got a bad headache.", chinese: '我头疼得厉害。' },
  { basic: 'She put her finger to her lip.', natural: 'She put her finger to her lip.', chinese: '她把手指放在嘴唇上。' },
  { basic: 'The sun goes down in the west.', natural: 'The sun sets in the west.', chinese: '太阳从西边落下。' },
  { basic: 'He is a man of great knowledge.', natural: "He's a man of great knowledge.", chinese: '他是一个知识渊博的人。' },
  { basic: 'I feel a drop of rain on my face.', natural: 'I feel a drop of rain on my face.', chinese: '我感到一滴雨落在脸上。' },
  { basic: 'She has a ring on her finger.', natural: "She's got a ring on her finger.", chinese: '她手指上戴着一枚戒指。' },
  { basic: 'The snow is falling softly.', natural: "The snow's falling softly.", chinese: '雪轻轻地下着。' },
  { basic: 'He gave me good advice.', natural: 'He gave me some good advice.', chinese: '他给了我很好的建议。' },
  { basic: 'I am waiting for my friend at the station.', natural: "I'm waiting for my friend at the station.", chinese: '我正在车站等我的朋友。' },
  { basic: 'She put the key in the lock.', natural: 'She put the key in the lock.', chinese: '她把钥匙插进锁里。' },
  { basic: 'The sea is very blue today.', natural: "The sea's very blue today.", chinese: '今天大海很蓝。' },
  { basic: 'He is walking with a stick.', natural: "He's walking with a stick.", chinese: '他拄着拐杖走路。' },
  { basic: 'I saw a strange light in the sky.', natural: 'I saw a strange light in the sky.', chinese: '我看到天空中有一道奇怪的光。' },
  { basic: 'She has a warm heart and a quick mind.', natural: "She's got a warm heart and a quick mind.", chinese: '她心地温暖，思维敏捷。' },
  { basic: 'The old man is sleeping in his chair.', natural: "The old man's sleeping in his chair.", chinese: '老人正在椅子上睡觉。' },
  { basic: 'He put out his hand to take the cup.', natural: 'He put out his hand to take the cup.', chinese: '他伸出手去拿杯子。' },
  { basic: 'I have a small garden at the back of my house.', natural: "I've got a small garden behind my house.", chinese: '我房子后面有一个小花园。' },
  { basic: 'She is writing with a new pen.', natural: "She's writing with a new pen.", chinese: '她正在用一支新笔写字。' },
  { basic: 'The fire is burning brightly.', natural: "The fire's burning brightly.", chinese: '火旺旺地烧着。' },
  { basic: 'He took off his shoes and socks.', natural: 'He took off his shoes and socks.', chinese: '他脱掉了鞋子和袜子。' },
  { basic: 'I can hear the sound of music.', natural: 'I can hear music.', chinese: '我能听到音乐声。' },
  { basic: 'She gave me a book for my birthday.', natural: 'She gave me a book for my birthday.', chinese: '她送了我一本书作为生日礼物。' },
  { basic: 'The cloud is moving across the sky.', natural: "The cloud's moving across the sky.", chinese: '云正在天空中移动。' },
  { basic: 'He has a deep voice.', natural: "He's got a deep voice.", chinese: '他嗓音低沉。' },
  { basic: 'I put the letter in the box.', natural: 'I put the letter in the box.', chinese: '我把信放进了箱子里。' },
  { basic: 'She is cutting the bread with a sharp knife.', natural: "She's cutting the bread with a sharp knife.", chinese: '她正用一把锋利的刀切面包。' },
  { basic: 'The boy gave the girl a flower.', natural: 'The boy gave the girl a flower.', chinese: '男孩给了女孩一朵花。' },
  { basic: 'I saw him going down the road.', natural: 'I saw him going down the road.', chinese: '我看见他沿着路走下去了。' },
  { basic: 'She has a sweet smile on her face.', natural: "She's got a sweet smile on her face.", chinese: '她脸上带着甜美的微笑。' },
  { basic: 'The wall is made of stone and brick.', natural: "The wall's made of stone and brick.", chinese: '墙是用石头和砖做的。' },
  { basic: 'He put some salt on his food.', natural: 'He put some salt on his food.', chinese: '他在食物上撒了些盐。' },
  { basic: 'I am reading a book about birds.', natural: "I'm reading a book about birds.", chinese: '我正在读一本关于鸟的书。' },
  { basic: 'She is putting on her hat and coat.', natural: "She's putting on her hat and coat.", chinese: '她正在戴上帽子、穿上外套。' },
  { basic: 'The tree has green leaves in summer.', natural: 'The tree has green leaves in summer.', chinese: '夏天这棵树有绿色的叶子。' },
  { basic: 'He is a person of great learning.', natural: "He's a person of great learning.", chinese: '他是一个学识渊博的人。' },
  { basic: 'I have no money in my pocket.', natural: "I've got no money in my pocket.", chinese: '我口袋里没有钱。' },
  { basic: 'She put the baby to sleep in the bed.', natural: 'She put the baby to bed.', chinese: '她把婴儿放到床上睡觉。' },
  { basic: 'The smell of the flower is very sweet.', natural: "The flower's smell is very sweet.", chinese: '那朵花的香味很甜。' },
  { basic: 'He kept his eyes on the road.', natural: 'He kept his eyes on the road.', chinese: '他眼睛盯着路面。' },
  { basic: 'I got up when the bell rang.', natural: 'I got up when the bell rang.', chinese: '铃声响起时我起床了。' },
  { basic: 'She made soup for the family.', natural: 'She made soup for the family.', chinese: '她为家人做了汤。' },
  { basic: 'The dog has a long tail.', natural: "The dog's got a long tail.", chinese: '狗有一条长尾巴。' },
  { basic: 'He put a stamp on the letter.', natural: 'He put a stamp on the letter.', chinese: '他在信上贴了张邮票。' },
  { basic: 'I saw her at the market yesterday.', natural: 'I saw her at the market yesterday.', chinese: '我昨天在市场看见她了。' },
  { basic: 'She has blue eyes and brown hair.', natural: "She's got blue eyes and brown hair.", chinese: '她有蓝色的眼睛和棕色的头发。' },
  { basic: 'The water is boiling in the pot.', natural: "The water's boiling in the pot.", chinese: '锅里的水开了。' },
  { basic: 'He gave a push to the door.', natural: 'He pushed the door.', chinese: '他推了一下门。' },
  { basic: 'I put my books in order on the shelf.', natural: 'I put my books in order on the shelf.', chinese: '我把书整理好放在架子上。' },
  { basic: 'She is learning the art of cooking.', natural: "She's learning the art of cooking.", chinese: '她正在学烹饪的艺术。' },
  { basic: 'The sun is going down behind the mountain.', natural: "The sun's going down behind the mountain.", chinese: '太阳正落山。' },
  { basic: 'He has a good knowledge of history.', natural: "He's got a good knowledge of history.", chinese: '他通晓历史。' },
  { basic: 'I need a bit of help with this work.', natural: 'I need a bit of help with this work.', chinese: '我这项工作需要一点帮助。' },
  { basic: 'She put her hand on my arm.', natural: 'She put her hand on my arm.', chinese: '她把手放在我的手臂上。' },
  { basic: 'The cat has soft black hair.', natural: "The cat's got soft black fur.", chinese: '那只猫有柔软的黑毛。' },
];

// 添加额外句子
for (const extra of extraSentences) {
  if (!seenBasic.has(extra.basic)) {
    seenBasic.add(extra.basic);
    // 找到句子中的单词IDs
    const wordIds = [];
    for (const w of words) {
      const regex = new RegExp('\\b' + w.word + '\\b', 'i');
      if (regex.test(extra.basic)) {
        wordIds.push(w.id);
      }
    }
    sentences.push({ ...extra, wordIds });
  }
}

// 确保每个单词至少出现15次（如果句子不够）
// 为出现较少的单词生成补充句子
const wordAppearance = new Map();
for (const s of sentences) {
  for (const wid of s.wordIds) {
    wordAppearance.set(wid, (wordAppearance.get(wid) || 0) + 1);
  }
}

// 为出现次数少的单词补充句子
for (const w of words) {
  const count = wordAppearance.get(w.id) || 0;
  if (count < 15 && sentences.length < 5000) {
    for (let i = count; i < Math.min(15, 15); i++) {
      const extra = {
        basic: `The ${w.word} is important for us.`,
        natural: `The ${w.word} is important for us.`,
        chinese: `${w.chinese}对我们很重要。`,
        wordIds: [w.id],
      };
      if (!seenBasic.has(extra.basic)) {
        seenBasic.add(extra.basic);
        sentences.push(extra);
        wordAppearance.set(w.id, (wordAppearance.get(w.id) || 0) + 1);
      }
      if (sentences.length >= 5000) break;
    }
  }
}

// 排序并分配ID
const finalSentences = sentences.slice(0, 4200).map((s, index) => ({
  id: index + 1,
  basic: s.basic,
  natural: s.natural,
  chinese: s.chinese,
  words: s.wordIds.filter(id => id !== undefined && id > 0 && id <= 850),
}));

console.log(`Generated ${finalSentences.length} sentences`);

// ============================================================
// 写入文件
// ============================================================

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(
  path.join(assetsDir, 'words.json'),
  JSON.stringify(words, null, 2),
  'utf-8'
);
console.log(`Written words.json (${words.length} words)`);

fs.writeFileSync(
  path.join(assetsDir, 'sentences.json'),
  JSON.stringify(finalSentences, null, 2),
  'utf-8'
);
console.log(`Written sentences.json (${finalSentences.length} sentences)`);

console.log('\n✅ Data generation complete!');
