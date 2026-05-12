"use client"
import React, { useEffect, useState } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
export default function ReviewsClient() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string|null>(null);
  const [reply, setReply] = useState('');
  const fetchReviews = async () => { setLoading(true); const r = await fetch('/api/reviews/admin'); const d = await r.json(); setReviews(d.reviews || []); setLoading(false); };
  useEffect(() => { fetchReviews(); }, []);
  const approve = async (id: string) => { await fetch(`/api/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_approved: true }) }); fetchReviews(); };
  const remove = async (id: string) => { await fetch(`/api/reviews/${id}`, { method: 'DELETE' }); fetchReviews(); };
  const submitReply = async (id: string) => { await fetch(`/api/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ admin_reply: reply }) }); setReplyId(null); setReply(''); fetchReviews(); };
  const pending = reviews.filter(r => !r.is_approved);
  const approved = reviews.filter(r => r.is_approved);
  return (
    <div>
      <div className="mb-8"><h1 className="font-display text-3xl text-white">Reviews</h1><p className="text-gray-500 text-sm mt-1">Approve, reply to, or remove customer reviews.</p></div>
      {loading ? <div className="text-center py-20 text-gray-500">Loading...</div> : (
        <>
          {pending.length > 0 && (
            <div className="mb-10">
              <h2 className="text-white font-medium mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />Pending Approval ({pending.length})</h2>
              <div className="space-y-4">
                {pending.map(r => (
                  <div key={r.id} className="glass rounded-2xl border border-amber-500/20 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div><p className="text-white font-medium">{r.reviewer_name}</p><p className="text-gray-500 text-xs">{r.reviewer_country}{r.kitten_name ? ` · ${r.kitten_name}` : ''}</p></div>
                      <div className="flex gap-1">{[1,2,3,4,5].map(n => <Star key={n} size={14} className={n <= r.rating ? 'fill-gold text-gold' : 'text-gray-600'} />)}</div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">"{r.review_text}"</p>
                    <div className="flex gap-2">
                      <button onClick={() => approve(r.id)} className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition"><Check size={13} /> Approve</button>
                      <button onClick={() => remove(r.id)} className="flex items-center gap-1.5 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition"><X size={13} /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-white font-medium mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />Approved ({approved.length})</h2>
            {approved.length === 0 ? <p className="text-gray-500 text-sm">No approved reviews yet.</p> : (
              <div className="space-y-4">
                {approved.map(r => (
                  <div key={r.id} className="glass rounded-2xl border border-gold/10 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div><p className="text-white font-medium">{r.reviewer_name}</p><p className="text-gray-500 text-xs">{r.reviewer_country}</p></div>
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-1">{[1,2,3,4,5].map(n => <Star key={n} size={13} className={n <= r.rating ? 'fill-gold text-gold' : 'text-gray-600'} />)}</div>
                        <button onClick={() => remove(r.id)} className="text-gray-500 hover:text-red-400 transition ml-2"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">"{r.review_text}"</p>
                    {r.admin_reply ? (
                      <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 text-xs text-gray-400"><p className="text-gold font-medium mb-1">✦ Your reply</p>{r.admin_reply}</div>
                    ) : replyId === r.id ? (
                      <div className="space-y-2">
                        <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Write your reply..." className="w-full px-3 py-2 rounded-xl bg-navy border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-gold" />
                        <div className="flex gap-2">
                          <button onClick={() => submitReply(r.id)} className="text-xs bg-gold text-navy px-4 py-2 rounded-xl font-medium hover:bg-gold-light transition">Post Reply</button>
                          <button onClick={() => setReplyId(null)} className="text-xs text-gray-500 hover:text-white transition">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyId(r.id)} className="flex items-center gap-1.5 text-xs glass border border-white/10 text-gray-400 hover:text-gold hover:border-gold/30 px-3 py-1.5 rounded-xl transition"><MessageSquare size={13} /> Reply</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
