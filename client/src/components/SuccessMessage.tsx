import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Lightbulb, MapPin, Target, Trophy, Clock } from "lucide-react";
import logoPath from "../assets/logo.png";
import { useEffect, useState } from "react";

interface SuccessMessageProps {
  onRestart: () => void;
  diagnosticoData?: any;
}

interface DiagnosticoData {
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

export default function SuccessMessage({ onRestart, diagnosticoData }: SuccessMessageProps) {
  const [loading, setLoading] = useState(true);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData | null>(null);

  useEffect(() => {
    // Si tenemos datos de diagnóstico, los usamos
    if (diagnosticoData) {
      setDiagnostico(diagnosticoData);
      setLoading(false);
    } else {
      // Simulamos un tiempo de carga si no hay datos
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [diagnosticoData]);

  if (loading || !diagnostico) {
    return (
      <motion.div 
        className="glass-card p-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 accent-glow"
          animate={{ 
            boxShadow: [
              "0 0 0 rgba(59, 130, 246, 0.4)",
              "0 0 25px rgba(59, 130, 246, 0.6)",
              "0 0 5px rgba(59, 130, 246, 0.4)"
            ],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Clock className="h-10 w-10 text-blue-500" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-grotesk font-medium mb-4 text-white"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity 
          }}
        >
          ESTAMOS REALIZANDO EL DIAGNÓSTICO OPERATIVO
        </motion.h2>
        
        <p className="text-gray-400 mb-8 text-lg">
          Gracias por completar el formulario. Estamos procesando tu información 
          para crear un diagnóstico personalizado para tu negocio.
        </p>
        
        <div className="flex justify-center mt-6">
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-t-2 border-blue-500"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>
        
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-6 px-6"
    >
      <div className="glass-card p-10 mb-8">
        {/* Header section */}
        <div className="text-center mb-10">
          <motion.div 
            className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 accent-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.4,
                type: "spring",
                stiffness: 300
              }}
            >
              <CheckCircle className="h-10 w-10 text-blue-500" />
            </motion.div>
          </motion.div>
          <h1 className="text-3xl font-grotesk font-medium text-white mb-2">
            {diagnostico.saludo}, tu diagnóstico está listo
          </h1>
          <p className="text-lg text-blue-400 flex items-center justify-center gap-2 mt-4">
            <MapPin size={18} />
            <span>Localización: {diagnostico.ciudad_region}</span>
          </p>
        </div>

        {/* Diagnostic Section */}
        <motion.div 
          className="mb-10 border-t border-[#333] pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.15,
              type: "spring",
              stiffness: 150
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                delay: 0.6,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            >
              <Target className="text-blue-400" size={24} />
            </motion.div>
            <span>Diagnóstico de Nicho</span>
          </motion.h2>
          
          <div className="space-y-6">
            {[
              {
                title: "Nicho recomendado:",
                content: diagnostico.diagnostico_nicho.nicho_sugerido,
                isHighlighted: true
              },
              {
                title: "¿Por qué este nicho?",
                content: diagnostico.diagnostico_nicho.razon_clave
              },
              {
                title: "Problema principal:",
                content: diagnostico.diagnostico_nicho.problema_principal
              },
              {
                title: "Solución MVP propuesta:",
                content: diagnostico.diagnostico_nicho.solucion_mvp
              }
            ].map((item, index) => (
              <motion.div 
                key={`nicho-${index}`}
                className={`glass-inner p-6 ${item.isHighlighted ? 'border-blue-900/30' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2 + (index * 0.1), 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <h3 className="text-lg font-medium text-blue-400 mb-2">{item.title}</h3>
                <p className={`${item.isHighlighted ? 'text-white text-xl' : 'text-gray-300'}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personal Impulse Section */}
        <motion.div 
          className="mb-10 border-t border-[#333] pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.35,
              type: "spring",
              stiffness: 150
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                delay: 0.8,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            >
              <Trophy className="text-blue-400" size={24} />
            </motion.div>
            <span>Impulso Personal</span>
          </motion.h2>
          
          <div className="space-y-6">
            {[
              {
                title: "Tu principal desafío:",
                content: diagnostico.impulso_personal.desafio_usuario
              },
              {
                title: "Nuestro consejo:",
                content: diagnostico.impulso_personal.consejo_reto
              },
              {
                title: "Sobre tus habilidades:",
                content: `"${diagnostico.impulso_personal.habilidades_usuario}"`,
                isItalic: true
              },
              {
                title: "Tu ventaja competitiva:",
                content: diagnostico.impulso_personal.ventaja_habilidad
              }
            ].map((item, index) => (
              <motion.div 
                key={`impulso-${index}`}
                className="glass-inner p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4 + (index * 0.1), 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <h3 className="text-lg font-medium text-blue-400 mb-2">{item.title}</h3>
                <p className={`text-gray-300 ${item.isItalic ? 'italic' : ''}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps Section */}
        <motion.div 
          className="mb-10 border-t border-[#333] pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.55,
              type: "spring",
              stiffness: 150
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                delay: 1.0,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            >
              <Lightbulb className="text-blue-400" size={24} />
            </motion.div>
            <span>Próximos Pasos</span>
          </motion.h2>
          
          <div className="space-y-6">
            {[
              {
                title: "Enfócate en:",
                content: diagnostico.proximo_paso.modulo,
                icon: null
              },
              {
                title: "Tu acción inmediata:",
                content: diagnostico.proximo_paso.accion_concreta,
                icon: <CheckCircle className="text-blue-400 mt-1 flex-shrink-0" size={18} />,
                highlight: true
              },
              {
                title: "Compromiso con la comunidad:",
                content: diagnostico.proximo_paso.compromiso_comunidad,
                icon: <ArrowRight className="text-blue-400 mt-1 flex-shrink-0" size={18} />,
                highlight: true
              }
            ].map((item, index) => (
              <motion.div 
                key={`next-step-${index}`}
                className={`glass-inner p-6 ${item.highlight ? 'highlight-box' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.6 + (index * 0.1), 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <h3 className="text-lg font-medium text-blue-400 mb-2">{item.title}</h3>
                {item.icon ? (
                  <div className="flex gap-3 items-start">
                    {item.icon}
                    <p className="text-white">{item.content}</p>
                  </div>
                ) : (
                  <p className="text-gray-300">{item.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer and button section */}
        <motion.div 
          className="text-center mt-10 pt-6 border-t border-[#333]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <motion.button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-blue-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Volver al inicio
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
          <p className="text-gray-500 mt-3">
            © 2025 - Todos los derechos reservados
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}