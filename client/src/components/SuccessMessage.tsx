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
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 accent-glow">
          <Clock className="h-10 w-10 text-blue-500 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-grotesk font-medium mb-4 text-white">
          ESTAMOS REALIZANDO EL DIAGNÓSTICO OPERATIVO
        </h2>
        
        <p className="text-gray-400 mb-8 text-lg">
          Gracias por completar el formulario. Estamos procesando tu información 
          para crear un diagnóstico personalizado para tu negocio.
        </p>
        
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div className="mt-10">
          <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto opacity-70" />
        </div>
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
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 accent-glow">
            <CheckCircle className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-grotesk font-medium text-white mb-2">
            {diagnostico.saludo}, tu diagnóstico está listo
          </h1>
          <p className="text-lg text-blue-400 flex items-center justify-center gap-2 mt-4">
            <MapPin size={18} />
            <span>Localización: {diagnostico.ciudad_region}</span>
          </p>
        </div>

        {/* Sección de Diagnóstico de Nicho */}
        <div className="mb-10 border-t border-[#333] pt-8">
          <h2 className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6">
            <Target className="text-blue-400" size={24} />
            <span>Diagnóstico de Nicho</span>
          </h2>
          
          <div className="space-y-6">
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Nicho recomendado:</h3>
              <p className="text-white text-xl">{diagnostico.diagnostico_nicho.nicho_sugerido}</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">¿Por qué este nicho?</h3>
              <p className="text-gray-300">{diagnostico.diagnostico_nicho.razon_clave}</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Problema principal:</h3>
              <p className="text-gray-300">{diagnostico.diagnostico_nicho.problema_principal}</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Solución MVP propuesta:</h3>
              <p className="text-gray-300">{diagnostico.diagnostico_nicho.solucion_mvp}</p>
            </div>
          </div>
        </div>

        {/* Sección de Impulso Personal */}
        <div className="mb-10 border-t border-[#333] pt-8">
          <h2 className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6">
            <Trophy className="text-blue-400" size={24} />
            <span>Impulso Personal</span>
          </h2>
          
          <div className="space-y-6">
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Tu principal desafío:</h3>
              <p className="text-gray-300">{diagnostico.impulso_personal.desafio_usuario}</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Nuestro consejo:</h3>
              <p className="text-gray-300">{diagnostico.impulso_personal.consejo_reto}</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Sobre tus habilidades:</h3>
              <p className="text-gray-300 italic">"{diagnostico.impulso_personal.habilidades_usuario}"</p>
            </div>
            
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Tu ventaja competitiva:</h3>
              <p className="text-gray-300">{diagnostico.impulso_personal.ventaja_habilidad}</p>
            </div>
          </div>
        </div>

        {/* Sección de Próximos Pasos */}
        <div className="mb-10 border-t border-[#333] pt-8">
          <h2 className="text-2xl font-grotesk text-white flex items-center gap-3 mb-6">
            <Lightbulb className="text-blue-400" size={24} />
            <span>Próximos Pasos</span>
          </h2>
          
          <div className="space-y-6">
            <div className="glass-inner p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Enfócate en:</h3>
              <p className="text-gray-300">{diagnostico.proximo_paso.modulo}</p>
            </div>
            
            <div className="glass-inner p-6 highlight-box">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Tu acción inmediata:</h3>
              <div className="flex gap-3 items-start">
                <CheckCircle className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <p className="text-white">{diagnostico.proximo_paso.accion_concreta}</p>
              </div>
            </div>
            
            <div className="glass-inner p-6 highlight-box">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Compromiso con la comunidad:</h3>
              <div className="flex gap-3 items-start">
                <ArrowRight className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <p className="text-white">{diagnostico.proximo_paso.compromiso_comunidad}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 pt-6 border-t border-[#333]">
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg transition-all"
          >
            Volver al inicio
          </button>
        </div>
        
        <div className="mt-10 text-center">
          <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto opacity-70" />
          <p className="text-gray-500 mt-3">
            © 2025 - Todos los derechos reservados
          </p>
        </div>
      </div>
    </motion.div>
  );
}
