"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const SessionFilter = ({ filterStatus, setFilterStatus, stats, sessions }) => {
  return (
    // <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4">
    <div className="bg-none rounded-2xl p-3 mb-4">
      {/* <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Filter Sessions</h3>
      </div> */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: 'All Sessions', count: stats.total },
          { key: 'pending', label: 'Pending', count: stats.pending },
          { key: 'confirmed', label: 'Confirmed', count: stats.upcoming },
          // { key: 'pending_reschedule', label: 'Pending Reschedule', count: stats.pendingReschedule },
          { key: 'completed', label: 'Completed', count: stats.completed },
          { key: 'canceled', label: 'Canceled', count: sessions.filter(s => s.status?.toLowerCase() === 'canceled').length }
        ].map(({ key, label, count }) => {
          return (
            <Button
              key={key}
              onClick={() => setFilterStatus(key)}
              variant={filterStatus === key ? 'default' : 'outline'}
              size="sm"
              className={`relative transition-all duration-200 ${
                filterStatus === key 
                  ? 'bg-black hover:bg-blue-700 text-white shadow-md' 
                  : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filterStatus === key 
                    ? 'bg-white text-black' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionFilter;
