import { Calendar, Clock, CheckCircle, Play } from "lucide-react";

const EventStats = ({ stats, onFilterChange, currentFilter }) => {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: <Calendar className="h-3.5 w-3.5" />,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      filterValue: "all",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: <Clock className="h-3.5 w-3.5" />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      filterValue: "upcoming",
    },
    {
      label: "Live",
      value: stats.ongoing,
      icon: <Play className="h-3.5 w-3.5" />,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      filterValue: "ongoing",
    },
    {
      label: "Past",
      value: stats.completed,
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      filterValue: "completed",
    },
  ];
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-2 xl:gap-3">
      {statItems.map((item, index) => {
        const isActive = currentFilter === item.filterValue;
        return (
          <div
            key={index}
            onClick={() => onFilterChange && onFilterChange(item.filterValue)}
            className={`bg-white rounded-lg border transition-all duration-200 hover:-translate-y-0.5 flex-1 min-w-[80px] sm:min-w-[90px] lg:min-w-[85px] xl:min-w-[95px] cursor-pointer group ${
              isActive
                ? `${item.borderColor} shadow-md ring-2 ring-blue-200`
                : `${item.borderColor} shadow-sm hover:shadow-md`
            }`}
          >
            <div className="p-2 sm:p-3 lg:p-2 xl:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:flex-col xl:flex-row gap-1 sm:gap-2 lg:gap-1 xl:gap-2">
                <div className="min-w-20 flex-1">
                  <p
                    className={`text-xs font-medium truncate mb-0.5 transition-colors ${
                      isActive
                        ? "text-gray-800"
                        : "text-gray-600 group-hover:text-gray-800"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-sm sm:text-base lg:text-sm xl:text-base font-bold leading-tight transition-transform ${
                      isActive
                        ? "text-gray-900 scale-105"
                        : "text-gray-900 group-hover:scale-105"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
                <div
                  className={`${item.bgColor} ${item.color} p-1 rounded-md flex-shrink-0 self-start sm:self-center lg:self-start xl:self-center transition-transform ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </div>
              </div>
            </div>

            {/* Bottom accent - more prominent when active */}
            <div
              className={`h-0.5 bg-gradient-to-r ${item.bgColor.replace("bg-", "from-")} to-transparent rounded-b-lg transition-opacity ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default EventStats;
