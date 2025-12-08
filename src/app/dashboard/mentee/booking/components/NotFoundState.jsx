import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundState() {
  const router = useRouter();
  
  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Mentor not found</h1>
      <p className="mb-6">
        The mentor you're looking for doesn't exist or has been removed.
      </p>
      <Button onClick={() => router.push("/dashboard/mentee/findmentor")}>
        Browse Mentors
      </Button>
    </div>
  );
}
