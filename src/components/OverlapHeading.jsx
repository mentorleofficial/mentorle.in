export default function OverlapHeading({ lower, upper }) {
    return (
        <div className="relative flex items-center justify-center">
            <h1 className="text-6xl sm:text-7xl lg:text-9xl text-[#21212122] font-thin">{lower}</h1>
            <h2 className="text-xl sm:text-2xl lg:text-4xl text-black absolute font-bold">{upper}</h2>
        </div>
    )
}