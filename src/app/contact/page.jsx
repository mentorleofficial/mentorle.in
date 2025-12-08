'use client'

import Button from "@/components/Button";

export default function Contact() {
    return (
        <section className="px-10 lg:px-24 flex mt-28 justify-around mb-20 items-center min-h-[60vh]">
          <div className="lg:w-[50%]">
            <h1 className="text-black text-5xl lg:text-[110px] font-bold ">Contact Us</h1>
            <p className="text-lg lg:text-xl text-black mt-4 mb-5">Click the button below to send us an email. Whether you have questions, feedback, or inquiries, we're here to help! Reach out to us and we'll get back to you promptly. We look forward to hearing from you!</p>
            {/* <div className="text-black bg-[#5c5c5c29] w-fit rounded-full mt-5 ">
              <input type="text" placeholder="Enter your email" className="w-[380px] px-5 py-3 bg-transparent outline-none" />
              <Button text="Join Now" />
            </div> */}
            <div className="flex gap-5 items-center mb-3">
                <img src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/mail.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9tYWlsLnN2ZyIsImlhdCI6MTc0MzYxMDI4MCwiZXhwIjoyMDU4OTcwMjgwfQ.WshaJUeUK7icLu4pLQGwMn8JstzWRYTFWa_gaXK3H88" alt="Mail" className="w-[25px]"/>
                <p>support@mentorle.in</p>
            </div>
            <div className="flex gap-5 items-center mb-5">
                <img src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/location.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2NhdGlvbi5zdmciLCJpYXQiOjE3NDM2MTAzMDgsImV4cCI6MjA1ODk3MDMwOH0.GWQZVjZorcp-7Y__wGVGIGGvbhYM5P_cko-QxkqrOEg" alt="Location" className="w-[25px]" />
                <p>Punjab, India</p>
            </div>
            <a href="mailto:support@mentorle.in?subject=General%20Complaint&body=Dear%20Mentorle%20Team,%0A%0AI%20would%20like%20to%20raise%20a%20general%20complaint%20regarding%20the%20following%20issue(s):%0A%0A[Please%20describe%20your%20complaint%20here.]%0Asupport@mentorle.in">
              <Button text="Contact Us" />
            </a>

          </div>
          <div>
            <img src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/contactus.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9jb250YWN0dXMucG5nIiwiaWF0IjoxNzQzNjEwMzI2LCJleHAiOjIwNTg5NzAzMjZ9.VVUkQp5zDrP4QTz9rUXMzoP6A05HOHmnPMoCf0-gYZM" alt="Hero Image" className="w-[550px] -mt-16 hidden lg:block" />
          </div>
        </section>
    )
}