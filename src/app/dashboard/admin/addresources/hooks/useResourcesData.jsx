import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Constants
const EMPTY_MATERIAL = {
  description: "",
  url: "",
  created_at: new Date().toISOString()
};

const VALIDATION_MESSAGES = {
  SELECT_DOMAIN: "Please select a domain first",
  ENTER_DOMAIN_NAME: "Please enter a domain name",
  ENTER_DISPLAY_NAME: "Please enter a display name",
  DOMAIN_EXISTS: "This domain already exists",
  EMPTY_DISPLAY_NAME: "Display name cannot be empty"
};

// Utility functions
const formatDomainId = (name) => name.trim().toLowerCase().replace(/\s+/g, '-');

export function useResourcesData() {
  // State management
  const [state, setState] = useState({
    resources: [],
    selectedDomain: "",
    newDomainName: "",
    newDisplayName: "",
    availableDomains: [],
    loading: false,
    saving: false
  });

  const { toast } = useToast();

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear form helper
  const clearNewDomainForm = useCallback(() => {
    updateState({ newDomainName: "", newDisplayName: "" });
  }, [updateState]);

  // Data fetching
  const fetchResources = useCallback(async () => {
    try {
      updateState({ loading: true });
      
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("domain");

      if (error) throw error;

      const resourcesData = data || [];
      const domainsData = resourcesData.map(resource => ({
        domain: resource.domain,
        displayName: resource.display_name || resource.domain,
        materialsCount: (resource.materials || []).length
      }));

      updateState({
        resources: resourcesData,
        availableDomains: domainsData
      });
      
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      updateState({ loading: false });
    }
  }, [updateState, toast]);

  // Domain operations
  const getCurrentDomainData = useCallback(() => {
    if (!state.selectedDomain) return null;
    
    return state.resources.find(r => r.domain === state.selectedDomain) || {
      id: null,
      domain: state.selectedDomain,
      materials: [],
    };
  }, [state.selectedDomain, state.resources]);

  const updateDomainData = useCallback((updates) => {
    updateState({
      resources: state.resources.map(r => {
        const existingIndex = state.resources.findIndex(res => res.domain === state.selectedDomain);
        
        if (existingIndex >= 0) {
          return r.domain === state.selectedDomain ? { ...r, ...updates } : r;
        } else {
          return r;
        }
      }).concat(
        state.resources.findIndex(res => res.domain === state.selectedDomain) < 0 
          ? [{ id: null, domain: state.selectedDomain, materials: [], ...updates }]
          : []
      )
    });
  }, [state.selectedDomain, state.resources, updateState]);

  const selectDomain = useCallback((domain) => {
    updateState({ selectedDomain: domain });
    clearNewDomainForm();
  }, [updateState, clearNewDomainForm]);

  const validateNewDomain = useCallback(() => {
    if (!state.newDomainName.trim()) {
      toast({
        title: "Error",
        description: VALIDATION_MESSAGES.ENTER_DOMAIN_NAME,
        variant: "destructive",
      });
      return false;
    }

    if (!state.newDisplayName.trim()) {
      toast({
        title: "Error",
        description: VALIDATION_MESSAGES.ENTER_DISPLAY_NAME,
        variant: "destructive",
      });
      return false;
    }

    const domainId = formatDomainId(state.newDomainName);
    if (state.availableDomains.some(d => d.domain === domainId)) {
      toast({
        title: "Error", 
        description: VALIDATION_MESSAGES.DOMAIN_EXISTS,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [state.newDomainName, state.newDisplayName, state.availableDomains, toast]);

  const createNewDomain = useCallback(() => {
    if (!validateNewDomain()) return;

    const domainId = formatDomainId(state.newDomainName);
    const displayName = state.newDisplayName.trim();

    updateState({
      selectedDomain: domainId,
      availableDomains: [...state.availableDomains, {
        domain: domainId,
        displayName,
        materialsCount: 0
      }]
    });
    
    clearNewDomainForm();
    
    toast({
      title: "Success",
      description: `New domain "${domainId}" created`,
    });
  }, [validateNewDomain, state.newDomainName, state.newDisplayName, state.availableDomains, updateState, clearNewDomainForm, toast]);

  const updateDisplayName = useCallback(async (domain, newDisplayNameValue) => {
    if (!newDisplayNameValue.trim()) {
      toast({
        title: "Error",
        description: VALIDATION_MESSAGES.EMPTY_DISPLAY_NAME,
        variant: "destructive",
      });
      return;
    }

    try {
      const resource = state.resources.find(r => r.domain === domain);
      if (resource?.id) {
        const { error } = await supabase
          .from("resources")
          .update({ display_name: newDisplayNameValue.trim() })
          .eq("id", resource.id);

        if (error) throw error;

        updateState({
          availableDomains: state.availableDomains.map(d => 
            d.domain === domain 
              ? { ...d, displayName: newDisplayNameValue.trim() }
              : d
          )
        });

        toast({
          title: "Success",
          description: `Display name updated for "${domain}"`,
        });

        await fetchResources();
      }
    } catch (error) {
      console.error("Error updating display name:", error);
      toast({
        title: "Error",
        description: "Failed to update display name",
        variant: "destructive",
      });
    }
  }, [state.resources, state.availableDomains, updateState, toast, fetchResources]);

  // Material operations
  const addMaterial = useCallback(() => {
    const currentData = getCurrentDomainData();
    if (!currentData) return;
    
    updateDomainData({
      materials: [...currentData.materials, { ...EMPTY_MATERIAL, created_at: new Date().toISOString() }]
    });
  }, [getCurrentDomainData, updateDomainData]);

  const updateMaterial = useCallback((index, field, value) => {
    const currentData = getCurrentDomainData();
    if (!currentData) return;
    
    const updatedMaterials = currentData.materials.map((material, i) => 
      i === index ? { 
        ...material, 
        [field]: value,
        ...(field !== 'created_at' && { created_at: new Date().toISOString() })
      } : material
    );
    updateDomainData({ materials: updatedMaterials });
  }, [getCurrentDomainData, updateDomainData]);

  const removeMaterial = useCallback((index) => {
    const currentData = getCurrentDomainData();
    if (!currentData) return;
    
    const updatedMaterials = currentData.materials.filter((_, i) => i !== index);
    updateDomainData({ materials: updatedMaterials });
  }, [getCurrentDomainData, updateDomainData]);

  // Save operations
  const validateAndFilterMaterials = useCallback((materials) => {
    return materials.filter(material => 
      material.description.trim() && material.url.trim()
    );
  }, []);

  const buildResourceData = useCallback((currentData, validMaterials) => {
    const selectedDomainData = state.availableDomains.find(d => d.domain === state.selectedDomain);
    
    return {
      domain: state.selectedDomain,
      display_name: currentData?.display_name || selectedDomainData?.displayName || state.selectedDomain,
      materials: validMaterials,
      updated_at: new Date().toISOString(),
    };
  }, [state.selectedDomain, state.availableDomains]);

  const saveResources = useCallback(async () => {
    if (!state.selectedDomain) {
      toast({
        title: "Error",
        description: VALIDATION_MESSAGES.SELECT_DOMAIN,
        variant: "destructive",
      });
      return;
    }

    try {
      updateState({ saving: true });
      const currentData = getCurrentDomainData();
      const validMaterials = validateAndFilterMaterials(currentData.materials);
      const resourceData = buildResourceData(currentData, validMaterials);

      let result;
      if (currentData.id) {
        result = await supabase
          .from("resources")
          .update(resourceData)
          .eq("id", currentData.id)
          .select();
      } else {
        result = await supabase
          .from("resources")
          .insert({ ...resourceData, created_at: new Date().toISOString() })
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Study materials for "${state.selectedDomain}" saved successfully`,
      });

      await fetchResources();
    } catch (error) {
      console.error("Error saving resources:", error);
      toast({
        title: "Error",
        description: "Failed to save study materials",
        variant: "destructive",
      });
    } finally {
      updateState({ saving: false });
    }
  }, [state.selectedDomain, getCurrentDomainData, validateAndFilterMaterials, buildResourceData, updateState, toast, fetchResources]);

  // Event handlers
  const handleDomainNameChange = useCallback((value) => {
    updateState({ newDomainName: value });
  }, [updateState]);

  const handleDisplayNameChange = useCallback((value) => {
    updateState({ newDisplayName: value });
  }, [updateState]);

  // Effects
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
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
  };
}
