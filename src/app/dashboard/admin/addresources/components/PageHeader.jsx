import { Settings, Info } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="mb-4">
      {/* Compact Header */}
      <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-black" />
            <div>
              <h1 className="text-xl font-bold text-black uppercase tracking-wider">
                Study Materials Manager
              </h1>
              <p className="text-black/70 text-xs font-medium">
                Add and organize study materials for different tech domains
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
