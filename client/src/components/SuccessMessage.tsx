import { motion } from "framer-motion";
import { 
  CheckCircle, ArrowRight, Lightbulb, MapPin, Target, Trophy, Clock,
  Activity, BarChart3, Users, LineChart, Rocket, Zap, Shield, Brain,
  MessagesSquare
} from "lucide-react";
import logoPath from "../assets/logo.png";
import { useEffect, useState } from "react";
import AIAssistant from "./AIAssistant";

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
        className="glass-card p-14 text-center max-w-2xl mx-auto"
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
              <Clock className="h-8 w-8 text-blue-400/80" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div className="space-y-1 mb-12">
          <motion.h2 
            className="text-2xl font-grotesk font-medium mb-6 text-white tracking-wide"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            PROCESANDO DIAGNÓSTICO
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 mx-auto max-w-md text-center text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Estamos analizando tus datos para generar un diagnóstico personalizado.
            <br />Este proceso puede tardar unos segundos.
          </motion.p>
        </motion.div>
        
        <div className="flex justify-center items-center space-x-1">
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
        
        <motion.div 
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <img src={logoPath} alt="AILINK Logo" className="h-10 mx-auto" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-10 px-6 relative z-10"
    >
      <div className="glass-card p-10 mb-8 relative column-container">
        {/* Header section */}
        <div className="text-center mb-16 mt-4">
          <div className="mb-2 opacity-60">
            <span className="symbolic-marker">✧ DIAGNÓSTICO OPERATIVO ✧</span>
          </div>
          <motion.div 
            className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-8 accent-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 12
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.6,
                type: "spring",
                stiffness: 150
              }}
            >
              <CheckCircle className="h-10 w-10 text-blue-500" />
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-3xl font-grotesk font-medium text-white mb-6 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {diagnostico.saludo}, tu diagnóstico está listo
          </motion.h1>
          <motion.p 
            className="text-lg text-blue-400/90 flex items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <MapPin size={16} />
            <span>Localización: {diagnostico.ciudad_region}</span>
          </motion.p>
        </div>

        {/* Diagnostic Section */}
        <motion.div 
          className="mb-10 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          <div className="section-divider" />
          <div className="mb-2">
            <span className="symbolic-marker">◇ 01</span>
          </div>
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-4 mb-8"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.15,
              type: "spring",
              damping: 20,
              stiffness: 90
            }}
          >
            <motion.div
              className="symbolic-icon-container"
              animate={{ 
                rotate: [0, 8, 0, -8, 0],
                scale: [1, 1.05, 1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                delay: 0.6,
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 5
              }}
            >
              <Target className="text-blue-400" size={22} />
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
          className="mb-10 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="section-divider" />
          <div className="mb-2">
            <span className="symbolic-marker">△ 02</span>
          </div>
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-4 mb-8"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.35,
              type: "spring",
              damping: 20,
              stiffness: 90
            }}
          >
            <motion.div
              className="symbolic-icon-container"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                delay: 0.8,
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 6
              }}
            >
              <Trophy className="text-blue-400" size={22} />
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
          className="mb-10 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="section-divider" />
          <div className="mb-2">
            <span className="symbolic-marker">□ 03</span>
          </div>
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-4 mb-8"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.55,
              type: "spring",
              damping: 20,
              stiffness: 90
            }}
          >
            <motion.div
              className="symbolic-icon-container"
              animate={{ 
                rotate: [0, 6, 0, -6, 0],
                scale: [1, 1.05, 1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                delay: 1.0,
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 7
              }}
            >
              <Lightbulb className="text-blue-400" size={22} />
            </motion.div>
            <span>Próximos Pasos</span>
          </motion.h2>
          
          {/* Timeline visualizer */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="relative flex justify-between items-center pt-2 pb-12">
              {/* Timeline Track */}
              <div className="absolute h-1 w-full bg-[#222] top-7 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute h-full bg-gradient-to-r from-blue-500/50 to-blue-400/20 left-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.9, duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              {/* Timeline Points */}
              {[
                { label: "Diagnóstico", icon: <Activity size={16} className="text-blue-400" /> },
                { label: "Propuesta de valor", icon: <BarChart3 size={16} className="text-blue-400" /> },
                { label: "Primer cliente", icon: <Users size={16} className="text-blue-400" /> },
                { label: "Optimización", icon: <LineChart size={16} className="text-blue-400" /> },
                { label: "Escalabilidad", icon: <Rocket size={16} className="text-blue-400" /> }
              ].map((point, index) => (
                <motion.div 
                  key={`timeline-point-${index}`}
                  className={`relative z-10 flex flex-col items-center gap-1 `}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center 
                    ${index === 0 ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 
                      index === 1 ? 'bg-blue-500/80 shadow-md shadow-blue-500/20' : 'bg-[#333]'} 
                    transition-all duration-500`}
                  >
                    {index <= 1 && point.icon}
                  </div>
                  <div className={`text-xs mt-2 ${index <= 1 ? 'text-blue-400/90' : 'text-gray-500'}`}>
                    {point.label}
                  </div>
                  {index === 1 && (
                    <motion.div 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.4 }}
                    >
                      <div className="text-blue-400 text-xs whitespace-nowrap px-2 py-1 rounded-sm bg-blue-500/10 backdrop-blur-sm">
                        Tu punto actual
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500/10 mx-auto" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
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
                  delay: 0.7 + (index * 0.1), 
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

        {/* AI Assistant Section */}
        <motion.div 
          className="mb-10 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="section-divider" />
          <div className="mb-2">
            <span className="symbolic-marker">⬦ 04</span>
          </div>
          <motion.h2 
            className="text-2xl font-grotesk text-white flex items-center gap-4 mb-8"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.75,
              type: "spring",
              damping: 20,
              stiffness: 90
            }}
          >
            <motion.div
              className="symbolic-icon-container"
              animate={{ 
                rotate: [0, 4, 0, -4, 0],
                scale: [1, 1.05, 1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                delay: 1.0,
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 8
              }}
            >
              <MessagesSquare className="text-blue-400" size={22} />
            </motion.div>
            <span>Asistente IA</span>
          </motion.h2>
          
          <AIAssistant diagnosticoData={diagnostico} />
        </motion.div>
        
        {/* Footer and button section */}
        <div className="section-divider mt-16" />
        <motion.div 
          className="text-center mt-16 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.9 }}
        >
          <div className="mb-8">
            <span className="symbolic-marker">⧫ FINALIZADO ⧫</span>
          </div>
          <motion.button
            onClick={onRestart}
            className="bg-transparent border border-blue-500/40 hover:border-blue-500 text-blue-400 hover:text-blue-300 py-3 px-10 rounded-md text-lg transition-all duration-500"
            whileHover={{ 
              y: -3,
              boxShadow: "0 6px 20px rgba(59, 130, 246, 0.15)"
            }}
            whileTap={{ y: 0 }}
          >
            Volver al inicio
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <img 
            src={logoPath} 
            alt="AILINK Logo" 
            className="h-10 mx-auto opacity-40 hover:opacity-80 transition-opacity duration-700" 
          />
          <p className="text-gray-600 mt-5 text-sm tracking-wide opacity-60">
            © 2025 — Todos los derechos reservados
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}