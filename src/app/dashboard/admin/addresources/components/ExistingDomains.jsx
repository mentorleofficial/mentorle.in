import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Edit3, FileStack } from "lucide-react";

export default function ExistingDomains({ 
  availableDomains, 
  selectedDomain, 
  selectDomain, 
  updateDisplayName 
}) {
  if (availableDomains.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-black rounded-full"></div>
        <h4 className="text-xs font-bold text-black uppercase tracking-wide">Existing Domains</h4>
      </div>
      
      <div className="space-y-2">
        {availableDomains.map((domainData) => (
          <div 
            key={domainData.domain} 
            className={`
              border-2 border-black bg-white p-3 transition-all duration-200
              hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]
              ${selectedDomain === domainData.domain 
                ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform translate-x-[-1px] translate-y-[-1px]' 
                : 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }
            `}
          >
            <div className="space-y-2">
              {/* Top row - Domain selection and info */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => selectDomain(domainData.domain)}
                  className={`
                    border-2 border-black rounded-none font-bold uppercase tracking-wider text-xs px-3 py-1 h-auto
                    transition-all duration-200 flex items-center gap-1
                    ${selectedDomain === domainData.domain
                      ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white text-black hover:bg-black hover:text-white hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                >
                  <Database className="w-3 h-3" />
                  {domainData.domain}
                </Button>
                
                <div className="flex items-center gap-1 text-black/70">
                  <FileStack className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {domainData.materialsCount}
                  </span>
                </div>
              </div>

              {/* Bottom row - Display name and edit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black text-sm">{domainData.displayName}</span>
                  {selectedDomain === domainData.domain && (
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-black/70" />
                  <Input
                    placeholder="Display name"
                    defaultValue={domainData.displayName}
                    className="w-32 h-8 border border-black rounded-none bg-white text-black placeholder:text-black/50 focus:ring-0 focus:border-black text-xs"
                    onBlur={(e) => {
                      if (e.target.value !== domainData.displayName) {
                        updateDisplayName(domainData.domain, e.target.value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
