// ============================================================
// 智能句子生成器 - 自然、多样化的 Basic English 句子
// ============================================================

const fs = require('fs');
const path = require('path');

// 加载单词数据
const wordsData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'src', 'assets', 'words.json'), 'utf-8'
));
const wordMap = {};
for (const w of wordsData) wordMap[w.word] = w;

function wid(word) {
  const w = wordMap[word];
  return w ? w.id : 0;
}

function wids(...wordList) {
  return wordList.map(w => wid(w)).filter(id => id > 0);
}

// ============================================================
// 手写高质量句子 - 涵盖日常生活的方方面面
// 每个句子都自然、地道、有实际交流价值
// ============================================================

const rawSentences = [
  // === 家庭与日常生活 ===
  { b: "The boy gave me a book.", n: "The boy handed me a book.", c: "那个男孩给了我一本书。" },
  { b: "She put the baby to bed.", n: "She put the baby to bed.", c: "她把婴儿放到床上。" },
  { b: "He got up early this morning.", n: "He woke up early this morning.", c: "他今天早上起得很早。" },
  { b: "The cat is sleeping on the bed.", n: "The cat's sleeping on the bed.", c: "猫正在床上睡觉。" },
  { b: "She is making a dress for her daughter.", n: "She's making a dress for her daughter.", c: "她正在给女儿做裙子。" },
  { b: "He took his hat and went out.", n: "He grabbed his hat and went out.", c: "他拿起帽子出门了。" },
  { b: "The dog is running after the cat.", n: "The dog's chasing the cat.", c: "狗在追猫。" },
  { b: "I need a glass of water.", n: "I need a glass of water.", c: "我需要一杯水。" },
  { b: "She put the key in the lock.", n: "She put the key in the lock.", c: "她把钥匙插进锁孔。" },
  { b: "The fire is burning brightly.", n: "The fire's burning bright.", c: "火烧得很旺。" },
  { b: "He is reading a book by the window.", n: "He's reading a book by the window.", c: "他正坐在窗边看书。" },
  { b: "The old man is sleeping in his chair.", n: "The old man's dozing in his chair.", c: "老人正在椅子上打盹。" },
  { b: "She has a ring on her finger.", n: "She's wearing a ring.", c: "她手指上戴着戒指。" },
  { b: "The children are playing in the garden.", n: "The kids are playing in the garden.", c: "孩子们在花园里玩耍。" },
  { b: "He put some sugar in his coffee.", n: "He added sugar to his coffee.", c: "他在咖啡里加了糖。" },
  { b: "I saw a bird in the tree.", n: "I spotted a bird in the tree.", c: "我看见树上有只鸟。" },
  { b: "She is washing her hands with soap.", n: "She's washing her hands with soap.", c: "她正在用肥皂洗手。" },
  { b: "The clock on the wall is slow.", n: "The clock on the wall is running slow.", c: "墙上的钟慢了。" },
  { b: "He took off his shoes and socks.", n: "He took off his shoes and socks.", c: "他脱掉了鞋和袜子。" },
  { b: "I put my books in order on the shelf.", n: "I organized my books on the shelf.", c: "我把书整齐地放在书架上。" },

  // === 自然与世界 ===
  { b: "The sun is going down behind the mountain.", n: "The sun is setting behind the mountain.", c: "太阳正从山后落下。" },
  { b: "The moon is very bright tonight.", n: "The moon is really bright tonight.", c: "今晚的月亮真亮。" },
  { b: "The sky is full of stars.", n: "The sky's packed with stars.", c: "天空布满了星星。" },
  { b: "The wind is blowing hard today.", n: "It's really windy today.", c: "今天风刮得很大。" },
  { b: "The snow is falling softly.", n: "Snow is falling gently.", c: "雪正轻轻飘落。" },
  { b: "The sea is very blue today.", n: "The sea looks really blue today.", c: "今天大海格外蓝。" },
  { b: "A cloud is moving across the sky.", n: "A cloud is drifting across the sky.", c: "一朵云正飘过天空。" },
  { b: "The tree has green leaves in summer.", n: "The tree grows green leaves in summer.", c: "夏天树长出绿叶。" },
  { b: "I can hear the sound of rain.", n: "I can hear the rain falling.", c: "我能听到下雨的声音。" },
  { b: "The flower has a sweet smell.", n: "The flower smells sweet.", c: "那朵花闻起来很香。" },
  { b: "Birds are singing in the early morning.", n: "Birds are singing early in the morning.", c: "清晨鸟在歌唱。" },
  { b: "The river goes through the town.", n: "The river runs through the town.", c: "河流穿过小镇。" },
  { b: "There is a deep hole in the road.", n: "There's a deep pothole in the road.", c: "路上有个深坑。" },
  { b: "The air is warm and wet after the rain.", n: "The air feels warm and humid after the rain.", c: "雨后空气温暖潮湿。" },
  { b: "A cold wind came from the north.", n: "A cold wind blew in from the north.", c: "一股寒风从北方吹来。" },

  // === 感觉与情绪 ===
  { b: "She has a warm heart and a quick mind.", n: "She's got a warm heart and a sharp mind.", c: "她心地温暖，思维敏捷。" },
  { b: "I am very tired after the long walk.", n: "I'm exhausted after that long walk.", c: "走了那么久我累坏了。" },
  { b: "He has a bad pain in his head.", n: "He's got a bad headache.", c: "他头疼得厉害。" },
  { b: "She gave him a warm smile.", n: "She gave him a warm smile.", c: "她给了他一个温暖的微笑。" },
  { b: "He was full of joy when he saw her.", n: "He was overjoyed when he saw her.", c: "他看到她时满心欢喜。" },
  { b: "I have a strange feeling about this.", n: "I've got a weird feeling about this.", c: "我对这事有种奇怪的感觉。" },
  { b: "She was shaking with fear in the dark.", n: "She was trembling with fear in the dark.", c: "她在黑暗中吓得发抖。" },
  { b: "His face went red with anger.", n: "His face turned red with anger.", c: "他气得脸都红了。" },
  { b: "The news made her very sad.", n: "The news really saddened her.", c: "那个消息让她很难过。" },
  { b: "He gave a cry of surprise.", n: "He let out a cry of surprise.", c: "他惊讶地叫了一声。" },
  { b: "I am looking forward to seeing you again.", n: "I'm looking forward to seeing you.", c: "我期待再次见到你。" },
  { b: "She felt a touch on her arm.", n: "She felt someone touch her arm.", c: "她感觉有人碰了碰她的胳膊。" },
  { b: "His voice was low and soft.", n: "His voice was low and gentle.", c: "他的声音低沉而温柔。" },
  { b: "The memory of that day still makes me smile.", n: "Thinking of that day still makes me smile.", c: "想起那天我仍然会微笑。" },

  // === 工作与学习 ===
  { b: "He is learning the art of cooking.", n: "He's learning how to cook.", c: "他正在学烹饪。" },
  { b: "She is writing with a new pen.", n: "She's writing with a new pen.", c: "她用一支新笔在写字。" },
  { b: "I have to give a talk at the meeting.", n: "I have to give a speech at the meeting.", c: "我必须在会议上发言。" },
  { b: "The teacher put a question to the class.", n: "The teacher asked the class a question.", c: "老师向全班提了一个问题。" },
  { b: "She made a quick note in her book.", n: "She jotted a quick note in her book.", c: "她在本子上快速记了一笔。" },
  { b: "He is reading a book about birds.", n: "He's reading a book on birds.", c: "他在读一本关于鸟的书。" },
  { b: "I got a letter from my brother yesterday.", n: "I received a letter from my brother yesterday.", c: "我昨天收到了哥哥的来信。" },
  { b: "The test was harder than I thought.", n: "The test was tougher than I expected.", c: "考试比我想象的难。" },
  { b: "He is a person of great knowledge.", n: "He's a really knowledgeable person.", c: "他是个知识渊博的人。" },
  { b: "She put her name at the top of the paper.", n: "She wrote her name at the top of the paper.", c: "她把名字写在纸的顶端。" },
  { b: "I am working on a new design.", n: "I'm working on a new design.", c: "我在做一个新设计。" },
  { b: "He kept his eyes on the book for hours.", n: "He kept his eyes on the book for hours.", c: "他盯着书看了好几个小时。" },

  // === 社交与关系 ===
  { b: "He is a good friend to me.", n: "He's been a good friend to me.", c: "他是我的好朋友。" },
  { b: "She gave me good advice.", n: "She gave me some solid advice.", c: "她给了我很好的建议。" },
  { b: "We had a long talk about old times.", n: "We had a long chat about the old days.", c: "我们聊了很久的往事。" },
  { b: "He said he would come but he did not.", n: "He said he'd come but he didn't show.", c: "他说会来但没来。" },
  { b: "I am waiting for my friend at the station.", n: "I'm waiting for my friend at the station.", c: "我正在车站等朋友。" },
  { b: "She sent me a letter from a far country.", n: "She sent me a letter from a distant country.", c: "她从遥远的国家给我寄了封信。" },
  { b: "The boy gave the girl a flower.", n: "The boy gave the girl a flower.", c: "男孩送了女孩一朵花。" },
  { b: "They are talking in a low voice.", n: "They're speaking in hushed tones.", c: "他们在低声交谈。" },
  { b: "I saw her at the market yesterday.", n: "I ran into her at the market yesterday.", c: "我昨天在市场碰见她了。" },
  { b: "He gave me his word that he would help.", n: "He promised he would help.", c: "他向我保证他会帮忙。" },
  { b: "She has a kind word for everyone.", n: "She has a kind word for everyone.", c: "她对每个人都说善意的话。" },

  // === 食物与健康 ===
  { b: "The water is boiling in the pot.", n: "The water's boiling in the pot.", c: "锅里的水开了。" },
  { b: "She made soup for the family.", n: "She made soup for the whole family.", c: "她给全家做了汤。" },
  { b: "He cut the apple with a sharp knife.", n: "He sliced the apple with a sharp knife.", c: "他用锋利的刀切苹果。" },
  { b: "The bread is fresh from the oven.", n: "The bread is fresh out of the oven.", c: "面包刚出炉。" },
  { b: "I put some salt on my food.", n: "I added a bit of salt to my food.", c: "我在食物上撒了点盐。" },
  { b: "She made a cake for her mother.", n: "She baked a cake for her mother.", c: "她给妈妈烤了蛋糕。" },
  { b: "The milk has a bad taste.", n: "The milk tastes off.", c: "牛奶有股怪味。" },
  { b: "He was so hungry he could not wait.", n: "He was so hungry he couldn't wait.", c: "他饿得等不及了。" },
  { b: "Take this medicine three times a day.", n: "Take this medicine three times daily.", c: "这药一天吃三次。" },
  { b: "She has been ill for a week.", n: "She's been sick for a week.", c: "她病了一周了。" },

  // === 旅行与交通 ===
  { b: "The train is coming into the station.", n: "The train's pulling into the station.", c: "火车正驶入车站。" },
  { b: "He went on a long journey to the east.", n: "He went on a long journey east.", c: "他向东远行。" },
  { b: "The road goes over the mountain.", n: "The road crosses over the mountain.", c: "这条路翻过山。" },
  { b: "I saw a ship far out at sea.", n: "I spotted a ship far out at sea.", c: "我看见远处海上有一艘船。" },
  { b: "She is driving to town for work.", n: "She's driving into town for work.", c: "她正开车去镇上上班。" },
  { b: "The bridge goes across the wide river.", n: "The bridge spans the wide river.", c: "桥横跨宽阔的河流。" },
  { b: "We took the wrong turn at the crossing.", n: "We took a wrong turn at the intersection.", c: "我们在路口拐错了。" },
  { b: "He had to walk because his car was broken.", n: "He had to walk because his car broke down.", c: "他只能走路因为车坏了。" },

  // === 买卖与经济 ===
  { b: "How much money do you have in your pocket?", n: "How much cash do you have on you?", c: "你口袋里有多少钱？" },
  { b: "The price of bread has gone up again.", n: "Bread prices have gone up again.", c: "面包又涨价了。" },
  { b: "She went to the store to get some food.", n: "She went to the shop to buy food.", c: "她去了商店买些食物。" },
  { b: "He keeps his money in a box under his bed.", n: "He keeps his cash in a box under his bed.", c: "他把钱藏在床下的盒子里。" },
  { b: "This coat cost more than I had.", n: "This coat cost more than I could afford.", c: "这件外套我买不起。" },

  // === 自然现象与季节 ===
  { b: "The days are getting shorter in the fall.", n: "The days are getting shorter in autumn.", c: "秋天白天变短了。" },
  { b: "A loud noise of thunder came from the sky.", n: "A loud clap of thunder came from the sky.", c: "天空中传来一声雷鸣。" },
  { b: "The sun comes up in the east every morning.", n: "The sun rises in the east every morning.", c: "太阳每天早晨从东方升起。" },
  { b: "Dark clouds are coming from the west.", n: "Dark clouds are rolling in from the west.", c: "乌云正从西边涌来。" },
  { b: "The spring flowers are coming up.", n: "Spring flowers are starting to bloom.", c: "春天的花正开了。" },

  // === 时间 ===
  { b: "Time goes by so fast when you are happy.", n: "Time flies when you're happy.", c: "快乐时时间过得飞快。" },
  { b: "I have not seen him for a long time.", n: "I haven't seen him in ages.", c: "我很久没见到他了。" },
  { b: "The meeting went on for three hours.", n: "The meeting dragged on for three hours.", c: "会议开了三个小时。" },
  { b: "Yesterday was the best day of my life.", n: "Yesterday was the best day of my life.", c: "昨天是我一生中最棒的一天。" },
  { b: "He comes to see us every now and then.", n: "He drops by every now and then.", c: "他偶尔来看我们。" },

  // === 抽象与哲理 ===
  { b: "The best things in life are free.", n: "The best things in life are free.", c: "生命中最好的东西是免费的。" },
  { b: "A good name is better than money.", n: "A good reputation beats money.", c: "好名声胜过金钱。" },
  { b: "Every cloud has a silver line.", n: "Every cloud has a silver lining.", c: "黑暗中总有一线光明。" },
  { b: "It is better to give than to take.", n: "It's better to give than to receive.", c: "给予比索取更好。" },
  { b: "Knowledge is the key to a better life.", n: "Knowledge is the key to a better life.", c: "知识是通向更好生活的钥匙。" },
  { b: "A kind word goes a long way.", n: "A kind word goes a long way.", c: "一句善意的话能走很远。" },

  // === 疑问与思考 ===
  { b: "What is the name of that flower?", n: "What's that flower called?", c: "那朵花叫什么名字？" },
  { b: "Why did he say that to you?", n: "Why did he say that to you?", c: "他为什么对你说那个？" },
  { b: "How do you make this food?", n: "How do you cook this?", c: "这道菜你是怎么做的？" },
  { b: "Where did you put the key?", n: "Where did you put the key?", c: "你把钥匙放哪了？" },
  { b: "When will the train get here?", n: "When does the train arrive?", c: "火车什么时候到？" },
  { b: "Do you have any idea what this is?", n: "Any idea what this is?", c: "你知道这是什么吗？" },
  { b: "Can you give me a hand with this box?", n: "Could you give me a hand with this box?", c: "你能帮我搬一下这个箱子吗？" },
  { b: "Are you coming to the party tonight?", n: "You coming to the party tonight?", c: "你今晚来参加聚会吗？" },

  // === 命令与请求 ===
  { b: "Please give me a glass of water.", n: "Could I have a glass of water please?", c: "请给我一杯水。" },
  { b: "Put the book back on the table.", n: "Put the book back on the table.", c: "把书放回桌子上。" },
  { b: "Do not go out without your coat.", n: "Don't go outside without your coat.", c: "别不穿外套就出去。" },
  { b: "Come and see what I have made.", n: "Come check out what I made.", c: "来看看我做了什么。" },
  { b: "Let me have a look at that picture.", n: "Let me take a look at that picture.", c: "让我看看那张照片。" },
  { b: "Keep your eyes open for the red house.", n: "Watch out for the red house.", c: "留意那栋红色的房子。" },

  // === 更多日常生活 ===
  { b: "He put on his coat because it was cold.", n: "He put his coat on because it was cold.", c: "因为天冷他穿上了外套。" },
  { b: "The door was shut but not locked.", n: "The door was closed but not locked.", c: "门关着但没锁。" },
  { b: "She cut her finger while cooking.", n: "She cut her finger cooking.", c: "她做饭时割伤了手指。" },
  { b: "I am going to take the dog for a walk.", n: "I'm going to walk the dog.", c: "我要带狗去散步。" },
  { b: "He fell off his horse and hurt his leg.", n: "He fell off his horse and injured his leg.", c: "他从马上摔下来伤了腿。" },
  { b: "The baby was crying for its mother.", n: "The baby was crying for its mom.", c: "婴儿哭着找妈妈。" },
  { b: "I have to get up at six tomorrow.", n: "I've got to get up at six tomorrow.", c: "我明天六点就得起床。" },
  { b: "She put her hand on my arm to stop me.", n: "She put her hand on my arm to stop me.", c: "她用手按住我的胳膊阻止我。" },
  { b: "The fish is swimming round and round.", n: "The fish is swimming in circles.", c: "鱼在转圈游。" },
  { b: "He sat down and did not say a word.", n: "He sat down without saying a word.", c: "他坐下来一言不发。" },

  // === 比较与对比 ===
  { b: "This book is better than that one.", n: "This book beats that one.", c: "这本书比那本好。" },
  { b: "She is taller than her brother now.", n: "She's taller than her brother now.", c: "她现在比她哥哥高了。" },
  { b: "The new house is much bigger than the old one.", n: "The new place is way bigger than the old one.", c: "新房子比旧的大多了。" },
  { b: "This is the worst day I have ever had.", n: "This is the worst day ever.", c: "这是我经历过最糟的一天。" },
  { b: "Nothing is more important than your health.", n: "Nothing beats good health.", c: "没有什么比健康更重要。" },

  // === 过去与回忆 ===
  { b: "When I was young, I lived by the sea.", n: "I lived by the sea when I was young.", c: "我年轻时住在海边。" },
  { b: "I remember the day we first met.", n: "I remember the day we first met.", c: "我记得我们初次见面的那天。" },
  { b: "He used to be a teacher at the school.", n: "He used to teach at that school.", c: "他以前是那所学校的老师。" },
  { b: "That was a long time ago.", n: "That was ages ago.", c: "那是很久以前的事了。" },

  // === 假设与条件 ===
  { b: "If it rains, we will stay at home.", n: "If it rains, we'll stay home.", c: "如果下雨我们就待在家。" },
  { b: "If I were you, I would take the offer.", n: "If I were you, I'd take the deal.", c: "我要是你就接受这个提议。" },
  { b: "You can come with us if you like.", n: "You can tag along if you want.", c: "你想的话可以跟我们一起来。" },
  { b: "If you are tired, go to bed early.", n: "If you're tired, hit the sack early.", c: "如果累了就早点睡。" },

  // === 能力与可能 ===
  { b: "I can see the top of the mountain from here.", n: "I can see the mountain peak from here.", c: "我从这里能看到山顶。" },
  { b: "She is able to do the work by herself.", n: "She can handle the work on her own.", c: "她能独立完成这项工作。" },
  { b: "You may be right about that.", n: "You might be right about that.", c: "你说得可能对。" },
  { b: "It is quite possible that he will come.", n: "It's quite possible he'll show up.", c: "他很有可能会来。" },
  { b: "Only a few people have ever seen this bird.", n: "Only a handful of people have seen this bird.", c: "只有极少数人见过这种鸟。" },

  // === 物理动作 ===
  { b: "He took a stone and threw it into the water.", n: "He picked up a stone and tossed it into the water.", c: "他捡起一块石头扔进水里。" },
  { b: "She gave the door a hard push.", n: "She shoved the door hard.", c: "她用力推了门。" },
  { b: "He bent down to pick up the key.", n: "He bent over to grab the key.", c: "他弯腰捡起钥匙。" },
  { b: "The boy kicked the ball over the wall.", n: "The boy booted the ball over the wall.", c: "男孩把球踢过了墙。" },
  { b: "She took a thread and put it through the needle.", n: "She threaded the needle.", c: "她把线穿过了针。" },

  // === 外貌与描述 ===
  { b: "She has long black hair and blue eyes.", n: "She's got long dark hair and blue eyes.", c: "她有一头黑色长发和蓝色眼睛。" },
  { b: "The old house has a red door.", n: "The old house features a red door.", c: "那栋旧房子有扇红色的门。" },
  { b: "He is a tall man with a kind face.", n: "He's a tall guy with a kind face.", c: "他是个高个子，面容和善。" },
  { b: "The room was small but clean and bright.", n: "The room was tiny but clean and bright.", c: "房间虽小但干净明亮。" },

  // === 意外与问题 ===
  { b: "There is a hole in my pocket.", n: "I've got a hole in my pocket.", c: "我口袋破了个洞。" },
  { b: "The light went out suddenly.", n: "The lights went out all of a sudden.", c: "灯突然灭了。" },
  { b: "I have lost my key somewhere.", n: "I've misplaced my key.", c: "我不知把钥匙丢哪了。" },
  { b: "The pen has no more ink in it.", n: "The pen ran out of ink.", c: "笔没墨水了。" },
  { b: "Something is wrong with the engine.", n: "Something's up with the engine.", c: "引擎出了点问题。" },
  { b: "I got a bit of dust in my eye.", n: "I got some dust in my eye.", c: "我眼睛进了些灰尘。" },

  // === 更复杂的复合句 ===
  { b: "I was so tired that I went to bed early.", n: "I was so wiped out I hit the sack early.", c: "我累得早早就睡了。" },
  { b: "He ran so fast that no one could keep up.", n: "He sprinted so fast nobody could keep pace.", c: "他跑得太快没人跟得上。" },
  { b: "She said she would come but she did not.", n: "She'd said she'd come but she didn't.", c: "她说要来却没来。" },
  { b: "The box was so heavy that I could not lift it.", n: "The box was so heavy I couldn't budge it.", c: "箱子重得我搬不动。" },
  { b: "I do not know where he has gone.", n: "I've got no clue where he went.", c: "我不知道他去哪了。" },

  // === 对比与因果关系 ===
  { b: "The sun was hot so we went for a swim.", n: "It was scorching so we went for a dip.", c: "太阳火辣所以我们去游泳了。" },
  { b: "He worked hard and got good money.", n: "He worked hard and earned good money.", c: "他努力工作赚了不少钱。" },
  { b: "She was ill so she did not go to school.", n: "She stayed home from school because she was sick.", c: "她生病了所以没去上学。" },
  { b: "The ice was thin so we did not walk on it.", n: "The ice was too thin to walk on.", c: "冰太薄所以我们没在上面走。" },
  { b: "Because of the rain the game was stopped.", n: "The game was called off due to rain.", c: "因为下雨比赛取消了。" },

  // === 更多日常对话 ===
  { b: "Thank you for the beautiful present.", n: "Thanks so much for the lovely gift.", c: "谢谢你的漂亮礼物。" },
  { b: "I am very pleased to see you again.", n: "So good to see you again.", c: "很高兴再次见到你。" },
  { b: "Please let me know if you need anything.", n: "Let me know if you need anything.", c: "需要什么就告诉我。" },
  { b: "Take care of yourself while I am away.", n: "Look after yourself while I'm gone.", c: "我不在时照顾好自己。" },
  { b: "I hope you have a good journey.", n: "Hope you have a great trip.", c: "祝你旅途愉快。" },

  // === 故事性句子 ===
  { b: "Once upon a time there was a small house by the sea.", n: "Once upon a time a little cottage stood by the sea.", c: "从前海边有座小房子。" },
  { b: "The old man sat by the fire and told a story.", n: "The old man sat fireside and spun a tale.", c: "老人坐在火边讲故事。" },
  { b: "A strange thing took place in our town last night.", n: "Something weird happened in town last night.", c: "昨晚镇上发生了一件怪事。" },
  { b: "The boy went into the dark wood all by himself.", n: "The boy ventured into the dark woods alone.", c: "男孩独自走进了黑暗的树林。" },

  // === 实用表达 ===
  { b: "That is a good idea.", n: "That's a great idea.", c: "那是个好主意。" },
  { b: "I am not quite ready yet.", n: "I'm not quite ready yet.", c: "我还没完全准备好。" },
  { b: "It does not make sense to me.", n: "It doesn't add up.", c: "这对我来说说不通。" },
  { b: "There is no need to be in such a hurry.", n: "No need to rush.", c: "没必要这么急。" },
  { b: "I will do my best to help you.", n: "I'll do my utmost to help.", c: "我会尽力帮你。" },
  { b: "That is enough for today.", n: "That'll do for today.", c: "今天差不多了。" },
  { b: "This is the place where I grew up.", n: "This is where I grew up.", c: "这是我长大的地方。" },
  { b: "Keep going straight till you see the church.", n: "Go straight until you spot the church.", c: "一直走直到看见教堂。" },

  // === 身体与健康 ===
  { b: "He has a strong body and a clear mind.", n: "He's got a strong body and a sharp mind.", c: "他身体强壮头脑清醒。" },
  { b: "She broke her arm when she was a child.", n: "She broke her arm as a kid.", c: "她小时候摔断过胳膊。" },
  { b: "The wound on his hand is getting better.", n: "The cut on his hand is healing up.", c: "他手上的伤口正在愈合。" },
  { b: "My tooth has been giving me pain all day.", n: "My tooth's been hurting all day.", c: "我的牙疼了一整天。" },

  // === 动物与自然 ===
  { b: "A snake was hiding in the long grass.", n: "A snake was lurking in the tall grass.", c: "一条蛇藏在高草丛中。" },
  { b: "The horse jumped over the low wall.", n: "The horse leaped over the low wall.", c: "马跳过了矮墙。" },
  { b: "Sheep were eating the green grass on the hill.", n: "Sheep grazed on the green hillside.", c: "羊在山坡上吃着青草。" },
  { b: "The monkey took the food from my hand.", n: "The monkey snatched the food right out of my hand.", c: "猴子从我手里拿走了食物。" },
  { b: "A bee was flying from flower to flower.", n: "A bee flitted from bloom to bloom.", c: "蜜蜂在花间飞来飞去。" },
  { b: "The fish came up to the top of the water.", n: "The fish surfaced to the top.", c: "鱼浮到了水面上。" },
  { b: "We saw a wild pig in the wood.", n: "We spotted a wild boar in the woods.", c: "我们在树林里看见一头野猪。" },
  { b: "The bird made a nest in the tree by our house.", n: "A bird built a nest in the tree near our house.", c: "鸟儿在我们房子旁的树上筑了巢。" },
  { b: "An ant is carrying food back to its hole.", n: "An ant is hauling food back to its nest.", c: "一只蚂蚁正把食物搬回洞里。" },

  // === 天气与环境 ===
  { b: "The sky is getting dark—a storm is coming.", n: "The sky's darkening—a storm's brewing.", c: "天色暗下来了——暴风雨要来了。" },
  { b: "In winter the lake is covered with ice.", n: "In winter the lake freezes over.", c: "冬天湖面结冰。" },
  { b: "The wind was so strong it took my hat off.", n: "The wind was so fierce it blew my hat clean off.", c: "风大得吹掉了我的帽子。" },
  { b: "After the rain, a beautiful rainbow came out.", n: "A gorgeous rainbow appeared after the rain.", c: "雨后出现了美丽的彩虹。" },
  { b: "The air is fresh and clean in the country.", n: "The air is crisp and clean in the countryside.", c: "乡下的空气清新干净。" },

  // === 创意与艺术 ===
  { b: "She has a beautiful voice—I love to hear her sing.", n: "She's got a stunning voice—I adore hearing her sing.", c: "她的嗓音很美——我喜欢听她唱歌。" },
  { b: "He made a picture of the sea with blue paint.", n: "He painted a seascape in blue.", c: "他用蓝色颜料画了一幅海景。" },
  { b: "The music was so sweet it made me cry.", n: "The music was so beautiful it moved me to tears.", c: "音乐美得让我落泪。" },
  { b: "She put her heart into every word of the song.", n: "She poured her heart into every lyric.", c: "她把心倾注在每句歌词里。" },

  // === 娱乐与休闲 ===
  { b: "We had a great time at the party last night.", n: "We had a blast at the party last night.", c: "昨晚的聚会我们玩得很开心。" },
  { b: "Let us go for a walk by the river.", n: "Let's take a stroll along the river.", c: "我们去河边散个步吧。" },
  { b: "He took a picture of the beautiful sunset.", n: "He snapped a photo of the gorgeous sunset.", c: "他拍下了美丽的日落。" },
  { b: "The children were laughing and running about.", n: "The kids were dashing around laughing.", c: "孩子们笑着跑来跑去。" },

  // === 更多实用句 ===
  { b: "I will see you at the same time tomorrow.", n: "Same time tomorrow then.", c: "明天同一时间见。" },
  { b: "It was good to hear your voice again.", n: "It was nice hearing your voice again.", c: "再次听到你的声音真好。" },
  { b: "She looked at me with a strange look on her face.", n: "She gave me a weird look.", c: "她用奇怪的表情看着我。" },
  { b: "He put the glass down on the table and left.", n: "He set the glass down and walked out.", c: "他把杯子放在桌上离开了。" },
  { b: "I do not have the answer to your question.", n: "I don't have an answer to that.", c: "我回答不了你的问题。" },
  { b: "The road to the town goes through a thick wood.", n: "The road to town cuts through a dense forest.", c: "去镇上的路穿过一片密林。" },
  { b: "She said nothing but her eyes said everything.", n: "She stayed silent but her eyes spoke volumes.", c: "她一言不发但眼神说明了一切。" },
  { b: "That is the very thing I was looking for.", n: "That's exactly what I was hunting for.", c: "这正是我在找的东西。" },
  { b: "He is not the sort of person to give up easily.", n: "He's not the type to throw in the towel.", c: "他不是那种轻易放弃的人。" },
  { b: "I have never seen anything so beautiful in my life.", n: "I've never laid eyes on anything so gorgeous.", c: "我这辈子没见过这么美的东西。" },
  { b: "The only way out is through the front door.", n: "The only exit is the front door.", c: "唯一的出路是前门。" },
  { b: "Keep this between us—do not tell anyone.", n: "Keep this between us—don't breathe a word.", c: "这事只有我们知道——别告诉任何人。" },
  { b: "A little learning is a dangerous thing.", n: "A little knowledge is a dangerous thing.", c: "一知半解是件危险的事。" },
  { b: "Actions speak louder than words.", n: "Actions speak louder than words.", c: "行动胜于言语。" },
  { b: "Where there is smoke, there is fire.", n: "Where there's smoke, there's fire.", c: "无风不起浪。" },
  { b: "Do not put all your eggs in one basket.", n: "Don't put all your eggs in one basket.", c: "不要把所有鸡蛋放在一个篮子里。" },
  { b: "The early bird gets the worm.", n: "The early bird catches the worm.", c: "早起的鸟儿有虫吃。" },
  { b: "You cannot have your cake and eat it too.", n: "You can't have your cake and eat it.", c: "鱼和熊掌不可兼得。" },
  { b: "It is no use crying over spilled milk.", n: "No point crying over spilled milk.", c: "覆水难收。" },
  { b: "One good turn deserves another.", n: "One good turn deserves another.", c: "善有善报。" },
];

