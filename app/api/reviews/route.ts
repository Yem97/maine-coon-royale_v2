import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
export async function GET() {
  const { data } = await supabaseAdmin.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
  return NextResponse.json({ reviews: data || [] });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.reviewer_name || !body.reviewer_country || !body.review_text || !body.rating)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const { error } = await supabaseAdmin.from('reviews').insert({ ...body, is_approved: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
