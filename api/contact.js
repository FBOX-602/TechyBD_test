import { json, methodNotAllowed, noStore, readJson, sendError } from "../lib/cms/http.js";
import { createItem } from "../lib/cms/db.js";

const RECEIVER_EMAIL = "fmdomar602@gmail.com";

export default async function handler(req, res) {
  noStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJson(req);
    const firstName = String(body?.firstName || "").trim();
    const lastName = String(body?.lastName || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const notes = String(body?.notes || body?.message || "").trim();

    if (!firstName || !email || !notes) {
      return json(res, 400, { error: "First Name, Email, and Project Message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(res, 400, { error: "Invalid email address format." });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const subject = `New Website Inquiry from ${fullName} (Techy BD)`;
    const textContent = `
NEW CONTACT FORM SUBMISSION
===========================
Name: ${fullName}
Email: ${email}
Phone / WhatsApp: ${phone || "Not provided"}

Project Details & Message:
--------------------------
${notes}

Submitted at: ${new Date().toISOString()}
Target Recipient: ${RECEIVER_EMAIL}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background: #06142F; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; color: #ffffff;">Techy BD — New Website Inquiry</h2>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <p style="font-size: 16px; font-weight: bold; margin-top: 0;">You have received a new contact form submission:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px; color: #64748b;">Full Name:</td><td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email Address:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #ff6500; font-weight: bold;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone / WhatsApp:</td><td style="padding: 8px 0; color: #0f172a;">${phone || "Not provided"}</td></tr>
          </table>
          <div style="background: #f8fafc; border-left: 4px solid #ff6500; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #0f172a;">Project Details / Message:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #334155;">${notes}</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Sent automatically from Techy BD Website Contact Form to <strong>${RECEIVER_EMAIL}</strong>.</p>
        </div>
      </div>
    `;

    // Server-side email delivery providers (Resend, SendGrid, SMTP, Webhook)
    let emailSent = false;

    // 1. Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendResp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Techy BD Contact <onboarding@resend.dev>",
            to: [RECEIVER_EMAIL],
            reply_to: email,
            subject,
            text: textContent,
            html: htmlContent,
          }),
        });
        if (resendResp.ok) {
          emailSent = true;
        } else {
          const errData = await resendResp.json().catch(() => ({}));
          console.warn("[Contact API] Resend dispatch failed:", errData);
        }
      } catch (resendErr) {
        console.warn("[Contact API] Resend request failed:", resendErr.message);
      }
    }

    // 2. SendGrid API
    if (!emailSent && process.env.SENDGRID_API_KEY) {
      try {
        const sgResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: RECEIVER_EMAIL }] }],
            from: { email: process.env.EMAIL_FROM || "info@techybd.com", name: "Techy BD Contact" },
            reply_to: { email, name: fullName },
            subject,
            content: [
              { type: "text/plain", value: textContent },
              { type: "text/html", value: htmlContent },
            ],
          }),
        });
        if (sgResp.ok) emailSent = true;
      } catch (sgErr) {
        console.warn("[Contact API] SendGrid failed:", sgErr.message);
      }
    }

    // 3. Webhook notification
    if (process.env.CONTACT_WEBHOOK_URL) {
      try {
        await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiver: RECEIVER_EMAIL, name: fullName, email, phone, notes }),
        });
      } catch (whErr) {
        console.warn("[Contact API] Webhook dispatch failed:", whErr.message);
      }
    }

    // 4. Record lead in Supabase database / customer lead store
    try {
      await createItem("customers", {
        name: fullName,
        emailOrPhone: email || phone,
        status: "Lead",
        totalOrders: "New Inquiry",
        totalSpent: "৳ 0",
        notes: `Inquiry for ${RECEIVER_EMAIL}:\n${notes}\nPhone: ${phone}`,
        createdAt: new Date().toISOString(),
      });
    } catch (dbSaveErr) {
      console.warn("[Contact API] Save lead record notice:", dbSaveErr.message);
    }

    return json(res, 200, {
      success: true,
      message: "Message sent successfully!",
      recipient: RECEIVER_EMAIL,
      emailSent,
    });
  } catch (err) {
    return sendError(res, err);
  }
}
