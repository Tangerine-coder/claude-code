const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const db = new Database('data/ecommerce.db');
db.pragma('foreign_keys = ON');

// 1) wipe old reviews
const old = db.prepare('SELECT COUNT(*) c FROM reviews').get().c;
db.prepare('DELETE FROM reviews').run();
console.log('删除旧评论:', old);

// 2) ensure extra users exist (keep existing 张三/王五/肖筱, add 李四/小美/阿强)
const users = [
  ['李四', 'lisi@example.com'],
  ['小美', 'xiaomei@example.com'],
  ['阿强', 'aqiang@example.com'],
];
for (const [name, email] of users) {
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (!exists) {
    const { v4: uid } = require('uuid');
    db.prepare("INSERT INTO users (id, username, email, password_hash, role, status) VALUES (?,?,?,?,'customer','active')")
      .run(uid(), name, email, '$2a$10$abcdefghijklmnopqrstuv'); // dummy hash, cannot login
  }
}
const uidOf = name => db.prepare('SELECT id FROM users WHERE username = ?').get(name).id;

// 3) product id by name
const pid = name => db.prepare('SELECT id FROM products WHERE name = ?').get(name).id;
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString();

// 4) curated reviews: [productName, userName, rating, content, daysAgo]
const reviews = [
  // --- 手机 ---
  ['NovaPhone 15 Pro - 256GB', '张三', 5, '钛金属边框手感一流，拍照夜拍特别干净，6.7寸屏看视频很爽。用了两周没发现毛病。', 12],
  ['NovaPhone 15 Pro - 256GB', '小美', 4, '系统流畅，拍照色彩讨喜。就是续航一天半需要充一次，重度使用勉强一天。', 8],
  ['NovaPhone 15 Pro - 256GB', '阿强', 5, '玩游戏完全不卡，信号也好。这个价位能买到这配置很值。', 3],
  ['NovaPhone 15 - 128GB', '王五', 5, '性价比很高，日常用很流畅，屏幕清晰。双摄拍人像也不错。', 15],
  ['NovaPhone 15 - 128GB', '李四', 4, '给家里老人买的，操作简单不复杂，电池也耐用。', 6],

  // --- 笔记本 ---
  ['NovaBook Pro 16英寸笔记本电脑', '阿强', 5, '屏幕素质绝了，剪视频渲染很快，风扇噪音控制得很好。', 10],
  ['NovaBook Pro 16英寸笔记本电脑', '张三', 4, '性能强劲，做工扎实。就是接口偏少，需要买扩展坞。', 5],
  ['NovaBook Air 13英寸笔记本电脑', '小美', 5, '超级轻薄，通勤背着没负担，无风扇安静，办公续航一天没问题。', 20],
  ['NovaBook Air 13英寸笔记本电脑', '李四', 4, '重量轻颜值高，屏幕边框很窄。性能日常办公够用。', 9],

  // --- 音频 ---
  ['NovaPods Pro 无线耳机', '王五', 5, '降噪效果惊艳，坐地铁一开世界都安静了。音质通透，佩戴也舒服。', 14],
  ['NovaPods Pro 无线耳机', '小美', 5, '通话清晰，入耳检测灵敏。充电盒很小巧，放包里很方便。', 7],
  ['Studio Pro 头戴式耳机', '阿强', 4, '低音有弹性，听歌氛围感强。耳罩软，戴久了不夹头。', 11],
  ['Studio Pro 头戴式耳机', '张三', 5, '录音室级别音质，人声还原真实，配的线也能插电脑用。', 4],

  // --- 手表 ---
  ['NovaWatch Pro 智能手表', '李四', 5, '心率血氧测得很准，和医院体检数据基本一致。续航真的能撑两周。', 13],
  ['NovaWatch Pro 智能手表', '小美', 5, '睡眠分析很详细，表带亲肤不闷汗。表盘自定义选择多。', 6],

  // --- 男装 ---
  ['经典版型纯棉牛津纺衬衫', '王五', 5, '面料挺括有质感，版型标准，洗了几次没变形没起球。', 18],
  ['经典版型纯棉牛津纺衬衫', '李四', 4, '白衬衫百搭，透气性好。就是领口稍紧，建议买大半码。', 9],
  ['修身弹力斜纹裤', '阿强', 4, '版型利落显瘦，弹力足蹲下不勒。颜色也耐看。', 16],
  ['美利奴羊毛V领毛衣', '张三', 5, '贴身穿也不扎，很软很暖。V领显精神，质感高级。', 8],
  ['轻薄休闲夹克', '王五', 5, '春秋穿刚好，防风防小雨。版型好看不臃肿，口袋够多。', 5],

  // --- 女装 ---
  ['碎花印花中长连衣裙', '小美', 5, '花色很温柔，雪纺垂感好，显瘦显气质。腰部系带设计很贴心。', 10],
  ['碎花印花中长连衣裙', '张三', 4, '给老婆买的，上身效果不错，尺码标准。', 3],
  ['高腰阔腿裤', '肖筱', 5, '高腰设计显腿长，垂感很好不皱，通勤穿很显气质。', 12],
  ['羊绒混纺开衫', '小美', 4, '手感软糯，颜色百搭，叠穿很好看。就是洗后需要注意打理。', 7],
  ['真丝系带衬衫', '肖筱', 5, '真丝质感一流，垂顺有光泽，系带设计很优雅，值得入手。', 9],

  // --- 童装 ---
  ['有机棉儿童睡衣套装', '张三', 5, '纯棉很柔软，儿子穿着说不痒，洗了也不缩水。', 14],
  ['儿童牛仔背带裤', '李四', 5, '料子结实耐穿，小孩天天爬上爬下也没坏。肩带可调能穿很久。', 11],

  // --- 家具 ---
  ['中古现代风沙发', '王五', 5, '祖母绿色太高级了，坐垫软硬适中，靠背支撑好，客厅颜值担当。', 17],
  ['中古现代风沙发', '小美', 4, '胡桃木腿很精致，整体很有质感。就是需要定期打理绒面。', 8],
  ['极简升降桌', '阿强', 5, '升降很平稳，噪音小，桌面够大。久坐办公党强烈推荐。', 13],
  ['天鹅绒休闲扶手椅', '肖筱', 4, '颜值高，坐感舒适，金色腿很亮眼。放在阳台角落很出片。', 6],

  // --- 装饰 ---
  ['手工编织挂毯', '小美', 5, '手工质感很好，棉绳编织得很密，挂墙上立刻有波西米亚风。', 15],
  ['香薰大豆蜡烛套装', '肖筱', 5, '香草檀香太好闻了，扩香很快，客厅点了半小时整个空间都香。', 10],
  ['北欧风陶瓷花瓶', '王五', 5, '哑光釉面质感高级，插干花特别好看，摆哪都合适。', 7],
  ['北欧风落地灯', '李四', 4, '灯光温暖不刺眼，三档亮度够用，实木感很日式。', 12],

  // --- 厨房 ---
  ['专业厨师刀具套装', '阿强', 5, '锋利度没得说，切番茄都不出水。刀架很稳，整套很有分量感。', 9],
  ['专业厨师刀具套装', '张三', 4, '手感舒服，用着顺手。就是刀需要定期保养磨刀。', 4],
];

const ins = db.prepare('INSERT INTO reviews (id, product_id, user_id, order_id, rating, content, images, is_approved, created_at) VALUES (?,?,?,NULL,?,?,?,1,?)');
let ok = 0, fail = 0;
for (const [pname, uname, rating, content, days] of reviews) {
  try {
    const p = db.prepare('SELECT id FROM products WHERE name = ?').get(pname);
    if (!p) { console.log('跳过(商品不存在):', pname); fail++; continue; }
    ins.run(uuid(), p.id, uidOf(uname), rating, content, '[]', daysAgo(days));
    ok++;
  } catch (e) { console.log('失败:', pname, e.message); fail++; }
}
console.log('成功写入评论:', ok, '失败:', fail);
console.log('评论总数:', db.prepare('SELECT COUNT(*) c FROM reviews').get().c);
db.close();
