import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DiagnosticForm from "@/components/DiagnosticForm";
import SuccessMessage from "@/components/SuccessMessage";
import ErrorMessage from "@/components/ErrorMessage";
import ProgressIndicator from "@/components/ProgressIndicator";
import { FormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import logoPath from "@assets/WhatsApp Image 2025-06-21 at 10.11.41_1750494039124.jpeg";

const initialFormData: FormData = {
  nombre_usuario: "",
  correo_electronico_usuario: "",
  ciudad_region_usuario: "",
  experiencia_previa: "",
  tipo_colaboracion: "",
  aspectos_mejorar: "",
  ideas_proyectos: "",
  comentarios_adicionales: "",
  terminos_aceptados: false,
  honeypot: "",
  isSubmitting: false,
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticoData, setDiagnosticoData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [webhookStatus, setWebhookStatus] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<'processing' | 'validation' | 'network' | 'unknown'>('unknown');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userSessionId] = useState(() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  const { toast } = useToast();

  // Configurar WebSocket para recibir actualizaciones del webhook con filtrado por sesión
  const { isConnected, lastMessage, webhookStatus: wsWebhookStatus } = useWebSocket(userSessionId);

  useEffect(() => {
    if (lastMessage) {
      console.log("Último mensaje WebSocket:", lastMessage);
      
      if (lastMessage.type === 'webhook_status') {
        setWebhookStatus(lastMessage.status || '');
        
        switch (lastMessage.status) {
          case 'starting':
            setStatusMessage("Iniciando análisis de datos...");
            break;
          case 'data_prepared':
            setStatusMessage("Datos preparados correctamente");
            break;
          case 'sending':
            setStatusMessage("Enviando información al sistema de análisis...");
            break;
          case 'success':
            setStatusMessage("Análisis completado exitosamente");
            break;
          case 'error':
            setStatusMessage("Error en el procesamiento");
            break;
          default:
            setStatusMessage(lastMessage.message || "Procesando...");
        }
      }
    }
  }, [lastMessage]);

  // Escuchar mensajes del webhook a través de postMessage
  useEffect(() => {
    const captureWebhookResponse = (event: MessageEvent) => {
      if (event.data && event.data.type === 'webhook_response') {
        console.log("Respuesta del webhook recibida:", event.data.response);
        setDiagnosticoData(event.data.response);
        
        // Avanzamos directamente al resultado
        setTimeout(() => {
          setIsSubmitted(true);
          setIsProcessing(false);
        }, 1000);
      }
    };

    window.addEventListener('message', captureWebhookResponse);
    
    return () => {
      window.removeEventListener('message', captureWebhookResponse);
    };
  }, []);

  const validateResponseData = (data: any): boolean => {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const requiredFields = ['nombre', 'nicho', 'icp', 'dolor', 'nsvp', 'oferta', 'idea_automatizacion'];
    
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length < 10) {
        console.log(`Campo inválido o muy corto: ${field}`, data[field]);
        return false;
      }
    }

    return true;
  };

  const handleSubmitSuccess = (response?: any) => {
    console.log("handleSubmitSuccess llamado con:", response);
    
    if (response) {
      try {
        console.log("Procesando respuesta directa:", response);
        
        // Validar que la respuesta contiene datos válidos
        if (validateResponseData(response)) {
          setDiagnosticoData(response);
          setIsSubmitted(true);
          setIsProcessing(false);
          setHasError(false);
        } else {
          console.error("Datos de respuesta inválidos o incompletos");
          setHasError(true);
          setErrorType('validation');
          setErrorMessage("Los datos recibidos están incompletos o no cumplen con los requisitos mínimos");
          setIsSubmitted(false);
          setIsProcessing(false);
        }
      } catch (e) {
        console.error("Error al procesar respuesta directa:", e);
        setHasError(true);
        setErrorType('processing');
        setErrorMessage(e instanceof Error ? e.message : "Error desconocido al procesar la respuesta");
        setIsSubmitted(false);
        setIsProcessing(false);
      }
    } else {
      console.log("No hay respuesta del servidor");
      setHasError(true);
      setErrorType('network');
      setErrorMessage("No se recibió respuesta del servidor");
      setIsSubmitted(false);
      setIsProcessing(false);
    }
  };

  const handleSubmitError = (error: any, type: 'processing' | 'validation' | 'network' | 'unknown' = 'unknown') => {
    console.error("Error en el formulario:", error);
    setHasError(true);
    setErrorType(type);
    setErrorMessage(error instanceof Error ? error.message : "Error desconocido");
    setIsSubmitted(false);
    setIsProcessing(false);
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
    setDiagnosticoData(null);
    setIsProcessing(false);
    setStatusMessage("");
    setWebhookStatus("");
    setHasError(false);
    setErrorType('unknown');
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#121212] py-10 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-2 opacity-60">
            <span className="symbolic-marker">✧ DIAGNÓSTICO OPERATIVO ✧</span>
          </div>
          <div className="flex justify-center mb-6 mt-4">
            <img src={logoPath} alt="AILINK Logo" className="h-24 md:h-28" />
          </div>
          <h1 className="text-3xl md:text-5xl font-medium mb-6 text-white leading-tight tracking-wide">
            Diagnóstico Operativo <span className="text-blue-500">AILINK</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Completa este breve cuestionario para recibir un diagnóstico personalizado 
            de tu negocio con inteligencia artificial.
          </p>
        </motion.header>

        {isSubmitted ? (
          <SuccessMessage 
            onRestart={handleRestart} 
            diagnosticoData={diagnosticoData} 
          />
        ) : isProcessing ? (
          <motion.div 
            className="glass-card p-14 text-center max-w-2xl mx-auto relative column-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-2 opacity-60">
              <span className="symbolic-marker">⁜ PROCESANDO ⁜</span>
            </div>
            
            <motion.div 
              className="w-28 h-28 mx-auto mb-14 mt-8 relative"
            >
              <motion.div 
                className="absolute inset-0 rounded-full border border-blue-500/20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute inset-1 rounded-full border border-blue-500/30"
                animate={{ 
                  scale: [1.1, 0.9, 1.1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              />
              <motion.div
                className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0.2)",
                    "0 0 20px rgba(59, 130, 246, 0.4)",
                    "0 0 5px rgba(59, 130, 246, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-400/80"></div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <h2 className="text-2xl font-grotesk font-medium mb-6 text-white tracking-wide">
              Procesando Información
            </h2>
            
            <p className="text-gray-400 mx-auto max-w-md">
              {statusMessage || "Estamos analizando tus datos para generar un diagnóstico personalizado"}
            </p>
            
            {webhookStatus && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${
                  webhookStatus === 'success' ? 'bg-green-500/20 text-green-300' :
                  webhookStatus === 'error' || webhookStatus === 'timeout' ? 'bg-red-500/20 text-red-300' :
                  webhookStatus === 'sending' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {webhookStatus === 'success' ? '✓ Completado' :
                   webhookStatus === 'error' || webhookStatus === 'timeout' ? '✕ Error' :
                   webhookStatus === 'sending' ? '↗ Enviando' :
                   webhookStatus === 'receiving' ? '↙ Recibiendo' :
                   webhookStatus}
                </div>
              </motion.div>
            )}
            
            <div className="flex justify-center items-center space-x-2 mt-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500/60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : hasError ? (
          <ErrorMessage 
            onRestart={handleRestart}
            errorType={errorType}
            errorMessage={errorMessage}
          />
        ) : (
          <DiagnosticForm 
            formData={formData} 
            setFormData={setFormData}
            onSubmitSuccess={handleSubmitSuccess}
            onSubmitError={handleSubmitError}
            userSessionId={userSessionId}
          />
        )}
      </div>
    </div>
  );
}