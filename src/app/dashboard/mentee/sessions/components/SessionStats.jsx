"use client";

import { Calendar, Clock, UserCheck, Award, AlertTriangle } from "lucide-react";

const SessionStats = ({ stats }) => {
  if (!stats || stats.total === 0) return null;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 lg:mt-0">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-500 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <Award className="h-8 w-8 text-green-500 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
          <UserCheck className="h-8 w-8 text-blue-500 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
        </div>
      </div>
      {/* {stats.pendingReschedule > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingReschedule}</p>
              <p className="text-xs text-gray-500">Reschedule</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SessionStats;
