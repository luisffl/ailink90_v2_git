import { ProgressIndicatorProps } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-10 max-w-xl mx-auto">
      <div className="flex justify-between mb-3 text-xs text-gray-400">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="font-medium"
          >
            {currentStep === 1 ? 'Información Básica' : 
             currentStep === 2 ? 'Perfil Profesional' : 
             currentStep === 3 ? 'Nichos y Preferencias' : 
             currentStep === 4 ? 'Recursos y Objetivos' : 
             'Finalizar'}
          </motion.span>
        </AnimatePresence>
        <motion.span 
          className="font-mono tracking-wider"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={currentStep}
        >
          <span className="text-blue-400">{currentStep}</span> <span className="opacity-50">/ {totalSteps}</span>
        </motion.span>
      </div>
      <div className="relative">
        <div className="h-1 bg-[#222222] rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="progress-bar h-full rounded-full relative" 
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"></div>
            <div className="absolute inset-0 opacity-50 bg-[length:10px_10px] bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)]"></div>
          </motion.div>
        </div>
        <motion.div
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/30"
          style={{ left: `${progress}%` }}
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
