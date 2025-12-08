import React from "react";

const CommunityStats = () => {
  return (
    <div className="relative bg-cover bg-center bg-no-repeat text-black mb-8 p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-6xl font-sans mt-7 mx-auto min-h-[300px] md:min-h-[500px]" 
      style={{ backgroundImage: "url('https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/community_online.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jb21tdW5pdHlfb25saW5lLnBuZyIsImlhdCI6MTc0MzYyNjY1MiwiZXhwIjoyMDU4OTg2NjUyfQ.ZQVofTbGriNS4Qwai-g_aXCs99aFpdaV4Budu1gSah0')"}}>
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>
      <div className="relative flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold mb-3 md:mb-4 text-white">Our Online Community</h1>
          <p className="text-white mb-3 md:mb-4 font-extrabold text-xs md:text-base">
          At Mentorle, we believe that mentorship doesn’t have to be a solitary journey. Our vibrant online community is designed to foster collaboration, support, and growth among IT and Electronics students and professionals from Tier 2, Tier 3, and Tier 4 cities in India. Join us to connect with like-minded individuals who share your passion for technology and innovation.
          </p>
          {/* <p className="text-white mb-4 md:mb-6 font-serif font-extrabold text-xs md:text-base">
            Occasionally we invite someone we really want to speak to (like Sal Khan, George Hotz, and Lady Ada) and host an
            with them.
          </p> */}
          <button className="bg-[#10c03e] hover:bg-black text-white font-bold py-2 px-4 md:px-6 mt-10 rounded-lg w-full md:w-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Join our Community
          </button>
        </div>
        <div className="flex flex-col justify-end items-center md:items-end text-white w-full gap-3 md:gap-6">
          <div className="flex flex-col items-end ">
            <p className="text-2xl font-extrabold md:text-4xl">Our Growing Impact</p>
          </div>
          <div className="flex flex-col items-end  ">
            <p className="text-2xl font-extrabold md:text-4xl">1,500+</p>
            <p className="text-white font-extrabold text-xs md:text-base">Thriving Community Members
            </p>
          </div>
          <div className="flex flex-col items-end ">
            <p className="text-2xl font-extrabold md:text-4xl ">100+</p>
            <p className="text-white font-extrabold justify-end text-xs md:text-base">Inspiring Community Sessions Hosted
            </p>
          </div>
          <div className="flex flex-col items-end ">
            <p className="text-2xl font-extrabold md:text-4xl ">50+</p>
            <p className="text-white font-extrabold text-xs md:text-base">Verified Expert Mentors Onboard</p>
          </div>
          <div className="flex flex-col items-end ">
            <p className="text-2xl font-extrabold md:text-4xl">1</p>
            <p className="text-white font-extrabold text-xs md:text-base">Successful Hackathon Conducted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;
