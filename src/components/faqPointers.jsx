'use client'

import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

let variant = {
    initial: { rotate: 0, originX: 0.5, originY: 0.5 },
    rotate: { rotate: 45, originX: 0.5, originY: 0.5 }
};

export default function FaqPointers({question, answer, opened, setOpened, id, points}) {
    const controls = useAnimationControls();
    const show = opened === id;

    useEffect(() => {
        if(!show)
        controls.start('initial');
    }, [show]);

    const handleClick = () => {
        if (show) {
            setOpened(0)
            controls.start('initial')
        }
        else {
            setOpened(id);
            controls.start('rotate')
        }
    }

    return (
        <motion.div className="flex flex-col text-white bg-[#000000e1] w-[100%] lg:w-[600px] mb-3 rounded-xl px-5 cursor-pointer" onClick={handleClick}
            
        >
            <div className="flex items-center gap-5 justify-between py-1">
                <p className="text-base lg:text-xl">{question}</p>
                <motion.p className="text-6xl origin-center cursor-pointer"
                    variants={variant}
                    animate={controls}
                    transition={{ type: 'tween' }}>+</motion.p>
            </div>
            <AnimatePresence>
                {show &&

                    <motion.p className="text-sm md:text-base w-[90%] lg:w-[550px] -mt-3 mb-5"
                        key="modal"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}>
                        <div className="mb-2">{answer}</div>
                        {points.map((point, index) => (
                            <p key={index} className="">• {point}</p>
                        ))}
                    </motion.p>

                }
            </AnimatePresence>

        </motion.div>
    );
}