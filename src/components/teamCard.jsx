import TeamImage from "./teamImage";
import clsx from "clsx";

export default function TeamCard({ name, role, image, quote, type }) {
  return (
    <div className="flex flex-col items-center">
      <TeamImage quote={quote} image={image} type={type} />
      <p
        className={`${clsx(
          type == 1 ? "text-2xl lg:text-4xl" : "text-xl lg:text-3xl"
        )} mt-4`}
      >
        {name}
      </p>
      <p
        className={`${clsx(
          type == 1 ? "text-base lg:text-lg" : "text-xs lg:text-sm"
        )} opacity-70`}
      >
        {role}
      </p>
    </div>
  );
}
