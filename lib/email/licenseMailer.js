import nodemailer from "nodemailer";

/**
 * Creates and returns a nodemailer transporter based on environment variables.
 * Supports SMTP (Google Workspace, Brevo, Mailgun, AWS SES, etc.)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Generates the clean HTML email template for license delivery.
 * Design aligned with AsKing brand tokens (Dark green #12281F, Accent #B8F55C).
 */
function buildLicenseEmailHtml({ customerName, customerEmail, activationCode, supportPhone }) {
  const safeName = customerName || "Pelanggan Terhormat";
  const safePhone = supportPhone || "6287769005244";

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Aktivasi AsKing Customer Manager</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #11231B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAF7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #DEE7DF; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #12281F; padding: 36px 32px; text-align: left;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B8F55C; display: block; margin-bottom: 8px;">AsKing &bull; Customer Manager</span>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #F2F7F4; line-height: 1.3;">Kode Aktivasi Lisensi Anda</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #A5B8AD;">Terima kasih telah bergabung. Akses lisensi seumur hidup Anda kini siap digunakan.</p>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #11231B;">
                Halo <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #556A60;">
                Transaksi Anda berhasil diverifikasi. Akun AsKing Anda telah dibuatkan secara otomatis dengan paket <strong>Lisensi Sekali Bayar (Lifetime)</strong> dan kuota <strong>1.500 Kredit AI</strong>.
              </p>

              <!-- Activation Code Box -->
              <div style="background-color: #F8FAF7; border: 2px dashed #B8F55C; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 28px;">
                <span style="font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #184530; display: block; margin-bottom: 8px;">Kode Aktivasi & Password Akses</span>
                <div style="font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #12281F; background-color: #FFFFFF; padding: 12px 20px; border-radius: 8px; border: 1px solid #CFE2D3; display: inline-block;">
                  ${activationCode}
                </div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6B8075;">
                  Simpan kode ini dengan aman. Kode ini berfungsi sebagai kata sandi login Anda.
                </p>
              </div>

              <!-- Quick Steps -->
              <h2 style="font-size: 16px; font-weight: 700; color: #12281F; margin: 0 0 14px 0;">Cara Masuk ke Aplikasi Desktop:</h2>
              <ol style="margin: 0 0 28px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #33443C;">
                <li>Buka aplikasi <strong>AsKing Desktop</strong> di komputer Anda.</li>
                <li>Pada layar awal aktivasi, masukkan:
                  <ul style="margin: 4px 0 0 0; padding-left: 18px; color: #184530;">
                    <li><strong>Email:</strong> ${customerEmail}</li>
                    <li><strong>Kode Aktivasi:</strong> ${activationCode}</li>
                  </ul>
                </li>
                <li>Klik tombol <strong>Aktivasi & Masuk</strong> untuk langsung mulai bekerja.</li>
              </ol>

              <!-- Important Policy Notice -->
              <div style="background-color: #EBF1EB; border-left: 4px solid #184530; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px;">
                <strong style="font-size: 13px; color: #12281F; display: block; margin-bottom: 4px;">Ketentuan Penggunaan Lisensi:</strong>
                <ul style="margin: 0; padding-left: 16px; font-size: 12.5px; color: #556A60; line-height: 1.6;">
                  <li><strong>1 Perangkat Aktif:</strong> Lisensi ini dikhususkan untuk 1 komputer aktif.</li>
                  <li><strong>Pindah Perangkat:</strong> Jika Anda berganti komputer atau install ulang OS, hubungi Tim Bantuan untuk mereset tautan perangkat Anda.</li>
                </ul>
              </div>

              <!-- Support Contact -->
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6B8075;">
                Butuh panduan atau bantuan teknis? Hubungi kami langsung melalui WhatsApp di 
                <a href="https://wa.me/${safePhone}" style="color: #184530; font-weight: 700; text-decoration: underline;">+${safePhone}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAF7; padding: 20px 32px; border-top: 1px solid #DEE7DF; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #889A90;">
                &copy; ${new Date().getFullYear()} AsKing Customer Manager &bull; GoDiscus Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Sends the license delivery email.
 * If SMTP is not yet configured, gracefully logs the details without throwing an unhandled exception.
 */
export async function sendLicenseDeliveryEmail({
  customerEmail,
  customerName,
  activationCode,
}) {
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "6287769005244";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "asking@godiscus.com";

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[LicenseMailer] SMTP is not configured in environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS). ` +
      `Email skipped, but activation code generated successfully: ${activationCode} for ${customerEmail}`
    );
    return {
      sent: false,
      reason: "SMTP not configured in environment variables.",
      activationCode,
    };
  }

  try {
    const html = buildLicenseEmailHtml({
      customerName,
      customerEmail,
      activationCode,
      supportPhone,
    });

    const info = await transporter.sendMail({
      from: `"AsKing Customer Manager" <${process.env.SMTP_FROM || supportEmail}>`,
      to: customerEmail,
      subject: `Kode Aktivasi Lisensi AsKing Customer Manager: ${activationCode}`,
      html,
    });

    console.log(`[LicenseMailer] ✅ License email successfully sent to ${customerEmail}. MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, activationCode };
  } catch (error) {
    console.error(`[LicenseMailer] ❌ Error sending license email to ${customerEmail}:`, error.message);
    return { sent: false, error: error.message, activationCode };
  }
}

