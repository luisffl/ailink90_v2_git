import { ProgressIndicatorProps } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-10 max-w-xl mx-auto">
      <div className="flex justify-between mb-2 text-xs text-gray-400">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-medium"
          >
            {currentStep === 1 ? 'Información Básica' : 
             currentStep === 2 ? 'Perfil Profesional' : 
             currentStep === 3 ? 'Nichos y Preferencias' : 
             currentStep === 4 ? 'Recursos y Objetivos' : 
             'Finalizar'}
          </motion.span>
        </AnimatePresence>
        <span className="font-medium tracking-wider">
          {currentStep} <span className="opacity-50">/ {totalSteps}</span>
        </span>
      </div>
      <div className="h-1.5 bg-[#222222] rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div 
          className="progress-bar h-full bg-blue-500 rounded-full accent-glow" 
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
