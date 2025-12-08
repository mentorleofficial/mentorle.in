import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltersSection({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) {
  return (
    <div className="bg-white border-2 border-black p-3 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="xl:col-span-3">
          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black w-3 h-3" />
            <Input
              placeholder="Email, domain, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                pl-7 border border-black rounded-none bg-white text-black placeholder:text-black/50 
                focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                transition-all duration-200 font-medium text-xs h-8
              "
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-black text-black uppercase tracking-wider mb-1">
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="
              border border-black rounded-none bg-white text-black
              focus:ring-0 focus:border-black focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
              transition-all duration-200 font-medium text-xs h-8
            ">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border border-black rounded-none bg-white">
              <SelectItem value="all" className="font-medium text-xs">All Status</SelectItem>
              <SelectItem value="pending" className="font-medium text-xs">Pending</SelectItem>
              <SelectItem value="active" className="font-medium text-xs">Active</SelectItem>
              <SelectItem value="expired" className="font-medium text-xs">Expired</SelectItem>
              <SelectItem value="rejected" className="font-medium text-xs">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
