import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/resend';
export async function GET() {
  const { data } = await supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ inquiries: data || [] });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.full_name || !body.email || !body.country || !body.interest)
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('inquiries').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await Promise.allSettled([sendInquiryNotification(data), sendInquiryConfirmation(data)]);
  return NextResponse.json({ success: true });
}
