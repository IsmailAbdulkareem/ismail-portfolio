import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { personSchema, websiteSchema } from "@/lib/structured-data";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <JsonLd data={[personSchema(), websiteSchema()]} />
      <Navbar />
      {children}
      <Footer />
      <ChatLauncher />
    </>
  );
}
