import { Users, Check, Clock, AlertCircle } from "lucide-react";

function StatsCard({ title, value, icon, color, alert = false }) {
  return (
    <div className={`
      bg-white border-2 border-black p-3 relative
      shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
      hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]
      transition-all duration-200
    `}>
      {alert && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center animate-pulse">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <div className="text-black">{icon}</div>
        <div className={`w-2 h-2 rounded-full ${alert ? 'bg-black' : 'bg-black/20'}`}></div>
      </div>
      <div>
        <p className="text-xs font-black text-black uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-black">{value}</p>
      </div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
      <StatsCard
        title="Total"
        value={stats.total}
        icon={<Users className="w-4 h-4" />}
        color="bg-white"
      />
      <StatsCard
        title="Active"
        value={stats.active}
        icon={<Check className="w-4 h-4" />}
        color="bg-white"
      />
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="w-4 h-4" />}
        color="bg-white"
        alert={stats.pending > 0}
      />
      <StatsCard
        title="Expired"
        value={stats.expired}
        icon={<AlertCircle className="w-4 h-4" />}
        color="bg-white"
        alert={stats.expired > 0}
      />
    </div>
  );
}
