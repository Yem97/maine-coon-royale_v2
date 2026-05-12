import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await supabaseAdmin.from('gallery').delete().eq('id', params.id);
  return NextResponse.json({ success: true });
}
