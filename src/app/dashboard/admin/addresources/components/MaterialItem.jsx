import { Trash2, FileText, Link, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Utility function for formatting timestamps
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'New';
  
  return `${new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export default function MaterialItem({ 
  material, 
  index, 
  displayIndex, // New prop for display numbering
  updateMaterial, 
  removeMaterial 
}) {
  const hasContent = material.description.trim() || material.url.trim();
  // Use displayIndex if provided, otherwise fall back to index
  const showIndex = displayIndex !== undefined ? displayIndex : index;

  return (
    <div className={`
      border-2 border-black bg-white p-3 transition-all duration-200
      hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]
      ${hasContent ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}
    `}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-black' : 'bg-black/30'}`}></div>
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            #{index + 1}
          </span>
          <div className="flex items-center gap-1 text-black/70">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">
              {formatTimestamp(material.created_at)}
            </span>
          </div>
        </div>
        <Button
          onClick={() => removeMaterial(index)}
          className="
            border border-black rounded-none font-bold uppercase tracking-wider text-xs px-2 py-1 h-auto
            bg-white text-black hover:bg-black hover:text-white
            transition-all duration-200 flex items-center gap-1
            shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
          "
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Description Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-1 text-xs font-bold text-black uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            Description *
          </label>
          <Textarea
            placeholder="e.g., Complete JavaScript course from basics to advanced..."
            value={material.description}
            onChange={(e) => updateMaterial(index, 'description', e.target.value)}
            rows={3}
            className="
              border border-black rounded-none bg-white text-black placeholder:text-black/50 
              focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
              transition-all duration-200 font-medium text-xs resize-none
            "
          />
        </div>

        {/* URL Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-1 text-xs font-bold text-black uppercase tracking-wider">
            <Link className="w-3 h-3" />
            Resource URL *
          </label>
          <Input
            placeholder="https://example.com/course..."
            value={material.url}
            onChange={(e) => updateMaterial(index, 'url', e.target.value)}
            className="
              border border-black rounded-none bg-white text-black placeholder:text-black/50 
              focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
              transition-all duration-200 h-8 font-medium text-xs
            "
          />
        </div>
      </div>
    </div>
  );
}
