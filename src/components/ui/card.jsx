// import * as React from "react";

// import { cn } from "@/lib/utils";

// const Card = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "rounded-lg border bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50",
//       className
//     )}
//     {...props}
//   />
// ));
// Card.displayName = "Card";

// const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex flex-col space-y-1.5 p-6", className)}
//     {...props}
//   />
// ));
// CardHeader.displayName = "CardHeader";

// const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
//   <h3
//     ref={ref}
//     className={cn(
//       "text-2xl font-semibold leading-none tracking-tight",
//       className
//     )}
//     {...props}
//   />
// ));
// CardTitle.displayName = "CardTitle";

// const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
//     {...props}
//   />
// ));
// CardDescription.displayName = "CardDescription";

// const CardContent = React.forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
// ));
// CardContent.displayName = "CardContent";

// const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex items-center p-6 pt-0", className)}
//     {...props}
//   />
// ));
// CardFooter.displayName = "CardFooter";

// export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };


import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, style, ...props }, ref) => {
  // Filter out conflicting animation properties from style prop
  const filteredStyle = style ? {
    ...style,
    // Remove conflicting animation properties if they exist
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      style={filteredStyle}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, style, ...props }, ref) => {
  const filteredStyle = style ? {
    ...style,
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
      style={filteredStyle}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, style, ...props }, ref) => {
  const filteredStyle = style ? {
    ...style,
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <h3
      ref={ref}
      className={cn(
        "text-xl sm:text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      style={filteredStyle}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, style, ...props }, ref) => {
  const filteredStyle = style ? {
    ...style,
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      style={filteredStyle}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, style, ...props }, ref) => {
  const filteredStyle = style ? {
    ...style,
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <div 
      ref={ref} 
      className={cn("p-4 sm:p-6 pt-0", className)} 
      style={filteredStyle}
      {...props} 
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, style, ...props }, ref) => {
  const filteredStyle = style ? {
    ...style,
    ...(style.animation && style.animationDelay && { animation: undefined }),
  } : undefined;

  return (
    <div
      ref={ref}
      className={cn("flex items-center p-4 sm:p-6 pt-0", className)}
      style={filteredStyle}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };