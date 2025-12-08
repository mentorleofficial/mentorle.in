"use client";

import TeamCard from "@/components/teamCard";
import TeamImage from "@/components/teamImage";
import OverlapHeading from "@/components/OverlapHeading";

export default function About() {
  return (
    <>
      <section className="flex flex-col items-center justify-center mt-24 text-black">
        <OverlapHeading lower={"MISSION"} upper={"OUR MISSION"} />

        <p className="text-center w-[80%] text-black text-lg lg:text-xl opacity-90 px-5 mt-5">
          Mentorle mission is to help Indian IT graduates become job-ready. We
          connect students with Our IT experts, offer tailored guidance and
          mentorship for students growing in IT field, and Developing platform.
          That would enable graduates and students to network with organizations
          and entrepreneurs while providing them with access to all the support
          they might require, including assistance in coding problems or
          contests. Our goal is to make sure every graduate can start a
          successful career in IT field.
        </p>
      </section>

      <section className="flex flex-col items-center justify-center mt-24 text-black mb-10">
        <OverlapHeading lower={"VISION"} upper={"OUR VISION"} />

        <p className="text-center w-[80%] text-black text-2xl lg:text-3xl opacity-90 px-5 mt-5">
          "To become the largest platform in Asia for IT field mentors or
          mentees"
        </p>
      </section>

      {/* <section className="text-black flex flex-col items-center mt-28 mb-20">
            <OverlapHeading lower={"TEAM"} upper={"MEET OUR TEAM"} />

                <p className="text-center w-[80%] text-black text-lg lg:text-xl opacity-95 px-5 mt-5">A passionate group driven by dedication, time, and effort. Together, we believe that anything is possible. With diverse skills and unwavering commitment, we're united in our mission to empower students and mentors alike on their journey to success with Mentorle.</p>
            </section>

            <section className="flex flex-wrap gap-14 items-center justify-center text-black mb-24 px-5">
                <TeamCard name={"Rachit Jain"} role={"Founder & CEO"} type={1} quote={"Mr. Rachit Jain driven by a passion for learning and a deep-seated commitment to empowering students in the IT field, he is the visionary behind our mentorship platform. With a wealth of experience in leading various clubs, organizing hackathons, and curating enriching events, he is on a mission to make a difference."} image={"/rachit.jpg"} />
                <TeamCard name={"Alekh Johari"} role={"Advisor"} type={1} quote={"Mr.Alekh Johari is founder of Anemoi Solution, a Web3-focused design and development agency that helps Web3 founders bring their vision to life. With around 20 years of overall experience, He  led and delivered projects for clients such as FIFA World Cup and London Olympics, creating top-notch designs and solutions for them."} image={"/alekhjohari.jpg"} />
                <TeamCard name={"Sougat Chatterjee"} role={"Advisor"} type={1} quote={"Mr. Sougat Chatterjee is an acclaimed Healthcare Leader, Startup Mentor, Academic Advisor, Keynote Speaker & a Humanitarian. He is a Mentor at Niti Aayog, Co-Founder of Abhay Ventures & Abhay Health and he is also on Board for many start-ups in healthtech, wellbeing, and education sectors."} image={"/sougat.jpg"} />
            </section>

            <section className="flex flex-wrap gap-20 items-center justify-center mb-16 px-10">
                <TeamCard name={"Aksh Walia"} role={"Full Stack Developer"} type={2} quote={"With expertise in both front-end and back-end development, Aksh plays a key role in maintaining and enhancing the functionality of Mentorle's website, ensuring a seamless experience for students."} image={"/aksh.jpg"} />
                <TeamCard name={"Chaitanya Anand"} role={"Web Developer"} type={2} quote={"A multi-talented asset, lending expertise in frontend development and intern recruitment. Enhancing user experience and sourcing top talent, he's integral to Mentorle's success."} image={"/chaitanya.jpg"} />
                <TeamCard name={"Aditya Kanodia"} role={"Partnership and Community"} type={2} quote={"A motivating community contributor, always there to plan events, offer assistance, and share knowledge. He fosters collaboration and empowerment within Mentorle's community."} image={"/aditya.jpg"} />
            </section> */}
    </>
  );
}
