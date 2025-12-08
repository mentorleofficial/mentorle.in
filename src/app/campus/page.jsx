import Image from "next/image";
import Link from "next/link";

export default function Campus() {
  const programSection = [
    {
      title: "On-campus mentorship hubs.",
      image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ig1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pZzEuanBnIiwiaWF0IjoxNzQzNTk1NDA2LCJleHAiOjIwNTg5NTU0MDZ9.OD8E9xIlFz011Mosk0MVjEpisi0e9x2Ybg1bqCwY-jU",
    },
    {
      title: "Networking events and career fairs.",
      image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ig2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pZzIuanBnIiwiaWF0IjoxNzQzNTk1NDE5LCJleHAiOjIwNTg5NTU0MTl9.opPOaiu--A9yuB5D-j-Hfyo2oXnToWWm48chxfNpU6M",
    },
    {
      title: "Collaborations with university clubs and organizations.",
      image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ig3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pZzMuanBnIiwiaWF0IjoxNzQzNTk1NDMwLCJleHAiOjIwNTg5NTU0MzB9.Ct4oZYf-DMVPZv-kaAtwTUNB_1ykM9O079Wh9Q6YzJ4",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black text-white  py-20">
        <div className="container  mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Campus Program – Coming Soon!
            </h1>
            <p className="text-xl mb-8">
              Build anticipation for an upcoming feature that integrates
              Mentorle into university campuses.
            </p>
            <Link
              href="#"
              className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programSection.map(({ title, image }, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt=""
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600 mb-4">
                    {/* Workshops on time management, study techniques, and exam
                    preparation. */}
                  </p>
                  {/* <Link
                    href="#"
                    className="text-black font-semibold hover:underline"
                  >
                    Learn More
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      {/* <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Mentorle has been an incredible experience. The mentors are
                  top-notch and the curriculum is comprehensive."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg"
                    alt={`Student ${i}`}
                    width={40}
                    height={40}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Student Name</p>
                    <p className="text-sm text-gray-500">UX Academy Graduate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      {/* CTA Section */}
      <section className="bg-gray-100 text-black py-20 mb-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8">
            "Sign up for updates to be the first to know when we launch!"
          </p>
          <Link
            href="#"
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Subscribe for Updates
          </Link>
        </div>
      </section>
    </div>
  );
}
