import { useState } from "react";
import { FormData } from "@/lib/types";
import DiagnosticForm from "@/components/DiagnosticForm";
import SuccessMessage from "@/components/SuccessMessage";
import logoPath from "../assets/logo.svg";
import { motion } from "framer-motion";

const initialFormData: FormData = {
  correo_electronico_usuario: "",
  ciudad_region_usuario: "",
  nichos_potenciales: "",
  tipos_negocio_preferidos: [],
  mayor_desafio: "",
  habilidades_actuales: "",
  compromiso_tiempo: "",
  objetivo_inicial: "",
  comentarios_adicionales: "",
  terminos_aceptados: false,
  isSubmitting: false
};

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitSuccess = () => {
    setIsProcessing(true);
    // Simulamos un tiempo de procesamiento antes de mostrar el mensaje final
    setTimeout(() => {
      setIsSubmitted(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#121212] py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <img src={logoPath} alt="AILINK Logo" className="h-24 md:h-28" />
          </div>
          <h1 className="text-3xl md:text-5xl font-medium mb-4 text-white leading-tight">
            Diagnóstico Operativo <span className="text-blue-500">AILINK</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Completa este breve cuestionario para recibir un diagnóstico personalizado 
            de tu negocio con inteligencia artificial.
          </p>
        </motion.header>

        {isSubmitted ? (
          <SuccessMessage onRestart={handleRestart} />
        ) : isProcessing ? (
          <motion.div 
            className="glass-card p-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
            <h2 className="text-2xl font-medium mb-4 text-white">
              Procesando tu información
            </h2>
            <p className="text-gray-400">
              Estamos analizando tus respuestas para preparar tu diagnóstico...
            </p>
          </motion.div>
        ) : (
          <DiagnosticForm 
            formData={formData} 
            setFormData={setFormData}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </div>
    </div>
  );
}
