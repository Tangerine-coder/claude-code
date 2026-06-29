<div align="center">

<img src="public/images/placeholder.svg" alt="Logo" width="80" height="80" style="border-radius:16px;background:linear-gradient(135deg,#0A2647,#FF6B35);padding:12px"/>

# 🌊 海南等下雪 · Nova Mart

### 全栈电商平台 · Next.js 15 · WebGL 动态背景

**一流的视觉效果 + 完整的电商功能 = 即开即用的现代商店**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003b57?logo=sqlite)](https://github.com/WiseLibs/better-sqlite3)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[在线演示](https://hai-nan-deng-xia-xue.onrender.com) · [报告 Bug](../../issues) · [请求功能](../../issues)

</div>

---

## ✨ 为什么选择 Nova Mart？

<table>
<tr>
<td width="50%">

### 🎨 顶级视觉体验
- **WebGL 流动光轨背景** — 品牌色光轨随鼠标交互
- **BorderGlow 边框光效** — 卡片边框跟随鼠标浮现彩色渐变
- **全站毛玻璃质感** — `backdrop-blur` 半透明卡片悬浮在光轨之上
- **流光骨架屏** — 渐变 shimmer 加载动画替代传统脉冲
- **Framer Motion 滚动动画** — 优雅的入场渐现效果

</td>
<td width="50%">

### 🛒 完整电商功能
- **商品浏览** — 分类/搜索/筛选/排序
- **购物车** — 侧边抽屉 + 全页管理
- **结算流程** — 地址选择 + 订单提交
- **用户中心** — 订单/收藏/历史/地址管理
- **商品详情** — SKU 选择 + 图片灯箱 + 评价系统
- **管理后台** — 仪表盘/商品CRUD/订单管理/用户管理

</td>
</tr>
</table>

---

## 🖼️ 界面预览

| 首页光轨背景 | 商品卡片光效 |
|:---:|:---:|
| WebGL Lightfall + 毛玻璃 Header | BorderGlow 鼠标跟随渐变边框 |

| 商品详情灯箱 | 管理后台仪表盘 |
|:---:|:---:|
| 图片缩放 + 全屏灯箱 | 统计卡片 + 实时数据 |

> 🔗 [在线体验 →](https://hai-nan-deng-xia-xue.onrender.com)

---

## 🚀 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript 5.8 |
| UI | React 18 + Tailwind CSS v4 |
| 动画 | Framer Motion + Swiper.js |
| WebGL | ogl (Lightfall 背景 + BorderGlow 光效) |
| 数据库 | SQLite (better-sqlite3) — 零配置，自动建表+种子 |
| 认证 | JWT (HttpOnly Cookie) + bcryptjs |
| 图标 | react-icons (Feather Icons) |
| 部署 | Render / Vercel / 任意 Node.js 环境 |

---

## ⚡ 3 分钟快速开始

```bash
# 1. 克隆项目
git clone https://github.com/Tangerine-coder/claude-code.git
cd claude-code

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# http://localhost:3000
```

**首次启动自动完成：**
- ✅ 创建 SQLite 数据库
- ✅ 执行 schema 建表
- ✅ 填充种子数据（24 件商品、12 个分类、2 个用户）

---

## 🔑 预置账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | `admin@novamart.com` | `xiao123` |
| 普通用户 | `user@example.com` | `user123` |

> 管理员后台入口：`/admin`

---

## 📦 项目结构

```
src/
├── app/
│   ├── (shop)/           # 商城前台路由
│   │   ├── page.tsx           # 首页
│   │   ├── products/[slug]/   # 商品详情
│   │   ├── categories/[slug]/ # 分类页
│   │   ├── cart/              # 购物车
│   │   ├── checkout/          # 结算
│   │   ├── login/register/    # 登录注册
│   │   ├── search/            # 搜索
│   │   └── user/              # 用户中心
│   ├── admin/             # 管理后台
│   │   ├── products/          # 商品管理
│   │   ├── orders/            # 订单管理
│   │   └── users/             # 用户管理
│   └── api/               # REST API (20+ 端点)
├── components/
│   ├── ui/                # UI 组件库 (15 个组件)
│   ├── home/              # 首页模块
│   ├── product/           # 商品组件
│   ├── layout/            # Header/Footer
│   ├── cart/              # 购物车抽屉
│   └── admin/             # 后台组件
├── lib/                   # 工具库
│   ├── db.ts              # 数据库连接 (自动迁移+种子)
│   ├── auth.ts            # JWT 认证
│   └── seed.ts            # 种子数据
└── types/                 # TypeScript 类型
```

---

## 🎯 特色功能详解

### 🔮 WebGL 动态背景
深蓝底色上流动着蓝色+橙色的光轨，鼠标附近光轨会增亮。所有卡片使用毛玻璃效果悬浮其上，形成迷人的景深层次。

### 💫 BorderGlow 边框光效
产品卡片、分类卡片、登录表单的边框会根据鼠标位置浮现彩色渐变光晕——采用 conic-gradient 遮罩 + mesh gradient 实现。

### 🖼️ 商品图片灯箱
商品详情页点击主图进入全屏灯箱，支持左右切换和点击关闭，毛玻璃按钮控制。

### 📱 移动端粘性底栏
商品详情页滚动超过首屏后，价格+加购按钮固定在底部，提升移动端转化率。

### 🏪 管理后台
完整的仪表盘（今日订单/收入/库存预警）+ 商品/分类/订单/用户 CRUD + 批量操作。

---

## 🚢 部署

### Render（推荐）
1. 创建 **Web Service**，连接 GitHub 仓库
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. 环境变量（可选）：`JWT_SECRET`、`NODE_ENV=production`

### Vercel / 自托管
标准 Next.js 应用，支持任何 Node.js 环境。

---

## 🤝 贡献

欢迎提 Issue 和 PR！如果你想：

- 🎨 改进 UI 设计
- ✨ 添加新功能（优惠券/支付集成/邮件通知）
- 🐛 修复 Bug
- 📝 改进文档

请先开 Issue 讨论你的想法。

---

## 📄 License

MIT © 2025 Tangerine-coder

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

[在线演示](https://hai-nan-deng-xia-xue.onrender.com) · [GitHub](../../) · [提交反馈](../../issues)

</div>
