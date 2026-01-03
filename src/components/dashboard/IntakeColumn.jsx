import IntakeCard from './IntakeCard';
import { Checkbox } from "@/components/ui/checkbox";

export default function IntakeColumn({ title, intakes, icon: Icon, color, selectedIds = [], onToggleSelect }) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shadow-sm">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-blue-900">{title}</h2>
        </div>
        <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
          {intakes.length}
        </span>
      </div>
      <div className={`space-y-3 min-h-[200px] p-4 rounded-xl bg-white/60 backdrop-blur-sm border-l-4 ${color} shadow-lg`}>
        {intakes.length === 0 ? (
          <p className="text-sm text-blue-400 text-center py-8">No intakes</p>
        ) : (
          intakes.map(intake => (
            <div key={intake.id} className="relative group">
              {onToggleSelect && (
                <div 
                  className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded p-1 shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSelect(intake.id);
                  }}
                >
                  <Checkbox 
                    checked={selectedIds.includes(intake.id)}
                    className="border-blue-300"
                  />
                </div>
              )}
              <IntakeCard intake={intake} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}