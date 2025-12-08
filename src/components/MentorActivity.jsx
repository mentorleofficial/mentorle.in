import Link from "next/link";

const MentorActivity = ({ image, name, description }) => {
  return (
    <div className="flex justify-center p-3">
      <div className="relative w-64 sm:w-72 bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
        {/* Profile Image */}
        <div className="relative w-full h-40 bg-gray-200">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={`${name}'s profile`}
          />
          <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
            <img src="/verified-tick.svg" className="w-5 h-5" alt="Verified" />
          </div>
        </div>

        {/* Mentor Info */}
        <div className="p-4 text-center">
          <h2 className="text-md font-semibold text-gray-900">{name}</h2>
          <p className="text-xs text-gray-600 mt-1">{description}</p>

          {/* View Profile Button */}
          <div className="mt-3">
            <Link
              href="/"
              className="inline-block px-4 py-2 w-full 600 rounded-full text-sm font-medium transition ease-in-out duration-200 text-white bg-black hover:bg-[#525458] hover:scale-105 "
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorActivity;
