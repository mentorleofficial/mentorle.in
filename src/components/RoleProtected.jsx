'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserWithRole } from '@/lib/auth';
import { hasRole, ROLES, getDashboardHomeRoute } from '@/lib/roles';
import { useToast } from '@/hooks/use-toast';

/**
 * A component that protects content based on user role
 * @param {Object} props Component props
 * @param {string|Array<string>} props.requiredRole The role(s) required to access the content
 * @param {React.ReactNode} props.children The content to render if authorized
 * @param {React.ReactNode} props.fallback Optional fallback component to render instead of redirecting
 * @param {boolean} props.redirectToDashboard Whether to redirect to dashboard if unauthorized (default: true)
 */
export default function RoleProtected({ 
  requiredRole, 
  children, 
  fallback = null,
  redirectToDashboard = true
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const userWithRole = await getCurrentUserWithRole();
        
        if (!userWithRole) {
          if (redirectToDashboard) {
            router.push('/login');
          }
          return;
        }
        
        // Check if user has required role(s)
        let authorized = false;
        
        if (Array.isArray(requiredRole)) {
          // Check if user has any of the required roles
          authorized = requiredRole.some(role => 
            hasRole(userWithRole.role, role)
          );
        } else {
          // Check single role
          authorized = hasRole(userWithRole.role, requiredRole);
        }
        
        setIsAuthorized(authorized);
        
        if (!authorized && redirectToDashboard) {
          const homeRoute = getDashboardHomeRoute(userWithRole.role);
          
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this page",
            variant: "destructive",
          });
          
          router.push(homeRoute);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Authorization error:", error);
        setIsAuthorized(false);
        setIsLoading(false);
        
        if (redirectToDashboard) {
          router.push('/login');
        }
      }
    };
    
    checkAuthorization();
  }, [requiredRole, router, redirectToDashboard, toast]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show content or fallback based on authorization
  return isAuthorized ? children : fallback;
}
