const ITEMS = [
  {
    title: '正品保障',
    desc: '平台自营，假一赔十',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: '7 天无理由退换',
    desc: '签收后 7 天内可退换',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    title: '48 小时发货',
    desc: '满 ¥99 免运费',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
  {
    title: '在线客服',
    desc: '工作日 9:00 - 18:00',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white/70 px-4 py-3"
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[var(--color-text)] truncate">{item.title}</span>
              <span className="block text-xs text-[var(--color-text-light)] truncate">{item.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
