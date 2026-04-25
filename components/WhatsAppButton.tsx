export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918110000533";
  const message = encodeURIComponent("Hi ArtTech24, I need a commercial interior design quote.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      💬
    </a>
  );
}
