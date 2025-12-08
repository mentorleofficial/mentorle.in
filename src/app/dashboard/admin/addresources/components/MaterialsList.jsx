import { Plus, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialItem from "./MaterialItem";

export default function MaterialsList({
  materials,
  addMaterial,
  updateMaterial,
  removeMaterial
}) {
  // Sort materials by created_at timestamp (newest first)
  const sortedMaterials = [...materials].sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB - dateA; // Newest first
  });

  return (
    <div className="space-y-4">
      {/* Compact Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-black" />
          <h3 className="text-lg font-bold text-black uppercase tracking-wider">Materials</h3>
          <div className="bg-black text-white px-2 py-1 text-xs font-bold">
            {materials.length}
          </div>
          {materials.length > 1 && (
            <span className="text-xs text-black/70 font-medium">• Newest First</span>
          )}
        </div>
        <Button
          onClick={addMaterial}
          className="
            border border-black rounded-none font-bold uppercase tracking-wider text-xs px-3 py-2 h-auto
            bg-black text-white hover:bg-white hover:text-black
            transition-all duration-200 flex items-center gap-1
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
            hover:translate-x-[1px] hover:translate-y-[1px]
          "
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {/* Content Section */}
      {materials.length === 0 ? (
        <div className="bg-white border-2 border-black p-8 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-3">
            <div className="relative">
              <FileText className="w-12 h-12 mx-auto text-black/30" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                0
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-black uppercase tracking-wider">No Materials</p>
              <p className="text-xs text-black/70 font-medium">
                Click "Add" to create your first study resource
              </p>
            </div>
            <Button
              onClick={addMaterial}
              className="
                border border-black rounded-none font-bold uppercase tracking-wider text-xs px-4 py-2 h-auto
                bg-black text-white hover:bg-white hover:text-black
                transition-all duration-200 flex items-center gap-1
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[1px] hover:translate-y-[1px]
              "
            >
              <Plus className="w-3 h-3" />
              Get Started
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedMaterials.map((material, index) => {
            // Find the original index in the unsorted array for proper update/remove functionality
            const originalIndex = materials.findIndex(m => 
              m.created_at === material.created_at && 
              m.description === material.description && 
              m.url === material.url
            );
            
            return (
              <MaterialItem
                key={`${material.created_at}-${index}`}
                material={material}
                index={originalIndex}
                displayIndex={index} // For display purposes (newest first numbering)
                updateMaterial={updateMaterial}
                removeMaterial={removeMaterial}
              />
            );
          })}
          
          {/* Compact Add More Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={addMaterial}
              className="
                border border-black rounded-none font-bold uppercase tracking-wider text-xs px-4 py-2 h-auto
                bg-white text-black hover:bg-black hover:text-white
                transition-all duration-200 flex items-center gap-1
                shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[-1px] hover:translate-y-[-1px]
              "
            >
              <Plus className="w-3 h-3" />
              Add More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
