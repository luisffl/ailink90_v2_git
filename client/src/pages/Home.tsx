import { useState, useEffect } from "react";
import { FormData } from "@/lib/types";
import DiagnosticForm from "@/components/DiagnosticForm";
import SuccessMessage from "@/components/SuccessMessage";
import logoPath from "../assets/logo.svg";
import { motion } from "framer-motion";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

const initialFormData: FormData = {
  nombre_usuario: "",
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

// Interfaz para la respuesta del webhook
interface DiagnosticoResponse {
  saludo: string;
  ciudad_region: string;
  diagnostico_nicho: {
    nicho_sugerido: string;
    razon_clave: string;
    problema_principal: string;
    solucion_mvp: string;
  };
  impulso_personal: {
    desafio_usuario: string;
    consejo_reto: string;
    habilidades_usuario: string;
    ventaja_habilidad: string;
  };
  proximo_paso: {
    modulo: string;
    accion_concreta: string;
    compromiso_comunidad: string;
  };
}

export default function Home() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticoData, setDiagnosticoData] = useState<DiagnosticoResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Usar nuestro hook de WebSocket
  const { 
    isConnected, 
    webhookStatus, 
    webhookMessage, 
    lastMessage 
  } = useWebSocket();
  
  // Efecto para mostrar el estado de la conexión WebSocket
  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket conectado correctamente');
    }
  }, [isConnected]);
  
  // Efecto para actualizar mensajes de estado del webhook
  useEffect(() => {
    if (webhookMessage) {
      setStatusMessage(webhookMessage);
    }
  }, [webhookMessage]);
  
  // Efecto para procesar mensajes de WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'webhook_status' && lastMessage.status === 'success') {
      // Si recibimos un mensaje de éxito con datos de diagnóstico
      if (isProcessing && !isSubmitted) {
        // Mostramos una notificación si estamos procesando
        toast({
          title: "Procesamiento completado",
          description: "Tu diagnóstico ha sido generado con éxito",
          duration: 3000,
        });
      }
    }
  }, [lastMessage, isProcessing, isSubmitted, toast]);
  
  // Función para capturar la respuesta del webhook (método legacy)
  const captureWebhookResponse = (event: MessageEvent) => {
    try {
      if (event.data && typeof event.data === 'string') {
        // Intentamos parsear como JSON
        try {
          const data = JSON.parse(event.data);
          if (data.saludo && data.diagnostico_nicho) {
            console.log("Recibida respuesta de diagnóstico:", data);
            setDiagnosticoData(data);
          }
        } catch (e) {
          // No es JSON válido, ignoramos
        }
      }
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
    }
  };

  // Escuchamos mensajes del backend a través del evento 'message' (método legacy)
  useEffect(() => {
    window.addEventListener('message', captureWebhookResponse);
    
    return () => {
      window.removeEventListener('message', captureWebhookResponse);
    };
  }, []);

  const handleSubmitSuccess = (response?: any) => {
    setIsProcessing(true);
    
    // Si recibimos respuesta directamente del formulario
    if (response) {
      try {
        setDiagnosticoData(response);
        
        // Si hay respuesta, avanzamos al siguiente paso rápidamente
        // Simulamos un tiempo breve de procesamiento antes de mostrar el mensaje final
        setTimeout(() => {
          setIsSubmitted(true);
          setIsProcessing(false);
        }, 1000);
      } catch (e) {
        console.error("Error al procesar respuesta directa:", e);
      }
    } else {
      // Si vamos a usar los datos de demostración, personalizamos el saludo con el nombre
      if (formData.nombre_usuario) {
        demoData.saludo = `Hola, ${formData.nombre_usuario}`;
      }
      // Si no recibimos respuesta directamente, esperamos más tiempo
      // para que el WebSocket pueda completar la comunicación
      
      // Establecemos un temporizador largo que solo se ejecutará si no recibimos 
      // la respuesta a través del WebSocket antes
      const timeoutTimer = setTimeout(() => {
        toast({
          title: "Tiempo de espera agotado",
          description: "Mostrando resultados con datos predeterminados",
          variant: "default",
          duration: 4000,
        });
        
        setIsSubmitted(true);
        setIsProcessing(false);
      }, 15000); // 15 segundos máximo de espera
      
      // Escuchamos los mensajes de WebSocket para avanzar cuando recibamos la respuesta
      const checkInterval = setInterval(() => {
        // Si ya recibimos la respuesta y tenemos datos o si el WebSocket informa de éxito
        if (webhookStatus === 'success' || diagnosticoData) {
          // Limpiamos los temporizadores
          clearTimeout(timeoutTimer);
          clearInterval(checkInterval);
          
          // Esperamos un poco para mostrar el mensaje de éxito
          setTimeout(() => {
            setIsSubmitted(true);
            setIsProcessing(false);
          }, 1000);
        }
        // Si hay un error en el webhook, también avanzamos pero usando datos demo
        else if (['error', 'timeout', 'processing_error'].includes(webhookStatus || '')) {
          // Limpiamos los temporizadores
          clearTimeout(timeoutTimer);
          clearInterval(checkInterval);
          
          // Notificamos al usuario del problema
          toast({
            title: "Error en el servicio",
            description: "Mostrando resultados con datos predeterminados",
            variant: "destructive",
            duration: 4000,
          });
          
          // Avanzamos a la pantalla final
          setTimeout(() => {
            setIsSubmitted(true);
            setIsProcessing(false);
          }, 1000);
        }
      }, 1000); // Comprobamos cada segundo
      
      // Limpiamos los intervalos cuando el componente se desmonte
      return () => {
        clearTimeout(timeoutTimer);
        clearInterval(checkInterval);
      };
    }
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
    setDiagnosticoData(null);
  };

  // Ejemplo de datos para test sin dependencia del webhook
  // Esto se usa solo como fallback si no recibimos datos del webhook
  const demoData = {
    "saludo": "Hola, Emprendedor",
    "ciudad_region": "Barcelona",
    "diagnostico_nicho": {
      "nicho_sugerido": "Proveedores de Servicios Gestionados de TI (MSPs)",
      "razon_clave": "Encaja con B2B y suelen necesitar optimizar la captación de clientes recurrentes en Barcelona.",
      "problema_principal": "Generación inconsistente de leads cualificados y seguimiento manual de propuestas.",
      "solucion_mvp": "Sistema automatizado para capturar leads B2B (web/LinkedIn), nutrirlos y facilitar agendamiento de consulta inicial."
    },
    "impulso_personal": {
      "desafio_usuario": "Me falta tiempo / Cómo organizarme",
      "consejo_reto": "Con 5-10h/sem, enfócate solo en las acciones clave de AILINK; bloquea tiempo fijo.",
      "habilidades_usuario": "He trabajado en muchos sectores pero me siento inconforme con mi vida",
      "ventaja_habilidad": "Tu experiencia diversa te da perspectiva; ¡usa esa motivación de cambio como tu motor ahora!"
    },
    "proximo_paso": {
      "modulo": "Módulo 3, Clase 3.1 ('Escribir tu Propuesta de Valor')",
      "accion_concreta": "Define tu Oferta MVP específica para el nicho recomendado.",
      "compromiso_comunidad": "Comparte tu nicho elegido en el hilo semanal de avances de Skool."
    }
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
            diagnosticoData={diagnosticoData || demoData} 
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
