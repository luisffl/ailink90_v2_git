import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import logoPath from "../assets/logo.png";

interface SuccessMessageProps {
  onRestart: () => void;
}

export default function SuccessMessage({ onRestart }: SuccessMessageProps) {
  return (
    <motion.div 
      className="glass-card p-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 accent-glow">
        <CheckCircle className="h-10 w-10 text-blue-500" />
      </div>
      
      <h2 className="text-3xl font-grotesk font-medium mb-4 text-white">
        ESTAMOS REALIZANDO EL DIAGNÓSTICO OPERATIVO
      </h2>
      
      <p className="text-gray-400 mb-8 text-lg">
        Gracias por completar el formulario. Estamos procesando tu información 
        para crear un diagnóstico personalizado para tu negocio.
      </p>
      
      <div className="border-t border-[#333] pt-8 mt-8">
        <div className="flex items-center justify-center space-x-2 text-blue-500 cursor-pointer" onClick={() => window.location.href = "https://ailink.es"}>
          <span>Ir a AILINK.es</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mt-10">
        <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto opacity-70" />
      </div>
    </motion.div>
  );
}
