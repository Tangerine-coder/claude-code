import React from 'react';
import type { Metadata } from 'next';
import { FiTruck, FiShield, FiHeadphones, FiAward } from 'react-icons/fi';

export const metadata: Metadata = {
  title: '关于海南等下雪 - 您的高端购物目的地',
  description: '了解海南等下雪 - 我们的故事、使命和对优质购物的承诺。',
};

const features = [
  {
    icon: FiTruck,
    title: '免费配送',
    description: '满50美元免运费。快速可靠的送货上门服务。',
  },
  {
    icon: FiShield,
    title: '安全支付',
    description: '您的支付信息始终受到行业标准加密保护。',
  },
  {
    icon: FiHeadphones,
    title: '全天候支持',
    description: '我们专属的客服团队全天候为您提供帮助。',
  },
  {
    icon: FiAward,
    title: '品质保证',
    description: '每件商品都经过精心挑选，并由我们的满意度保证支持。',
  },
];

const stats = [
  { value: '100K+', label: '满意客户' },
  { value: '50K+', label: '商品总数' },
  { value: '200+', label: '品牌合作' },
  { value: '30+', label: '城市覆盖' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">关于海南等下雪</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            您的高端在线购物目的地，为您连接来自全球各地的优质商品。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-surface rounded-xl shadow-sm border border-[var(--color-border)] p-6 text-center">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">{stat.value}</p>
              <p className="text-sm text-[var(--color-text-light)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">品牌故事</h2>
            <div className="space-y-4 text-[var(--color-text-light)] leading-relaxed">
              <p>
                海南等下雪成立于2020年，秉承一个简单的愿景：打造以品质、便捷和客户满意度为首要目标的高端在线购物体验。
              </p>
              <p>
                从一个小小的电商爱好者团队起步，我们已发展成为最受信赖的在线购物平台之一。我们与超过200个精心挑选的品牌合作，为您带来涵盖时尚、电子产品、家居生活等品类的最佳商品。
              </p>
              <p>
                我们目录中的每一件商品都经过严格筛选。我们相信购物应该令人愉悦而非沮丧。这就是为什么我们投入大量资源打造无缝平台、可靠物流和卓越客服的原因。
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-6xl mb-4">海</p>
              <p className="text-sm text-[var(--color-text-light)]">海南等下雪 - 始于2020</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-6">我们的使命</h2>
          <p className="text-lg text-[var(--color-text-light)] leading-relaxed max-w-3xl mx-auto">
            让全球消费者能够以公道的价格获得优质商品，并享受卓越的服务体验。我们致力于建立一个满意的客户社区，成为他们信赖的首选购物目的地。
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-12">为什么选择海南等下雪</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-light)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white border-t border-[var(--color-border)] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">联系我们</h2>
          <p className="text-[var(--color-text-light)] mb-8 max-w-2xl mx-auto">
            有任何问题或反馈？我们很乐意听取您的意见。我们的团队随时准备为您提供帮助。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-semibold text-[var(--color-text)] mb-1">电子邮箱</p>
              <p className="text-[var(--color-text-light)]">support@novamart.com</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-semibold text-[var(--color-text)] mb-1">电话</p>
              <p className="text-[var(--color-text-light)]">+1 (555) 123-4567</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-semibold text-[var(--color-text)] mb-1">地址</p>
              <p className="text-[var(--color-text-light)]">四川省广安市广安区商业街123号</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
