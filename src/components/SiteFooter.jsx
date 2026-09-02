import Image from "next/image";
import Link from "next/link";
import { PLATFORM_URL } from "@/lib/platform";

const SOCIAL_LINKS = [
  {
    href: "https://discord.com/invite/Cm2zFMGEYq",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/discord.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaXNjb3JkLnN2ZyIsImlhdCI6MTc0MzYxMTQ3OSwiZXhwIjoyMDU4OTcxNDc5fQ.wsMJtvIHxMdlfzdUgZ3InqM3rqNkyJetm9HE2cW_STw",
    alt: "discord",
  },
  {
    href: "https://www.instagram.com/mentorle_official/",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/instagram.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pbnN0YWdyYW0uc3ZnIiwiaWF0IjoxNzQzNjExNjI0LCJleHAiOjIwNTg5NzE2MjR9.rL7AyxjX1C7kvyilU1SBEaug7Rl0sSaV2aOhqBws5Kc",
    alt: "instagram",
  },
  {
    href: "https://www.linkedin.com/company/mentorlee/",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/linkedin.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9saW5rZWRpbi5zdmciLCJpYXQiOjE3NDM2MTE1MDksImV4cCI6MjA1ODk3MTUwOX0.fD7lkPJMoXKtDEKldkqkInlsHQJrMAW4gumVJpVOPPo",
    alt: "linkedin",
  },
  {
    href: "https://chat.whatsapp.com/DaP0RTmYUkKGLZvaZuDnWH",
    src: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/whatsapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS93aGF0c2FwcC5zdmciLCJpYXQiOjE3NDM2MTE1MzcsImV4cCI6MjA1ODk3MTUzN30.qDP5_T-QNesX-kVMd8I7Rf29wzK5XjLK1n01dUs-DFc",
    alt: "whatsapp",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/pricing", label: "Mentorle Plus" },
      { href: "/event", label: "Bootcamps" },
      { href: "/event", label: "Masterclasses" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/mentor", label: "Find Mentors" },
      { href: PLATFORM_URL, label: "Opportunities", external: true },
      { href: PLATFORM_URL, label: "1:1 Sessions", external: true },
      { href: "/event", label: "Masterclasses" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cancellation-refund-policy", label: "Cancellation & Refund Policy" },
      { href: "/dpdp-compliance", label: "DPDP Compliance" },
    ],
  },
];

function FooterLink({ href, label, external }) {
  const className =
    "text-gray-300 hover:text-white transition-colors duration-200 text-sm";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function SiteFooter() {
  return (
    <>
      <Image
        src="https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/footer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mb290ZXIucG5nIiwiaWF0IjoxNzQzNjExOTg1LCJleHAiOjIwNTg5NzE5ODV9.as2D7XlTNWc36yJCDkhk2UKDznRfG1kMWXf37H1BbBE"
        width={1000}
        height={300}
        alt="footerimage"
        className="w-full h-auto relative -bottom-2"
      />

      <footer className="bg-black relative -bottom-1">
        <div className="relative flex items-center justify-center flex-col xl:-top-5 py-8 px-4 space-y-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="w-[150px] sm:w-[200px] lg:w-[250px] xl:w-[300px]"
          />
          <div className="h-[2px] bg-[#ffffff3a] w-[40%] mx-auto mt-5" />

          <div className="flex justify-center items-center gap-10 mt-5">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.alt}
                href={social.href}
                className="transition-transform duration-200 hover:scale-110"
              >
                <img
                  src={social.src}
                  alt={social.alt}
                  width={30}
                  height={30}
                  className="w-[20px] sm:w-[30px]"
                />
              </Link>
            ))}
          </div>

          <div className="w-full max-w-6xl mt-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="text-white font-semibold text-base mb-4">
                    {column.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <FooterLink
                          href={link.href}
                          label={link.label}
                          external={link.external}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h3 className="text-white font-semibold text-base mb-4">
                  Contact Us
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  <li>
                    <a
                      href="mailto:support@mentorle.in"
                      className="hover:text-white transition-colors duration-200"
                    >
                      support@mentorle.in
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+919888409232"
                      className="hover:text-white transition-colors duration-200"
                    >
                      +91 9888409232
                    </a>
                  </li>
                  <li>
                    MOH. Sukhiabad, Near Baba Balak Nath Mandir, Hoshiarpur,
                    Punjab — 146001
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/20 w-full max-w-6xl mx-auto mt-6" />

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 text-center lg:text-left w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-white opacity-85 text-sm sm:text-base order-2 lg:order-1">
              © {new Date().getFullYear()} AltioraEdtech Learning (OPC) Pvt.
              Ltd. All rights reserved.
            </div>
            <div className="text-white opacity-85 text-sm sm:text-base order-1 lg:order-2">
              <p>CIN: U85500PB2025OPC064679</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
