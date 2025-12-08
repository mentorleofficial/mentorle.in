import { Plus, Hash, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateNewDomain({
  newDomainName,
  newDisplayName,
  handleDomainNameChange,
  handleDisplayNameChange,
  createNewDomain
}) {
  const isFormValid = newDomainName.trim() && newDisplayName.trim();

  return (
    <div className="border-t border-black/20 pt-3 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-black rounded-full"></div>
        <h4 className="text-xs font-bold text-black uppercase tracking-wide">Create New Domain</h4>
      </div>
      
      <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
        <div className="space-y-3">
          {/* Input Fields - Stacked for compactness */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs font-bold text-black uppercase tracking-wider">
                <Hash className="w-3 h-3" />
                Domain ID
              </label>
              <Input
                placeholder="e.g., machine-learning"
                value={newDomainName}
                onChange={(e) => handleDomainNameChange(e.target.value)}
                className="border border-black rounded-none bg-white text-black placeholder:text-black/50 focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-8 font-medium text-xs"
              />
            </div>
            
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs font-bold text-black uppercase tracking-wider">
                <Type className="w-3 h-3" />
                Display Name
              </label>
              <Input
                placeholder="e.g., Machine Learning"
                value={newDisplayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                className="border border-black rounded-none bg-white text-black placeholder:text-black/50 focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-8 font-medium text-xs"
              />
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-end pt-1">
            <Button 
              onClick={createNewDomain}
              disabled={!isFormValid}
              className={`
                border border-black rounded-none font-bold uppercase tracking-wider text-xs px-3 py-1 h-auto
                transition-all duration-200 flex items-center gap-1
                ${isFormValid 
                  ? 'bg-black text-white hover:bg-white hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]' 
                  : 'bg-white text-black/30 cursor-not-allowed border-black/30'
                }
              `}
            >
              <Plus className="w-3 h-3" />
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Compact Info Text */}
      <div className="mt-2 p-2 bg-black/5 border-l-2 border-black">
        <p className="text-xs text-black/70 font-medium">
          <span className="font-bold">ID:</span> Database use • <span className="font-bold">Name:</span> User display
        </p>
      </div>
    </div>
  );
}
