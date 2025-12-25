"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Consolidated navigation data
const navigationData = {
  findMentor: [
    {
      title: "Find a Mentor",
      href: "/mentor",
      description: "Book a mentor for personalized guidance and support.",
    },
  ],
  becomeMentor: [
    {
      title: "Become a Mentor",
      href: "/become-mentor",
      description: "Share your expertise and guide others.",
    },
  ],
  community: [
    {
      title: "Events and Workshops",
      href: "/events",
      description: "Events and workshops for the community to learn and grow together.",
    },
    {
      title: "Join Now",
      href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
      description: "Learn More About Community.",
    },
  ],
  resources: [
    {
      title: "Resources",
      href: "/resources",
      description: "Resources for the community to learn and grow together.",
    },
    {
      title: "Blogs & Articles",
      href: "/blogs",
      description: "Read articles and insights from mentors and experts.",
    },
    {
      title: "Perks And Discounts",
      href: "/perk-discount",
      description: "Get access to dozens of perks and discounts through Mentorle courses.",
    },
  ],
  university: [
    {
      title: "Campus Program (Coming Soon)",
      href: "/campus",
      description: "Build anticipation for an upcoming feature that integrates Mentorle into university campuses.",
    },
  ],
  about: [
    {
      title: "About",
      href: "/about",
      description: "About Mentorle.",
    },
    {
      title: "Contact Us",
      href: "/contact",
      description: "Contact Mentorle for any queries or to know more about us.",
    },
    {
      title: "Team",
      href: "/team",
      description: "Meet Mentorle Team.",
    },
  ],
};

// Social links data
const socialLinks = [
  {
    href: "https://discord.com/invite/Cm2zFMGEYq",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw",
    alt: "discord",
  },
  {
    href: "https://www.instagram.com/mentorle_official/",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc",
    alt: "instagram",
  },
  {
    href: "https://www.linkedin.com/company/mentorlee/",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo",
    alt: "linkedin",
  },
  {
    href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc",
    alt: "whatsapp",
  },
];

// Footer links data
const footerLinks = [
  { href: "/private-policy", label: "Privacy Policy" },
  { href: "https://t.me/+sjxQXmum2GA0YWQ9", label: "FAQs" },
  { href: "https://t.me/+sjxQXmum2GA0YWQ9", label: "Contact Us" },
  { href: "/term-and-conditions", label: "Terms & Conditions" },
];

// Mobile menu data
// Note: Community removed since Events is already a direct link, avoiding redundancy
const mobileMenuItems = [
  { title: "Resources", items: navigationData.resources },
  { title: "For University", items: navigationData.university },
  { title: "About Us", items: navigationData.about },
];

// Direct mobile menu links (no dropdown needed)
const mobileDirectLinks = [
  { title: "Find Mentor", href: "/mentor" },
  { title: "Become Mentor", href: "/become-mentor" },
  { title: "Events", href: "/event"}
];

// Reusable components
const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-500 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-xl hover:shadow-gray-200/50 focus:bg-gray-50 focus:shadow-md group border border-transparent hover:border-gray-200 transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        <div className="text-sm font-semibold leading-none text-gray-900 group-hover:text-black transition-colors duration-300 relative z-10">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-gray-600 group-hover:text-gray-700 transition-colors duration-300 relative z-10">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

