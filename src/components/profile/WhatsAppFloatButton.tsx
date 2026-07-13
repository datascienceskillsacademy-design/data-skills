import { MessageCircle } from "lucide-react";
import { SUPPORT_WHATSAPP_NUMBER } from "@/lib/payment";

interface WhatsAppFloatButtonProps {
  name: string;
  email: string;
  courseTitles: string[];
}

export function WhatsAppFloatButton({ name, email, courseTitles }: WhatsAppFloatButtonProps) {
  const courseList = courseTitles.length > 0 ? courseTitles.join(", ") : "a course";
  const message = `Hi, I'm ${name} (${email}). I've enrolled in: ${courseList} on DataSkills and would like some help.`;
  const href = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl shadow-green-900/30 transition-transform hover:scale-105 hover:bg-green-700 active:scale-95"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-75" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
