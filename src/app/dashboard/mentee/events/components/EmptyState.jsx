import { Calendar, Plus, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({ filterType, router }) => {
  const getEmptyStateContent = () => {
    switch (filterType) {
      case "upcoming":
        return {
          icon: <Clock className="h-16 w-16 text-blue-400" />,
          title: "No Upcoming Events",
          description: "There are no upcoming events scheduled at the moment. Check back later for new opportunities!",
          actionText: "Browse All Events",
          action: () => router.push("/dashboard/mentee/events")
        };
      case "ongoing":
        return {
          icon: <Calendar className="h-16 w-16 text-orange-400" />,
          title: "No Ongoing Events",
          description: "There are no events currently in progress. Check upcoming events for future opportunities.",
          actionText: "View Upcoming",
          action: () => {}
        };      case "completed":
        return {
          icon: <Calendar className="h-16 w-16 text-gray-400" />,
          title: "No Completed Events",
          description: "You haven't attended any completed events yet. Start your learning journey by joining upcoming events!",
          actionText: "Find Events",
          action: () => router.push("/dashboard/mentee/events")
        };
      default:
        return {
          icon: <Search className="h-16 w-16 text-gray-400" />,
          title: "No Events Found",
          description: "We couldn't find any events matching your criteria.",
          actionText: "Reset Filters",
          action: () => {}
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className=" flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        {content.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {content.description}
      </p>
      {/* <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={content.action} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {content.actionText}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard/mentee/findmentor")}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Find Mentors
        </Button>
      </div> */}
    </div>
  );
};

export default EmptyState;
