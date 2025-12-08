import { Button } from "@/components/ui/button";
import { Users, Zap, BarChart } from "lucide-react";
import Image from "next/image";
export default function StudentTraning() {
  const logos = [
    { name: "Company 1", src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/awsactivate.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hd3NhY3RpdmF0ZS5wbmciLCJpYXQiOjE3NDM1OTQ5OTIsImV4cCI6MjA1ODk1NDk5Mn0.yyXM0qTLVB8pkfFV1Qj4RRKHNas3Qy15ZhXe9_FIzI8" },
    { name: "Company 2", src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/microsoftstartups.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9taWNyb3NvZnRzdGFydHVwcy5qcGciLCJpYXQiOjE3NDM1OTUwMzIsImV4cCI6MjA1ODk1NTAzMn0.qRrh0rJbV_CCe0wOZE3-cP4zbnE6mbph78g2DmzA1Ik" },
    { name: "Company 3", src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/startupindia.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdGFydHVwaW5kaWEucG5nIiwiaWF0IjoxNzQzNTk1MDYyLCJleHAiOjIwNTg5NTUwNjJ9.u1FN2pHBtQ6Pa3eR_54YD3TxSL6c5ci_jjiQ118VAUc" }, 
    { name: "Company 4", src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/nasscom.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9uYXNzY29tLmpwZyIsImlhdCI6MTc0MzU5NTA5MiwiZXhwIjoyMDU4OTU1MDkyfQ.2N4CQkxbXp7S8yFipY1NlNw4nERnqSX3Eeu329BtaeI" },
    // { name: "Company 5", src: "/placeholder.svg?height=50&width=120" },
  ];
  const features = [
    {
      icon: <BarChart className="h-10 w-10 text-blue-500" />,
      title: "Perks and Discounts",
      description:
        "List any exclusive discounts or benefits mentors receive (e.g., access to training resources, networking opportunities).",
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-500" />,
      title: "Professional Development",
      description:
        "Highlight how mentoring can enhance their own skills and leadership abilities.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: "Giving Back",
      description: "Emphasize the satisfaction of helping students succeed.",
    },
  ];
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* // Hero Section */}
      <section className="bg-gray-100 py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-6xl gap-5 mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
              Create training modules relevant to university students (e.g.,
              career planning, interview skills, specific industry knowledge).
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Incorporate mentor feedback sessions into the training programs.
            </p>
            <Button size="lg" className="text-lg px-8 py-4">
              Enroll Now – Elevate Your Skills!
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/st1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdDEuanBnIiwiaWF0IjoxNzQzNTk1OTM3LCJleHAiOjIwNTg5NTU5Mzd9.jGkkIS-pqFZODRo1ncrKdZETRVTjUOKBvEXsjRTqmmU"
              alt="Team working together"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* // Logos Section */}
      <section className="bg-white py-16 px-6 md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
            Supported & Backed By
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {logos.map((logo) => (
              <Image
                key={logo.name}
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                width={120}
                height={50}
                className=" hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>
      {/* // Features Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Clearly outline the perks of becoming a mentor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* // Testimonials Section */}
      <section className="bg-white py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-center">
            <p className="text-2xl md:text-3xl font-medium text-gray-800 mb-8">
              "Personalized Mentorship for University Success" or "Unlock Your
              Potential with Expert Guidance at Mentorle"
            </p>
            <footer className="flex flex-col items-center">
              <Image
                src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/rachit.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYWNoaXQuanBnIiwiaWF0IjoxNzQzNTk1OTEzLCJleHAiOjIwNTg5NTU5MTN9.pa7sZ6_BPsekl92RHcbBkqwz60YZAXz2kzFbCR0kM2Y"
                alt="Jane Doe"
                width={150}
                height={150}
                className="rounded-full mb-4 shadow-xl"
              />
              <cite className="text-lg font-semibold text-gray-800 not-italic">
                Rachit Jain
              </cite>
              <p className="text-gray-600">Founder & CEO</p>
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
