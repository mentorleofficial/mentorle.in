"use client";

import Faq from "@/components/faq";
import { useState } from "react";
import FaqPointers from "@/components/faqPointers";
import Button from "@/components/Button";
import Link from "next/link";

let points = [
  "Career guidance in IT And Electronic field",
  "Skill development and knowledge sharing",
  "Networking opportunities",
  "Feedback and review of your work",
  "Motivation and encouragement",
  "Get rewards",
];

export default function FAQ() {
  const [opened, setOpened] = useState(0);
  return (
    <>
      <div>
        <p className="text-xl md:text-2xl text-gray-800 mb-3 md:mb-7">FAQ</p>
        <h2 className="text-3xl md:text-6xl font-semibold">
          Frequently Asked Questions
        </h2>
        <p className="text-sm md:text-base opacity-70 mt-2 md:mt-5 mb-3">
          Explore our FAQ section to find answers to commonly asked questions
          about our products/services. If you can't find what you're looking
          for, feel free to reach out to join our Telegram Discussion Forum.
        </p>
        <Link href="https://t.me/+sjxQXmum2GA0YWQ9">
          <Button text="Join our Discussion Forum" />
        </Link>
      </div>

      <div className="mt-7">
        <Faq
          question={"What is Mentorle?"}
          answer={
            "Mentorle is providing one-on-one mentoring and guidance from our experienced mentors in the field of IT And Electronic or Developing a platform that would enable graduates and students to network with organizations and entrepreneurs while providing them with access to all the support they might require, including assistance in coding problems or contests."
          }
          opened={opened}
          setOpened={setOpened}
          id={1}
        />
        <Faq
          question={"Who are the mentors on Mentorle?"}
          answer={
            "Our mentors are experienced professionals from various IT And Electronic fields, including software development, data science, cybersecurity, and more. They are passionate about helping others and committed to sharing their knowledge and expertise."
          }
          opened={opened}
          setOpened={setOpened}
          id={2}
        />
        <FaqPointers
          question={"What kind of support can I expect from my mentor?"}
          answer={
            "Your mentor can provide various types of support, including:"
          }
          opened={opened}
          setOpened={setOpened}
          id={3}
          points={points}
        />
        <Faq
          question={"Is Mentorle secure?"}
          answer={
            "Yes, Mentorle takes data security very seriously. We use industry-standard security measures to protect your personal information."
          }
          opened={opened}
          setOpened={setOpened}
          id={4}
        />
        <Faq
          question={"How much does it cost to use Mentorle?"}
          answer={
            "It is cost-effective, so you don't have to worry about authenticity or legitimacy— we offer you reliable services."
          }
          opened={opened}
          setOpened={setOpened}
          id={5}
        />
      </div>
    </>
  );
}
