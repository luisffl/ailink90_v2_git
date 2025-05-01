import { useState, useEffect } from "react";
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticoData, setDiagnosticoData] = useState<DiagnosticoResponse | null>(null);
  
  // Función para capturar la respuesta del webhook
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

  // Escuchamos mensajes del backend a través del evento 'message'
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
      } catch (e) {
        console.error("Error al procesar respuesta directa:", e);
      }
    }
    
    // Simulamos un tiempo de procesamiento antes de mostrar el mensaje final
    setTimeout(() => {
      setIsSubmitted(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
    setDiagnosticoData(null);
  };

  // Ejemplo de datos para test sin dependencia del webhook
  // Esto se usa solo como fallback si no recibimos datos del webhook
  const demoData = {
    "saludo": "Hola",
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
          <SuccessMessage 
            onRestart={handleRestart} 
            diagnosticoData={diagnosticoData || demoData} 
          />
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
