"use client";

import { useState, useEffect } from "react";
import FAQ from "@/sections/FAQ";
import {
  Radio,
  ChartColumnIncreasing,
  Handshake,
  GitCommitHorizontal,
} from "lucide-react";
import Link from "next/link";
export default function BecomeMentor() {
  const [isSticky, setIsSticky] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  // (useState < number) | (null > null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="font-sans">
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make a Difference – Become a Mentor
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
              "Share your knowledge, inspire the next generation, and grow your
              leadership skills."
            </p>
            {/* <button></button> */}
            <Link
              href="/apply-mentor"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition duration-300"
            >
              Apply Now
            </Link>
            {/* <Link
              href="https://app.youform.com/forms/nrunmiwn"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition duration-300"
            >
              Apply Now
            </Link> */}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Be a Mentor?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Radio className="w-16 h-16" />,
                  title: "Impact Lives",
                  description:
                    "Help students achieve their academic and career goals.",
                },
                {
                  icon: <ChartColumnIncreasing className="w-16 h-16" />,
                  title: "Professional Growth",
                  description: "Develop coaching and communication skills.",
                },
                {
                  icon: <Handshake className="w-16 h-16" />,
                  title: "Community Building",
                  description:
                    "Connect with like-minded individuals passionate about education.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* eligiblity Section */}
        <section className="py-20">
          <div className="container text-center mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Eligibility Criteria
            </h2>
            <div className="gap-12">
              {[
                {
                  description:
                    "Minimum 2 years of professional experience or advanced degree holders.",
                },
                {
                  description: "Passion for mentoring and guiding young minds.",
                },
              ].map((benefit, index) => (
                <div key={index} className=" ">
                  {/* <div className="text-5xl mb-4">{benefit.icon}</div> */}
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.description}
                  </h3>
                  {/* <p className="text-gray-600">{benefit.description}</p> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Application Process
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
              {[
                {
                  step: <GitCommitHorizontal className="w-6 h-6" />,
                  title: "Step 1",
                  description: "Fill out the application form.",
                },
                {
                  step: <GitCommitHorizontal />,
                  title: "Step 2",
                  description: "Attend a brief orientation session.",
                },
                {
                  step: <GitCommitHorizontal />,
                  title: "Step 3",
                  description: "Get matched with students and start mentoring!",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center md:w-1/4"
                >
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              What Our Mentors Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: "Sarah Johnson",
                  role: "UX Designer at Google",
                  quote:
                    "Mentoring with Mentorle has been an incredibly rewarding experience. It's amazing to see students grow and succeed in their design careers.",
                },
                {
                  name: "Michael Chen",
                  role: "Product Designer at Airbnb",
                  quote:
                    "The flexibility and support from the Mentorle team make mentoring here a joy. I've learned as much from my students as they have from me.",
                },
                {
                  name: "Emma Rodriguez",
                  role: "UI Designer at Facebook",
                  quote:
                    "Being a Mentorle mentor has helped me stay current with industry trends and continuously improve my own skills while helping others.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* FAQ Section */}
        {/* <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  question: "How much time do I need to commit?",
                  answer:
                    "Mentors typically spend 5-10 hours per week, depending on their availability and the number of students they choose to mentor.",
                },
                {
                  question: "Do I need teaching experience?",
                  answer:
                    "While teaching experience is beneficial, it's not required. We provide training and resources to help you become an effective mentor.",
                },
                {
                  question: "How does payment work?",
                  answer:
                    "Mentors are paid monthly based on the number of students mentored and sessions conducted. Rates are competitive and vary based on experience.",
                },
                {
                  question: "Can I mentor part-time?",
                  answer:
                    "Yes, many of our mentors balance mentoring with full-time jobs or other commitments. You can choose how many students you want to mentor.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 transform ${
                        activeAccordion === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  {activeAccordion === index && (
                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <section className=" flex flex-col lg:flex-row gap-5 lg:gap-20 justify-center mt-20 mb-20 px-8 md:px-24 text-black ">
          <FAQ />
        </section>
        {/* Final CTA */}
        <section className="bg-gray-100 mb-10 text-black py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of mentors and help shape the future of design.
            </p>
            <Link
              href="/apply-mentor"
              className="bg-black text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition duration-300"
            >
              Apply to Be a Mentor
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
