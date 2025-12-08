"use client";

import { useResourcesData } from "./hooks/useResourcesData";
import PageHeader from "./components/PageHeader";
import DomainSelector from "./components/DomainSelector";
import ContentManager from "./components/ContentManager";
import LoadingSpinner from "./components/LoadingSpinner";

export default function AddResources() {
  const {
    state,
    getCurrentDomainData,
    selectDomain,
    createNewDomain,
    updateDisplayName,
    addMaterial,
    updateMaterial,
    removeMaterial,
    saveResources,
    handleDomainNameChange,
    handleDisplayNameChange
  } = useResourcesData();

  // Destructure state for cleaner access
  const {
    selectedDomain,
    newDomainName,
    newDisplayName,
    availableDomains,
    loading,
    saving
  } = state;

  // Computed values
  const currentData = getCurrentDomainData();
  const selectedDomainInfo = availableDomains.find(d => d.domain === selectedDomain);

  return (
    <div className="min-h-screen pt-10 bg-white">
      <div className="container mx-auto p-4 max-w-8xl">
        <PageHeader />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column - Domain Management */}
          <div className="xl:col-span-1">
            <DomainSelector
              availableDomains={availableDomains}
              selectedDomain={selectedDomain}
              newDomainName={newDomainName}
              newDisplayName={newDisplayName}
              selectDomain={selectDomain}
              updateDisplayName={updateDisplayName}
              handleDomainNameChange={handleDomainNameChange}
              handleDisplayNameChange={handleDisplayNameChange}
              createNewDomain={createNewDomain}
              selectedDomainInfo={selectedDomainInfo}
            />
          </div>

          {/* Right Column - Content Management */}
          <div className="xl:col-span-2">
            <ContentManager
              selectedDomain={selectedDomain}
              currentData={currentData}
              saving={saving}
              saveResources={saveResources}
              addMaterial={addMaterial}
              updateMaterial={updateMaterial}
              removeMaterial={removeMaterial}
            />
          </div>
        </div>

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}
