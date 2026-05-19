import nodemailer from "nodemailer";
import { InscriptionPayload } from "./inscription-schema";

// Get SMTP configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "relay.upb.ro";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "25", 10);
const SMTP_USER = process.env.SMTP_USER || "noreply_bileteupbro@relay.upb.ro";
const SMTP_PASS = process.env.SMTP_PASS || "EiWahquahgh5/";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "noreply_bileteupbro@relay.upb.ro";
const CONTACT_FORM_TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL || "noreply_bileteupbro@relay.upb.ro";

// Create the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // True for 465, false for 25/587 (typically uses STARTTLS if available)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    // Prevent failure on self-signed certificates or internal relays common in university systems
    rejectUnauthorized: false,
  },
});

/**
 * Generate a beautifully styled, premium HTML email for the administrator.
 */
function getAdminEmailHtml(data: InscriptionPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Înscriere nouă - Poli Summer Camp</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fc;
          color: #122647;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(31, 56, 112, 0.08);
          border: 1px solid #d7e0ef;
        }
        .header {
          background: linear-gradient(135deg, #1e315f 0%, #2e4d8d 100%);
          padding: 35px 25px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #e2e8f5;
          opacity: 0.9;
        }
        .content {
          padding: 30px 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #3f5ea8;
          border-bottom: 2px solid #eef3fb;
          padding-bottom: 8px;
          margin-top: 25px;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .section-title:first-of-type {
          margin-top: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          padding: 12px 10px;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid #eef3fb;
        }
        th {
          width: 35%;
          color: #536685;
          font-weight: 600;
        }
        td {
          color: #122647;
          font-weight: 500;
        }
        .medical-box {
          background-color: #fff9f0;
          border-left: 4px solid #ff9800;
          padding: 15px;
          border-radius: 4px 8px 8px 4px;
          font-size: 14px;
          color: #b7791f;
          line-height: 1.5;
          margin-top: 10px;
        }
        .medical-box-none {
          background-color: #f4fbf7;
          border-left: 4px solid #2d9d95;
          padding: 12px 15px;
          border-radius: 4px 8px 8px 4px;
          font-size: 14px;
          color: #1e6b65;
          margin-top: 10px;
        }
        .footer {
          background-color: #eef3fb;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #536685;
          border-top: 1px solid #d7e0ef;
        }
        .footer p {
          margin: 5px 0;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 20px;
          background-color: #eef3fb;
          color: #3f5ea8;
          border: 1px solid #cfe0ff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Înscriere Poli Summer Camp</h1>
          <p>Notificare automată de înregistrare în sistem</p>
        </div>
        <div class="content">
          <div class="section-title">Informații Program</div>
          <table>
            <tr>
              <th>Categorie Vârstă</th>
              <td><span class="badge">${data.ageCategory}</span></td>
            </tr>
            <tr>
              <th>Seria aleasă</th>
              <td><strong>${data.series}</strong></td>
            </tr>
          </table>

          <div class="section-title">Date Copil</div>
          <table>
            <tr>
              <th>Nume Copil</th>
              <td>${data.childName}</td>
            </tr>
            <tr>
              <th>Vârstă</th>
              <td>${data.age} ani</td>
            </tr>
            <tr>
              <th>Școală</th>
              <td>${data.school}</td>
            </tr>
          </table>

          <div class="section-title">Date Părinte</div>
          <table>
            <tr>
              <th>Nume Părinte</th>
              <td>${data.parentName}</td>
            </tr>
            <tr>
              <th>Telefon</th>
              <td><a href="tel:${data.phone}" style="color: #3f5ea8; text-decoration: none;">${data.phone}</a></td>
            </tr>
            <tr>
              <th>E-mail</th>
              <td><a href="mailto:${data.email}" style="color: #3f5ea8; text-decoration: none;">${data.email}</a></td>
            </tr>
          </table>

          <div class="section-title">Informații Medicale / Alergii</div>
          ${
            data.medicalInfo && data.medicalInfo.toLowerCase() !== "nu" && data.medicalInfo.trim() !== "-"
              ? `<div class="medical-box">${data.medicalInfo.replace(/\n/g, "<br>")}</div>`
              : `<div class="medical-box-none">Nu sunt raportate probleme medicale, alergii sau afecțiuni.</div>`
          }

          <div class="section-title">Acorduri</div>
          <table>
            <tr>
              <th>Acord GDPR</th>
              <td>✅ Da, consimțământ acordat</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>Acest e-mail a fost trimis automat de pe serverul Poli Summer Camp.</p>
          <p>&copy; ${new Date().getFullYear()} Universitatea Națională de Științe și Tehnologie POLITEHNICA București</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a beautifully styled, premium HTML confirmation email for the parent.
 */
function getParentConfirmationHtml(data: InscriptionPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmare primire cerere - Poli Summer Camp</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7fc;
          color: #122647;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(31, 56, 112, 0.08);
          border: 1px solid #d7e0ef;
        }
        .header {
          background: linear-gradient(135deg, #2e4d8d 0%, #3f5ea8 100%);
          padding: 40px 25px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.12);
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 15px;
          color: #e8efff;
        }
        .content {
          padding: 30px 25px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 17px;
          font-weight: 700;
          color: #1e315f;
          margin-bottom: 15px;
        }
        .intro-text {
          font-size: 15px;
          color: #536685;
          margin-bottom: 25px;
        }
        .details-card {
          background-color: #f8faff;
          border: 1px solid #e2e8f5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .details-title {
          font-weight: 700;
          color: #2e4d8d;
          font-size: 15px;
          margin-bottom: 12px;
          border-bottom: 1px solid #e2e8f5;
          padding-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #eef3fb;
          font-size: 14px;
        }
        .details-row:last-child {
          border-bottom: none;
        }
        .details-label {
          color: #536685;
          font-weight: 600;
        }
        .details-value {
          color: #122647;
          font-weight: 700;
          text-align: right;
        }
        .steps {
          margin-top: 25px;
          margin-bottom: 25px;
        }
        .steps-title {
          font-size: 16px;
          font-weight: 700;
          color: #122647;
          margin-bottom: 15px;
        }
        .step-item {
          display: flex;
          margin-bottom: 15px;
        }
        .step-number {
          background-color: #edf3ff;
          color: #3f5ea8;
          font-weight: 700;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 14px;
          border: 1px solid #cfe0ff;
        }
        .step-content {
          font-size: 14px;
          color: #536685;
          padding-top: 3px;
        }
        .step-content strong {
          color: #122647;
        }
        .cta-box {
          background: linear-gradient(135deg, #edf4ff 0%, #e2e8f5 100%);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #2e4d8d;
          font-weight: 600;
          border: 1px solid #d7e0ef;
          margin-top: 30px;
        }
        .footer {
          background-color: #eef3fb;
          padding: 25px 20px;
          text-align: center;
          font-size: 12px;
          color: #536685;
          border-top: 1px solid #d7e0ef;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #3f5ea8;
          text-decoration: none;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Poli Summer Camp</h1>
          <p>Cerere de înscriere înregistrată cu succes</p>
        </div>
        <div class="content">
          <div class="greeting">Dragă ${data.parentName},</div>
          <div class="intro-text">
            Vă mulțumim pentru interesul acordat taberei de vară <strong>Poli Summer Camp</strong>! 
            Am primit cu succes cererea dvs. de înscriere pentru copilul <strong>${data.childName}</strong>. 
            Mai jos găsiți rezumatul detaliilor transmise:
          </div>

          <div class="details-card">
            <div class="details-title">Rezumat Înscriere</div>
            <div class="details-row">
              <span class="details-label">Nume copil:</span>
              <span class="details-value">${data.childName}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Vârstă copil:</span>
              <span class="details-value">${data.age} ani</span>
            </div>
            <div class="details-row">
              <span class="details-label">Categorie de vârstă:</span>
              <span class="details-value">${data.ageCategory}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Seria aleasă:</span>
              <span class="details-value">${data.series}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Școala copilului:</span>
              <span class="details-value">${data.school}</span>
            </div>
          </div>

          <div class="steps">
            <div class="steps-title">Ce urmează după trimitere?</div>
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <strong>Verificarea locurilor:</strong> Echipa noastră va analiza disponibilitatea locurilor pentru seria selectată.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <strong>Validarea telefonică:</strong> Vă vom contacta în scurt timp pentru validare și confirmare finală.
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <strong>Plata și documentele:</strong> După confirmare, veți primi pe e-mail link-ul de plată securizat și instrucțiunile suplimentare pentru documentele fizice necesare la sosire.
              </div>
            </div>
          </div>

          <div class="cta-box">
            Ne bucurăm să vă avem alături în această vară plină de descoperiri și aventuri științifice!
          </div>
        </div>
        <div class="footer">
          <p>Dacă aveți întrebări, ne puteți contacta la adresa <a href="mailto:marketing@upb.ro">marketing@upb.ro</a>.</p>
          <p>&copy; ${new Date().getFullYear()} Universitatea Națională de Științe și Tehnologie POLITEHNICA București</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a registration email.
 * This will send:
 * 1. An notification email to the administrator (CONTACT_FORM_TO_EMAIL)
 * 2. A confirmation email to the parent (data.email)
 */
export async function sendInscriptionEmails(data: InscriptionPayload): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Send email to Administrator
    const adminMailOptions = {
      from: `"${data.parentName} via Poli Summer Camp" <${SMTP_FROM_EMAIL}>`,
      to: CONTACT_FORM_TO_EMAIL,
      subject: `[Înscriere Nouă] ${data.childName} - ${data.ageCategory} - ${data.series}`,
      html: getAdminEmailHtml(data),
      replyTo: data.email, // Allow the admin to click reply directly to reach the parent
    };

    // 2. Send email to Parent
    const parentMailOptions = {
      from: `"Poli Summer Camp" <${SMTP_FROM_EMAIL}>`,
      to: data.email,
      subject: `Înscriere înregistrată - Poli Summer Camp (${data.childName})`,
      html: getParentConfirmationHtml(data),
    };

    // Send both emails in parallel
    const [adminResult, parentResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(parentMailOptions),
    ]);

    console.log("Admin notification sent:", adminResult.messageId);
    console.log("Parent confirmation sent:", parentResult.messageId);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send SMTP emails:", error);
    return {
      success: false,
      error: error?.message || "Eroare necunoscută la trimiterea e-mailului prin SMTP.",
    };
  }
}
