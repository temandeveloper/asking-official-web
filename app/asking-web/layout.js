export const metadata = {
  title: "AsKing Web — Omnichannel Customer Manager & AI Automation",
  description:
    "Reimajinasi web responsif aplikasi AsKing: Omnichannel WhatsApp, Telegram, Email, CRM Tickets Kanban, dan AI Customer Agent.",
};

export default function AskingWebLayout({ children }) {
  return (
    <div className="w-screen h-dvh overflow-hidden bg-base-200">
      {children}
    </div>
  );
}