const DropdownContent = ({ items }) => (
  <NavigationMenuContent>
    <div className="relative">
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
      <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 relative z-10">
        {items.map((item, index) => (
          <div key={item.title} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 100}ms` }}>
            <ListItem title={item.title} href={item.href}>
              {item.description}
            </ListItem>
          </div>
        ))}
      </ul>
    </div>
  </NavigationMenuContent>
);

const MobileDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2 w-full py-3 px-4 rounded-xl hover:bg-white/80 transition-all duration-300 group relative overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
        <span className="relative z-10">{title}</span>
        <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ml-auto relative z-10 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`transition-all duration-500 ease-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-gray-100 overflow-hidden">
          {items.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "block text-gray-700 text-sm px-6 py-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:text-gray-900 hover:translate-x-2 relative overflow-hidden group",
                index === 0 && "rounded-t-xl",
                index === items.length - 1 && "rounded-b-xl"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-black transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
              <span className="relative z-10">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Template({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // CRITICAL: Check for recovery token and redirect to reset-password if needed
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
    
    // If we have a recovery token but we're not on reset-password, redirect there
    if (hasRecoveryToken && pathname !== '/reset-password') {
      sessionStorage.setItem('isPasswordResetFlow', 'true');
      // Preserve the hash when redirecting
      const hash = window.location.hash;
      router.push('/reset-password' + hash);
      return;
    }

    // If we're on dashboard but have the password reset flag, redirect to reset-password
    if (pathname.startsWith('/dashboard') && 
        sessionStorage.getItem('isPasswordResetFlow') === 'true') {
      if (hasRecoveryToken) {
        router.push('/reset-password' + window.location.hash);
      } else {
        router.push('/reset-password');
      }
      return;
    }
  }, [pathname, router]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user name and role from any of the three tables
  useEffect(() => {
    const fetchUserNameAndRole = async () => {
      // CRITICAL: Don't do anything if we're on reset-password page
      // This prevents any redirects during password reset flow
      if (pathname === '/reset-password' || 
          (typeof window !== 'undefined' && sessionStorage.getItem('isPasswordResetFlow') === 'true')) {
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      let userName = "";
      let role = "";
      // Try mentee_data
      let { data: mentee } = await supabase
        .from("mentee_data")
        .select("name")
        .eq("email", user.email)
        .single();
      if (mentee && mentee.name) {
        userName = mentee.name;
        role = "mentee";
      } else {
        // Try mentor_data
        let { data: mentor } = await supabase
          .from("mentor_data")
          .select("name")
          .eq("email", user.email)
          .single();
        if (mentor && mentor.name) {
          userName = mentor.name;
          role = "mentor";
        } else {
          // Try admin_data
          let { data: admin } = await supabase
            .from("admin_data")
            .select("name")
            .eq("email", user.email)
            .single();
          if (admin && admin.name) {
            userName = admin.name;
            role = "admin";
          }
        }
      }
      setUserName(userName);
      setUserRole(role);
    };
    fetchUserNameAndRole();
  }, [isAuthenticated]);

  const shouldShowNavAndFooter = !isAuthenticated && !pathname.startsWith("/dashboard");

  // Handler for authenticated user dashboard navigation
  const handleDashboardNavigation = () => {
    if (userRole === "mentee") {
      router.push("/dashboard/mentee");
    } else if (userRole === "mentor") {
      router.push("/dashboard/mentor");
    } else if (userRole === "admin") {
      router.push("/dashboard/admin");
    }
  };

  return (
    <>
      {shouldShowNavAndFooter && (
        <div className={`sticky top-0 z-50 transition-all duration-500 ${
          scrollY > 0 
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-xl' 
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
        }`}>
          <div className="max-w-[1240px] flex flex-wrap items-center justify-around gap-4 mx-auto py-5 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
            
            <Link href="/" className="flex items-center mr-[-8px] space-x-6 lg:block group relative z-10">
           
                <Image
                  src="/mentorlelogo.png"
                  width={200}
                  height={200}
                  alt="Logo"
                  className="pl-5 xl:pl-0 md:w-[200px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              
            </Link>

            <div className="lg:hidden flex-1 flex justify-end">
              <button
                className="p-3 rounded-xl hover:bg-gray-100 focus:outline-none transition-all duration-300 active:scale-95 relative overflow-hidden group"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <div className="relative z-10">
                  {menuOpen ? 
                    <X className="w-6 h-6 text-gray-700 transition-transform duration-300 rotate-90" /> : 
                    <Menu className="w-6 h-6 text-gray-700 transition-transform duration-300" />
                  }
                </div>
              </button>
            </div>

            <NavigationMenu>
              <NavigationMenuList className="hidden lg:flex space-x-1">
                {/* Direct Navigation Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/mentor"
                      className="text-md font-medium hover:text-gray-900 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="relative z-10">Find Mentor</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/become-mentor"
                      className="text-md font-medium hover:text-gray-900 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="relative z-10">Become Mentor</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/event"
                      className="text-md font-medium hover:text-gray-900 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md relative overflow-hidden group"
                      >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="relative z-10">Events</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Dropdown Navigation Items */}
                {[
                  // { label: "Events", data: navigationData.community },
                  { label: "Resources", data: navigationData.resources },
                  { label: "For University", data: navigationData.university },
                  { label: "About Us", data: navigationData.about }
                ].map((item, index) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger className="text-md font-medium hover:text-gray-900 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="relative z-10">{item.label}</span>
                    </NavigationMenuTrigger>
                    <DropdownContent items={item.data} />
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    {userName ? (
                      <button
                        onClick={handleDashboardNavigation}
                        className="hidden lg:flex px-6 py-3 text-white bg-black font-medium rounded-xl border-2 border-black transition-all duration-500 ease-out transform hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl ml-4 relative overflow-hidden group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        {/* <Sparkles className="w-4 h-4 mr-2 relative z-10 group-hover:animate-spin" /> */}
                        <span className="relative z-10">Hi! {userName}</span>
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="hidden lg:flex px-6 py-3 text-white bg-black font-medium rounded-xl border-2 border-black transition-all duration-500 ease-out transform hover:bg-white hover:text-black hover:scale-105 hover:shadow-2xl ml-4 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        {/* <Sparkles className="w-4 h-4 mr-2 relative z-10 group-hover:animate-spin" /> */}
                        <span className="relative z-10">Login</span>
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Enhanced Mobile Menu */}
          {menuOpen && (
            <div className="fixed top-[88px] left-2 right-2 sm:left-4 sm:right-4 z-50 flex flex-col lg:hidden bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-200 animate-in slide-in-from-top-5 duration-500 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50"></div>
              <div className="relative z-10">
                {/* Direct Links */}
                {mobileDirectLinks.map((link, index) => (
                  <div key={link.title} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                    <Link
                      href={link.href}
                      className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2 w-full py-3 px-4 rounded-xl hover:bg-white/80 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
                      <span className="relative z-10">{link.title}</span>
                    </Link>
                  </div>
                ))}
                
                {/* Dropdown Items */}
                {mobileMenuItems.map((section, index) => (
                  <div key={section.title} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${(index + mobileDirectLinks.length) * 100}ms` }}>
                    <MobileDropdown title={section.title} items={section.items} />
                  </div>
                ))}
                
                <div className="flex justify-center pt-4 border-t border-gray-200 mt-6">
                  {userName ? (
                    <button
                      onClick={handleDashboardNavigation}
                      className="px-6 py-3 text-black font-medium rounded-xl border-2 border-black transition-all duration-500 ease-out transform hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl relative overflow-hidden group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {/* <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> */}
                        Hi! {userName}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="px-6 py-3 text-black font-medium rounded-xl border-2 border-black transition-all duration-500 ease-out transform hover:bg-black hover:text-white hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {/* <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> */}
                        Login
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )} 

      {children}

      {shouldShowNavAndFooter && (
        <>
          <Image
            src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/footer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mb290ZXIucG5nIiwiaWF0IjoxNzQzNjExOTg1LCJleHAiOjIwNTg5NzE5ODV9.as2D7XlTNWc36yJCDkhk2UKDznRfG1kMWXf37H1BbBE"
            width={1000}
            height={300}
            alt="footerimage"
            className="w-full h-auto relative -bottom-2"
          />

          <footer className="bg-black relative -bottom-1">
            <div className="relative flex items-center justify-center flex-col xl:-top-5 py-8 px-4 space-y-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={300}
                height={300}
                className="w-[150px] sm:w-[200px] lg:w-[250px] xl:w-[300px]"
              />
              <div className="h-[2px] bg-[#ffffff3a] w-[40%] mx-auto mt-5" />
              <div className="flex justify-center items-center gap-10 mt-5">
                <Link
                  href="https://discord.com/invite/Cm2zFMGEYq"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <img
                    src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw"
                    alt="discord"
                    width={30}
                    height={30}
                    className="w-[20px] sm:w-[30px]"
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/mentorle_official/"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <img
                    src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc"
                    alt="instagram"
                    width={30}
                    height={30}
                    className="w-[20px] sm:w-[30px]"
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/mentorlee/"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <img
                    src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo"
                    alt="linkedin"
                    width={30}
                    height={30}
                    className="w-[20px] sm:w-[30px]"
                  />
                </Link>
                <Link
                  href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <img
                    src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc"
                    alt="whatsapp"
                    width={30}
                    height={30}
                    className="w-[20px] sm:w-[30px]"
                  />
                </Link>
              </div>
              <div className="flex flex-col space-y-6 w-full mt-6 px-4 sm:px-6 lg:px-8 xl:px-12">
  {/* Links Section */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                <Link
                  href="/private-policy"
                  className="transition-colors duration-200 hover:text-[#2D59E3]"
                >
                  <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
                    Privacy Policy
                  </div>
                </Link>
                <a
                  href="https://t.me/+sjxQXmum2GA0YWQ9"
                  className="transition-colors duration-200 hover:text-[#2D59E3]"
                >
                  <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
                    FAQs
                  </div>
                </a>
                <a
                  href="https://t.me/+sjxQXmum2GA0YWQ9"
                  className="transition-colors duration-200 hover:text-[#2D59E3]"
                >
                  <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
                    Contact Us
                  </div>
                </a>
                <Link
                  href="/term-and-conditions"
                  className="transition-colors duration-200 hover:text-[#2D59E3]"
                >
                  <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
                    Terms & Conditions
                  </div>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20 w-full max-w-4xl mx-auto"></div>

              {/* Copyright and Company Info Section */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 text-center lg:text-left">
                {/* Copyright */}
                <div className="text-white opacity-85 text-sm sm:text-base order-2 lg:order-1">
                  © {new Date().getFullYear()} AltioraEdtech Learning (OPC) Pvt. Ltd. All rights reserved.
                </div>
                
                {/* CIN */}
                <div className="text-white opacity-85 text-sm sm:text-base order-1 lg:order-2">
                  <p>CIN: U85500PB2025OPC064679</p>
                </div>
              </div>
            </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}






// "use client";

// import * as React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { cn } from "@/lib/utils";
// // import { Icons } from "../components/icons";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   // navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// // import { ListItem } from "@/components/ui/list-item";
// import { Menu, X } from "lucide-react";
// // import { px } from "framer-motion";

// const community = [
//   {
//     title: "Events and Workshops",
//     href: "/events",
//     description:
//       "Events and workshops for the community to learn and grow together.",
//   },
//   {
//     title: "Join Now",
//     href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
//     description: "Learn More About Community.",
//   },
// ];
// const resources = [
//   {
//     title: "Resources",
//     href: "/resources",
//     description: "Resources for the community to learn and grow together.",
//   },
//   {
//     title: "Perks And Discounts",
//     href: "/perk-discount",
//     description:
//       "Get access to dozens of perks and discounts through Mentorle courses.",
//   },
// ];
// const university = [
//   {
//     title: "Student Training",
//     href: "/student-traning",
//     description: "Training For Students.",
//   },
//   {
//     title: "Campus Program (Coming Soon)",
//     href: "/campus",
//     description:
//       "Build anticipation for an upcoming feature that integrates Mentorle into university campuses.",
//   },
// ];
// const about = [
//   {
//     title: "About",
//     href: "/about",
//     description: "About Mentorle.",
//   },
//   {
//     title: "Contact Us",
//     href: "/contact",
//     description: "Contact Mentorle for any queries or to know more about us.",
//   },
//   {
//     title: "Team",
//     href: "/team",
//     description: "Meet Mentorle Team.",
//   },
// ];
// const mentorship = [
//   {
//     title: "Find a Mentor",
//     href: "/mentor",
//     description: "Book a mentor for personalized guidance and support.",
//   },
//   {
//     title: "Become Mentor",
//     href: "/become-mentor",
//     description: "Join us as a mentor and share your knowledge with others.",
//   },
// ];

// export default function Template({ children }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };
//   return (
//     <>
//       <div className="sticky top-0 z-50 bg-white">
//         <div className="max-w-[1240px] flex flex-wrap items-center justify-around gap-4 mx-auto py-5 border-b-2 border-[#0000003a]">
//           <Link
//             href="/"
//             className="flex items-center mr-[-8px] space-x-6 lg:block"
//           >
//             <Image
//               src="/mentorlelogo.png"
//               width={200}
//               height={200}
//               alt="Logo"
//               className="pl-5 xl:pl-0 md:w-[200px]"
//             />
//           </Link>

//           {/* Hamburger Menu for Mobile */}
//           <div className="lg:hidden flex-1 flex justify-end">
//             <button
//               className="p-2 rounded-md focus:outline-none"
//               onClick={toggleMenu}
//             >
//               {menuOpen ? (
//                 <X className="w-6 h-6 text-black" />
//               ) : (
//                 <Menu className="w-6 h-6 text-black" />
//               )}
//             </button>
//           </div>

//           <NavigationMenu>
//             <NavigationMenuList className="hidden lg:flex space-x-3">
//               {/* Program & courses */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   Programs & Courses
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//                     <li className="row-span-3">
//                       <NavigationMenuLink asChild>
//                         <a
//                           className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
//                           href="/"
//                         >
//                           {/* <Icons.logo className="h-6 w-6" /> */}
//                           <Image
//                             src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/cs-r.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jcy1yLnBuZyIsImlhdCI6MTc0MzYxMTk1NiwiZXhwIjoyMDU4OTcxOTU2fQ.BF0TOe-CZPdvVBbmjR-0ya_VIgvDamOwkguvOlitaZw"
//                             width={40}
//                             height={32}
//                             className="h-32 w-40"
//                             alt=""
//                           />
//                           <div className="mb-2 mt-4 text-lg font-medium">
//                             Free Courses
//                           </div>
//                           <p className="text-sm leading-tight text-muted-foreground">
//                             Commig Soon!
//                           </p>
//                         </a>
//                       </NavigationMenuLink>
//                     </li>
//                     <ListItem href="/" title="Cloud Computing">
//                       Commig Soon!
//                     </ListItem>
//                     <ListItem href="/" title="BlockChain Develpoment">
//                       Commig Soon!
//                     </ListItem>
//                     <ListItem
//                       href="/docs/primitives/typography"
//                       title="CyberSecurity"
//                     >
//                       Commig Soon!
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // Community */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   Community
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                     {community.map((community) => (
//                       <ListItem
//                         key={community.title}
//                         title={community.title}
//                         href={community.href}
//                       >
//                         {community.description}
//                       </ListItem>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // Resources */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   Resources
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                     {resources.map((resources) => (
//                       <ListItem
//                         key={resources.title}
//                         title={resources.title}
//                         href={resources.href}
//                       >
//                         {resources.description}
//                       </ListItem>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // University */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   For University
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                     {university.map((university) => (
//                       <ListItem
//                         key={university.title}
//                         title={university.title}
//                         href={university.href}
//                       >
//                         {university.description}
//                       </ListItem>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // About */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   About Us
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                     {about.map((about) => (
//                       <ListItem
//                         key={about.title}
//                         title={about.title}
//                         href={about.href}
//                       >
//                         {about.description}
//                       </ListItem>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // Mentorship */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="text-md">
//                   Mentorship
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                     {mentorship.map((mentorship) => (
//                       <ListItem
//                         key={mentorship.title}
//                         title={mentorship.title}
//                         href={mentorship.href}
//                       >
//                         {mentorship.description}
//                       </ListItem>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//               {/* // Button for book mentor */}
//               {/* <NavigationMenuItem>
//                 <Link href="/mentor" legacyBehavior passHref>
//                   <NavigationMenuLink
//                     className={`hidden lg:flex navigationMenuTriggerStyle() px-4 py-3    bg-[#1B1B1B] text-white font-medium rounded-full transition-all duration-200 ease-in-out transform hover:bg-[#525458] hover:scale-105`}
//                   >
//                     Book Mentor
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem> */}
//               {/* // Button for become mentor */}
//               {/* <NavigationMenuItem>
//                 <Link href="/become-mentor" legacyBehavior passHref>
//                   <NavigationMenuLink
//                     className={`hidden lg:flex navigationMenuTriggerStyle() p-3 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-[#000000] hover:text-white hover:scale-105 `}
//                   >
//                     Become Mentor
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem> */}
//               {/* // Button for Login */}
//               <NavigationMenuItem>
//                 <Link href="/login" legacyBehavior passHref>
//                   <NavigationMenuLink
//                     className={`hidden lg:flex navigationMenuTriggerStyle() px-6 py-3 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-[#000000] hover:text-white hover:scale-105 `}
//                   >
//                     Login
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="fixed top-[80px] left-0 right-0 z-50 flex flex-col lg:hidden bg-gray-100 shadow-lg rounded-lg p-4 space-y-4 mx-4">
//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               Programs & Courses
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href=""
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 Cloud Computing
//               </Link>
//               <Link
//                 href=""
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Coming Soon...
//               </Link>
//             </div>
//           </div>

//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               Community
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href="/events"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 Events & Workshops
//               </Link>
//               <Link
//                 href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Join now
//               </Link>
//             </div>
//           </div>

//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               Resources
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href="/resources"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 Resources
//               </Link>
//               <Link
//                 href="/perk-discount"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Perks & Discount
//               </Link>
//             </div>
//           </div>

//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               For University
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href="/student-traning"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 Student Training
//               </Link>
//               <Link
//                 href="/campus"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Campus Program (Coming Soon)
//               </Link>
//             </div>
//           </div>
//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               Mentorship
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href="/mentor"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 Find a Mentor
//               </Link>
//               <Link
//                 href="/become-mentor"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Become Mentor
//               </Link>
//             </div>
//           </div>

//           <div className="relative group inline-block text-left">
//             <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//               About Us
//               <svg
//                 className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//               <Link
//                 href="/about"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//               >
//                 About
//               </Link>
//               <Link
//                 href="/contact"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100"
//               >
//                 Contact
//               </Link>
//               <Link
//                 href="/team"
//                 className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//               >
//                 Team
//               </Link>
//             </div>
//           </div>
//           <div className="flex justify-evenly">
//             {/* <Link
//               href="/mentor"
//               className="navigationMenuTriggerStyle() px-4 py-4 bg-[#1B1B1B] text-white font-medium rounded-full transition-all duration-200 ease-in-out transform hover:bg-[#525458] hover:scale-105"
//             >
//               Book Mentor
//             </Link>
//             <Link
//               href="/become-mentor"
//               className="navigationMenuTriggerStyle() px-4 py-4 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-[#000000] hover:text-white hover:scale-105"
//             >
//               Become Mentor
//             </Link> */}
//             <Link
//               href="/login"
//               className="navigationMenuTriggerStyle() px-4 py-4 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-[#000000] hover:text-white hover:scale-105"
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       )}
//       {/* <div className="h-[10px]"></div> Spacer for fixed navbar */}
//       {children}
//       <Image
//         src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/footer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mb290ZXIucG5nIiwiaWF0IjoxNzQzNjExOTg1LCJleHAiOjIwNTg5NzE5ODV9.as2D7XlTNWc36yJCDkhk2UKDznRfG1kMWXf37H1BbBE"
//         width={1000}
//         height={300}
//         alt="footerimage"
//         className="w-full h-auto relative -bottom-2"
//       />

//       <footer className=" bg-black relative -bottom-1">
//         <div className="relative flex items-center justify-center flex-col xl:-top-5 py-8 px-4 space-y-6">
//           <Image
//             src="/logo.png"
//             alt="Logo"
//             width={300}
//             height={300}
//             className="w-[150px] sm:w-[200px] lg:w-[250px] xl:w-[300px]"
//           />
//           <div className="h-[2px] bg-[#ffffff3a] w-[40%] mx-auto mt-5" />

//           <div className="flex justify-center items-center gap-10 mt-5">
//             <Link
//               href="https://discord.com/invite/Cm2zFMGEYq"
//               className="transition-transform duration-200 hover:scale-110"
//             >
//               <img
//                 src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw"
//                 alt="discord"
//                 width="30"
//                 height="30"
//                 className="w-[20px] sm:w-[30px]"
//               />
//             </Link>
//             <Link
//               href="https://www.instagram.com/mentorle_official/"
//               className="transition-transform duration-200 hover:scale-110"
//             >
//               <img
//                 src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc"
//                 alt="instagram"
//                 width="30"
//                 height="30"
//                 className="w-[20px] sm:w-[30px]"
//               />
//             </Link>
//             <Link
//               href="https://www.linkedin.com/company/mentorlee/"
//               className="transition-transform duration-200 hover:scale-110"
//             >
//               <img
//                 src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo"
//                 alt="linkedin"
//                 width="30"
//                 height="30"
//                 className="w-[20px] sm:w-[30px]"
//               />
//             </Link>
//             <Link
//               href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH"
//               className="transition-transform duration-200 hover:scale-110"
//             >
//               <img
//                 src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc"
//                 alt="whatsapp"
//                 width="30"
//                 height="30"
//                 className="w-[20px] sm:w-[30px]"
//               />
//             </Link>
//           </div>

//           <div className="flex flex-col lg:flex-row justify-between items-center w-full mt-6 space-y-4 px-24 lg:space-y-0">
//             <div className="flex gap-5 text-md">
//               <Link
//                 href="/private-policy"
//                 className="transition-colors duration-200 hover:text-[#2D59E3]"
//               >
//                 <div className="text-white text-center underline cursor-pointer hover:font-semibold">
//                   Privacy Policy
//                 </div>
//               </Link>
//               <a
//                 href="https://t.me/+sjxQXmum2GA0YWQ9"
//                 className="transition-colors duration-200 hover:text-[#2D59E3]"
//               >
//                 <div className="text-white text-center underline cursor-pointer hover:font-semibold">
//                   FAQs
//                 </div>
//               </a>

//               <a
//                 href="https://t.me/+sjxQXmum2GA0YWQ9"
//                 className="transition-colors duration-200 hover:text-[#2D59E3]"
//               >
//                 <div className="text-white text-center underline cursor-pointer hover:font-semibold">
//                   Contact Us
//                 </div>
//               </a>

//               <Link
//                 href="/term-and-conditions"
//                 className="transition-colors duration-200 hover:text-[#2D59E3]"
//               >
//                 <div className="text-white text-center underline cursor-pointer hover:font-semibold">
//                   Terms & Conditions
//                 </div>
//               </Link>
//             </div>
//             <div className="text-white text-center opacity-85 text-md">
//               © 2023 Mentorle Technologies Pvt Ltd. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }
// const ListItem = React.forwardRef(
//   /**
//    * @param {Object} props
//    * @param {string} props.className
//    * @param {string} props.title
//    * @param {React.ReactNode} props.children
//    * @param {React.Ref<HTMLAnchorElement>} ref
//    */
//   ({ className, title, children, ...props }, ref) => {
//     return (
//       <li>
//         <NavigationMenuLink asChild>
//           <a
//             ref={ref}
//             className={cn(
//               "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//               className
//             )}
//             {...props}
//           >
//             <div className="text-sm font-medium leading-none">{title}</div>
//             <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//               {children}
//             </p>
//           </a>
//         </NavigationMenuLink>
//       </li>
//     );
//   }
// );
// ListItem.displayName = "ListItem";

// "use client";

// import * as React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { Menu, X } from "lucide-react";

// const community = [
//   {
//     title: "Events and Workshops",
//     href: "/events",
//     description:
//       "Events and workshops for the community to learn and grow together.",
//   },
//   {
//     title: "Join Now",
//     href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
//     description: "Learn More About Community.",
//   },
// ];

// const resources = [
//   {
//     title: "Resources",
//     href: "/resources",
//     description: "Resources for the community to learn and grow together.",
//   },
//   {
//     title: "Perks And Discounts",
//     href: "/perk-discount",
//     description:
//       "Get access to dozens of perks and discounts through Mentorle courses.",
//   },
// ];

// const university = [
//   // {
//   //   title: "Student Training",
//   //   href: "/student-training",
//   //   description: "Training For Students.",
//   // },
//   {
//     title: "Campus Program (Coming Soon)",
//     href: "/campus",
//     description:
//       "Build anticipation for an upcoming feature that integrates Mentorle into university campuses.",
//   },
// ];

// const about = [
//   {
//     title: "About",
//     href: "/about",
//     description: "About Mentorle.",
//   },
//   {
//     title: "Contact Us",
//     href: "/contact",
//     description: "Contact Mentorle for any queries or to know more about us.",
//   },
//   {
//     title: "Team",
//     href: "/team",
//     description: "Meet Mentorle Team.",
//   },
// ];

// // const mentorship = [
// //   {
// //     title: "Find a Mentor",
// //     href: "/mentor",
// //     description: "Book a mentor for personalized guidance and support.",
// //   },
// //   {
// //     title: "Become Mentor",
// //     href: "/become-mentor",
// //     description: "Join us as a mentor and share your knowledge with others.",
// //   },
// // ];
// const findmentor = [
//   {
//     title: "Find a Mentor",
//     href: "/mentor",
//     description: "Book a mentor for personalized guidance and support.",
//   },
// ];
// const becomementor = [
//   {
//     title: "Become a Mentor",
//     href: "/become-mentor",
//     description: "Book a mentor for personalized guidance and support.",
//   },
// ];

// export default function Template({ children }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Simulate authentication check (replace with your auth logic)
//   useEffect(() => {
//     // Example: Check for auth token in localStorage or cookies
//     const token = localStorage.getItem("auth_token"); // Replace with your auth method
//     setIsAuthenticated(!!token);
//   }, []);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   // Hide navbar and footer for dashboard routes or authenticated users
//   const isDashboardRoute = pathname.startsWith("/dashboard");
//   const shouldShowNavAndFooter = !isAuthenticated && !isDashboardRoute;

//   return (
//     <>
//       {shouldShowNavAndFooter && (
//         <div className="sticky top-0 z-50 bg-white">
//           <div className="max-w-[1240px] flex flex-wrap items-center justify-around gap-4 mx-auto py-5 border-b-2 border-[#0000003a]">
//             <Link
//               href="/"
//               className="flex items-center mr-[-8px] space-x-6 lg:block"
//             >
//               <Image
//                 src="/mentorlelogo.png"
//                 width={200}
//                 height={200}
//                 alt="Logo"
//                 className="pl-5 xl:pl-0 md:w-[200px]"
//               />
//             </Link>

//             <div className="lg:hidden flex-1 flex justify-end">
//               <button
//                 className="p-2 rounded-md focus:outline-none"
//                 onClick={toggleMenu}
//               >
//                 {menuOpen ? (
//                   <X className="w-6 h-6 text-black" />
//                 ) : (
//                   <Menu className="w-6 h-6 text-black" />
//                 )}
//               </button>
//             </div>

//             <NavigationMenu>
//               <NavigationMenuList className="hidden lg:flex space-x-3">
                
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     Find Mentor
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {findmentor.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     Become Mentor
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {becomementor.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     Community
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {community.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     Resources
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {resources.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     For University
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {university.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     About Us
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                       {about.map((item) => (
//                         <ListItem
//                           key={item.title}
//                           title={item.title}
//                           href={item.href}
//                         >
//                           {item.description}
//                         </ListItem>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 {/* <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">
//                     Programs & Courses
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//                       <li className="row-span-3">
//                         <NavigationMenuLink asChild>
//                           <a
//                             className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
//                             href="/"
//                           >
//                             <Image
//                               src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/cs-r.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jcy1yLnBuZyIsImlhdCI6MTc0MzYxMTk1NiwiZXhwIjoyMDU4OTcxOTU2fQ.BF0TOe-CZPdvVBbmjR-0ya_VIgvDamOwkguvOlitaZw"
//                               width={40}
//                               height={32}
//                               className="h-32 w-40"
//                               alt="Free Courses"
//                             />
//                             <div className="mb-2 mt-4 text-lg font-medium">
//                               Free Courses
//                             </div>
//                             <p className="text-sm leading-tight text-muted-foreground">
//                               Coming Soon!
//                             </p>
//                           </a>
//                         </NavigationMenuLink>
//                       </li>
//                       <ListItem href="/" title="Cloud Computing">
//                         Coming Soon!
//                       </ListItem>
//                       <ListItem href="/" title="Blockchain Development">
//                         Coming Soon!
//                       </ListItem>
//                       <ListItem href="/" title="Cybersecurity">
//                         Coming Soon!
//                       </ListItem>
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem> */}

//                 <NavigationMenuItem>
//                   <NavigationMenuLink asChild>
//                     <Link href="/login" className="hidden lg:flex px-6 py-3 text-white bg-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-white hover:text-black hover:scale-105">
//                       Login
//                     </Link>
//                   </NavigationMenuLink>
//                 </NavigationMenuItem>
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>

//           {menuOpen && (
//             <div className="fixed top-[80px] left-0 right-0 z-50 flex flex-col lg:hidden bg-gray-100 shadow-lg rounded-lg p-4 space-y-4 mx-4">
//               {/* <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   Programs & Courses
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   <Link
//                     href="/"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     Cloud Computing
//                   </Link>
//                   <Link
//                     href="/"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100"
//                   >
//                     Blockchain Development
//                   </Link>
//                   <Link
//                     href="/"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Cybersecurity
//                   </Link>
//                 </div>
//               </div> */}

//               <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   Community
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   <Link
//                     href="/events"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     Events & Workshops
//                   </Link>
//                   <Link
//                     href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Join Now
//                   </Link>
//                 </div>
//               </div>

//               <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   Resources
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   <Link
//                     href="/resources"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     Resources
//                   </Link>
//                   <Link
//                     href="/perk-discount"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Perks & Discounts
//                   </Link>
//                 </div>
//               </div>

//               <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   For University
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   {/* <Link
//                     href="/student-training"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     Student Training
//                   </Link> */}
//                   <Link
//                     href="/campus"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Campus Program (Coming Soon)
//                   </Link>
//                 </div>
//               </div>

//               <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   Mentorship
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   <Link
//                     href="/mentor"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     Find a Mentor
//                   </Link>
//                   <Link
//                     href="/become-mentor"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Become Mentor
//                   </Link>
//                 </div>
//               </div>

//               <div className="relative group inline-block text-left">
//                 <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//                   About Us
//                   <svg
//                     className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="absolute left-0 mt-2 w-56 bg-transparent shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 group-hover:bg-white z-50">
//                   <Link
//                     href="/about"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-t-lg"
//                   >
//                     About
//                   </Link>
//                   <Link
//                     href="/contact"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100"
//                   >
//                     Contact
//                   </Link>
//                   <Link
//                     href="/team"
//                     className="block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded-b-lg"
//                   >
//                     Team
//                   </Link>
//                 </div>
//               </div>

//               <div className="flex justify-evenly">
//                 <Link
//                   href="/login"
//                   className="px-4 py-4 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-[#000000] hover:text-white hover:scale-105"
//                 >
//                   Login
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {children}

//       {shouldShowNavAndFooter && (
//         <>
//           <Image
//             src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/footer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mb290ZXIucG5nIiwiaWF0IjoxNzQzNjExOTg1LCJleHAiOjIwNTg5NzE5ODV9.as2D7XlTNWc36yJCDkhk2UKDznRfG1kMWXf37H1BbBE"
//             width={1000}
//             height={300}
//             alt="footerimage"
//             className="w-full h-auto relative -bottom-2"
//           />

//           <footer className="bg-black relative -bottom-1">
//             <div className="relative flex items-center justify-center flex-col xl:-top-5 py-8 px-4 space-y-6">
//               <Image
//                 src="/logo.png"
//                 alt="Logo"
//                 width={300}
//                 height={300}
//                 className="w-[150px] sm:w-[200px] lg:w-[250px] xl:w-[300px]"
//               />
//               <div className="h-[2px] bg-[#ffffff3a] w-[40%] mx-auto mt-5" />
//               <div className="flex justify-center items-center gap-10 mt-5">
//                 <Link
//                   href="https://discord.com/invite/Cm2zFMGEYq"
//                   className="transition-transform duration-200 hover:scale-110"
//                 >
//                   <img
//                     src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw"
//                     alt="discord"
//                     width={30}
//                     height={30}
//                     className="w-[20px] sm:w-[30px]"
//                   />
//                 </Link>
//                 <Link
//                   href="https://www.instagram.com/mentorle_official/"
//                   className="transition-transform duration-200 hover:scale-110"
//                 >
//                   <img
//                     src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc"
//                     alt="instagram"
//                     width={30}
//                     height={30}
//                     className="w-[20px] sm:w-[30px]"
//                   />
//                 </Link>
//                 <Link
//                   href="https://www.linkedin.com/company/mentorlee/"
//                   className="transition-transform duration-200 hover:scale-110"
//                 >
//                   <img
//                     src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo"
//                     alt="linkedin"
//                     width={30}
//                     height={30}
//                     className="w-[20px] sm:w-[30px]"
//                   />
//                 </Link>
//                 <Link
//                   href="https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH"
//                   className="transition-transform duration-200 hover:scale-110"
//                 >
//                   <img
//                     src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc"
//                     alt="whatsapp"
//                     width={30}
//                     height={30}
//                     className="w-[20px] sm:w-[30px]"
//                   />
//                 </Link>
//               </div>
//               <div className="flex flex-col space-y-6 w-full mt-6 px-4 sm:px-6 lg:px-8 xl:px-12">
//   {/* Links Section */}
//               <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
//                 <Link
//                   href="/private-policy"
//                   className="transition-colors duration-200 hover:text-[#2D59E3]"
//                 >
//                   <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
//                     Privacy Policy
//                   </div>
//                 </Link>
//                 <a
//                   href="https://t.me/+sjxQXmum2GA0YWQ9"
//                   className="transition-colors duration-200 hover:text-[#2D59E3]"
//                 >
//                   <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
//                     FAQs
//                   </div>
//                 </a>
//                 <a
//                   href="https://t.me/+sjxQXmum2GA0YWQ9"
//                   className="transition-colors duration-200 hover:text-[#2D59E3]"
//                 >
//                   <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
//                     Contact Us
//                   </div>
//                 </a>
//                 <Link
//                   href="/term-and-conditions"
//                   className="transition-colors duration-200 hover:text-[#2D59E3]"
//                 >
//                   <div className="text-white text-center underline cursor-pointer hover:font-semibold text-sm sm:text-base">
//                     Terms & Conditions
//                   </div>
//                 </Link>
//               </div>

//               {/* Divider */}
//               <div className="h-px bg-white/20 w-full max-w-4xl mx-auto"></div>

//               {/* Copyright and Company Info Section */}
//               <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 text-center lg:text-left">
//                 {/* Copyright */}
//                 <div className="text-white opacity-85 text-sm sm:text-base order-2 lg:order-1">
//                   © {new Date().getFullYear()} AltioraEdtech Learning (OPC) Pvt. Ltd. All rights reserved.
//                 </div>
                
//                 {/* CIN */}
//                 <div className="text-white opacity-85 text-sm sm:text-base order-1 lg:order-2">
//                   <p>CIN: U85500PB2025OPC064679</p>
//                 </div>
//               </div>
//             </div>
//             </div>
//           </footer>
//         </>
//       )}
//     </>
//   );
// }

// const ListItem = React.forwardRef(
//   ({ className, title, children, ...props }, ref) => {
//     return (
//       <li>
//         <NavigationMenuLink asChild>
//           <a
//             ref={ref}
//             className={cn(
//               "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//               className
//             )}
//             {...props}
//           >
//             <div className="text-sm font-medium leading-none">{title}</div>
//             <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//               {children}
//             </p>
//           </a>
//         </NavigationMenuLink>
//       </li>
//     );
//   }
// );
// ListItem.displayName = "ListItem";




// "use client";

// import * as React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { Menu, X, ChevronDown } from "lucide-react";

// // Consolidated navigation data
// const navigationData = {
//   findMentor: [
//     {
//       title: "Find a Mentor",
//       href: "/mentor",
//       description: "Book a mentor for personalized guidance and support.",
//     },
//   ],
//   becomeMentor: [
//     {
//       title: "Become a Mentor",
//       href: "/become-mentor",
//       description: "Share your expertise and guide others.",
//     },
//   ],
//   community: [
//     {
//       title: "Events and Workshops",
//       href: "/events",
//       description: "Events and workshops for the community to learn and grow together.",
//     },
//     {
//       title: "Join Now",
//       href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
//       description: "Learn More About Community.",
//     },
//   ],
//   resources: [
//     {
//       title: "Resources",
//       href: "/resources",
//       description: "Resources for the community to learn and grow together.",
//     },
//     {
//       title: "Perks And Discounts",
//       href: "/perk-discount",
//       description: "Get access to dozens of perks and discounts through Mentorle courses.",
//     },
//   ],
//   university: [
//     {
//       title: "Campus Program (Coming Soon)",
//       href: "/campus",
//       description: "Build anticipation for an upcoming feature that integrates Mentorle into university campuses.",
//     },
//   ],
//   about: [
//     {
//       title: "About",
//       href: "/about",
//       description: "About Mentorle.",
//     },
//     {
//       title: "Contact Us",
//       href: "/contact",
//       description: "Contact Mentorle for any queries or to know more about us.",
//     },
//     {
//       title: "Team",
//       href: "/team",
//       description: "Meet Mentorle Team.",
//     },
//   ],
// };

// // Social links data
// const socialLinks = [
//   {
//     href: "https://discord.com/invite/Cm2zFMGEYq",
//     src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw",
//     alt: "discord",
//   },
//   {
//     href: "https://www.instagram.com/mentorle_official/",
//     src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc",
//     alt: "instagram",
//   },
//   {
//     href: "https://www.linkedin.com/company/mentorlee/",
//     src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo",
//     alt: "linkedin",
//   },
//   {
//     href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
//     src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc",
//     alt: "whatsapp",
//   },
// ];

// // Footer links data
// const footerLinks = [
//   { href: "/private-policy", label: "Privacy Policy" },
//   { href: "https://t.me/+sjxQXmum2GA0YWQ9", label: "FAQs" },
//   { href: "https://t.me/+sjxQXmum2GA0YWQ9", label: "Contact Us" },
//   { href: "/term-and-conditions", label: "Terms & Conditions" },
// ];

// // Mobile menu data
// const mobileMenuItems = [
//   // { 
//   //   title: "Mentorship", 
//   //   items: [...navigationData.findMentor, ...navigationData.becomeMentor] 
//   // },
//   { title: "Find Mentor", items: navigationData.findMentor },
//   { title: "Become Mentor", items: navigationData.becomeMentor },
//   { title: "Community", items: navigationData.community },
//   { title: "Resources", items: navigationData.resources },
//   { title: "For University", items: navigationData.university },
//   { title: "About Us", items: navigationData.about },
// ];

// // Reusable components
// const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => (
//   <li>
//     <NavigationMenuLink asChild>
//       <a
//         ref={ref}
//         className={cn(
//           "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//           className
//         )}
//         {...props}
//       >
//         <div className="text-sm font-medium leading-none">{title}</div>
//         <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//           {children}
//         </p>
//       </a>
//     </NavigationMenuLink>
//   </li>
// ));
// ListItem.displayName = "ListItem";

// const DropdownContent = ({ items }) => (
//   <NavigationMenuContent>
//     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//       {items.map((item) => (
//         <ListItem key={item.title} title={item.title} href={item.href}>
//           {item.description}
//         </ListItem>
//       ))}
//     </ul>
//   </NavigationMenuContent>
// );

// const MobileDropdown = ({ title, items }) => (
//   <div className="relative group inline-block text-left">
//     <button className="text-black text-lg font-semibold focus:outline-none flex items-center gap-2">
//       {title}
//       <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" />
//     </button>
//     <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 z-50">
//       {items.map((item, index) => (
//         <Link
//           key={item.title}
//           href={item.href}
//           className={cn(
//             "block text-gray-700 text-sm px-4 py-2 hover:bg-gray-100",
//             index === 0 && "rounded-t-lg",
//             index === items.length - 1 && "rounded-b-lg"
//           )}
//         >
//           {item.title}
//         </Link>
//       ))}
//     </div>
//   </div>
// );

// export default function Template({ children }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
//     setIsAuthenticated(!!token);
//   }, []);

//   const shouldShowNavAndFooter = !isAuthenticated && !pathname.startsWith("/dashboard");

//   return (
//     <>
//       {shouldShowNavAndFooter && (
//         <div className="sticky top-0 z-50 bg-white">
//           <div className="max-w-[1240px] flex flex-wrap items-center justify-around gap-4 mx-auto py-5 border-b-2 border-[#0000003a]">
//             <Link href="/" className="flex items-center mr-[-8px] space-x-6 lg:block">
//               <Image
//                 src="/mentorlelogo.png"
//                 width={200}
//                 height={200}
//                 alt="Logo"
//                 className="pl-5 xl:pl-0 md:w-[200px]"
//               />
//             </Link>

//             <div className="lg:hidden flex-1 flex justify-end">
//               <button
//                 className="p-2 rounded-md focus:outline-none"
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 aria-label="Toggle menu"
//               >
//                 {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>

//             <NavigationMenu>
//               <NavigationMenuList className="hidden lg:flex space-x-3">
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">Find Mentor</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.findMentor} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">Become Mentor</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.becomeMentor} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">Community</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.community} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">Resources</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.resources} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">For University</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.university} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-md">About Us</NavigationMenuTrigger>
//                   <DropdownContent items={navigationData.about} />
//                 </NavigationMenuItem>

//                 <NavigationMenuItem>
//                   <NavigationMenuLink asChild>
//                     <Link
//                       href="/login"
//                       className="hidden lg:flex px-6 py-3 text-white bg-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-white hover:text-black hover:scale-105"
//                     >
//                       Login
//                     </Link>
//                   </NavigationMenuLink>
//                 </NavigationMenuItem>
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>

//           {/* Mobile Menu */}
//           {menuOpen && (
//             <div className="fixed top-[80px] left-0 right-0 z-50 flex flex-col lg:hidden bg-gray-100 shadow-lg rounded-lg p-4 space-y-4 mx-4">
//               {mobileMenuItems.map((section) => (
//                 <MobileDropdown key={section.title} title={section.title} items={section.items} />
//               ))}
              
//               <div className="flex justify-center">
//                 <Link
//                   href="/login"
//                   className="px-4 py-4 text-black font-medium rounded-lg border-2 border-black transition-all duration-200 ease-in-out transform hover:bg-black hover:text-white hover:scale-105"
//                 >
//                   Login
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {children}

//       {shouldShowNavAndFooter && (
//         <>
//           <Image
//             src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/footer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mb290ZXIucG5nIiwiaWF0IjoxNzQzNjExOTg1LCJleHAiOjIwNTg5NzE5ODV9.as2D7XlTNWc36yJCDkhk2UKDznRfG1kMWXf37H1BbBE"
//             width={1000}
//             height={300}
//             alt="Footer background"
//             className="w-full h-auto relative -bottom-2"
//           />

//           <footer className="bg-black relative -bottom-1">
//             <div className="relative flex items-center justify-center flex-col xl:-top-5 py-8 px-4 space-y-6">
//               <Image src="/logo.png" alt="Logo" width={300} height={300} className="w-[150px] sm:w-[200px] lg:w-[250px] xl:w-[300px]" />
              
//               <div className="h-[2px] bg-[#ffffff3a] w-[40%] mx-auto mt-5" />
              
//               <div className="flex justify-center items-center gap-10 mt-5">
//                 {socialLinks.map((social) => (
//                   <Link
//                     key={social.alt}
//                     href={social.href}
//                     className="transition-transform duration-200 hover:scale-110"
//                   >
//                     <img
//                       src={social.src}
//                       alt={social.alt}
//                       width={30}
//                       height={30}
//                       className="w-[20px] sm:w-[30px]"
//                     />
//                   </Link>
//                 ))}
//               </div>

//               <div className="flex flex-col space-y-6 w-full mt-6 px-4 sm:px-6 lg:px-8 xl:px-12">
//                 <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
//                   {footerLinks.map((link) => (
//                     <Link
//                       key={link.label}
//                       href={link.href}
//                       className="text-white text-center underline cursor-pointer hover:font-semibold hover:text-[#2D59E3] text-sm sm:text-base transition-colors duration-200"
//                     >
//                       {link.label}
//                     </Link>
//                   ))}
//                 </div>

//                 <div className="h-px bg-white/20 w-full max-w-4xl mx-auto"></div>

//                 <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 text-center lg:text-left">
//                   <div className="text-white opacity-85 text-sm sm:text-base order-2 lg:order-1">
//                     © {new Date().getFullYear()} AltioraEdtech Learning (OPC) Pvt. Ltd. All rights reserved.
//                   </div>
//                   <div className="text-white opacity-85 text-sm sm:text-base order-1 lg:order-2">
//                     CIN: U85500PB2025OPC064679
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </footer>
//         </>
//       )}
//     </>
//   );
// }