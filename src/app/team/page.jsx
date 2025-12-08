"use client";

import Teamcard from "@/components/teamCard";
import OverlapHeading from "@/components/OverlapHeading";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

let team = [
  {
    name: "Rachit Jain",
    role: "Founder & CEO",
    quote:
      "Mr. Rachit Jain driven by a passion for learning and a deep-seated commitment to empowering students in the IT field, he is the visionary behind our mentorship platform. With a wealth of experience in leading various clubs, organizing hackathons, and curating enriching events, he is on a mission to make a difference.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/rachit.new.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYWNoaXQubmV3LmpwZyIsImlhdCI6MTc0NDAwMzYyMywiZXhwIjoyMDU5MzYzNjIzfQ.8oFZY22TfkOVe0tBnnv1toXqSEQWYqzi-YPIzjiPhHQ",
  },
  {
    name: "Alekh Johari",
    role: "Advisor",
    quote:
      "Mr.Alekh Johari is founder of Anemoi Solution, a Web3-focused design and development agency that helps Web3 founders bring their vision to life. With around 20 years of overall experience, He  led and delivered projects for clients such as FIFA World Cup and London Olympics, creating top-notch designs and solutions for them.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/alekhjohari.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hbGVraGpvaGFyaS5qcGciLCJpYXQiOjE3NDM2MDk1NzMsImV4cCI6MjA1ODk2OTU3M30.fCtpd1uYf-2NliPXL69OsWHWARrdSAKBHdXLCjKKU0w",
  },
  {
    name: "Sougat Chatterjee",
    role: "Advisor",
    quote:
      "Mr. Sougat Chatterjee is an acclaimed Healthcare Leader, Startup Mentor, Academic Advisor, Keynote Speaker & a Humanitarian. He is a Mentor at Niti Aayog, Co-Founder of Abhay Ventures & Abhay Health and he is also on Board for many start-ups in healthtech, wellbeing, and education sectors.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/sougat.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zb3VnYXQuanBnIiwiaWF0IjoxNzQzNjA5NjUxLCJleHAiOjIwNTg5Njk2NTF9.qvvD5bpn17llkg6XCOBMNMqa02Ov89x3PvnWlnBekmQ",
  },

  // {
  //   name: "Anisha Jain",
  //   role: "Marketing Consultant",
  //   quote:
  //     "marketing and counseling consultant at Mentorle, responsible for creating and implementing marketing strategies to promote the platform. She is passionate about helping students and mentors connect and learn from each other.",
  //   image:
  //     "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/anisha.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hbmlzaGEuanBlZyIsImlhdCI6MTc0MzYwOTY4NywiZXhwIjoyMDU4OTY5Njg3fQ.cIvj9UxwxXp2nzBuERcIyVxqfjLSkmkQPjY9lP4_RbY",
  // },

  
  {
    name: "Abhishek Soni",
    role: "Technical Head",
    quote:
      "Develop the backend of the Mentorle website, ensuring that the platform runs smoothly and efficiently. He is a key player in the development of the website, ensuring that it is user-friendly and easy to navigate.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/Abhisheksoni.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9BYmhpc2hla3NvbmkuanBnIiwiaWF0IjoxNzQ0MDAzMzc4LCJleHAiOjIwNTkzNjMzNzh9.bEtN9omysYSn5I637ppaC7kVTN1gHezgBUC83U1_RW8",
  },
  
];
let mentor = [
  {
    name: "Ravi Prakash",
    role: "Mentor & Support",
    quote:
      "Mentor and Support for the Mentorle platform, providing guidance and assistance to students and mentors. He is passionate about helping others succeed and is dedicated to making a positive impact on the lives of students and mentors.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ravi.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYXZpLmpwZyIsImlhdCI6MTc0MzYwOTg2MiwiZXhwIjoyMDU4OTY5ODYyfQ.QgkGR0sOOUkffHLYoy4l5xoyLAQfxoXyboAbGNO7U1k",
  },
  {
    name: "Abhishek Sharma",
    role: "Mentor & Support",
    quote:
      "Mr. Abhishek Sharma is mentor and support for the Mentorle platform, providing guidance and assistance to students and mentors. He is passionate about helping others succeed and is dedicated to making a positive impact on the lives of students and mentors.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/abhishekCloudPotatoe.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hYmhpc2hla0Nsb3VkUG90YXRvZS5qcGVnIiwiaWF0IjoxNzUxMDk0OTk3LCJleHAiOjIwNjY0NTQ5OTd9.4lpOMbCMb01fiXoh2-RgQAU_Bpq0MyTVL6hVkNjYqo4",
  },
  {
    name: "Jaskeerat Singh",
    role: "Technical Mentor",
    quote:
      "Mr. Jaskeerat Singh is Software Engineer Brevo, a tech enthusiast, and a mentor. He is passionate about building scalable and reliable software systems. He has experience in building and scaling web applications and is always eager to learn and share his knowledge.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/jaskeerat.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9qYXNrZWVyYXQuanBlZyIsImlhdCI6MTc0MzYwOTkwMywiZXhwIjoyMDU4OTY5OTAzfQ.JDclb8Q72ipVuF_DSak321V50kjW2h-Ml-fxge2GC8w",
  },
  {
    name: "Anurag Mishra",
    role: "Technical Mentor",
    quote:
      "Mr. Anurag Mishra is Software Engineer PayU, a tech enthusiast, and a mentor. He is passionate about building scalable and reliable software systems. He has experience in building and scaling web applications and is always eager to learn and share his knowledge.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/Anurag.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9BbnVyYWcucG5nIiwiaWF0IjoxNzQzNjA5OTMxLCJleHAiOjIwNTg5Njk5MzF9.FmuwiYORGWUcjupL3LFieG5hw0t3KWxom7zPC-thLzM",
  },
];
let contributors = [
  {
    name: "Aksh Walia",
    role: "Full Stack Developer",
    quote:
      "With expertise in both front-end and back-end development, Aksh plays a key role in maintaining and enhancing the functionality of Mentorle's website, ensuring a seamless experience for students.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/aksh.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9ha3NoLmpwZyIsImlhdCI6MTc0MzYwOTk0OSwiZXhwIjoyMDU4OTY5OTQ5fQ.h5CQmsFb0CTHEAq8Eaq1y-SXYwpOmOQGlNGd_OE7gWg",
  },
  {
    name: "Chaitanya Anand",
    role: "Web Developer",
    quote:
      "A multi-talented asset, lending expertise in frontend development and intern recruitment. Enhancing user experience and sourcing top talent, he's integral to Mentorle's success.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/chaitanya.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jaGFpdGFueWEuanBnIiwiaWF0IjoxNzQzNjA5OTc2LCJleHAiOjIwNTg5Njk5NzZ9.sptym50aILUl-lN9tH8IIKnH0yePP4FvhOnpcYF03fU",
  },
  {
    name: "Aditya Kanodia",
    role: "Partnership and Community",
    quote:
      "A motivating community contributor, always there to plan events, offer assistance, and share knowledge. He fosters collaboration and empowerment within Mentorle's community.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/aditya.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hZGl0eWEuanBnIiwiaWF0IjoxNzQzNjEwMDUyLCJleHAiOjIwNTg5NzAwNTJ9.Ih5PB8def_wxl2l8PsHKkEhxZve8-C18c7Y_ijfNh_s",
  },
  {
    name: "Jasleen kaur",
    role: "Social Media Manager",
    quote:
      "manage the social media presence of Mentorle, ensuring that the platform is engaging and informative. She is responsible for creating and curating content that resonates with students and mentors.",
    image:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/jasleen.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9qYXNsZWVuLmpwZyIsImlhdCI6MTc0MzYxMDA4MCwiZXhwIjoyMDU4OTcwMDgwfQ.03d8jVqIzJxZa6nZIv0I-_jTwIWBsl3yzTPwqtUo6aU",
  },
];
export default function Resources() {
  return (
    <div className="my-20 min-h-[60vh] sm:h-auto flex flex-col mx-10 lg:mx-28">
      <OverlapHeading lower={"TEAM"} upper={"MEET OUR TEAM"} />
      <h1 className="text-xl text-center lg:text-2xl font-semibold mb-7">
        A passionate group driven by dedication, time, and effort. Together, we
        believe that anything is possible. With diverse skills and unwavering
        commitment, we're united in our mission to empower students and mentors
        alike on their journey to success with Mentorle.
      </h1>
      <Tabs defaultValue="team" className="w-full">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="mentor">Mentor</TabsTrigger>
          {/* <TabsTrigger value="contributors">Past Contributor</TabsTrigger> */}
        </TabsList>

        <TabsContent value="team">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5">
            {team.map((card, index) => {
              return (
                <div key={index} className="min-w-[350px]">
                  <Teamcard {...card} />
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="mentor">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5">
            {mentor.map((card, index) => {
              return (
                <div key={index} className="min-w-[350px]">
                  <Teamcard {...card} />
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="contributors">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-5">
            {contributors.map((card, index) => {
              return (
                <div key={index} className="min-w-[350px]">
                  <Teamcard {...card} />
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
