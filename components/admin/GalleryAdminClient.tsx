"use client"
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, Loader2, X } from 'lucide-react';
export default function GalleryAdminClient() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image_url: '', category: 'general' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fetchPhotos = async () => { const r = await fetch('/api/gallery'); const d = await r.json(); setPhotos(d.photos || []); };
  useEffect(() => { fetchPhotos(); }, []);
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'gallery-images');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const d = await res.json(); if (d.url) setForm(f => ({ ...f, image_url: d.url })); setUploading(false);
  };
  const handleSubmit = async () => {
    if (!form.image_url) return;
    await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false); setForm({ title: '', image_url: '', category: 'general' }); fetchPhotos();
  };
  const handleDelete = async (id: string) => { if (!confirm('Delete this photo?')) return; await fetch(`/api/gallery/${id}`, { method: 'DELETE' }); fetchPhotos(); };
  const inp = "px-3 py-2.5 rounded-xl bg-navy border border-white/10 text-white text-sm focus:outline-none focus:border-gold placeholder-gray-600";
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl text-white">Gallery</h1><p className="text-gray-500 text-sm mt-1">Manage your photo gallery.</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gold text-navy px-5 py-2.5 rounded-xl font-medium hover:bg-gold-light transition"><Plus size={18} /> Add Photo</button>
      </div>
      {showForm && (
        <div className="glass rounded-2xl border border-gold/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-4"><h3 className="text-white font-medium">Add New Photo</h3><button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))} placeholder="Photo title (optional)" className={`${inp} w-full`} />
            <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))} className={`${inp} w-full`}>
              <option value="general">General</option><option value="kittens">Kittens</option><option value="families">Happy Families</option><option value="cattery">Our Home</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {form.image_url && <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"><Image src={form.image_url} alt="" width={64} height={64} className="w-full h-full object-cover" /></div>}
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 text-sm glass border border-white/10 text-gray-400 hover:text-gold hover:border-gold/30 px-4 py-2 rounded-xl transition disabled:opacity-50">
              {uploading ? <><Loader2 size={14} className="animate-spin" />Uploading...</> : <><Upload size={14} />Upload Photo</>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={!form.image_url} className="bg-gold text-navy px-6 py-2.5 rounded-xl font-medium hover:bg-gold-light transition disabled:opacity-50">Add to Gallery</button>
            <button onClick={() => setShowForm(false)} className="glass border border-white/10 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl transition">Cancel</button>
          </div>
        </div>
      )}
      {photos.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-gold/10"><p className="text-4xl mb-4">🖼️</p><p className="text-gray-400">No photos yet.</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(p => (
            <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-square border border-gold/10 hover:border-gold/30 transition">
              <Image src={p.image_url} alt={p.title || ''} fill className="object-cover" sizes="300px" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(p.id)} className="bg-red-500/80 text-white p-2 rounded-xl hover:bg-red-500 transition"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
