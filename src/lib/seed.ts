import type { Db } from './db';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { generateOrderNo } from './utils';

export async function seedDatabase(db: Db) {
  const salt = bcrypt.genSaltSync(10);

  // ========== Users ==========
  const adminId = uuid();
  const userId = uuid();

  const insertUser = db.prepare(
    `INSERT INTO users (id, username, email, password_hash, phone, avatar, role, status, last_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  );

  await insertUser.run(adminId, 'admin', 'admin@novamart.com', bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'xiao123', salt), '13800000000', '', 'admin', 'active');
  await insertUser.run(userId, '张三', 'user@example.com', bcrypt.hashSync('user123', salt), '13800138001', '', 'customer', 'active');

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

  await insertCat.run(catClothing, '服装', 'clothing', null, '四季时尚服饰', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 1);
  await insertCat.run(catMens, '男装', 'mens-clothing', catClothing, '时尚男装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 1);
  await insertCat.run(catWomens, '女装', 'womens-clothing', catClothing, '优雅女装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 2);
  await insertCat.run(catKids, '童装', 'kids-clothing', catClothing, '舒适童装系列', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop', 3);

  await insertCat.run(catElectronics, '电子产品', 'electronics', null, '前沿科技数码产品', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 2);
  await insertCat.run(catPhones, '智能手机', 'smartphones', catElectronics, '最新款智能手机', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 1);
  await insertCat.run(catLaptops, '笔记本电脑', 'laptops', catElectronics, '高性能笔记本设备', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 2);
  await insertCat.run(catAudio, '音频设备', 'audio', catElectronics, '高端音响设备', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 3);

  await insertCat.run(catHome, '家居生活', 'home-living', null, '精美家居好物', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 3);
  await insertCat.run(catFurniture, '家具', 'furniture', catHome, '现代家具设计', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 1);
  await insertCat.run(catDecor, '装饰', 'decor', catHome, '艺术家居装饰品', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 2);
  await insertCat.run(catKitchen, '厨房用品', 'kitchen', catHome, '厨房必备与创意小家电', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 3);

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
      price: 39.99, originalPrice: 59.99, stock: 150, catId: catMens, brand: '诺瓦精选',
            images: JSON.stringify(['/images/products/classic-fit-cotton-oxford-shirt.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '100% 有机棉' }, { name: '版型', value: '经典版型' }, { name: '领型', value: '纽扣领' }, { name: '洗涤', value: '可机洗' }]),
      tags: '新品,有机,畅销', featured: 1, isNew: 1, recommended: 1, sales: 2340
    },
    {
      id: uuid(), name: '修身弹力斜纹裤', slug: 'slim-fit-stretch-chinos',
      desc: '<p>现代修身版型斜纹裤，含2%弹力纤维，全天舒适自如。中腰设计与锥形裤腿，打造利落轮廓。</p>',
      price: 49.99, originalPrice: 69.99, stock: 200, catId: catMens, brand: '诺瓦精选',
            images: JSON.stringify(['/images/products/slim-fit-stretch-chinos.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '98% 棉, 2% 弹力纤维' }, { name: '版型', value: '修身版型' }, { name: '腰型', value: '中腰' }]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 1890
    },
    {
      id: uuid(), name: '美利奴羊毛V领毛衣', slug: 'merino-wool-v-neck-sweater',
      desc: '<p>奢华柔软的美利奴羊毛毛衣，经典V领设计。具有温度调节功能，天然抗异味。</p>',
      price: 89.99, originalPrice: 129.99, stock: 80, catId: catMens, brand: '纯羊毛',
            images: JSON.stringify(['/images/products/merino-wool-v-neck-sweater.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '100% 美利奴羊毛' }, { name: '厚度', value: '中等针数' }, { name: '领型', value: 'V领' }]),
      tags: '高端', featured: 1, isNew: 0, recommended: 0, sales: 567
    },

    // Clothing - Women's
    {
      id: uuid(), name: '碎花印花中长连衣裙', slug: 'floral-print-midi-dress',
      desc: '<p>惊艳的中长连衣裙，采用手绘风格碎花印花轻质雪纺面料。围裹式廓形适合各种体型，配有可调节腰部系带。</p>',
      price: 59.99, originalPrice: 89.99, stock: 120, catId: catWomens, brand: '花开物语',
            images: JSON.stringify(['/images/products/floral-print-midi-dress.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '雪纺' }, { name: '长度', value: '中长款' }, { name: '款式', value: '围裹式连衣裙' }, { name: '季节', value: '春夏' }]),
      tags: '新品,春季', featured: 1, isNew: 1, recommended: 1, sales: 1456
    },
    {
      id: uuid(), name: '高腰阔腿裤', slug: 'high-waist-wide-leg-trousers',
      desc: '<p>精致的高腰阔腿裤，采用垂感极佳的绉纱面料，抗皱不褪色，展现优雅气质。</p>',
      price: 49.99, originalPrice: 69.99, stock: 95, catId: catWomens, brand: '诺瓦精选',
            images: JSON.stringify(['/images/products/high-waist-wide-leg-trousers.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '涤纶绉纱' }, { name: '腰型', value: '高腰' }, { name: '裤型', value: '阔腿' }]),
      tags: '通勤,经典', featured: 0, isNew: 0, recommended: 1, sales: 890
    },
    {
      id: uuid(), name: '羊绒混纺开衫', slug: 'cashmere-blend-cardigan',
      desc: '<p>用这款羊绒混纺开衫将自己包裹在奢华之中。配有珍珠母贝纽扣和罗纹袖口，是完美的叠穿单品。</p>',
      price: 159.99, originalPrice: 229.99, stock: 45, catId: catWomens, brand: '纯羊毛',
            images: JSON.stringify(['/images/products/cashmere-blend-cardigan.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '70% 羊毛, 30% 羊绒' }, { name: '闭合方式', value: '前开扣' }, { name: '洗涤', value: '仅限干洗' }]),
      tags: '高端,冬季', featured: 1, isNew: 0, recommended: 0, sales: 342
    },

    // Clothing - Kids'
    {
      id: uuid(), name: '有机棉儿童睡衣套装', slug: 'organic-cotton-pj-set',
      desc: '<p>可爱两件套睡衣，采用GOTS认证有机棉制成。超级柔软、透气，不含任何有害化学物质。即使是敏感肌肤的宝宝也能安心穿着。</p>',
      price: 29.99, originalPrice: 39.99, stock: 180, catId: catKids, brand: '小诺瓦',
            images: JSON.stringify(['/images/products/organic-cotton-pj-set.jpg']),
      specs: JSON.stringify([{ name: '材质', value: 'GOTS 有机棉' }, { name: '套装', value: '上衣 + 裤子' }, { name: '适用年龄', value: '2-8 岁' }]),
      tags: '有机,新品', featured: 0, isNew: 1, recommended: 1, sales: 2100
    },
    {
      id: uuid(), name: '儿童牛仔背带裤', slug: 'kids-denim-overalls',
      desc: '<p>专为好动儿童设计的耐用可爱牛仔背带裤。配有可调节肩带，适应孩子的成长，膝盖部位加固处理，更加耐穿。</p>',
      price: 34.99, originalPrice: 49.99, stock: 140, catId: catKids, brand: '小诺瓦',
      images: JSON.stringify(['https://images.unsplash.com/photo-1541015492536-31d513c59861?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '棉质牛仔布' }, { name: '闭合方式', value: '纽扣肩带' }, { name: '口袋', value: '5 个口袋' }]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 678
    },

    // Electronics - Smartphones
    {
      id: uuid(), name: 'NovaPhone 15 Pro - 256GB', slug: 'novaphone-15-pro-256gb',
      desc: '<p>NovaPhone 15 Pro 配备惊艳的6.7英寸OLED显示屏、A18 Pro芯片以及4800万像素主摄的专业级相机系统。全天候续航与钛金属机身设计。</p>',
      price: 1099.0, originalPrice: 1199.0, stock: 50, catId: catPhones, brand: '诺瓦科技',
            images: JSON.stringify(['/images/products/novaphone-15-pro-256gb.jpg']),
      specs: JSON.stringify([{ name: '屏幕', value: '6.7英寸 OLED 120Hz' }, { name: '芯片', value: 'A18 Pro' }, { name: '摄像头', value: '4800万 + 1200万 + 1200万像素' }, { name: '存储', value: '256GB' }, { name: '电池', value: '4500mAh' }]),
      tags: '热销,高端', featured: 1, isNew: 1, recommended: 1, sales: 5600
    },
    {
      id: uuid(), name: 'NovaPhone 15 - 128GB', slug: 'novaphone-15-128gb',
      desc: '<p>NovaPhone 15 以亲民价格带来旗舰级性能。配备6.1英寸Super Retina显示屏、A17芯片和先进的双摄系统。</p>',
      price: 799.0, originalPrice: 899.0, stock: 75, catId: catPhones, brand: '诺瓦科技',
            images: JSON.stringify(['/images/products/novaphone-15-128gb.jpg']),
      specs: JSON.stringify([{ name: '屏幕', value: '6.1英寸 Super Retina' }, { name: '芯片', value: 'A17' }, { name: '摄像头', value: '4800万 + 1200万像素' }, { name: '存储', value: '128GB' }]),
      tags: '热销', featured: 1, isNew: 1, recommended: 1, sales: 7800
    },

    // Electronics - Laptops
    {
      id: uuid(), name: 'NovaBook Pro 16英寸笔记本电脑', slug: 'novabook-pro-16-laptop',
      desc: '<p>强劲性能与便携兼具，NovaBook Pro 搭载 M4 Pro 芯片，配备惊艳的16英寸 Liquid Retina XDR 显示屏，续航长达22小时。创意专业人士的理想之选。</p>',
      price: 2499.0, originalPrice: 2699.0, stock: 30, catId: catLaptops, brand: '诺瓦科技',
            images: JSON.stringify(['/images/products/novabook-pro-16-laptop.jpg']),
      specs: JSON.stringify([{ name: '屏幕', value: '16英寸 Liquid Retina XDR' }, { name: '芯片', value: 'M4 Pro' }, { name: '内存', value: '18GB' }, { name: '存储', value: '512GB 固态硬盘' }, { name: '续航', value: '最长22小时' }]),
      tags: '高端,热销', featured: 1, isNew: 1, recommended: 1, sales: 3400
    },
    {
      id: uuid(), name: 'NovaBook Air 13英寸笔记本电脑', slug: 'novabook-air-13-laptop',
      desc: '<p>极致轻薄，NovaBook Air 是终极日常笔记本。搭载 M4 芯片，配备13.6英寸 Liquid Retina 显示屏，无风扇设计实现静音运行。</p>',
      price: 1099.0, originalPrice: 1199.0, stock: 60, catId: catLaptops, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '13.6英寸 Liquid Retina' }, { name: '芯片', value: 'M4' }, { name: '内存', value: '8GB' }, { name: '存储', value: '256GB 固态硬盘' }, { name: '重量', value: '1.24 kg' }]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 5100
    },

    // Electronics - Audio
    {
      id: uuid(), name: 'NovaPods Pro 无线耳机', slug: 'novapods-pro-wireless-earbuds',
      desc: '<p>沉浸式音效体验，配备主动降噪功能。支持自适应均衡、空间音频，配合MagSafe充电盒可实现最长30小时的总聆听时间。</p>',
      price: 249.0, originalPrice: 279.0, stock: 200, catId: catAudio, brand: '诺瓦科技',
            images: JSON.stringify(['/images/products/novapods-pro-wireless-earbuds.jpg']),
      specs: JSON.stringify([{ name: '类型', value: '真无线' }, { name: '降噪', value: '主动降噪' }, { name: '续航', value: '总计30小时' }, { name: '防水等级', value: 'IPX4' }]),
      tags: '热销,畅销', featured: 1, isNew: 0, recommended: 1, sales: 12300
    },
    {
      id: uuid(), name: 'Studio Pro 头戴式耳机', slug: 'studio-pro-over-ear-headphones',
      desc: '<p>专业级头戴式耳机，呈现录音室品质音效。记忆海绵耳罩、40小时续航，支持无损音频，带来极致聆听体验。</p>',
      price: 399.0, originalPrice: 449.0, stock: 85, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '类型', value: '头戴式' }, { name: '驱动单元', value: '40mm 定制' }, { name: '续航', value: '40小时' }, { name: '连接方式', value: '蓝牙5.3 + 3.5mm' }]),
      tags: '高端', featured: 1, isNew: 0, recommended: 0, sales: 2300
    },

    // Home - Furniture
    {
      id: uuid(), name: '中古现代风沙发', slug: 'mid-century-modern-sofa',
      desc: '<p>客厅的惊艳焦点。这款中古现代风沙发采用实心胡桃木腿、高密度海绵座垫和祖母绿色优质天鹅绒面料，尽显品味。</p>',
      price: 1199.0, originalPrice: 1499.0, stock: 15, catId: catFurniture, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '风格', value: '中古现代风' }, { name: '材质', value: '天鹅绒 + 胡桃木' }, { name: '座位', value: '三人位' }, { name: '尺寸', value: '210 × 85 × 80 cm' }]),
      tags: '高端,热销', featured: 1, isNew: 0, recommended: 0, sales: 234
    },
    {
      id: uuid(), name: '极简升降桌', slug: 'minimalist-standing-desk',
      desc: '<p>用这款电动升降桌升级你的工作空间。72cm至120cm平滑高度调节，记忆预设，宽敞竹制桌面。附带线缆管理托盘。</p>',
      price: 399.99, originalPrice: 549.99, stock: 40, catId: catFurniture, brand: '港湾家居',
            images: JSON.stringify(['/images/products/minimalist-standing-desk.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '竹面 + 钢架' }, { name: '高度范围', value: '72-120 cm' }, { name: '电机', value: '双电机' }, { name: '承重', value: '80 kg' }]),
      tags: '新品,办公', featured: 0, isNew: 1, recommended: 1, sales: 890
    },
    {
      id: uuid(), name: '天鹅绒休闲扶手椅', slug: 'velvet-accent-armchair',
      desc: '<p>用这款奢华天鹅绒扶手椅为任何房间增添一抹亮色。配有金色金属腿、深拉扣靠背和柔软海绵座垫，带来极致舒适。</p>',
      price: 429.99, originalPrice: 599.99, stock: 25, catId: catFurniture, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '面料', value: '优质天鹅绒' }, { name: '框架', value: '实木' }, { name: '腿', value: '金色金属' }]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 456
    },

    // Home - Decor
    {
      id: uuid(), name: '手工编织挂毯', slug: 'handwoven-macrame-wall-hanging',
      desc: '<p>由资深匠人手工编织的挂毯，采用100%天然棉绳制成。每一件都由技艺精湛的匠人手工打结，独一无二。为任何房间增添温暖与质感。</p>',
      price: 59.99, originalPrice: 89.99, stock: 100, catId: catDecor, brand: '匠心集',
            images: JSON.stringify(['/images/products/handwoven-macrame-wall-hanging.jpg']),
      specs: JSON.stringify([{ name: '材质', value: '100% 棉绳' }, { name: '尺寸', value: '80 × 60 cm' }, { name: '风格', value: '波西米亚风' }, { name: '安装件', value: '木质挂杆' }]),
      tags: '新品,手工', featured: 0, isNew: 1, recommended: 1, sales: 1230
    },
    {
      id: uuid(), name: '香薰大豆蜡烛套装', slug: 'scented-soy-candle-collection',
      desc: '<p>手工浇注100%大豆蜡蜡烛，装在精美的琥珀色玻璃罐中。三种标志性香型可选：香草檀香、清新亚麻和薰衣草桉树。燃烧时间约60小时。</p>',
      price: 49.99, originalPrice: 69.99, stock: 300, catId: catDecor, brand: '匠心集',
      images: JSON.stringify(['https://images.unsplash.com/photo-1608263153703-caa6b0fd7bc7?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '蜡质', value: '100% 大豆蜡' }, { name: '燃烧时间', value: '约60小时' }, { name: '重量', value: '280g' }, { name: '容器', value: '琥珀色玻璃罐' }]),
      tags: '畅销,礼品', featured: 1, isNew: 0, recommended: 1, sales: 6700
    },

    // Home - Kitchen
    {
      id: uuid(), name: '专业厨师刀具套装', slug: 'professional-chef-knife-set',
      desc: '<p>完整的8件套刀具，采用高碳德国不锈钢锻造而成。包含主厨刀、三德刀、面包刀、多用刀、水果刀、厨房剪刀、磨刀棒和金合欢木刀架。</p>',
      price: 159.99, originalPrice: 239.99, stock: 55, catId: catKitchen, brand: '厨艺家',
      images: JSON.stringify(['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '德国不锈钢' }, { name: '件数', value: '8件套' }, { name: '手柄', value: '人体工学彩木' }, { name: '刀架', value: '金合欢木' }]),
      tags: '高端', featured: 0, isNew: 0, recommended: 1, sales: 890
    },

    // ========== New Products ==========
    // Men's - Lightweight Jacket
    {
      id: uuid(), name: '轻薄休闲夹克', slug: 'lightweight-casual-jacket',
      desc: '<p>时尚百搭的轻薄休闲夹克，采用高品质防水面料，内衬透气网布。经典立领设计，轻盈便携，适合春秋季节日常穿搭。</p>',
      price: 79.99, originalPrice: 119.99, stock: 120, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['https://images.unsplash.com/photo-1557418669-db3f781a58c0?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '防水尼龙' }, { name: '里衬', value: '透气网布' }, { name: '闭合方式', value: '拉链+按扣' }]),
      tags: '新品,春季', featured: 1, isNew: 1, recommended: 1, sales: 890
    },
    // Women's - Silk Blouse
    {
      id: uuid(), name: '真丝系带衬衫', slug: 'silk-wrap-blouse',
      desc: '<p>优雅的真丝系带衬衫，采用100%桑蚕丝面料，质感柔滑垂顺。前襟系带设计，修饰颈部和肩部线条，是通勤与约会的完美选择。</p>',
      price: 99.99, originalPrice: 149.99, stock: 85, catId: catWomens, brand: '花开物语',
      images: JSON.stringify(['https://images.unsplash.com/photo-1608234807905-4466023792f5?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '100% 桑蚕丝' }, { name: '款式', value: '系带衬衫' }, { name: '袖长', value: '长袖' }]),
      tags: '新品,高端', featured: 1, isNew: 1, recommended: 1, sales: 670
    },
    // Electronics - Smart Watch
    {
      id: uuid(), name: 'NovaWatch Pro 智能手表', slug: 'novawatch-pro-smart-watch',
      desc: '<p>NovaWatch Pro 搭载先进的健康监测系统，支持心电、血氧、睡眠分析等功能。1.9英寸AMOLED屏幕，钛合金表壳，续航长达14天。</p>',
      price: 549.0, originalPrice: 649.0, stock: 200, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '屏幕', value: '1.9英寸 AMOLED' }, { name: '续航', value: '最长14天' }, { name: '防水', value: '5ATM' }, { name: '传感器', value: '心电+血氧+加速度计' }]),
      tags: '热销,新品', featured: 1, isNew: 1, recommended: 1, sales: 3200
    },
    // Home Decor - Ceramic Vase
    {
      id: uuid(), name: '北欧风陶瓷花瓶', slug: 'nordic-ceramic-vase',
      desc: '<p>简约北欧风陶瓷花瓶，哑光釉面质感，手工制作每一件都独一无二。适合摆放干花、鲜切花或单独作为装饰摆件，为家居增添自然气息。</p>',
      price: 39.99, originalPrice: 59.99, stock: 300, catId: catDecor, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1604762525953-2c80447cc4a6?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '哑光陶瓷' }, { name: '高度', value: '25cm' }, { name: '颜色', value: '米白色' }, { name: '适用', value: '干花/鲜花/摆件' }]),
      tags: '新品', featured: 1, isNew: 1, recommended: 0, sales: 1560
    },
    // Home Decor - Floor Lamp
    {
      id: uuid(), name: '北欧风落地灯', slug: 'nordic-floor-lamp',
      desc: '<p>极简北欧风落地灯，金属灯杆配亚麻灯罩，暖色光线营造温馨氛围。三档调光设计，适合客厅、书房和卧室角落。</p>',
      price: 129.99, originalPrice: 179.99, stock: 60, catId: catDecor, brand: '港湾家居',
      images: JSON.stringify(['https://images.unsplash.com/photo-1616118132567-bb93c5741365?w=640&h=640&fit=crop']),
      specs: JSON.stringify([{ name: '材质', value: '金属+亚麻灯罩' }, { name: '高度', value: '150cm' }, { name: '光源', value: 'E27 三档调光' }, { name: '颜色', value: '哑光黑' }]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 430
    },

    // ================= 扩展商品（本地生成插画） =================
    {
      id: uuid(), name: '宽松连帽卫衣', slug: 'relaxed-fit-hoodie',
      desc: '<p>320g 加厚棉质抓绒，宽松落肩版型，前袋与抽绳细节，秋冬单穿或叠穿都合适。</p>',
      price: 59.99, originalPrice: 89.99, stock: 180, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/relaxed-fit-hoodie.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "80% 棉 / 20% 聚酯纤维"}, {"name": "克重", "value": "320g"}, {"name": "版型", "value": "宽松落肩"}]),
      tags: '新品,热销', featured: 1, isNew: 1, recommended: 1, sales: 1820
    },
    {
      id: uuid(), name: '休闲飞行员夹克', slug: 'casual-bomber-jacket',
      desc: '<p>防泼水面料配罗纹收口，双向拉链，通勤与周末都能穿。</p>',
      price: 129.99, originalPrice: 189.99, stock: 90, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/casual-bomber-jacket.svg']),
      specs: JSON.stringify([{"name": "面料", "value": "防泼水尼龙"}, {"name": "内衬", "value": "网眼透气"}, {"name": "口袋", "value": "按扣侧袋"}]),
      tags: '高端,新品', featured: 0, isNew: 1, recommended: 1, sales: 640
    },
    {
      id: uuid(), name: '重磅纯棉短袖T恤', slug: 'heavyweight-cotton-tee',
      desc: '<p>240g 精梳棉，领口双层加固，不易变形。</p>',
      price: 29.99, originalPrice: 39.99, stock: 300, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/heavyweight-cotton-tee.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "100% 精梳棉"}, {"name": "克重", "value": "240g"}, {"name": "洗涤", "value": "可机洗"}]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 3120
    },
    {
      id: uuid(), name: '水洗牛仔工装衬衫', slug: 'denim-work-shirt',
      desc: '<p>水洗做旧工艺，双胸袋设计，可外穿也可当薄外套。</p>',
      price: 69.99, originalPrice: 99.99, stock: 120, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/denim-work-shirt.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "100% 棉牛仔"}, {"name": "工艺", "value": "水洗做旧"}, {"name": "版型", "value": "直筒"}]),
      tags: '新品', featured: 1, isNew: 1, recommended: 0, sales: 410
    },
    {
      id: uuid(), name: '束脚工装裤', slug: 'cargo-jogger-pants',
      desc: '<p>弹力斜纹面料，六个口袋，束脚收口利落不拖沓。</p>',
      price: 79.99, originalPrice: 109.99, stock: 150, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/cargo-jogger-pants.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "97% 棉 / 3% 氨纶"}, {"name": "口袋", "value": "6 个"}, {"name": "版型", "value": "束脚"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 980
    },
    {
      id: uuid(), name: '亚麻短袖衬衫', slug: 'linen-short-sleeve-shirt',
      desc: '<p>亚麻混纺透气不闷，适合夏季通勤与度假。</p>',
      price: 49.99, originalPrice: 69.99, stock: 160, catId: catMens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/linen-short-sleeve-shirt.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "55% 亚麻 / 45% 棉"}, {"name": "版型", "value": "常规"}, {"name": "洗涤", "value": "建议手洗"}]),
      tags: '新品,清爽', featured: 0, isNew: 1, recommended: 0, sales: 520
    },
    {
      id: uuid(), name: '针织开衫外套', slug: 'knit-cardigan',
      desc: '<p>细腻针织手感，微弹不扎人，可当薄外套或叠穿打底。</p>',
      price: 69.99, originalPrice: 99.99, stock: 140, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/knit-cardigan.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "50% 粘纤 / 30% 锦纶 / 20% 羊毛"}, {"name": "版型", "value": "宽松"}, {"name": "季节", "value": "春秋"}]),
      tags: '新品,热销', featured: 1, isNew: 1, recommended: 1, sales: 1460
    },
    {
      id: uuid(), name: 'A字中长半身裙', slug: 'a-line-midi-skirt',
      desc: '<p>高腰 A 字剪裁显腿长，垂坠感面料不易起皱。</p>',
      price: 59.99, originalPrice: 89.99, stock: 120, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/a-line-midi-skirt.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "聚酯纤维混纺"}, {"name": "长度", "value": "中长"}, {"name": "腰型", "value": "高腰"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 870
    },
    {
      id: uuid(), name: '雪纺衬衫上衣', slug: 'chiffon-blouse',
      desc: '<p>轻薄雪纺，微透需内搭，通勤与约会都适配。</p>',
      price: 45.99, originalPrice: 65.99, stock: 170, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/chiffon-blouse.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "100% 聚酯纤维"}, {"name": "版型", "value": "常规"}, {"name": "洗涤", "value": "手洗"}]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 630
    },
    {
      id: uuid(), name: '西装阔腿长裤', slug: 'wide-leg-tailored-pants',
      desc: '<p>垂坠西装料，高腰直筒阔腿，遮肉显高。</p>',
      price: 89.99, originalPrice: 129.99, stock: 110, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/wide-leg-tailored-pants.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "西装混纺"}, {"name": "腰型", "value": "高腰"}, {"name": "版型", "value": "阔腿"}]),
      tags: '高端,热销', featured: 1, isNew: 0, recommended: 1, sales: 1120
    },
    {
      id: uuid(), name: '经典双排扣风衣', slug: 'trench-coat',
      desc: '<p>中长款风衣，双排扣配腰带，防风挺括。</p>',
      price: 199.99, originalPrice: 299.99, stock: 60, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/trench-coat.svg']),
      specs: JSON.stringify([{"name": "面料", "value": "防泼水涤棉"}, {"name": "长度", "value": "中长"}, {"name": "细节", "value": "可拆腰带"}]),
      tags: '高端', featured: 1, isNew: 0, recommended: 0, sales: 280
    },
    {
      id: uuid(), name: '百褶半身短裙', slug: 'pleated-skirt',
      desc: '<p>定型百褶不易散，配短靴或运动鞋都好看。</p>',
      price: 49.99, originalPrice: 69.99, stock: 130, catId: catWomens, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/pleated-skirt.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "聚酯纤维"}, {"name": "长度", "value": "短款"}, {"name": "腰型", "value": "中高腰"}]),
      tags: '新品', featured: 0, isNew: 1, recommended: 1, sales: 540
    },
    {
      id: uuid(), name: '儿童加绒卫衣', slug: 'kids-hoodie',
      desc: '<p>内里抓绒保暖，袖口罗纹不勒手，水洗不易掉色。</p>',
      price: 39.99, originalPrice: 59.99, stock: 200, catId: catKids, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/kids-hoodie.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "棉混纺"}, {"name": "内里", "value": "抓绒"}, {"name": "洗涤", "value": "可机洗"}]),
      tags: '热销', featured: 0, isNew: 1, recommended: 1, sales: 760
    },
    {
      id: uuid(), name: '儿童牛仔背带裤', slug: 'kids-overalls',
      desc: '<p>可调节肩带，宽松版型好活动，耐脏耐磨。</p>',
      price: 55.99, originalPrice: 79.99, stock: 140, catId: catKids, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/kids-overalls.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "棉牛仔"}, {"name": "肩带", "value": "可调节"}, {"name": "口袋", "value": "前袋 + 侧袋"}]),
      tags: '新品', featured: 1, isNew: 1, recommended: 0, sales: 320
    },
    {
      id: uuid(), name: '儿童纯棉家居服套装', slug: 'kids-cotton-pajamas',
      desc: '<p>A 类婴幼儿标准面料，柔软亲肤，两件套好穿脱。</p>',
      price: 45.99, originalPrice: 65.99, stock: 180, catId: catKids, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/kids-cotton-pajamas.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "100% 棉"}, {"name": "标准", "value": "A 类"}, {"name": "套装", "value": "上衣 + 长裤"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 690
    },
    {
      id: uuid(), name: '磁吸手机壳', slug: 'magnetic-phone-case',
      desc: '<p>磨砂肤感背板，支持磁吸配件，四角气囊防摔。</p>',
      price: 39.99, originalPrice: 59.99, stock: 260, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/magnetic-phone-case.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "TPU + 磨砂 PC"}, {"name": "磁吸", "value": "支持 MagSafe"}, {"name": "防护", "value": "四角气囊"}]),
      tags: '热销,新品', featured: 1, isNew: 1, recommended: 1, sales: 1980
    },
    {
      id: uuid(), name: '20000mAh 快充充电宝', slug: 'power-bank-20000',
      desc: '<p>22.5W 双向快充，双口输出，可同时给手机与耳机充电。</p>',
      price: 129.99, originalPrice: 169.99, stock: 150, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/power-bank-20000.svg']),
      specs: JSON.stringify([{"name": "容量", "value": "20000mAh"}, {"name": "功率", "value": "22.5W"}, {"name": "接口", "value": "USB-C + USB-A"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 1340
    },
    {
      id: uuid(), name: '编织快充数据线 1.5m', slug: 'braided-usb-c-cable',
      desc: '<p>尼龙编织抗折断，支持 60W PD 快充与数据传输。</p>',
      price: 19.99, originalPrice: 29.99, stock: 400, catId: catPhones, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/braided-usb-c-cable.svg']),
      specs: JSON.stringify([{"name": "长度", "value": "1.5m"}, {"name": "功率", "value": "60W"}, {"name": "接口", "value": "USB-C to USB-C"}]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 4210
    },
    {
      id: uuid(), name: '静音无线鼠标', slug: 'wireless-mouse',
      desc: '<p>2.4G + 蓝牙双模，静音微动，一节电池用半年。</p>',
      price: 79.99, originalPrice: 109.99, stock: 180, catId: catLaptops, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/wireless-mouse.svg']),
      specs: JSON.stringify([{"name": "连接", "value": "2.4G / 蓝牙"}, {"name": "DPI", "value": "800-1600"}, {"name": "电池", "value": "AA"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 1520
    },
    {
      id: uuid(), name: '87 键机械键盘', slug: 'mechanical-keyboard-87',
      desc: '<p>热插拔轴体，三模连接，PBT 键帽耐磨不打油。</p>',
      price: 299.99, originalPrice: 399.99, stock: 70, catId: catLaptops, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/mechanical-keyboard-87.svg']),
      specs: JSON.stringify([{"name": "配列", "value": "87 键"}, {"name": "轴体", "value": "热插拔"}, {"name": "连接", "value": "有线 / 2.4G / 蓝牙"}]),
      tags: '高端,新品', featured: 1, isNew: 1, recommended: 1, sales: 430
    },
    {
      id: uuid(), name: '14 英寸笔记本内胆包', slug: 'laptop-sleeve-14',
      desc: '<p>防泼水外层 + 加厚珍珠棉，独立配件袋。</p>',
      price: 59.99, originalPrice: 89.99, stock: 160, catId: catLaptops, brand: '诺瓦精选',
      images: JSON.stringify(['/images/products/laptop-sleeve-14.svg']),
      specs: JSON.stringify([{"name": "适配", "value": "13-14 英寸"}, {"name": "材质", "value": "防泼水尼龙"}, {"name": "内衬", "value": "珍珠棉"}]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 760
    },
    {
      id: uuid(), name: '便携蓝牙音箱', slug: 'bluetooth-speaker-pro',
      desc: '<p>360° 环绕声场，IPX7 防水，续航 16 小时。</p>',
      price: 249.99, originalPrice: 329.99, stock: 95, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/bluetooth-speaker-pro.svg']),
      specs: JSON.stringify([{"name": "功率", "value": "20W"}, {"name": "防水", "value": "IPX7"}, {"name": "续航", "value": "16 小时"}]),
      tags: '热销,新品', featured: 1, isNew: 1, recommended: 1, sales: 880
    },
    {
      id: uuid(), name: '头戴式降噪耳机', slug: 'over-ear-headphones',
      desc: '<p>主动降噪 42dB，40mm 动圈单元，续航 40 小时。</p>',
      price: 899.99, originalPrice: 1099.0, stock: 45, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/over-ear-headphones.svg']),
      specs: JSON.stringify([{"name": "降噪", "value": "42dB"}, {"name": "单元", "value": "40mm 动圈"}, {"name": "续航", "value": "40 小时"}]),
      tags: '高端,热销', featured: 1, isNew: 0, recommended: 1, sales: 520
    },
    {
      id: uuid(), name: '入耳式有线耳机', slug: 'wired-earphones',
      desc: '<p>10mm 动圈，线控麦克风，Type-C 接口即插即用。</p>',
      price: 49.99, originalPrice: 79.99, stock: 220, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/wired-earphones.svg']),
      specs: JSON.stringify([{"name": "单元", "value": "10mm"}, {"name": "接口", "value": "Type-C"}, {"name": "线控", "value": "支持"}]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 2140
    },
    {
      id: uuid(), name: '桌面迷你回音壁', slug: 'mini-soundbar',
      desc: '<p>双全频单元 + 被动振膜，蓝牙 5.3 低延迟。</p>',
      price: 399.99, originalPrice: 499.99, stock: 50, catId: catAudio, brand: '诺瓦科技',
      images: JSON.stringify(['/images/products/mini-soundbar.svg']),
      specs: JSON.stringify([{"name": "单元", "value": "双全频 + 被动振膜"}, {"name": "蓝牙", "value": "5.3"}, {"name": "接口", "value": "AUX / USB"}]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 210
    },
    {
      id: uuid(), name: '人体工学办公椅', slug: 'ergonomic-office-chair',
      desc: '<p>4D 扶手 + 腰托，网布透气，可后仰锁定。</p>',
      price: 899.99, originalPrice: 1299.0, stock: 40, catId: catFurniture, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/ergonomic-office-chair.svg']),
      specs: JSON.stringify([{"name": "靠背", "value": "网布"}, {"name": "扶手", "value": "4D 可调"}, {"name": "承重", "value": "120kg"}]),
      tags: '高端,热销', featured: 1, isNew: 0, recommended: 1, sales: 340
    },
    {
      id: uuid(), name: '弧形落地灯', slug: 'floor-lamp-arc',
      desc: '<p>三档色温，弧形灯臂覆盖沙发区，底座稳重。</p>',
      price: 399.99, originalPrice: 549.99, stock: 65, catId: catFurniture, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/floor-lamp-arc.svg']),
      specs: JSON.stringify([{"name": "色温", "value": "3000K/4000K/6000K"}, {"name": "功率", "value": "12W"}, {"name": "高度", "value": "165cm"}]),
      tags: '新品', featured: 1, isNew: 1, recommended: 1, sales: 260
    },
    {
      id: uuid(), name: '橡木开放书架', slug: 'oak-bookshelf',
      desc: '<p>实木框架 + 五层置物，可当书架也可做隔断。</p>',
      price: 699.99, originalPrice: 899.99, stock: 35, catId: catFurniture, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/oak-bookshelf.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "橡木 + 环保板"}, {"name": "层数", "value": "5 层"}, {"name": "尺寸", "value": "80×30×180cm"}]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 120
    },
    {
      id: uuid(), name: '圆形边几', slug: 'side-table-round',
      desc: '<p>小户型友好，圆角设计不磕碰，可放沙发边或床头。</p>',
      price: 259.99, originalPrice: 359.99, stock: 80, catId: catFurniture, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/side-table-round.svg']),
      specs: JSON.stringify([{"name": "直径", "value": "45cm"}, {"name": "高度", "value": "50cm"}, {"name": "材质", "value": "实木贴皮"}]),
      tags: '', featured: 0, isNew: 0, recommended: 1, sales: 310
    },
    {
      id: uuid(), name: '香薰大豆蜡烛套装', slug: 'scented-candle-set',
      desc: '<p>天然大豆蜡，三款香型（雪松 / 白茶 / 鼠尾草），燃烧约 30 小时。</p>',
      price: 49.99, originalPrice: 69.99, stock: 170, catId: catDecor, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/scented-candle-set.svg']),
      specs: JSON.stringify([{"name": "蜡质", "value": "天然大豆蜡"}, {"name": "香型", "value": "3 款"}, {"name": "燃烧时长", "value": "约 30h"}]),
      tags: '热销,新品', featured: 1, isNew: 1, recommended: 1, sales: 1580
    },
    {
      id: uuid(), name: '哑光陶瓷花瓶', slug: 'ceramic-vase',
      desc: '<p>手工拉坯哑光釉面，插干花或单独摆放都好看。</p>',
      price: 89.99, originalPrice: 129.99, stock: 110, catId: catDecor, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/ceramic-vase.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "陶瓷"}, {"name": "工艺", "value": "哑光釉"}, {"name": "高度", "value": "26cm"}]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 430
    },
    {
      id: uuid(), name: '简约相框三件套', slug: 'photo-frame-set',
      desc: '<p>原木边框 + 亚克力面板，三种尺寸组合墙面。</p>',
      price: 69.99, originalPrice: 99.99, stock: 140, catId: catDecor, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/photo-frame-set.svg']),
      specs: JSON.stringify([{"name": "尺寸", "value": "6/7/8 寸"}, {"name": "材质", "value": "原木 + 亚克力"}, {"name": "摆放", "value": "可挂可立"}]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 280
    },
    {
      id: uuid(), name: '手工簇绒地毯', slug: 'hand-tufted-rug',
      desc: '<p>短绒不易积灰，防滑底背，客厅与卧室都合适。</p>',
      price: 399.99, originalPrice: 559.99, stock: 45, catId: catDecor, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/hand-tufted-rug.svg']),
      specs: JSON.stringify([{"name": "尺寸", "value": "120×180cm"}, {"name": "材质", "value": "涤纶短绒"}, {"name": "底背", "value": "防滑"}]),
      tags: '', featured: 1, isNew: 0, recommended: 0, sales: 190
    },
    {
      id: uuid(), name: '手冲咖啡壶套装', slug: 'pour-over-kettle',
      desc: '<p>细口控流壶 + 滤杯 + 分享壶，手冲入门一套齐。</p>',
      price: 229.99, originalPrice: 299.99, stock: 85, catId: catKitchen, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/pour-over-kettle.svg']),
      specs: JSON.stringify([{"name": "容量", "value": "600ml"}, {"name": "材质", "value": "304 不锈钢"}, {"name": "套装", "value": "壶 + 滤杯 + 分享壶"}]),
      tags: '热销,新品', featured: 1, isNew: 1, recommended: 1, sales: 640
    },
    {
      id: uuid(), name: '陶瓷马克杯 350ml', slug: 'ceramic-mug-350',
      desc: '<p>厚胎保温，杯口圆润，可微波可洗碗机。</p>',
      price: 39.99, originalPrice: 59.99, stock: 260, catId: catKitchen, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/ceramic-mug-350.svg']),
      specs: JSON.stringify([{"name": "容量", "value": "350ml"}, {"name": "材质", "value": "陶瓷"}, {"name": "适用", "value": "微波炉 / 洗碗机"}]),
      tags: '畅销', featured: 0, isNew: 0, recommended: 1, sales: 2260
    },
    {
      id: uuid(), name: '316 不锈钢保温杯', slug: 'insulated-bottle-500',
      desc: '<p>6 小时保温 / 12 小时保冷，一键弹盖单手可开。</p>',
      price: 99.99, originalPrice: 139.99, stock: 200, catId: catKitchen, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/insulated-bottle-500.svg']),
      specs: JSON.stringify([{"name": "容量", "value": "500ml"}, {"name": "材质", "value": "316 不锈钢"}, {"name": "保温", "value": "6 小时"}]),
      tags: '热销', featured: 0, isNew: 0, recommended: 1, sales: 1730
    },
    {
      id: uuid(), name: '分格便当盒套装', slug: 'bento-box-set',
      desc: '<p>三分格 + 独立汤盒，可微波，密封圈防漏。</p>',
      price: 79.99, originalPrice: 109.99, stock: 150, catId: catKitchen, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/bento-box-set.svg']),
      specs: JSON.stringify([{"name": "容量", "value": "900ml"}, {"name": "格数", "value": "3 格 + 汤盒"}, {"name": "适用", "value": "微波炉"}]),
      tags: '新品', featured: 0, isNew: 1, recommended: 0, sales: 520
    },
    {
      id: uuid(), name: '相思木砧板', slug: 'acacia-cutting-board',
      desc: '<p>整木拼接不易开裂，双面可用，带导流槽。</p>',
      price: 69.99, originalPrice: 99.99, stock: 120, catId: catKitchen, brand: '诺瓦家居',
      images: JSON.stringify(['/images/products/acacia-cutting-board.svg']),
      specs: JSON.stringify([{"name": "材质", "value": "相思木"}, {"name": "尺寸", "value": "38×25cm"}, {"name": "细节", "value": "导流槽"}]),
      tags: '', featured: 0, isNew: 0, recommended: 0, sales: 380
    },
];

  for (const p of products) {
    await insertProduct.run(p.id, p.name, p.slug, p.desc, p.price, p.originalPrice, p.stock, p.catId, p.brand, p.images, p.specs, p.tags, p.featured, p.isNew, p.recommended, p.sales);
  }

  // ========== Product SKUs ==========
  const insertSku = db.prepare(
    `INSERT INTO product_skus (id, product_id, spec_info, price, stock, sku_code) VALUES (?, ?, ?, ?, ?, ?)`
  );

  // SKUs for Classic Fit Oxford Shirt (product index 0)
  const shirtId = products[0].id;
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'S' }), null, 30, 'OXF-WHT-S');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'M' }), null, 50, 'OXF-WHT-M');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'L' }), null, 45, 'OXF-WHT-L');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '白色', '尺码': 'XL' }), null, 25, 'OXF-WHT-XL');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'S' }), null, 20, 'OXF-BLU-S');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'M' }), null, 40, 'OXF-BLU-M');
  await insertSku.run(uuid(), shirtId, JSON.stringify({ '颜色': '浅蓝色', '尺码': 'L' }), null, 35, 'OXF-BLU-L');

  // SKUs for Floral Print Midi Dress (product index 3)
  const dressId = products[3].id;
  await insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'XS' }), null, 20, 'DRS-FLR-XS');
  await insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'S' }), null, 35, 'DRS-FLR-S');
  await insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'M' }), null, 40, 'DRS-FLR-M');
  await insertSku.run(uuid(), dressId, JSON.stringify({ '尺码': 'L' }), null, 25, 'DRS-FLR-L');

  // SKUs for NovaPhone 15 Pro (product index 8)
  const phoneId = products[8].id;
  await insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '原色钛金属' }), null, 15, 'NP15P-NAT');
  await insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '蓝色钛金属' }), null, 20, 'NP15P-BLU');
  await insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '黑色钛金属' }), null, 10, 'NP15P-BLK');
  await insertSku.run(uuid(), phoneId, JSON.stringify({ '颜色': '白色钛金属' }), null, 5, 'NP15P-WHT');

  // ========== Banners ==========
  const insertBanner = db.prepare(
    `INSERT INTO banners (id, title, subtitle, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`
  );

  await insertBanner.run(uuid(), '全场大促火热进行中', '精选商品低至5折，限时抢购，手慢无！', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop', '/categories/clothing', 1);
  await insertBanner.run(uuid(), '数码新品驾到', '探索诺瓦科技最新力作，享独家首发特惠。', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=500&fit=crop', '/categories/electronics', 2);
  await insertBanner.run(uuid(), '家居焕新季', '精选家居好物，打造理想生活空间。30%起让利。', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=500&fit=crop', '/categories/home-living', 3);
  await insertBanner.run(uuid(), '周末免邮狂欢', '全场满 ¥99 免邮，马上开抢！', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop', '/categories/electronics', 4);

  // ========== Announcements ==========
  const insertAnnouncement = db.prepare(
    `INSERT INTO announcements (id, content, link_url, is_active) VALUES (?, ?, ?, 1)`
  );

  await insertAnnouncement.run(uuid(), '🚚 全场满 ¥99 免邮配送', '/help');
  await insertAnnouncement.run(uuid(), '🎉 新用户首单享9折优惠——使用优惠码: WELCOME10', '/auth/login');

  // ========== Addresses ==========
  const insertAddress = db.prepare(
    `INSERT INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, zip_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const addr1Id = uuid();
  const addr2Id = uuid();
  await insertAddress.run(addr1Id, userId, '张三', '13800138001', 'sichuan', 'guangan', 'guanganqu', '商业街123号1栋3单元502室', '638000', 1);
  await insertAddress.run(addr2Id, userId, '张三', '13800138001', 'sichuan', 'guangan', 'guanganqu', '滨江路88号2栋1204室', '638000', 0);

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

  await insertOrder.run(order1Id, orderNo1, userId, 'delivered', 0, 0, 0, 'credit_card', addressSnapshot, '请放在门口', new Date(Date.now() - 86400000 * 14).toISOString(), new Date(Date.now() - 86400000 * 13).toISOString(), new Date(Date.now() - 86400000 * 7).toISOString());
  await insertOrderItem.run(uuid(), order1Id, products[8].id, products[8].name, JSON.parse(products[8].images)[0], JSON.stringify({ '颜色': '蓝色钛金属' }), 0, 1, 0);
  // Add discount to simulate coupon
  db.prepare('UPDATE orders SET discount_amount = 0 WHERE id = ?').run(order1Id);
  db.prepare('UPDATE orders SET total_amount = 0 WHERE id = ?').run(order1Id);

  await insertOrder.run(order2Id, orderNo2, userId, 'shipped', 0, 0, 0, 'paypal', addressSnapshot, '', new Date(Date.now() - 86400000 * 3).toISOString(), new Date(Date.now() - 86400000 * 2).toISOString(), null);
  await insertOrderItem.run(uuid(), order2Id, products[6].id, products[6].name, JSON.parse(products[6].images)[0], JSON.stringify({ '尺码': 'M' }), 0, 1, 0);
  await insertOrderItem.run(uuid(), order2Id, products[0].id, products[0].name, JSON.parse(products[0].images)[0], JSON.stringify({ '颜色': '白色', '尺码': 'M' }), 0, 1, 0);

  await insertOrder.run(order3Id, orderNo3, userId, 'pending_payment', 0, 0, 0, '', addressSnapshot, '', null, null, null);
  await insertOrderItem.run(uuid(), order3Id, products[19].id, products[19].name, JSON.parse(products[19].images)[0], '{}', 0, 1, 0);

  // ========== Reviews ==========
  const insertReview = db.prepare(
    `INSERT INTO reviews (id, product_id, user_id, order_id, rating, content, images, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  );

  const reviewProducts = [products[8], products[9], products[11], products[18], products[0], products[12]];
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
    { rating: 4, content: '衬衫不错，但版型偏大了一点，建议买小一号。', images: JSON.stringify(['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=400&fit=crop']) },
    { rating: 5, content: '音质简直难以置信。声音清澈透亮，降噪也是一流水平。', images: '[]' },
    { rating: 5, content: '送礼首选！蜡烛套装包装精美，朋友特别喜欢。', images: '[]' },
  ];

  for (let i = 0; i < reviewData.length; i++) {
    const prod = reviewProducts[i % reviewProducts.length];
    await insertReview.run(uuid(), prod.id, userId, order1Id, reviewData[i].rating, reviewData[i].content, reviewData[i].images);
  }

  // ========== Favorites ==========
  const insertFavorite = db.prepare(
    `INSERT OR IGNORE INTO favorites (id, user_id, product_id) VALUES (?, ?, ?)`
  );

  const favProductIds = [products[8].id, products[12].id, products[18].id, products[0].id, products[19].id];
  for (const pid of favProductIds) {
    await insertFavorite.run(uuid(), userId, pid);
  }

  // ========== Site Settings ==========
  const insertSetting = db.prepare(
    `INSERT INTO site_settings (id, key, value) VALUES (?, ?, ?)`
  );

  await insertSetting.run(uuid(), 'site_name', '海南等下雪');
  await insertSetting.run(uuid(), 'site_description', '您的高品质在线购物平台');
  await insertSetting.run(uuid(), 'contact_email', 'support@novamart.com');
  await insertSetting.run(uuid(), 'contact_phone', '+1 (555) 123-4567');
  await insertSetting.run(uuid(), 'free_shipping_threshold', '50');
  await insertSetting.run(uuid(), 'default_shipping_fee', '5.99');
  await insertSetting.run(uuid(), 'tax_rate', '0.08');
}
