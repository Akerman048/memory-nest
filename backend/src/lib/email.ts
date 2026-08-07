import { AppError } from "@/errors/app-error.js";

type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
  idempotencyKey: string;
};

export const getFrontendUrl = () =>
  (process.env.FRONTEND_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const sendTransactionalEmail = async ({
  to,
  subject,
  text,
  idempotencyKey,
}: TransactionalEmail) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError(503, "EMAIL_NOT_CONFIGURED", "Email delivery is not configured");
    }

    console.info(`[email:development] To: ${to}\nSubject: ${subject}\n${text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      "User-Agent": "memory-nest/1.0",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!response.ok) {
    throw new AppError(502, "EMAIL_DELIVERY_FAILED", "Email delivery failed");
  }
};
