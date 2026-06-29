'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { FiChevronDown, FiSearch, FiShoppingBag, FiTruck, FiRefreshCw, FiCreditCard, FiHeadphones } from 'react-icons/fi';
import clsx from 'clsx';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    id: 'shopping',
    title: '购物指南',
    icon: FiShoppingBag,
    items: [
      {
        question: '如何下单？',
        answer: '浏览我们的商品目录，找到您喜欢的商品，选择数量和规格，然后点击"加入购物车"。准备好后，进入购物车并点击"结算"即可完成订单。下单前需要先登录账户。',
      },
      {
        question: '如何搜索商品？',
        answer: '使用页面顶部的搜索栏。您可以按商品名称、品牌或分类进行搜索。在搜索结果页使用筛选器可以按价格、分类或品牌缩小范围。',
      },
      {
        question: '如何使用优惠码？',
        answer: '在结算时，您会找到一个标有"优惠码"或"折扣码"的输入框。输入您的优惠码并点击"应用"。折扣将在支付前体现在您的订单总额中。',
      },
      {
        question: '可以修改或取消订单吗？',
        answer: '如果订单仍处于"待付款"或"已付款"状态，您可以取消订单。一旦订单已发货，则无法取消。如需修改或取消订单，请尽快联系我们的客服团队。',
      },
    ],
  },
  {
    id: 'shipping',
    title: '配送说明',
    icon: FiTruck,
    items: [
      {
        question: '有哪些配送方式？',
        answer: '我们提供标准配送（5-7个工作日）和快递配送（2-3个工作日）。所有满50美元的订单均可享受免费标准配送。',
      },
      {
        question: '如何追踪我的订单？',
        answer: '订单发出后，您将收到一封包含追踪编号的确认邮件。您也可以登录账户在"我的订单"中点击具体订单查看订单状态和追踪信息。',
      },
      {
        question: '是否支持国际配送？',
        answer: '是的，我们支持配送至全球30多个国家和地区。国际运费和配送时间因目的地而异。结算时您可以根据收货地址查看可用的配送方式和费用。',
      },
      {
        question: '包裹丢失或损坏怎么办？',
        answer: '如果您的包裹在运输途中丢失或收到时已损坏，请在预计送达日期或收货后的48小时内联系我们的客服团队。我们将与承运商合作解决问题，并为您安排补发或退款。',
      },
    ],
  },
  {
    id: 'returns',
    title: '退换货规则',
    icon: FiRefreshCw,
    items: [
      {
        question: '退货政策是什么？',
        answer: '我们为大多数商品提供30天退货保障。商品必须保持原状、未使用，所有标签和包装完好无损。部分商品如个人护理产品和清仓商品可能不支持退货。',
      },
      {
        question: '如何申请退货？',
        answer: '在账户中进入"我的订单"，找到您要退货的商品所在订单，点击"申请退货"。按照说明生成退货标签。将商品妥善包装后，送至指定的承运点。',
      },
      {
        question: '退款需要多长时间？',
        answer: '收到您的退货商品后，我们将在3-5个工作日内完成检验并处理退款。退款将退回到您的原支付方式。根据您的银行处理速度，款项可能需要额外3-7个工作日才能到达您的账户。',
      },
      {
        question: '可以换货吗？',
        answer: '是的，大多数商品都支持换货。您可以先为现有商品申请退货，再下单购买需要的替换商品。或者联系我们的客服团队安排直接换货。',
      },
    ],
  },
  {
    id: 'payment',
    title: '支付方式',
    icon: FiCreditCard,
    items: [
      {
        question: '支持哪些支付方式？',
        answer: '我们支持所有主流信用卡和借记卡（Visa、Mastercard、American Express、Discover）、PayPal、Apple Pay和Google Pay。部分区域还支持银行转账。',
      },
      {
        question: '我的支付信息安全吗？',
        answer: '绝对安全。我们采用行业标准的SSL/TLS加密技术保护您的数据。我们从不存储您的完整信用卡信息。所有支付均通过符合PCI-DSS标准的支付网关处理。',
      },
      {
        question: '什么时候会扣款？',
        answer: '下单时即会从您的支付方式中扣款。对于预售商品，您的卡将被授权但不会实际扣款，直到商品发货时才扣款。',
      },
      {
        question: '价格以什么货币显示？',
        answer: '价格默认以美元（USD）显示。根据您所在的地区，您可能可以选择以本地货币查看价格。',
      },
    ],
  },
  {
    id: 'contact',
    title: '联系我们',
    icon: FiHeadphones,
    items: [
      {
        question: '如何联系客服？',
        answer: '您可以通过电子邮件 support@novamart.com、电话 +1 (555) 123-4567 或我们网站上的在线聊天工具联系我们。我们的客服团队全天候为您服务。',
      },
      {
        question: '客服工作时间是什么？',
        answer: '我们的客服团队全天24小时、每周7天（包括节假日）为您服务。在线聊天和电话支持时间可能因地区而异。邮件咨询通常在2-4小时内回复。',
      },
      {
        question: '如何报告网站问题？',
        answer: '如果您在使用我们网站时遇到任何技术问题，请发送邮件至 support@novamart.com，描述问题情况，包括您的浏览器和设备信息。截图也有助于我们诊断问题。',
      },
      {
        question: '有实体店吗？',
        answer: '目前，海南等下雪是一家纯线上零售商。这使我们能够保持有竞争力的价格，并提供比实体店更丰富的商品选择。我们的总部位于美国加利福尼亚州旧金山市商业街123号。',
      },
    ],
  },
];

function AccordionItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
      >
        {question}
        <FiChevronDown
          className={clsx(
            'w-4 h-4 flex-shrink-0 text-[var(--color-text-light)] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shopping: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSections = faqSections.map((section) => {
    if (!searchQuery.trim()) return section;
    const query = searchQuery.toLowerCase();
    const filteredItems = section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
    return { ...section, items: filteredItems };
  }).filter((section) => section.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">帮助中心</h1>
        <p className="text-[var(--color-text-light)] max-w-xl mx-auto">
          查找关于购物、配送、退换货等常见问题的解答。
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-12">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-lighter)] w-5 h-5" />
        <input
          type="text"
          placeholder="搜索帮助内容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
        />
      </div>

      {/* FAQ Sections */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-light)]">未找到与&ldquo;{searchQuery}&rdquo;相关的结果</p>
            <p className="text-sm text-[var(--color-text-lighter)] mt-2">请尝试其他搜索词</p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} className="glass-surface rounded-xl border border-[var(--color-border)] overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <section.icon className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)] flex-1 text-left">{section.title}</h2>
                  <FiChevronDown
                    className={clsx(
                      'w-5 h-5 text-[var(--color-text-light)] transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="px-6 pb-2">
                    {section.items.map((item, idx) => (
                      <AccordionItem key={idx} question={item.question} answer={item.answer} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help */}
      <div className="mt-16 text-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">仍然需要帮助？</h2>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          我们的客服团队全天候为您服务，随时解答您的任何疑问。
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="mailto:support@novamart.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--color-accent)] rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            邮件支持
          </a>
          <a
            href="tel:+15551234567"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors text-sm"
          >
            致电我们
          </a>
        </div>
      </div>
    </div>
  );
}
