import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryNotification(inquiry: Record<string, string>) {
  try {
    await resend.emails.send({
      from: 'Maine Coon Royale <noreply@maincoonroyale.com>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Inquiry from ${inquiry.full_name}`,
      html: `<div style="font-family:sans-serif;max-width:600px"><div style="background:#1a1a2e;padding:24px;border-radius:12px 12px 0 0"><h1 style="color:#D4AF37;margin:0">New Inquiry</h1></div><div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px"><p><strong>Name:</strong> ${inquiry.full_name}</p><p><strong>Email:</strong> ${inquiry.email}</p><p><strong>Country:</strong> ${inquiry.country}</p><p><strong>Interest:</strong> ${inquiry.interest}</p>${inquiry.message ? `<p><strong>Message:</strong> ${inquiry.message}</p>` : ''}</div></div>`,
    });
  } catch (e) { console.error('Email error:', e); }
}

export async function sendInquiryConfirmation(inquiry: Record<string, string>) {
  try {
    await resend.emails.send({
      from: 'Maine Coon Royale <noreply@maincoonroyale.com>',
      to: inquiry.email,
      subject: 'We received your inquiry — Maine Coon Royale',
      html: `<div style="font-family:sans-serif;max-width:600px"><div style="background:#1a1a2e;padding:24px;border-radius:12px 12px 0 0"><h1 style="color:#D4AF37;margin:0">Thank you, ${inquiry.full_name}!</h1></div><div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px"><p>We have received your inquiry and will respond within 24 hours.</p><br/><p style="color:#888">— The Maine Coon Royale Team</p></div></div>`,
    });
  } catch (e) { console.error('Email error:', e); }
}
