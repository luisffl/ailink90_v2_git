import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import logoPath from "../assets/logo.png";

interface SuccessMessageProps {
  onRestart: () => void;
}

export default function SuccessMessage({ onRestart }: SuccessMessageProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-8 w-8 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-3">Diagnóstico en proceso</h2>
      
      <p className="text-[#B0B0B0] mb-6">
        Recibirás los resultados en tu correo electrónico pronto. 
        ¡Gracias por confiar en AILINK Starter!
      </p>
      
      <div className="mt-8 mb-4">
        <img src={logoPath} alt="AILINK Logo" className="h-10 mx-auto opacity-50" />
      </div>
      
      <Button 
        onClick={onRestart}
        variant="link" 
        className="text-[#2f5aff] underline"
      >
        Realizar otro diagnóstico
      </Button>
    </motion.div>
  );
}
