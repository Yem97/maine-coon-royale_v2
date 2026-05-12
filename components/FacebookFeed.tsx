"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Facebook, Heart, ExternalLink } from 'lucide-react';
export default function FacebookFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => { fetch('/api/facebook').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {}); }, []);
  return (
    <section id="facebook" className="py-20 bg-navy-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4"><Facebook size={24} className="text-gold" /><h2 className="font-display text-4xl md:text-5xl font-semibold text-white">Latest Updates</h2></div>
          <p className="text-gray-400 max-w-xl mx-auto">Follow our journey — new litters, happy families, and life at the cattery.</p>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-10"><Facebook size={48} className="mx-auto mb-4 text-gray-600" /><p className="text-gray-500">Facebook updates coming soon!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="glass rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition group">
                {post.image_url && <div className="relative h-48 overflow-hidden"><Image src={post.image_url} alt="Post" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" /></div>}
                <div className="p-5">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs"><Heart size={13} className="text-gold" /><span>{post.likes || 0} likes</span></div>
                    {post.post_url && <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold text-xs hover:underline">View post <ExternalLink size={11} /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
