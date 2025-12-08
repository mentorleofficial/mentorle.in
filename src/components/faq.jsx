'use client'

import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

let variant = {
    initial: { rotate: 0, originX: 0.5, originY: 0.5 },
    rotate: { rotate: 45, originX: 0.5, originY: 0.5 }
};

export default function Faq({question, answer, opened, setOpened, id}) {
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
            controls.start('expand')
        }
    }

    return (
        <motion.div className="flex flex-col text-white bg-[#000000e1] w-[100%] lg:w-[600px] mb-3 rounded-xl px-5 cursor-pointer overflow-hidden" onClick={handleClick}
            variants={{
                initial: { height: 65 },
                expand: {height: 'auto'}
            }}
            animate={controls}
            transition={{type: 'tween'}}
        >
            <div className="flex gap-5 items-center justify-between py-1 ">
                <p className="text-base md:text-xl">{question}</p>
                <motion.p className="text-6xl origin-center cursor-pointer"
                    variants={variant}
                    animate={controls}
                    transition={{ type: 'tween' }}>+</motion.p>
            </div>
            <AnimatePresence>
                {
                    <p className="text-sm md:text-base w-[90%] lg:w-[550px] mb-5">
                        {answer}
                    </p>

                }
            </AnimatePresence>

        </motion.div>
    );
}