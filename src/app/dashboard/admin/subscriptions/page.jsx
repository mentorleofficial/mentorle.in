"use client";

import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import {
  PageHeader,
  StatsCards,
  FiltersSection,
  SubscriptionsList,
  LoadingSpinner,
  useSubscriptionsData
} from "./components";

function SubscriptionsManagementContent() {
  const {
    filteredSubscriptions,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    actionLoading,
    handleStatusUpdate,
    handleExtendSubscription
  } = useSubscriptionsData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageHeader />
        
        <StatsCards stats={stats} />
        
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <SubscriptionsList
          filteredSubscriptions={filteredSubscriptions}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          handleStatusUpdate={handleStatusUpdate}
          handleExtendSubscription={handleExtendSubscription}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}

// Main exported component with role protection
export default function SubscriptionsManagement() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <SubscriptionsManagementContent />
    </RoleProtected>
  );
}
