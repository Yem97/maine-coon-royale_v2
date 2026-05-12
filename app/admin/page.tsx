export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import { Crown } from 'lucide-react';

async function getStats() {
  const [k, i, r, g] = await Promise.all([
    supabaseAdmin.from('kittens').select('status'),
    supabaseAdmin.from('inquiries').select('is_read'),
    supabaseAdmin.from('reviews').select('is_approved'),
    supabaseAdmin.from('gallery').select('id'),
  ]);
  const kittens = k.data || [];
  const inquiries = i.data || [];
  const reviews = r.data || [];
  return {
    total: kittens.length,
    available: kittens.filter((x: any) => x.status === 'available').length,
    reserved: kittens.filter((x: any) => x.status === 'reserved').length,
    inquiries: inquiries.length,
    unread: inquiries.filter((x: any) => !x.is_read).length,
    pendingReviews: reviews.filter((x: any) => !x.is_approved).length,
    gallery: (g.data || []).length,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const cards = [
    { label: 'Total Kittens', value: stats.total, color: 'text-gold', href: '/admin/kittens' },
    { label: 'Available', value: stats.available, color: 'text-emerald-400', href: '/admin/kittens' },
    { label: 'Reserved', value: stats.reserved, color: 'text-amber-400', href: '/admin/kittens' },
    { label: 'Inquiries', value: stats.inquiries, color: 'text-blue-400', href: '/admin/inquiries' },
    { label: 'Unread', value: stats.unread, color: 'text-red-400', href: '/admin/inquiries' },
    { label: 'Pending Reviews', value: stats.pendingReviews, color: 'text-purple-400', href: '/admin/reviews' },
    { label: 'Gallery Photos', value: stats.gallery, color: 'text-pink-400', href: '/admin/gallery' },
  ];
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Crown size={24} className="text-gold" />
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back to Maine Coon Royale</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <Link key={c.label} href={c.href} className="glass rounded-2xl border border-gold/10 p-5 hover:border-gold/30 transition">
            <p className={`text-3xl font-display font-semibold mb-1 ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.unread > 0 && (
          <div className="glass rounded-2xl border border-gold/10 p-6">
            <h3 className="font-medium text-white mb-2">📬 {stats.unread} unread {stats.unread === 1 ? 'inquiry' : 'inquiries'}</h3>
            <Link href="/admin/inquiries" className="text-gold text-sm hover:underline">View inquiries →</Link>
          </div>
        )}
        {stats.pendingReviews > 0 && (
          <div className="glass rounded-2xl border border-gold/10 p-6">
            <h3 className="font-medium text-white mb-2">⭐ {stats.pendingReviews} review{stats.pendingReviews > 1 ? 's' : ''} awaiting approval</h3>
            <Link href="/admin/reviews" className="text-gold text-sm hover:underline">Review now →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
