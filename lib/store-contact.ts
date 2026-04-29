export function getWhatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("880")) {
    return `https://wa.me/${digits}`;
  }

  if (digits.startsWith("0")) {
    return `https://wa.me/88${digits}`;
  }

  return `https://wa.me/${digits}`;
}
