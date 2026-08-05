import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    // Local dev fallback: no Resend key configured yet, so print the email
    // to the server console instead of failing. Lets you test the full
    // registration/verification flow before wiring up a real provider.
    console.log("\n--- EMAIL (dev fallback, not actually sent) ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(html);
    console.log("--- END EMAIL ---\n");
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "LINKO <noreply@example.com>",
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.APP_URL}/api/auth/verify?token=${token}`;
  await send(
    to,
    "Verify your LINKO account",
    `<p>Welcome to LINKO. Click below to verify your email:</p><p><a href="${url}">${url}</a></p>`
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.APP_URL}/reset-password?token=${token}`;
  await send(
    to,
    "Reset your LINKO password",
    `<p>Click below to reset your password:</p><p><a href="${url}">${url}</a></p>`
  );
}
