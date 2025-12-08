import { BookOpen, Target } from "lucide-react";
import ExistingDomains from "./ExistingDomains";
import CreateNewDomain from "./CreateNewDomain";

export default function DomainSelector({
  availableDomains,
  selectedDomain,
  newDomainName,
  newDisplayName,
  selectDomain,
  updateDisplayName,
  handleDomainNameChange,
  handleDisplayNameChange,
  createNewDomain,
  selectedDomainInfo
}) {
  return (
    <div className="h-fit">
      {/* Compact Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
        <div className="bg-black text-white p-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg font-bold uppercase tracking-wider">Domain Management</h2>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <ExistingDomains
            availableDomains={availableDomains}
            selectedDomain={selectedDomain}
            selectDomain={selectDomain}
            updateDisplayName={updateDisplayName}
          />

          <CreateNewDomain
            newDomainName={newDomainName}
            newDisplayName={newDisplayName}
            handleDomainNameChange={handleDomainNameChange}
            handleDisplayNameChange={handleDisplayNameChange}
            createNewDomain={createNewDomain}
          />
        </div>
      </div>
    </div>
  );
}
