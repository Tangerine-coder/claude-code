import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Doc {
  title: string;
  desc: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const DOCS: Record<string, Doc> = {
  privacy: {
    title: '隐私政策',
    desc: '本政策说明演示站点收集哪些信息、如何使用以及你可以如何管理这些信息。',
    updated: '2026-01-01',
    sections: [
      {
        heading: '一、我们收集哪些信息',
        body: [
          '注册时填写：用户名、邮箱、密码（密码以不可逆哈希存储，平台无法查看明文）。',
          '下单时需要：收货人姓名、手机号、收货地址。',
          '使用过程中产生：购物车、收藏、浏览记录、订单记录。',
        ],
      },
      {
        heading: '二、信息如何使用',
        body: [
          '用于完成下单、发货、售后等必要流程，以及展示你的订单与地址。',
          '不会出售、出租你的个人信息，也不会用于与购物无关的营销推送。',
        ],
      },
      {
        heading: '三、信息如何保护',
        body: [
          '个人中心、订单、地址等接口均需登录且仅返回本人数据；后台接口仅管理员可访问。',
          '涉及个人信息的接口不缓存（no-store），并禁止搜索引擎收录。',
          '登录、注册、修改密码等操作有频率限制，防止被暴力尝试。',
        ],
      },
      {
        heading: '四、你的权利',
        body: [
          '你可以在个人中心修改资料与密码，删除收货地址，或联系我们删除账号及关联数据。',
        ],
      },
      {
        heading: '五、演示说明',
        body: [
          '本网站为技术演示原型，不进行真实交易；页面中的商品、订单、联系方式均为模拟测试数据。',
        ],
      },
    ],
  },
  terms: {
    title: '用户协议',
    desc: '使用本站前请阅读以下条款。本站为技术演示，不构成真实交易关系。',
    updated: '2026-01-01',
    sections: [
      {
        heading: '一、协议范围',
        body: [
          '本协议适用于你访问和使用本演示站点的行为。继续使用即视为知悉本站为演示性质。',
        ],
      },
      {
        heading: '二、账号',
        body: [
          '请妥善保管账号密码，不要使用与其他网站相同的密码。',
          '禁止使用脚本批量注册、暴力试密码或攻击站点，违者将被限制访问。',
        ],
      },
      {
        heading: '三、交易说明',
        body: [
          '本站不接入真实支付渠道，下单、订单状态、物流信息均为模拟，不产生任何实际交易与付款义务。',
        ],
      },
      {
        heading: '四、内容与知识产权',
        body: [
          '站内商品图片来自公开图库，仅用于演示排版；商品文案为示例内容。',
        ],
      },
      {
        heading: '五、免责',
        body: [
          '因演示性质导致的数据重置、服务中断，本站不承担责任。',
        ],
      },
    ],
  },
  returns: {
    title: '7 天退换货规则',
    desc: '演示站点的售后规则示例，正式商用前需替换为真实经营主体的规则。',
    updated: '2026-01-01',
    sections: [
      {
        heading: '一、适用范围',
        body: [
          '自签收之日起 7 日内，商品未使用、包装完好且不影响二次销售的，可申请退换。',
        ],
      },
      {
        heading: '二、不支持退换的情况',
        body: [
          '已拆封的贴身衣物、定制类商品、个人护理用品；人为损坏或缺失配件的商品。',
        ],
      },
      {
        heading: '三、运费承担',
        body: [
          '质量问题由平台承担往返运费；非质量问题由买家承担退回运费。订单满 ¥99 免运费。',
        ],
      },
      {
        heading: '四、流程',
        body: [
          '在「我的订单」发起申请 → 客服审核 → 寄回商品 → 收货验收 → 原路退款或换货寄出。',
          '演示环境下该流程不会真实执行。',
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  return {
    title: doc ? doc.title : '未找到页面',
    description: doc?.desc,
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
      <nav className="text-sm text-[var(--color-text-light)] mb-4" aria-label="面包屑导航">
        <Link href="/" className="hover:text-[var(--color-accent)]">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{doc.title}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-2">{doc.title}</h1>
      <p className="text-sm text-[var(--color-text-light)] mb-8">
        最后更新：{doc.updated}　·　本页面为演示文本，不构成法律意见
      </p>

      <div className="space-y-8">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">{s.heading}</h2>
            {s.body.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-[var(--color-text-light)] mb-1.5">
                {line}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-white/70 p-4">
        <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
          提示：本站为技术演示原型，不进行真实交易，页面中的商品、订单、地址、电话、备案信息均为模拟数据。
        </p>
      </div>
    </div>
  );
}
