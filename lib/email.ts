import nodemailer from "nodemailer";

type LeadMailPayload = {
  name: string;
  phone: string;
  location: string;
  businessType?: string;
  areaSqft?: number;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
};

export async function sendLeadEmail(payload: LeadMailPayload) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const to = process.env.LEAD_RECEIVER_EMAIL;

  if (!host || !user || !pass || !to) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const html = `
    <h2>New Lead - ArtTech24</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Phone:</strong> ${payload.phone}</p>
    <p><strong>Location:</strong> ${payload.location}</p>
    <p><strong>Business Type:</strong> ${payload.businessType || "N/A"}</p>
    <p><strong>Area (sqft):</strong> ${payload.areaSqft || "N/A"}</p>
    <p><strong>Estimated Cost:</strong> ${payload.estimatedCostMin || "-"} to ${payload.estimatedCostMax || "-"}</p>
  `;

  await transporter.sendMail({
    from: `ArtTech24 Leads <${user}>`,
    to,
    subject: "New Website Lead",
    html,
  });
}