// ============================================================
// 处理句子，提取单词ID
// ============================================================

function extractWordIds(text) {
  const ids = [];
  const cleanText = text.toLowerCase().replace(/[.,!?;:'"()\-—]/g, ' ');
  const textWords = cleanText.split(/\s+/).filter(w => w.length > 0);

  // 先匹配多词短语
  for (const word of textWords) {
    const w = wordMap[word];
    if (w && !ids.includes(w.id)) {
      ids.push(w.id);
    }
  }

  // 尝试匹配词根（去掉 s, ed, ing, er, est, ly 等）
  for (const tw of textWords) {
    if (wordMap[tw]) continue; // 已经匹配到了
    for (const suffix of ['s', 'ed', 'ing', 'er', 'est', 'ly', 'ness', 'ment', 'ful', 'less']) {
      if (tw.endsWith(suffix)) {
        const root = tw.slice(0, -suffix.length);
        if (wordMap[root] && !ids.includes(wordMap[root].id)) {
          ids.push(wordMap[root].id);
          break;
        }
        if (suffix === 'ed' && tw.endsWith('ied')) {
          const root2 = tw.slice(0, -3) + 'y';
          if (wordMap[root2] && !ids.includes(wordMap[root2].id)) {
            ids.push(wordMap[root2].id);
            break;
          }
        }
      }
    }
  }

  return ids;
}

const sentences = [];
const seen = new Set();

for (const s of rawSentences) {
  if (seen.has(s.b)) continue;
  seen.add(s.b);

  sentences.push({
    id: sentences.length + 1,
    basic: s.b,
    natural: s.n,
    chinese: s.c,
    words: extractWordIds(s.b),
  });
}

console.log(`Generated ${sentences.length} hand-crafted sentences`);

// 检查是否需要补充更多
if (sentences.length < 3000) {
  // 使用智能模板补充
  // 这些模板需要更自然地构造
  const supplementTemplates = [];

  // 好的动词短语
  const vp = [
    ['give', '给'], ['take', '拿'], ['make', '做'], ['get', '得到'], ['put', '放'],
    ['see', '看'], ['send', '送'], ['keep', '保持'], ['let', '让'], ['do', '做'],
    ['have', '有'], ['come', '来'], ['go', '去'], ['say', '说'], ['look at', '看'],
    ['put on', '穿上'], ['take off', '脱掉'], ['go out', '出去'], ['come in', '进来'],
    ['get up', '起来'], ['give up', '放弃'], ['put down', '放下'], ['take out', '取出'],
  ];

  const subjects = [
    ['he', '他'], ['she', '她'], ['they', '他们'], ['we', '我们'],
    ['the boy', '男孩'], ['the girl', '女孩'], ['the man', '男人'], ['the woman', '女人'],
    ['the old man', '老人'], ['the young woman', '年轻女子'],
    ['the teacher', '老师'], ['the doctor', '医生'], ['the child', '孩子'],
    ['my friend', '我的朋友'], ['his mother', '他的母亲'], ['her father', '她的父亲'],
  ];

  const objects = [
    ['the book', '书'], ['the box', '盒子'], ['the key', '钥匙'], ['the letter', '信'],
    ['the door', '门'], ['the window', '窗户'], ['the cup', '杯子'], ['the bag', '包'],
    ['the money', '钱'], ['the food', '食物'], ['the water', '水'], ['the flower', '花'],
    ['the picture', '画'], ['the paper', '纸'], ['the pen', '笔'], ['the knife', '刀'],
    ['the bread', '面包'], ['the coat', '外套'], ['the hat', '帽子'], ['the ball', '球'],
    ['the stone', '石头'], ['the stick', '棍子'], ['the apple', '苹果'], ['the orange', '橙子'],
    ['the cat', '猫'], ['the dog', '狗'], ['the bird', '鸟'], ['the fish', '鱼'],
  ];

  const places = [
    ['on the table', '在桌上'], ['on the floor', '在地板上'], ['in the box', '在盒子里'],
    ['in the room', '在房间里'], ['in the garden', '在花园里'], ['by the door', '在门边'],
    ['by the window', '在窗边'], ['under the bed', '在床下'], ['on the shelf', '在架子上'],
    ['in his pocket', '在他口袋里'], ['in her hand', '在她手里'], ['on the wall', '在墙上'],
  ];

  const times = [
    ['this morning', '今天早上'], ['yesterday', '昨天'], ['last night', '昨晚'],
    ['a minute ago', '一分钟前'], ['an hour ago', '一小时前'], ['just now', '刚才'],
    ['at night', '在夜里'], ['in the morning', '在早上'], ['after work', '下班后'],
    ['before the meeting', '开会前'], ['after the rain stopped', '雨停后'],
  ];

  const reasons = [
    ['because it was too old', '因为它太旧了'],
    ['because he was tired', '因为他累了'],
    ['because she was in a hurry', '因为她在赶时间'],
    ['because the sun was going down', '因为太阳下山了'],
    ['because they were hungry', '因为他们饿了'],
    ['because it was broken', '因为它坏了'],
    ['because it started to rain', '因为开始下雨了'],
  ];

  const adjectives = [
    ['good', '好的'], ['bad', '坏的'], ['new', '新的'], ['old', '旧的'],
    ['big', '大的'], ['small', '小的'], ['long', '长的'], ['short', '短的'],
    ['warm', '暖的'], ['cold', '冷的'], ['hot', '热的'], ['bright', '亮的'],
    ['dark', '暗的'], ['clean', '干净的'], ['dirty', '脏的'], ['hard', '硬的'],
    ['soft', '软的'], ['quick', '快的'], ['slow', '慢的'], ['strong', '强壮的'],
    ['thin', '薄的'], ['thick', '厚的'], ['full', '满的'], ['open', '开的'],
    ['quiet', '安静的'], ['beautiful', '美丽的'], ['strange', '奇怪的'],
    ['sweet', '甜的'], ['red', '红色的'], ['blue', '蓝色的'], ['green', '绿色的'],
    ['happy', '快乐的'], ['sad', '悲伤的'], ['tired', '累的'], ['angry', '生气的'],
    ['free', '自由的'], ['poor', '穷的'], ['rich', '富的'], ['able', '有能力的'],
  ];

  let templateCount = 0;
  const maxSupplement = 3500 - sentences.length;

  // 模板1: [主语] [动词] [宾语] [地点]
  for (const [subj, subjCh] of subjects) {
    for (const [verb, verbCh] of vp) {
      for (const [obj, objCh] of objects) {
        for (const [place, placeCh] of places) {
          if (templateCount >= maxSupplement) break;
          const basic = `${cap(subj)} ${verb} ${obj} ${place}.`;
          if (seen.has(basic)) continue;
          seen.add(basic);
          sentences.push({
            id: sentences.length + 1,
            basic,
            natural: basic,
            chinese: `${subjCh}把${objCh}${verbCh}${placeCh}。`,
            words: extractWordIds(basic),
          });
          templateCount++;
        }
      }
    }
  }

  // 模板2: [主语] [动词] [宾语] [时间]
  for (const [subj, subjCh] of subjects) {
    for (const [verb, verbCh] of vp.slice(0, 10)) {
      for (const [obj, objCh] of objects) {
        for (const [time, timeCh] of times) {
          if (templateCount >= maxSupplement) break;
          const basic = `${cap(subj)} ${verb} ${obj} ${time}.`;
          if (seen.has(basic)) continue;
          seen.add(basic);
          sentences.push({
            id: sentences.length + 1,
            basic,
            natural: basic,
            chinese: `${subjCh}${timeCh}${verbCh}了${objCh}。`,
            words: extractWordIds(basic),
          });
          templateCount++;
        }
      }
    }
  }

  // 模板3: [主语] [动词] [宾语] [原因]
  for (const [subj, subjCh] of subjects.slice(0, 8)) {
    for (const [verb, verbCh] of vp.slice(0, 6)) {
      for (const [obj, objCh] of objects.slice(0, 10)) {
        for (const [reason, reasonCh] of reasons) {
          if (templateCount >= maxSupplement) break;
          const basic = `${cap(subj)} ${verb} ${obj} ${reason}.`;
          if (seen.has(basic)) continue;
          seen.add(basic);
          sentences.push({
            id: sentences.length + 1,
            basic,
            natural: basic,
            chinese: `${subjCh}${reasonCh}，${verbCh}了${objCh}。`,
            words: extractWordIds(basic),
          });
          templateCount++;
        }
      }
    }
  }

  // 模板4: This is a [adj] [thing]
  for (const [adj, adjCh] of adjectives) {
    for (const [obj, objCh] of objects) {
      if (templateCount >= maxSupplement) break;
      const basic = `This is a ${adj} ${obj.replace('the ', '')}.`;
      if (seen.has(basic)) continue;
      seen.add(basic);
      sentences.push({
        id: sentences.length + 1,
        basic,
        natural: basic,
        chinese: `这是一个${adjCh}的${objCh}。`,
        words: extractWordIds(basic),
      });
      templateCount++;
    }
  }

  // 模板5: I can [verb] the [thing]
  for (const [verb, verbCh] of vp.slice(0, 10)) {
    for (const [obj, objCh] of objects) {
      if (templateCount >= maxSupplement) break;
      const basic = `I can ${verb} ${obj}.`;
      if (seen.has(basic)) continue;
      seen.add(basic);
      sentences.push({
        id: sentences.length + 1,
        basic,
        natural: basic,
        chinese: `我能${verbCh}${objCh}。`,
        words: extractWordIds(basic),
      });
      templateCount++;
    }
  }

  // 模板6: [主语] is/was/are [adj]
  for (const [subj, subjCh] of subjects) {
    for (const [adj, adjCh] of adjectives) {
      if (templateCount >= maxSupplement) break;
      const beVerb = ['they', 'we'].includes(subj) || subj.endsWith('n') ? 'are'
        : subj === 'i' ? 'am'
        : ['he', 'she', 'the boy', 'the girl', 'the man', 'the woman'].includes(subj) ? 'is' : 'is';
      const basic = `${cap(subj)} ${beVerb} ${adj}.`;
      if (seen.has(basic)) continue;
      seen.add(basic);
      sentences.push({
        id: sentences.length + 1,
        basic,
        natural: basic,
        chinese: `${subjCh}很${adjCh}。`,
        words: extractWordIds(basic),
      });
      templateCount++;
    }
  }

  // 模板7: 疑问句
  const questionSubjects = subjects.slice(0, 12);
  const questionVerbs = vp.slice(0, 12);
  for (const [subj, subjCh] of questionSubjects) {
    for (const [verb, verbCh] of questionVerbs) {
      for (const [obj, objCh] of objects.slice(0, 12)) {
        if (templateCount >= maxSupplement) break;
        const doVerb = ['he', 'she', 'the boy', 'the girl'].includes(subj) ? 'Does' : 'Do';
        let basic;
        if (doVerb === 'Does') {
          basic = `${doVerb} ${subj} ${verb} ${obj}?`;
        } else {
          basic = `${doVerb} ${subj} ${verb} ${obj}?`;
        }
        if (seen.has(basic)) continue;
        seen.add(basic);
        sentences.push({
          id: sentences.length + 1,
          basic,
          natural: basic,
          chinese: `${subjCh}${verbCh}${objCh}吗？`,
          words: extractWordIds(basic),
        });
        templateCount++;
      }
    }
  }

  console.log(`Added ${templateCount} template-based sentences`);
}

// ============================================================
// 写入文件
// ============================================================

const finalSentences = sentences.slice(0, 4200).map((s, idx) => ({
  ...s,
  id: idx + 1,
}));

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'assets', 'sentences.json'),
  JSON.stringify(finalSentences, null, 2),
  'utf-8'
);

console.log(`✅ Written ${finalSentences.length} sentences to sentences.json`);
console.log(`   Hand-crafted: ${rawSentences.length}`);
console.log(`   Template-generated: ${finalSentences.length - rawSentences.length}`);

function cap(s) {
  if (s === 'i') return 'I';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
