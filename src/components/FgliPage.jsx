import Image from "next/image";
import Link from "next/link";

export default function FGLIPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* The Challenge Section */}
      <section className="mb-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="bg-[#333] text-white rounded-full py-2 px-6 mb-6 inline-block">
            <h2 className="text-lg font-medium ">The challenge</h2>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1b4121] mb-6 leading-tight">
            IT & Electronics students in Tier 2, Tier 3, and Tier 4 cities in India
            <span className="bg-[#d3ff7b] text-[#1b4121] px-2 rounded-md mx-1">
              struggle to access quality mentorship and industry-relevant skills,
            </span>
            limiting their chances of securing competitive jobs in the fast-evolving tech landscape
          </h3>
        </div>

        {/* <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#333] text-white p-6 rounded-lg">
            <p className="text-lg mb-4">
              Only <span className="font-bold">1 in 3</span> of all college
              students both graduate within{" "}
              <span className="font-bold">6 years</span> AND have a job{" "}
              <span className="font-bold">6 months</span> after graduation.
            </p>

            <div className="relative w-40 h-40 mx-auto">
              <div className="w-full h-full rounded-full border-8 border-[#2a5a30]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-[#d3ff7b]">33%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#333] text-white p-6 rounded-lg">
            <p className="text-lg mb-4">
              Only <span className="font-bold">44%</span> of FGLI graduates'
              have a job that requires a bachelor's degree one year post-grad.
            </p>

            <div className="flex justify-center space-x-2 mt-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item <= 2 ? "bg-[#d3ff7b]" : "bg-[#d3ff7b]/50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#1b4121]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </section>

      {/* Our Solution Section */}
      <section className="mb-16 grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-[#1b4121] text-white rounded-full py-2 px-6 inline-block mb-6">
            <h2 className="text-lg font-medium">Our solution</h2>
          </div>

          {/* <h3 className="text-2xl md:text-3xl font-bold text-[#1b4121] mb-4">
            Developing FGLI Talent
          </h3> */}

          <p className="text-[#1b4121] mb-6">
            At Mentorle, we are dedicated to bridging the gap between academic learning and industry demands for IT and Electronics students and professionals. Our platform empowers learners by providing
          </p>
          <p className="text-[#1b4121] mb-6">
            Verified Expert Mentors : Rigorous vetting ensures legitimacy through identity checks, professional background validation, and credential verification.
          </p>
          <p className="text-[#1b4121] mb-6">
            Personalized Learning Paths : Step-by-step roadmaps tailored to individual goals, helping mentees acquire marketable skills.
          </p>
          <p className="text-[#1b4121] mb-6">
            Flexible Formats : Access mentorship through 1:1 sessions, group workshops, webinars, and boot camps to suit diverse learning preferences.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#1b4121] mb-4">Our model</h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#1b4121]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <p className="text-sm text-[#1b4121]">
                Community Engagement : A thriving community of 1,500+ members for peer support and networking.
              </p>
            </div>

            {/* <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#1b4121]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 9V7a4 4 0 00-8 0v2" />
                  <path d="M12 12v1" />
                  <path d="M10 11v2" />
                  <path d="M14 11v2" />
                  <path d="M9 16h6" />
                  <path d="M8 20h8a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#1b4121]">
                AI-Powered Matching : Connects mentees with mentors based on specific aspirations and needs.
              </p>
            </div> */}

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#1b4121]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 20h18" />
                  <rect x="6" y="10" width="4" height="10" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </div>
              <p className="text-sm text-[#1b4121]">
                Skill Development : Comprehensive resources like mock interviews, coding assistance, and resume reviews.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#1b4121]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-sm text-[#1b4121]">
                Trust Assurance : Advanced verification processes ensure safety and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Online Design Education Section */}
      {/* <section className="bg-[#eeee] p-6 md:p-10 rounded-lg mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6">
              Online Design Education With a Heavy Dose of Human Connection
            </h2>

            <div className="mt-auto pt-8">
              <Image
                src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/fgli.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mZ2xpLndlYnAiLCJpYXQiOjE3NDM2MjY3NzAsImV4cCI6MjA1ODk4Njc3MH0.fyTNFCjK49DxuKFAYkz8hn-YoJSV9G0IwqE_iIQLuYs"
                width={500}
                height={300}
                alt="Illustration of people collaborating on design"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-black text-xl mb-6">
              We believe that the best way to really learn something is from
              other people. That's why we've put mentorship, feedback, and
              community at the center of all of our programs and courses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <div className="bg-[#333] shadow-md text-[#F8FAFC] p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">TRUE MENTORSHIP</h3>
                <p className="text-md mb-4">
                  Learn with an expert. Our rigorously vetted design mentors
                  provide personalized feedback, encouragement, and an insider's
                  perspective on the design industry.
                </p>
                <Link href="#" className="text-sm flex items-center">
                  <span>+ Learn More about Mentorship</span>
                </Link>
              </div>

              <div className="bg-[#333] shadow-md text-[#F8FAFC] p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">OUR COMMUNITY</h3>
                <p className="text-md mb-4">
                  Just because our courses are online, doesn't mean you'll go it
                  alone. Our online community gives students a space for
                  collaboration, networking, and making new friends.
                </p>
                <Link href="/events" className="text-sm flex items-center">
                  <span>+ Explore our Community</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