/**
 * Generates the clean HTML email template for Top Up AI Credit confirmation.
 * Design aligned with AsKing brand tokens (Dark green #12281F, Accent #B8F55C).
 */
function buildTopUpEmailHtml({
  customerName,
  customerEmail,
  creditsAdded,
  newTotalCredits,
  refId,
  supportPhone,
}) {
  const safeName = customerName || "Pelanggan Terhormat";
  const safePhone = supportPhone || "6287769005244";
  const formattedAdded = Number(creditsAdded || 0).toLocaleString("id-ID");
  const formattedTotal = Number(newTotalCredits || 0).toLocaleString("id-ID");

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top Up AI Credit Berhasil - AsKing Customer Manager</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #11231B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAF7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #DEE7DF; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #12281F; padding: 36px 32px; text-align: left;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B8F55C; display: block; margin-bottom: 8px;">AsKing &bull; Customer Manager</span>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #F2F7F4; line-height: 1.3;">Top Up AI Credit Berhasil!</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #A5B8AD;">Kredit AI Anda telah ditambahkan ke akun Anda dan langsung aktif.</p>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #11231B;">
                Halo <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #556A60;">
                Pembayaran Top Up AI Credit Anda telah berhasil kami verifikasi. Kuota otomatisasi AI asisten pelanggan Anda telah diperbarui.
              </p>

              <!-- Credit Balance Summary Box -->
              <div style="background-color: #F8FAF7; border: 2px solid #DEE7DF; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 16px; border-bottom: 1px dashed #DEE7DF;">
                      <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #6B8075; display: block;">Credit Ditambahkan</span>
                      <strong style="font-size: 22px; color: #184530; font-weight: 800;">+${formattedAdded} Credit</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 16px;">
                      <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #6B8075; display: block;">Total Saldo AI Credit Anda</span>
                      <strong style="font-size: 28px; color: #12281F; font-weight: 800;">${formattedTotal} Credit</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Transaction Info -->
              <table width="100%" cellspacing="0" cellpadding="8" style="background-color: #EBF1EB; border-radius: 10px; font-size: 13px; color: #33443C; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #6B8075; font-weight: 600;">Email Akun:</td>
                  <td width="65%" style="font-weight: 700; color: #11231B;">${customerEmail}</td>
                </tr>
                <tr>
                  <td style="color: #6B8075; font-weight: 600;">No. Referensi:</td>
                  <td style="font-family: monospace; font-weight: 700; color: #11231B;">${refId || "-"}</td>
                </tr>
                <tr>
                  <td style="color: #6B8075; font-weight: 600;">Status:</td>
                  <td style="font-weight: 700; color: #184530;">Langsung Aktif di Aplikasi Desktop</td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13.5px; line-height: 1.6; color: #556A60;">
                Buka aplikasi <strong>AsKing Desktop</strong> Anda. Saldo AI Credit akan otomatis terbarui secara langsung pada indikator menu Customer Agent.
              </p>

              <!-- Support Contact -->
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6B8075;">
                Butuh bantuan seputar akun atau kuota Anda? Hubungi kami langsung melalui WhatsApp di 
                <a href="https://wa.me/${safePhone}" style="color: #184530; font-weight: 700; text-decoration: underline;">+${safePhone}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAF7; padding: 20px 32px; border-top: 1px solid #DEE7DF; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #889A90;">
                &copy; ${new Date().getFullYear()} AsKing Customer Manager &bull; GoDiscus Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Sends the Top Up AI Credit confirmation email.
 */
export async function sendTopUpConfirmationEmail({
  customerEmail,
  customerName,
  creditsAdded,
  newTotalCredits,
  refId,
}) {
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "6287769005244";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "asking@godiscus.com";

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `[LicenseMailer] SMTP is not configured. Top Up email skipped for ${customerEmail}. Credits added: ${creditsAdded}`
    );
    return {
      sent: false,
      reason: "SMTP not configured in environment variables.",
      creditsAdded,
    };
  }

  try {
    const html = buildTopUpEmailHtml({
      customerName,
      customerEmail,
      creditsAdded,
      newTotalCredits,
      refId,
      supportPhone,
    });

    const info = await transporter.sendMail({
      from: `"AsKing Customer Manager" <${process.env.SMTP_FROM || supportEmail}>`,
      to: customerEmail,
      subject: `Top Up Berhasil: +${Number(creditsAdded || 0).toLocaleString("id-ID")} AI Credit AsKing Customer Manager`,
      html,
    });

    console.log(
      `[LicenseMailer] ✅ Top Up email sent to ${customerEmail}. MessageId: ${info.messageId}`
    );
    return { sent: true, messageId: info.messageId, creditsAdded };
  } catch (error) {
    console.error(
      `[LicenseMailer] ❌ Error sending Top Up email to ${customerEmail}:`,
      error.message
    );
    return { sent: false, error: error.message, creditsAdded };
  }
}
