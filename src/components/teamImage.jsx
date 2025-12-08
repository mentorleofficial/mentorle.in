import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import clsx from "clsx";

export default function TeamImage({ quote, image, type }) {
  const controls = useAnimationControls();
  const [variant, setVariant] = useState({
    initial: { height: 0, width: 0, borderRadius: 999 },
    zoomIn: { height: 440, width: 340, borderRadius: 16, y: 0, x: 0 },
  });

  useEffect(() => {
    setVariant({
      initial: { height: 0, width: 0, borderRadius: 999 },
      zoomIn: { height: "100%", width: "100%", borderRadius: 16, y: 0, x: 0 },
    });
  }, [type]);

  let showDialog = () => {
    controls.start("zoomIn");
    controls.start("rotate");
    controls.start("fadeIn");
  };

  let removeDialog = () => {
    controls.start("initial");
  };

  return (
    <div
      className="relative flex items-center justify-center text-white overflow-hidden"
      onMouseEnter={showDialog}
      onMouseLeave={removeDialog}
    >
      <motion.div
        className={`${clsx(
          type == 1
            ? "w-[190px] h-[270px] lg:w-[250px] lg:h-[330px] xl:w-[320px] xl:h-[420px]"
            : "w-[160px] h-[220px] lg:w-[200px] lg:h-[270px] xl:w-[260px] xl:h-[340px]"
        )} bg-gray-500 rounded-2xl absolute -z-10`}
        animate={controls}
        variants={{ initial: { rotate: 0 }, rotate: { rotate: 4 } }}
        transition={{ type: "tween", delay: 0.2 }}
      />
      <motion.img
        src={image}
        alt="Image"
        className={`${clsx(
          type == 1
            ? "w-[190px] h-[270px] lg:w-[250px] lg:h-[330px] xl:w-[320px] xl:h-[420px]"
            : "w-[160px] h-[220px] lg:w-[200px] lg:h-[270px] xl:w-[260px] xl:h-[340px]"
        )} rounded-2xl object-cover object-center`}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute bg-[#212121] rounded-2xl bottom-0 right-0 z-10"
        animate={controls}
        variants={variant}
        transition={{ type: "tween" }}
      />
      <motion.div
        className={`absolute ${clsx(
          type == 1
            ? "w-[190px] h-[270px] lg:w-[250px] lg:h-[330px] xl:w-[320px] xl:h-[420px] text-[12px] lg:text-sm xl:text-base"
            : "w-[160px] h-[220px] lg:w-[200px] lg:h-[270px] xl:w-[260px] xl:h-[340px] text-[11px] lg:text-xs xl:text-sm"
        )} text-center p-4 xl:p-8 flex flex-col items-center justify-center z-20 opacity-0`}
        animate={controls}
        variants={{ initial: { opacity: 0 }, fadeIn: { opacity: 1 } }}
      >
        {type == 2 && <p className="opacity-80 text-xl">Contributor</p>}
        {quote}
      </motion.div>
    </div>
  );
}
