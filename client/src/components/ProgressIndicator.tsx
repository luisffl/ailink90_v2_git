import { ProgressIndicatorProps } from "@/lib/types";

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-10 max-w-xl mx-auto">
      <div className="flex justify-between mb-2 text-xs text-[#B0B0B0]">
        <span>Inicio</span>
        <span>Paso {currentStep} de {totalSteps}</span>
      </div>
      <div className="h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
        <div 
          className="progress-bar h-full bg-[#2f5aff] rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
