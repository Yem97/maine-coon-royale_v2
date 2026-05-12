import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { error } = await supabaseAdmin.from('reviews').update(body).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await supabaseAdmin.from('reviews').delete().eq('id', params.id);
  return NextResponse.json({ success: true });
}
