import Image from "next/image"

export default function TestimonialCard({ quote, image, name, role }) {
    return (
        <div className='px-4 md:px-10'>
            <p className='text-base md:text-2xl font opacity-90'>{quote}</p>
            <div className='flex gap-5 items-center mt-4'>
                <Image src={image} alt="Mentor 1" width={80} height={80} className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-cover rounded-full " />
                <div className='flex flex-col justify-center'>
                    <p className='font-bold text-base md:text-xl'>{name}</p>
                    <p className="text-xs md:text-base">{role}</p>
                </div>
            </div>
        </div>
    )
}