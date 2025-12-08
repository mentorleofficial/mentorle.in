import { Calendar } from "lucide-react";

export default function BookingSlots({ 
  availabilitySlots, 
  selectedSlot, 
  setSelectedSlot,
  formatTimeSlot 
}) {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
      {availabilitySlots.map((slot) => (
        <div
          key={slot.id}
          className={`p-3 border rounded-lg cursor-pointer flex items-center ${
            selectedSlot?.id === slot.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-400"
          }`}
          onClick={() => setSelectedSlot(slot)}
        >
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
            <Calendar size={16} />
          </div>
          <div>
            <p className="font-medium">{formatTimeSlot(slot)}</p>
            <p className="text-xs text-gray-500">60 min session</p>
          </div>
        </div>
      ))}
    </div>
  );
}
