import { CreditCard } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="mb-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-black flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-wider mb-1">
            User Subscriptions
          </h1>
          <p className="text-sm font-bold text-black/70 uppercase tracking-wide">
            Activate, manage and monitor subscriptions
          </p>
        </div>
      </div>
    </div>
  );
}
