import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('kittens').update({ ...body, age_weeks: body.age_weeks ? Number(body.age_weeks) : undefined, price_usd: body.price_usd ? Number(body.price_usd) : undefined }).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ kitten: data });
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await supabaseAdmin.from('kittens').delete().eq('id', params.id);
  return NextResponse.json({ success: true });
}
