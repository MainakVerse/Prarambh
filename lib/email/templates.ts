/**
 * Transactional email templates. Plain functions returning HTML — no runtime
 * template engine, nothing user-controlled interpolated without escaping.
 */
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const shell = (title: string, body: string) => `<!doctype html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;background:#f6f6f6;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;padding:32px">
    <h2 style="margin:0 0 16px">${esc(title)}</h2>
    ${body}
    <p style="color:#888;font-size:12px;margin-top:32px">
      If you didn't expect this email, you can safely ignore it — or revoke all
      sessions from your account settings.
    </p>
  </div>
</body></html>`;

export function verificationEmail(verifyUrl: string) {
  return {
    subject: "Verify your email",
    html: shell(
      "Verify your email",
      `<p>Confirm this address to finish setting up your account.</p>
       <p><a href="${esc(verifyUrl)}"
             style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          Verify email</a></p>
       <p style="color:#666;font-size:13px">This link expires in 24 hours.</p>`
    ),
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset your password",
    html: shell(
      "Reset your password",
      `<p>Someone (hopefully you) requested a password reset for this account.</p>
       <p><a href="${esc(resetUrl)}"
             style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          Choose a new password</a></p>
       <p style="color:#666;font-size:13px">This link expires in 1 hour and can be used once.
        If you didn't request this, ignore it — your password is unchanged.</p>`
    ),
  };
}

export function newDeviceAlertEmail(info: { time: string; ip: string; userAgent: string }) {
  return {
    subject: "New sign-in to your account",
    html: shell(
      "New sign-in detected",
      `<p>Your account was just signed in from a device we haven't seen before:</p>
       <ul style="color:#444;font-size:14px">
         <li>Time: ${esc(info.time)}</li>
         <li>IP: ${esc(info.ip)}</li>
         <li>Device: ${esc(info.userAgent)}</li>
       </ul>
       <p>If this was you, no action is needed. If not, revoke all sessions immediately.</p>`
    ),
  };
}

export function revocationAlertEmail() {
  return {
    subject: "Security alert: sessions revoked",
    html: shell(
      "Suspicious token reuse detected",
      `<p>We detected a sign-in credential for your account being used twice —
        a sign it may have been stolen. As a precaution, <strong>all sessions in
        that login chain were revoked</strong>.</p>
       <p>Please sign in again. If you keep receiving this email, your device or
        network may be compromised.</p>`
    ),
  };
}
