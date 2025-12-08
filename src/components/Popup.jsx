// "use client";
// import React, { useState, useEffect } from "react";

// const Popup = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const isPopupClosed = localStorage.getItem("popupClosed") === "true";
//       setIsOpen(!isPopupClosed);
//     }
//   }, []);

//   const closePopup = () => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("popupClosed", "true");
//     }
//     setIsOpen(false);
//   };
//   if (!isOpen) return null;

//   return (
//     <>
//       isOpen && (
//       <div className="fixed top-6 left-0 w-full h-[50px] bg-black flex items-center justify-between px-4 z-50 tracking-widest">
//         <span className="text-white text-lg font-semibold text-center">
//           <marquee behavior="" direction="left">
//             This is a MENTORLE popup!
//           </marquee>
//         </span>
//         <button
//           onClick={closePopup}
//           className="text-3xl font-extrabold text-red-200"
//         >
//           ×
//         </button>
//       </div>
//       )
//     </>
//   );
// };

// export default Popup;

"use client";
import React, { useState, useEffect } from "react";

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPopupClosed = localStorage.getItem("popupClosed") === "true";
      setIsOpen(!isPopupClosed); // Open popup only if it wasn't closed
    }
  }, []);

  const closePopup = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("popupClosed", "true");
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 w-full h-[40px] bg-black flex items-center justify-between px-4 z-50 tracking-widest">
      <span className="text-white text-center text-lg font-semibold w-full">
        <marquee direction="right">This is a MENTORLE popup!</marquee>
      </span>
      <button
        onClick={closePopup}
        className="text-3xl font-extrabold text-red-200"
      >
        ×
      </button>
    </div>
  );
};

export default Popup;
