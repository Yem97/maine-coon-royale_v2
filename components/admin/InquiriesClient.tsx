"use client"
import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
export default function InquiriesClient() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string|null>(null);
  useEffect(() => { fetch('/api/inquiries').then(r => r.json()).then(d => { setInquiries(d.inquiries || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const markRead = async (id: string) => {
    await fetch(`/api/inquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_read: true }) });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
  };
  return (
    <div>
      <div className="mb-8"><h1 className="font-display text-3xl text-white">Inquiries</h1><p className="text-gray-500 text-sm mt-1">All client messages and waiting list signups.</p></div>
      {loading ? <div className="text-center py-20 text-gray-500">Loading...</div> : inquiries.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-gold/10"><p className="text-4xl mb-4">📬</p><p className="text-gray-400">No inquiries yet.</p></div>
      ) : (
        <div className="glass rounded-2xl border border-gold/10 overflow-hidden divide-y divide-white/5">
          {inquiries.map(inq => (
            <div key={inq.id} className={`${!inq.is_read ? 'bg-gold/5' : ''}`}>
              <div className="px-6 py-4 flex items-center gap-4">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!inq.is_read ? 'bg-gold' : 'bg-gray-700'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-white text-sm">{inq.full_name}</p>
                    <span className="text-xs text-gray-500">{inq.country}</span>
                    <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{inq.interest}</span>
                    {inq.kitten_name && <span className="text-xs text-gray-400">· {inq.kitten_name}</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{inq.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <a href={`mailto:${inq.email}`} className="p-2 rounded-lg text-gray-500 hover:text-gold hover:bg-gold/10 transition"><Mail size={15} /></a>
                  {inq.whatsapp && <a href={`https://wa.me/${inq.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition"><MessageCircle size={15} /></a>}
                  {!inq.is_read && <button onClick={() => markRead(inq.id)} className="p-2 rounded-lg text-gray-500 hover:text-gold hover:bg-gold/10 transition"><Check size={15} /></button>}
                  <button onClick={() => setExpanded(expanded === inq.id ? null : inq.id)} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition">
                    {expanded === inq.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>
              {expanded === inq.id && inq.message && (
                <div className="px-6 pb-4 ml-6">
                  <div className="bg-navy border-l-2 border-gold/30 rounded-xl p-4 text-sm text-gray-400 leading-relaxed">{inq.message}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
