"use client";

import { AlertCircle } from "lucide-react";

const LoadingState = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
    <p className="text-gray-500 animate-pulse">Loading your sessions...</p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center mb-6 shadow-sm">
    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
    <span>{error}</span>
  </div>
);

export { LoadingState, ErrorState };
