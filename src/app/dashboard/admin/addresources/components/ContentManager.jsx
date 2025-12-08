import { Save, Database, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialsList from "./MaterialsList";

export default function ContentManager({
  selectedDomain,
  currentData,
  saving,
  saveResources,
  addMaterial,
  updateMaterial,
  removeMaterial
}) {
  if (!selectedDomain || !currentData) return null;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-fit">
      {/* Compact Header */}
      <div className="bg-black text-white p-3 border-b-2 border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider">{selectedDomain}</h2>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                Content Management
              </p>
            </div>
          </div>
          
          <Button
            onClick={saveResources}
            disabled={saving}
            className={`
              border border-white rounded-none font-bold uppercase tracking-wider text-xs px-4 py-2 h-auto
              transition-all duration-200 flex items-center gap-1
              ${saving 
                ? 'bg-white/20 text-white/70 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-black hover:text-white hover:border-black shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
              }
            `}
          >
            {saving ? (
              <>
                <Loader className="w-3 h-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <MaterialsList
          materials={currentData.materials}
          addMaterial={addMaterial}
          updateMaterial={updateMaterial}
          removeMaterial={removeMaterial}
        />
      </div>
    </div>
  );
}
