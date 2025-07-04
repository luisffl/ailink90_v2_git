import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logoPath from "@assets/ailink-logo.jpeg";

interface ErrorMessageProps {
  onRestart: () => void;
  errorType?: 'processing' | 'validation' | 'network' | 'unknown';
  errorMessage?: string;
}

export default function ErrorMessage({ onRestart, errorType = 'unknown', errorMessage }: ErrorMessageProps) {
  const getErrorContent = () => {
    switch (errorType) {
      case 'processing':
        return {
          title: "Error en el procesamiento",
          description: "No pudimos procesar tu diagnóstico correctamente. Los datos recibidos están incompletos o tienen errores.",
          icon: <AlertTriangle className="w-12 h-12 text-orange-400" />,
          suggestion: "Intenta completar el formulario nuevamente con información más detallada."
        };
      case 'validation':
        return {
          title: "Datos insuficientes",
          description: "La respuesta del sistema no contiene la información necesaria para generar tu diagnóstico.",
          icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
          suggestion: "Revisa que hayas completado todos los campos correctamente."
        };
      case 'network':
        return {
          title: "Error de conexión",
          description: "No pudimos conectar con nuestros servidores para procesar tu solicitud.",
          icon: <RefreshCw className="w-12 h-12 text-red-400" />,
          suggestion: "Verifica tu conexión a internet e intenta nuevamente."
        };
      default:
        return {
          title: "Error inesperado",
          description: errorMessage || "Ha ocurrido un error inesperado durante el proceso.",
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          suggestion: "Intenta nuevamente en unos momentos."
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        className="glass-card p-14 text-center max-w-2xl mx-auto relative column-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img 
            src={logoPath} 
            alt="AILINK Logo" 
            className="w-16 h-16 mx-auto rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Indicador de error */}
        <div className="mb-4 opacity-60">
          <span className="symbolic-marker">⁜ ERROR ⁜</span>
        </div>

        {/* Icono de error */}
        <motion.div 
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
        >
          {errorContent.icon}
        </motion.div>

        {/* Título del error */}
        <motion.h1 
          className="text-3xl font-light mb-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {errorContent.title}
        </motion.h1>

        {/* Descripción del error */}
        <motion.p 
          className="text-gray-300 text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {errorContent.description}
        </motion.p>

        {/* Sugerencia */}
        <motion.div 
          className="bg-gray-800/30 rounded-lg p-6 mb-8 border border-gray-700/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-gray-400 text-sm">
            {errorContent.suggestion}
          </p>
        </motion.div>

        {/* Información de contacto simplificada */}
        <motion.div 
          className="bg-gray-800/40 border border-gray-600/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-gray-300 text-sm leading-relaxed">
            Puedes volver a intentarlo. Si el error persiste, por favor contacta con un administrador de Skool para obtener asistencia.
          </p>
        </motion.div>

        {/* Botón de reinicio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium flex items-center gap-3 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Intentar nuevamente
          </Button>
        </motion.div>


      </motion.div>
    </div>
  );
}