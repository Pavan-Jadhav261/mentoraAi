import { SmartCodeEditorWrapper } from "@/components/smart-editor/SmartCodeEditorWrapper";
import NavPill from "@/components/nav-pill";

export const metadata = {
  title: "Smart Code Editor | Mentora",
  description: "AI-powered coding practice and editor page.",
};

export default function SmartEditorPage() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <NavPill />
      <main className="flex-1 w-full pt-20 pb-4 px-4 overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden border border-border shadow-lg">
          <SmartCodeEditorWrapper />
        </div>
      </main>
    </div>
  );
}
