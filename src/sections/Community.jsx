import Button from "@/components/Button";

export default function Community() {
  return (
    <section className="text-white communitysection relative overflow-hidden mt-20 mb-20">
      <img
        src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/community.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jb21tdW5pdHkuanBnIiwiaWF0IjoxNzQzNjE4MTM3LCJleHAiOjIwNTg5NzgxMzd9.qSUUpuT3djmJU6_Abi5uUvAzsxv6gc9fyfGBw2hBkfY"
        alt="Community"
        className="w-full h-full absolute -z-30 object-cover"
      />
      <div className="bg-[#000000a6] w-full h-full absolute -z-10" />
      <div className="flex flex-col gap-3 w-[70%] mx-auto py-10">
        <div className="text-3xl font-bold">
          WELCOME TO <span className="text-[#526fff]">MENTORLE</span>
        </div>
        <div className="text-4xl inline">
          We have more than a{" "}
          <span className="relative w-fit text-black px-2 text-center font-bold">
            <span className="bg-white rounded-lg absolute w-full h-full -rotate-2 -z-10 left-0" />
            1000+ members
          </span>{" "}
          from all around India who can learn, code, interact together.
        </div>

        <div className="flex gap-10 my-5">
          <div className="border-2 border-white border-solid rounded-3xl w-fit flex flex-col items-center p-5">
            <p className="text-6xl">1000+</p>
            <p className="text-xl">Members</p>
          </div>
          <div className="border-2 border-white border-solid rounded-3xl w-fit flex flex-col items-center p-5">
            <p className="text-6xl">10+</p>
            <p className="text-xl">Current Mentors</p>
          </div>
          <div className="border-2 border-white border-solid rounded-3xl w-fit flex flex-col items-center p-5">
            <p className="text-6xl">4+</p>
            <p className="text-xl">Current Events</p>
          </div>
        </div>

        <Button text="Join our community" />
      </div>
    </section>
  );
}
