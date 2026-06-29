import type Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { generateOrderNo } from './utils';

export function seedDatabase(db: Database.Database) {
  const salt = bcrypt.genSaltSync(10);

  // ========== Users ==========
  const adminId = uuid();
  const userId = uuid();

  const insertUser = db.prepare(
    `INSERT INTO users (id, username, email, password_hash, phone, avatar, role, status, last_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  );

  insertUser.run(adminId, 'admin', 'admin@novamart.com', bcrypt.hashSync('xiao123', salt), '13800000000', '', 'admin', 'active');
  insertUser.run(userId, '张三', 'user@example.com', bcrypt.hashSync('user123', salt), '13800138001', '', 'customer', 'active');

  // ========== Categories ==========
  const catClothing = uuid();
  const catMens = uuid();
  const catWomens = uuid();
  const catKids = uuid();
  const catElectronics = uuid();
  const catPhones = uuid();
  const catLaptops = uuid();
  const catAudio = uuid();
  const catHome = uuid();
  const catFurniture = uuid();
  const catDecor = uuid();
  const catKitchen = uuid();

  const insertCat = db.prepare(
    `INSERT INTO categories (id, name, slug, parent_id, description, image, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  );

  insertCat.run(catClothing, '服装', 'clothing', null, '四季时尚服饰', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 1);
  insertCat.run(catMens, '男装', 'mens-clothing', catClothing, '时尚男装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 1);
  insertCat.run(catWomens, '女装', 'womens-clothing', catClothing, '优雅女装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 2);
  insertCat.run(catKids, '童装', 'kids-clothing', catClothing, '舒适童装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 3);

  insertCat.run(catElectronics, '电子产品', 'electronics', null, '前沿科技数码产品', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 2);
  insertCat.run(catPhones, '智能手机', 'smartphones', catElectronics, '最新款智能手机', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 1);
  insertCat.run(catLaptops, '笔记本电脑', 'laptops', catElectronics, '高性能笔记本设备', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 2);
  insertCat.run(catAudio, '音频设备', 'audio', catElectronics, '高端音响设备', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 3);

  insertCat.run(catHome, '家居生活', 'home-living', null, '精美家居好物', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 3);
  insertCat.run(catFurniture, '家具', 'furniture', catHome, '现代家具设计', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 1);
  insertCat.run(catDecor, '装饰', 'decor', catHome, '艺术家居装饰品', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 2);
  insertCat.run(catKitchen, '厨房用品', 'kitchen', catHome, '厨房必备与创意小家电', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 3);

  // ========== Products ==========
  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, slug, description, price, original_price, stock, category_id, brand, images, specs, tags, is_featured, is_new, is_recommended, sales_count, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`
  );

  const products = [
    // Clothing - Men's
    {
      id: uuid(), name: '经典版型纯棉牛津纺衬衫', slug: 'classic-fit-cotton-oxford-shirt',
      desc: '<p>经典永不过时的必备单品，采用100%有机棉精制而成。这款牛津纺衬衫配有纽扣领、胸袋和宽松经典版型，无论是塞进裤腰还是随意穿着都同样出色。</p><p>无论是休闲周五还是周末出游，都是理想之选。</p>',
      price: 0, originalPrice: null, stock: 150, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '100% 有机棉' }, { name: '版型', value: '经典版型' }, { name: '领型', value: '纽扣领' }, { name: '洗涤', value: '可机洗' }]),
      tags: '新品,有机,畅销', featured: 1, isNew: 1, recommended: 1, sales: 2340
    },
    {
      id: uuid(), name: '修身弹力斜纹裤', slug: 'slim-fit-stretch-chinos',
      desc: '<p>现代修身版型斜纹裤，含2%弹力纤维，全天舒适自如。中腰设计与锥形裤腿，打造利落轮廓。</p>',
      price: 0, originalPrice: null, stock: 200, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '98% 棉, 2% 弹力纤维' }, { name: '版型', value: '修身版型' }, { name: '腰型', value: '中腰' }]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 1890
    },
    {
      id: uuid(), name: '美利奴羊毛V领毛衣', slug: 'merino-wool-v-neck-sweater',
      desc: '<p>奢华柔软的美利奴羊毛毛衣，经典V领设计。具有温度调节功能，天然抗异味。</p>',
      price: 0, originalPrice: null, stock: 80, catId: catMens, brand: '纯羊毛',
      images: JSON.stringify(['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '100% 美利奴羊毛' }, { name: '厚度', value: '中等针数' }, { name: '领型', value: 'V领' }]),
      tags: '高端', featured: 1, isNew: 0, recommended: 0, sales: 567
    },

    // Clothing - Women's
    {
      id: uuid(), name: '碎花印花中长连衣裙', slug: 'floral-print-midi-dress',
      desc: '<p>惊艳的中长连衣裙，采用手绘风格碎花印花轻质雪纺面料。围裹式廓形适合各种体型，配有可调节腰部系带。</p>',
      price: 0, originalPrice: null, stock: 120, catId: catWomens, brand: '花开物语',
      images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '雪纺' }, { name: '长度', value: '中长款' }, { name: '款式', value: '围裹式连衣裙' }, { name: '季节', value: '春夏' }]),
      tags: '新品,春季', featured: 1, isNew: 1, recommended: 1, sales: 1456
    },
    {
      id: uuid(), name: '高腰阔腿裤', slug: 'high-waist-wide-leg-trousers',
      desc: '<p>精致的高腰阔腿裤，采用垂感极佳的绉纱面料，抗皱不褪色，展现优雅气质。</p>',
      price: 0, originalPrice: null, stock: 95, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '涤纶绉纱' }, { name: '腰型', value: '高腰' }, { name: '裤型', value: '阔腿' }]),
      tags: '通勤,经典', featured: 0, isNew: 0, recommended: 1, sales: 890
    },
    {
      id: uuid(), name: '羊绒混纺开衫', slug: 'cashmere-blend-cardigan',
      desc: '<p>用这款羊绒混纺开衫将自己包裹在奢华之中。配有珍珠母贝纽扣和罗纹袖口，是完美的叠穿单品。</p>',
      price: 0, originalPrice: null, stock: 45, catId: catWomens, brand: '纯羊毛',
      images: JSON.stringify(['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '70% 羊毛, 30% 羊绒' }, { name: '闭合方式', value: '前开扣' }, { name: '洗涤', value: '仅限干洗' }]),
      tags: '高端,冬季', featured: 1, isNew: 0, recommended: 0, sales: 342
    },

    // Clothing - Kids'
    {
      id: uuid(), name: '有机棉儿童睡衣套装', slug: 'organic-cotton-pj-set',
      desc: '<p>可爱两件套睡衣，采用GOTS认证有机棉制成。超级柔软、透气，不含任何有害化学物质。即使是敏感肌肤的宝宝也能安心穿着。</p>',
      price: 0, originalPrice: null, stock: 180, catId: catKids, brand: '小诺瓦',
      images: JSON.stringify(['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: 'GOTS 有机棉' }, { name: '套装', value: '上衣 + 裤子' }, { name: '适用年龄', value: '2-8 岁' }]),
      tags: '有机,新品', featured: 0, isNew: 1, recommended: 1, sales: 2100
    },
    {
      id: uuid(), name: '儿童牛仔背带裤', slug: 'kids-denim-overalls',
      desc: '<p>专为好动儿童设计的耐用可爱牛仔背带裤。配有可调节肩带，适应孩子的成长，膝盖部位加固处理，更加耐穿。</p>',
      price: 0, originalPrice: null, stock: 140, catId: catKids, brand: '小诺瓦',
      images: JSON.stringify(['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '棉质牛仔布' }, { name: '闭合方式', value: '纽扣肩带' }, { name: '口袋', value: '5 个口袋' }]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 678
    },

    // Electronics - Smartphones
    {
      id: uuid(), name: 'NovaPhone 15 Pro - 256GB', slug: 'novaphone-15-pro-256gb',
      desc: '<p>NovaPhone 15 Pro 配备惊艳的6.7英寸OLED显示屏、A18 Pro芯片以及4800万像素主摄的专业级相机系统。全天候续航与钛金属机身设计。</p>',
      price: 0, originalPrice: null, stock: 50, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '6.7英寸 OLED 120Hz' }, { name: '芯片', value: 'A18 Pro' }, { name: '摄像头', value: '4800万 + 1200万 + 1200万像素' }, { name: '存储', value: '256GB' }, { name: '电池', value: '4500mAh' }]),
      tags: '热销,高端', featured: 1, isNew: 1, recommended: 1, sales: 5600
    },
    {
      id: uuid(), name: 'NovaPhone 15 - 128GB', slug: 'novaphone-15-128gb',
      desc: '<p>NovaPhone 15 以亲民价格带来旗舰级性能。配备6.1英寸Super Retina显示屏、A17芯片和先进的双摄系统。</p>',
      price: 0, originalPrice: null, stock: 75, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '6.1英寸 Super Retina' }, { name: '芯片', value: 'A17' }, { name: '摄像头', value: '4800万 + 1200万像素' }, { name: '存储', value: '128GB' }]),
      tags: '热销', featured: 1, isNew: 1, recommended: 1, sales: 7800
    },

    // Electronics - Laptops
    {
      id: uuid(), name: 'NovaBook Pro 16英寸笔记本电脑', slug: 'novabook-pro-16-laptop',
      desc: '<p>强劲性能与便携兼具，NovaBook Pro 搭载 M4 Pro 芯片，配备惊艳的16英寸 Liquid Retina XDR 显示屏，续航长达22小时。创意专业人士的理想之选。</p>',
      price: 0, originalPrice: null, stock: 30, catId: catLaptops, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '16英寸 Liquid Retina XDR' }, { name: '芯片', value: 'M4 Pro' }, { name: '内存', value: '18GB' }, { name: '存储', value: '512GB 固态硬盘' }, { name: '续航', value: '最长22小时' }]),
      tags: '高端,热销', featured: 1, isNew: 1, recommended: 1, sales: 3400
    },
    {
      id: uuid(), name: 'NovaBook Air 13英寸笔记本电脑', slug: 'novabook-air-13-laptop',
      desc: '<p>极致轻薄，NovaBook Air 是终极日常笔记本。搭载 M4 芯片，配备13.6英寸 Liquid Retina 显示屏，无风扇设计实现静音运行。</p>',
      price: 0, originalPrice: null, stock: 60, catId: catLaptops, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '13.6英寸 Liquid Retina' }, { name: '芯片', value: 'M4' }, { name: '内存', value: '8GB' }, { name: '存储', value: '256GB 固态硬盘' }, { name: '重量', value: '1.24 kg' }]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 5100
    },

    // Electronics - Audio
    {
      id: uuid(), name: 'NovaPods Pro 无线耳机', slug: 'novapods-pro-wireless-earbuds',
      desc: '<p>沉浸式音效体验，配备主动降噪功能。支持自适应均衡、空间音频，配合MagSafe充电盒可实现最长30小时的总聆听时间。</p>',
      price: 0, originalPrice: null, stock: 200, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '类型', value: '真无线' }, { name: '降噪', value: '主动降噪' }, { name: '续航', value: '总计30小时' }, { name: '防水等级', value: 'IPX4' }]),
      tags: '热销,畅销', featured: 1, isNew: 0, recommended: 1, sales: 12300
    },
    {
      id: uuid(), name: 'Studio Pro 头戴式耳机', slug: 'studio-pro-over-ear-headphones',
      desc: '<p>专业级头戴式耳机，呈现录音室品质音效。记忆海绵耳罩、40小时续航，支持无损音频，带来极致聆听体验。</p>',
      price: 0, originalPrice: null, stock: 85, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '类型', value: '头戴式' }, { name: '驱动单元', value: '40mm 定制' }, { name: '续航', value: '40小时' }, { name: '连接方式', value: '蓝牙5.3 + 3.5mm' }]),
      tags: '高端', featured: 1, isNew: 0, recommended: 0, sales: 2300
    },
    {
      id: uuid(), name: '便携蓝牙音箱', slug: 'portable-bluetooth-speaker',
      desc: '<p>小巧身材，强劲音量。这款便携音箱提供360°环绕立体声，低音深沉饱满。IP67级防水防尘，20小时续航。任何冒险旅程的完美伴侣。</p>',
      price: 0, originalPrice: null, stock: 160, catId: catAudio, brand: '声波',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '音效', value: '360° 立体声' }, { name: '续航', value: '20小时' }, { name: '防水', value: 'IP67' }, { name: '重量', value: '540g' }]),
      tags: '', featured: 0, isNew: 0, recommended: 1, sales: 4500
    },

    // Home - Furniture
    {
      id: uuid(), name: '中古现代风沙发', slug: 'mid-century-modern-sofa',
      desc: '<p>客厅的惊艳焦点。这款中古现代风沙发采用实心胡桃木腿、高密度海绵座垫和祖母绿色优质天鹅绒面料，尽显品味。</p>',
      price: 0, originalPrice: null, stock: 15, catId: catFurniture, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '风格', value: '中古现代风' }, { name: '材质', value: '天鹅绒 + 胡桃木' }, { name: '座位', value: '三人位' }, { name: '尺寸', value: '210 × 85 × 80 cm' }]),
      tags: '高端,热销', featured: 1, isNew: 0, recommended: 0, sales: 234
    },
    {
      id: uuid(), name: '极简升降桌', slug: 'minimalist-standing-desk',
      desc: '<p>用这款电动升降桌升级你的工作空间。72cm至120cm平滑高度调节，记忆预设，宽敞竹制桌面。附带线缆管理托盘。</p>',
      price: 0, originalPrice: null, stock: 40, catId: catFurniture, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '竹面 + 钢架' }, { name: '高度范围', value: '72-120 cm' }, { name: '电机', value: '双电机' }, { name: '承重', value: '80 kg' }]),
      tags: '新品,办公', featured: 0, isNew: 1, recommended: 1, sales: 890
    },
    {
      id: uuid(), name: '天鹅绒休闲扶手椅', slug: 'velvet-accent-armchair',
      desc: '<p>用这款奢华天鹅绒扶手椅为任何房间增添一抹亮色。配有金色金属腿、深拉扣靠背和柔软海绵座垫，带来极致舒适。</p>',
      price: 0, originalPrice: null, stock: 25, catId: catFurniture, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '面料', value: '优质天鹅绒' }, { name: '框架', value: '实木' }, { name: '腿', value: '金色金属' }]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 456
    },

    // Home - Decor
    {
      id: uuid(), name: '手工编织挂毯', slug: 'handwoven-macrame-wall-hanging',
      desc: '<p>由资深匠人手工编织的挂毯，采用100%天然棉绳制成。每一件都由技艺精湛的匠人手工打结，独一无二。为任何房间增添温暖与质感。</p>',
      price: 0, originalPrice: null, stock: 100, catId: catDecor, brand: '匠心集',
      images: JSON.stringify(['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '100% 棉绳' }, { name: '尺寸', value: '80 × 60 cm' }, { name: '风格', value: '波西米亚风' }, { name: '安装件', value: '木质挂杆' }]),
      tags: '新品,手工', featured: 0, isNew: 1, recommended: 1, sales: 1230
    },
    {
      id: uuid(), name: '香薰大豆蜡烛套装', slug: 'scented-soy-candle-collection',
      desc: '<p>手工浇注100%大豆蜡蜡烛，装在精美的琥珀色玻璃罐中。三种标志性香型可选：香草檀香、清新亚麻和薰衣草桉树。燃烧时间约60小时。</p>',
      price: 0, originalPrice: null, stock: 300, catId: catDecor, brand: '匠心集',
      images: JSON.stringify(['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '蜡质', value: '100% 大豆蜡' }, { name: '燃烧时间', value: '约60小时' }, { name: '重量', value: '280g' }, { name: '容器', value: '琥珀色玻璃罐' }]),
      tags: '畅销,礼品', featured: 1, isNew: 0, recommended: 1, sales: 6700
    },

    // Home - Kitchen
    {
      id: uuid(), name: '专业厨师刀具套装', slug: 'professional-chef-knife-set',
      desc: '<p>完整的8件套刀具，采用高碳德国不锈钢锻造而成。包含主厨刀、三德刀、面包刀、多用刀、水果刀、厨房剪刀、磨刀棒和金合欢木刀架。</p>',
      price: 0, originalPrice: null, stock: 55, catId: catKitchen, brand: '厨艺家',
      images: JSON.stringify(['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '德国不锈钢' }, { name: '件数', value: '8件套' }, { name: '手柄', value: '人体工学彩木' }, { name: '刀架', value: '金合欢木' }]),
      tags: '高端', featured: 0, isNew: 0, recommended: 1, sales: 890
    },
    {
      id: uuid(), name: '铸铁珐琅锅 6QT', slug: 'cast-iron-dutch-oven-6qt',
      desc: '<p>可以传承几代人的厨房利器。预开锅铸铁搭配珐琅涂层，非常适合慢炖、红烧、烤面包和煲汤。不锈钢珠自循环凝水锅盖。</p>',
      price: 0, originalPrice: null, stock: 70, catId: catKitchen, brand: '厨艺家',
      images: JSON.stringify(['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '珐琅铸铁' }, { name: '容量', value: '6 QT (5.7L)' }, { name: '烤箱适用', value: '最高260°C' }, { name: '重量', value: '5.4 kg' }]),
      tags: '畅销', featured: 1, isNew: 0, recommended: 1, sales: 3400
    },
    {
      id: uuid(), name: '不锈钢锅具套装', slug: 'stainless-steel-cookware-set',
      desc: '<p>10件套优质不锈钢锅具，三层复合结构实现均匀加热。包含煎锅、汤锅、炖锅和炒锅。可进烤箱、可洗碗机清洗。兼容电磁炉。</p>',
      price: 0, originalPrice: null, stock: 45, catId: catKitchen, brand: '厨艺家',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '三层复合不锈钢' }, { name: '件数', value: '10件套' }, { name: '兼容性', value: '所有灶具 含电磁炉' }, { name: '洗碗机', value: '适用' }]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 567
    },
    {
      id: uuid(), name: '智能咖啡机', slug: 'smart-coffee-maker',
      desc: '<p>支持WiFi连接的咖啡机，可通过手机远程操控。定时冲泡、调节浓度，咖啡煮好后自动通知。内置研磨器，保证最新鲜的口感。</p>',
      price: 0, originalPrice: null, stock: 90, catId: catKitchen, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '容量', value: '12杯' }, { name: '连接方式', value: 'WiFi + App 控制' }, { name: '研磨器', value: '内置锥形研磨器' }, { name: '冲泡类型', value: '滴滤 + 单杯' }]),
      tags: '新品,智能', featured: 1, isNew: 1, recommended: 1, sales: 2100
    },
  ];

  for (const p of products) {
    insertProduct.run(p.id, p.name, p.slug, p.desc, p.price, p.originalPrice, p.stock, p.catId, p.brand, p.images, p.specs, p.tags, p.featured, p.isNew, p.recommended, p.sales);
  }

  // ========== Product SKUs ==========
  const insertSku = db.prepare(
    `INSERT INTO product_skus (id, product_id, spec_info, price, stock, sku_code) VALUES (?, ?, ?, ?, ?, ?)`
  );

  // SKUs for Classic Fit Oxford Shirt (product index 0)
  const shirtId = products[0].id;
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'S' }), null, 30, 'OXF-WHT-S');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'M' }), null, 50, 'OXF-WHT-M');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'L' }), null, 45, 'OXF-WHT-L');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'XL' }), null, 25, 'OXF-WHT-XL');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'S' }), null, 20, 'OXF-BLU-S');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'M' }), null, 40, 'OXF-BLU-M');
  insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'L' }), null, 35, 'OXF-BLU-L');

  // SKUs for Floral Print Midi Dress (product index 3)
  const dressId = products[3].id;
  insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'XS' }), null, 20, 'DRS-FLR-XS');
  insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'S' }), null, 35, 'DRS-FLR-S');
  insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'M' }), null, 40, 'DRS-FLR-M');
  insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'L' }), null, 25, 'DRS-FLR-L');

  // SKUs for NovaPhone 15 Pro (product index 8)
  const phoneId = products[8].id;
  insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '原色钛金属' }), null, 15, 'NP15P-NAT');
  insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '蓝色钛金属' }), null, 20, 'NP15P-BLU');
  insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '黑色钛金属' }), null, 10, 'NP15P-BLK');
  insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '白色钛金属' }), null, 5, 'NP15P-WHT');

  // ========== Banners ==========
  const insertBanner = db.prepare(
    `INSERT INTO banners (id, title, subtitle, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`
  );

  insertBanner.run(uuid(), '夏日大促火热进行中', '精选商品低至5折，限时抢购，手慢无！', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop', '/categories/clothing', 1);
  insertBanner.run(uuid(), '数码新品驾到', '探索诺瓦科技最新力作，享独家首发特惠。', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=500&fit=crop', '/categories/electronics', 2);
  insertBanner.run(uuid(), '家居焕新季', '精选家居好物，打造理想生活空间。30%起让利。', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=500&fit=crop', '/categories/home-living', 3);
  insertBanner.run(uuid(), '周末免邮狂欢', '全场满$50包邮，马上开抢！', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop', '/categories/electronics', 4);

  // ========== Announcements ==========
  const insertAnnouncement = db.prepare(
    `INSERT INTO announcements (id, content, link_url, is_active) VALUES (?, ?, ?, 1)`
  );

  insertAnnouncement.run(uuid(), '🚚 全场满299元享免邮配送', '/help');
  insertAnnouncement.run(uuid(), '🎉 新用户首单享9折优惠——使用优惠码: WELCOME10', '/auth/login');

  // ========== Addresses ==========
  const insertAddress = db.prepare(
    `INSERT INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, zip_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const addr1Id = uuid();
  const addr2Id = uuid();
  insertAddress.run(addr1Id, userId, '张三', '13800138001', 'sichuan', 'guangan', 'guanganqu', '商业街123号1栋3单元502室', '638000', 1);
  insertAddress.run(addr2Id, userId, '张三', '13800138001', 'sichuan', 'guangan', 'guanganqu', '滨江路88号2栋1204室', '638000', 0);

  // ========== Orders ==========
  const insertOrder = db.prepare(
    `INSERT INTO orders (id, order_no, user_id, status, total_amount, discount_amount, shipping_fee, payment_method, shipping_address, remark, paid_at, shipped_at, delivered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertOrderItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, product_name, product_image, spec_info, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const order1Id = uuid();
  const order2Id = uuid();
  const order3Id = uuid();

  const addressSnapshot = JSON.stringify({
    receiver_name: '张三',
    phone: '13800138001',
    province: 'sichuan',
    city: 'guangan',
    district: 'guanganqu',
    detail: '商业街123号1栋3单元502室',
    zip_code: '638000',
  });

  const orderNo1 = generateOrderNo();
  const orderNo2 = generateOrderNo();
  const orderNo3 = generateOrderNo();

  insertOrder.run(order1Id, orderNo1, userId, 'delivered', 0, 0, 0, 'credit_card', addressSnapshot, '请放在门口', new Date(Date.now() - 86400000 * 14).toISOString(), new Date(Date.now() - 86400000 * 13).toISOString(), new Date(Date.now() - 86400000 * 7).toISOString());
  insertOrderItem.run(uuid(), order1Id, products[8].id, products[8].name, JSON.parse(products[8].images)[0], JSON.stringify({ '颜色': '蓝色钛金属' }), 0, 1, 0);
  // Add discount to simulate coupon
  db.prepare('UPDATE orders SET discount_amount = 0 WHERE id = ?').run(order1Id);
  db.prepare('UPDATE orders SET total_amount = 0 WHERE id = ?').run(order1Id);

  insertOrder.run(order2Id, orderNo2, userId, 'shipped', 0, 0, 0, 'paypal', addressSnapshot, '', new Date(Date.now() - 86400000 * 3).toISOString(), new Date(Date.now() - 86400000 * 2).toISOString(), null);
  insertOrderItem.run(uuid(), order2Id, products[6].id, products[6].name, JSON.parse(products[6].images)[0], JSON.stringify({ '尺码': 'M' }), 0, 1, 0);
  insertOrderItem.run(uuid(), order2Id, products[0].id, products[0].name, JSON.parse(products[0].images)[0], JSON.stringify({ '颜色': '白色', '尺码': 'M' }), 0, 1, 0);

  insertOrder.run(order3Id, orderNo3, userId, 'pending_payment', 0, 0, 0, '', addressSnapshot, '', null, null, null);
  insertOrderItem.run(uuid(), order3Id, products[21].id, products[21].name, JSON.parse(products[21].images)[0], '{}', 0, 1, 0);

  // ========== Reviews ==========
  const insertReview = db.prepare(
    `INSERT INTO reviews (id, product_id, user_id, order_id, rating, content, images, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  );

  const reviewProducts = [products[8], products[9], products[11], products[19], products[0], products[12]];
  const reviewData = [
    { rating: 5, content: '太喜欢这款手机了！拍照效果惊艳，电池续航一整天没问题。今年买得最值的一件东西。', images: '[]' },
    { rating: 5, content: '性价比超高。运行流畅，屏幕显示出色。强烈推荐！', images: '[]' },
    { rating: 4, content: '这个价位的笔记本真的非常扎实。轻薄但性能足够我日常工作使用。唯一遗憾是接口少了点。', images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop']) },
    { rating: 5, content: '这些蜡烛味道太棒了！香草檀香是我的最爱。而且非常耐用。', images: JSON.stringify(['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop']) },
    { rating: 4, content: '衬衫质量不错。面料柔软透气，尺码也很标准。', images: '[]' },
    { rating: 5, content: '我用过最好的耳机！降噪效果简直绝了，佩戴也非常舒适。', images: '[]' },
    { rating: 5, content: '笔记本太强了！续航简直离谱，我可以连续用两个工作日不用充电。', images: '[]' },
    { rating: 3, content: '手机挺好的，但是物流比预期慢了不少。产品本身倒是没问题。', images: '[]' },
    { rating: 5, content: '蜡烛扩香效果惊人，整个客厅都香了。一定会回购！', images: '[]' },
    { rating: 4, content: '衬衫不错，但版型偏大了一点，建议买小一号。', images: JSON.stringify(['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop']) },
    { rating: 5, content: '音质简直难以置信。声音清澈透亮，降噪也是一流水平。', images: '[]' },
    { rating: 5, content: '送礼首选！蜡烛套装包装精美，朋友特别喜欢。', images: '[]' },
  ];

  for (let i = 0; i < reviewData.length; i++) {
    const prod = reviewProducts[i % reviewProducts.length];
    insertReview.run(uuid(), prod.id, userId, order1Id, reviewData[i].rating, reviewData[i].content, reviewData[i].images);
  }

  // ========== Favorites ==========
  const insertFavorite = db.prepare(
    `INSERT OR IGNORE INTO favorites (id, user_id, product_id) VALUES (?, ?, ?)`
  );

  const favProductIds = [products[8].id, products[12].id, products[19].id, products[0].id, products[21].id];
  for (const pid of favProductIds) {
    insertFavorite.run(uuid(), userId, pid);
  }

  // ========== Site Settings ==========
  const insertSetting = db.prepare(
    `INSERT INTO site_settings (id, key, value) VALUES (?, ?, ?)`
  );

  insertSetting.run(uuid(), 'site_name', '海南等下雪');
  insertSetting.run(uuid(), 'site_description', '您的高品质在线购物平台');
  insertSetting.run(uuid(), 'contact_email', 'support@novamart.com');
  insertSetting.run(uuid(), 'contact_phone', '+1 (555) 123-4567');
  insertSetting.run(uuid(), 'free_shipping_threshold', '50');
  insertSetting.run(uuid(), 'default_shipping_fee', '5.99');
  insertSetting.run(uuid(), 'tax_rate', '0.08');
}

// Allow running standalone: npx tsx src/lib/seed.ts
// Use process.argv check instead of require.main (Next.js production compatible)
if (process.argv[1]?.includes('seed')) {
  import('better-sqlite3').then(({ default: Database }) => {
    const path = require('path');
    const fs = require('fs');

    const DB_PATH = path.join(process.cwd(), 'data', 'ecommerce.db');
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }

    const db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec('DROP TABLE IF EXISTS cart_items');
    db.exec('DROP TABLE IF EXISTS browse_history');
    db.exec('DROP TABLE IF EXISTS favorites');
    db.exec('DROP TABLE IF EXISTS reviews');
    db.exec('DROP TABLE IF EXISTS order_items');
    db.exec('DROP TABLE IF EXISTS orders');
    db.exec('DROP TABLE IF EXISTS product_skus');
    db.exec('DROP TABLE IF EXISTS products');
    db.exec('DROP TABLE IF EXISTS addresses');
    db.exec('DROP TABLE IF EXISTS announcements');
    db.exec('DROP TABLE IF EXISTS banners');
    db.exec('DROP TABLE IF EXISTS site_settings');
    db.exec('DROP TABLE IF EXISTS categories');
    db.exec('DROP TABLE IF EXISTS users');
    db.exec(schema);

    seedDatabase(db);
    console.log('Database seeded successfully!');
    db.close();
  });
}
