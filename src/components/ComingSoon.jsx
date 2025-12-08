"use client";

import { motion } from "framer-motion";

const ComingSoon = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[#fbfbfb] p-4 rounded  md:min-h-[400px]">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex justify-center items-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100 blur-3xl"
        ></motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="relative max-w-lg w-full bg-background rounded-2xl shadow-lg p-8 text-center border border-gray-200 backdrop-blur-sm"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-16 h-16 mx-auto mb-6 bg-foreground rounded-full flex items-center justify-center shadow-md"
        >
          <motion.svg
            className="w-9 h-9 text-background"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="text-2xl font-bold mb-3 text-gray-900 overflow-hidden whitespace-nowrap  animate-typing"
        >
          Coming Soon!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-6 text-gray-600"
        >
          We’re crafting something amazing for you. Stay tuned!
        </motion.p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="bg-foreground h-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)]"
            initial={{ width: "0%" }}
            animate={{ width: "85%" }}
            transition={{
              duration: 1.8,
              delay: 1,
              type: "spring",
            }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-sm text-gray-500"
        >
          Page under development. Check back soon!
        </motion.p>
      </motion.div>

      <style jsx global>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-typing {
          animation: typing 2s steps(20) 1; 
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
