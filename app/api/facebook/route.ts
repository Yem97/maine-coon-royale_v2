import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
export async function GET() {
  const { data } = await supabaseAdmin.from('facebook_posts').select('*').order('posted_at', { ascending: false }).limit(6);
  return NextResponse.json({ posts: data || [] });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('facebook_posts').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
