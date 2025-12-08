import { motion } from "framer-motion"
import Link from "next/link"

export default function Button({ text, link }) {
    return (

        <motion.button className="bg-black text-white text-sm md:text-base hover:bg-[#222222] rounded-full px-6 py-3 font-bold button w-fit"
            whileHover={{}}>
            {text}
        </motion.button>

    )
}