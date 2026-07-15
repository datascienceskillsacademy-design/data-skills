import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { EnrollModalProvider } from "@/components/auth/EnrollModalProvider";
import { CompleteProfileModal } from "@/components/profile/CompleteProfileModal";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnrollModalProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompleteProfileModal />
    </EnrollModalProvider>
  );
}
