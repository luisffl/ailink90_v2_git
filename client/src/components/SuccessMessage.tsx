import { motion } from "framer-motion";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/Copia de ICONO.png";

interface SuccessMessageProps {
  onRestart: () => void;
  diagnosticoData?: any;
}

interface DiagnosticoData {
  nombre: string;
  resumen_personal: string;
  nicho: string;
  icp: string;
  dolor: string;
  nsvp: string;
  oferta: string;
  idea_automatizacion: string;
}

export default function SuccessMessage({ onRestart, diagnosticoData }: SuccessMessageProps) {
  const { toast } = useToast();

  console.log("SuccessMessage renderizado con datos:", diagnosticoData);

  const handleDownloadPDF = () => {
    toast({
      title: "PDF en desarrollo",
      description: "La funcionalidad de descarga PDF estará disponible pronto",
      duration: 3000,
    });
  };

  // Datos por defecto si no hay diagnosticoData
  const datos: DiagnosticoData = diagnosticoData || {
    nombre: "Usuario",
    resumen_personal: "Profesional motivado en búsqueda de oportunidades de crecimiento.",
    nicho: "Consultoría digital personalizada",
    icp: "Profesionales que buscan optimizar sus procesos de trabajo",
    dolor: "Falta de claridad en la estrategia digital y automatización",
    nsvp: "Te ayudo a crear sistemas digitales eficientes que te permiten escalar tu negocio",
    oferta: "Consultoría inicial gratuita de 30 minutos para definir tu estrategia digital",
    idea_automatizacion: "Sistema de automatización personalizado que se adapta a tus necesidades específicas"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#121212] py-10 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* Header con logo y confirmación */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-2 opacity-60">
            <span className="symbolic-marker">✧ DIAGNÓSTICO COMPLETADO ✧</span>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 12
            }}
            className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-8 accent-glow"
          >
            <CheckCircle className="h-10 w-10 text-blue-500" />
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-5xl font-medium mb-6 text-white leading-tight tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            ¡Hola, <span className="text-blue-500">{datos.nombre}</span>!
          </motion.h1>
          
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {datos.resumen_personal}
          </motion.p>
        </motion.div>

        {/* Contenido principal del diagnóstico */}
        <motion.div 
          className="glass-card p-10 mb-8 relative column-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="grid gap-12">
            
            {/* Tu Nicho */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="section-title">Tu Nicho Personalizado</h2>
              <div className="glass-inner p-8">
                <p className="text-gray-200 text-lg leading-relaxed">{datos.nicho}</p>
              </div>
            </motion.section>

            {/* Cliente Ideal y Dolor */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <section className="space-y-6">
                <h2 className="section-title">Tu Cliente Ideal</h2>
                <div className="glass-inner p-8">
                  <p className="text-gray-200 leading-relaxed">{datos.icp}</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="section-title">Su Dolor Principal</h2>
                <div className="glass-inner p-8">
                  <p className="text-gray-200 leading-relaxed">{datos.dolor}</p>
                </div>
              </section>
            </motion.div>

            {/* Propuesta de Valor */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-6"
            >
              <h2 className="section-title">Tu Propuesta de Valor Única</h2>
              <div className="glass-inner p-8 border-blue-900/30">
                <p className="text-blue-100 text-lg leading-relaxed">{datos.nsvp}</p>
              </div>
            </motion.section>

            {/* Oferta */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-6"
            >
              <h2 className="section-title">Tu Oferta Específica</h2>
              <div className="glass-inner p-8">
                <p className="text-gray-200 text-lg leading-relaxed">{datos.oferta}</p>
              </div>
            </motion.section>

            {/* Automatización */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-6"
            >
              <h2 className="section-title">Tu Idea de Automatización</h2>
              <div className="glass-inner p-8">
                <p className="text-gray-200 text-lg leading-relaxed">{datos.idea_automatizacion}</p>
              </div>
            </motion.section>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button 
            onClick={handleDownloadPDF}
            className="btn-primary px-8 py-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Diagnóstico PDF
          </Button>
          <Button 
            onClick={onRestart}
            variant="outline"
            className="btn-secondary px-8 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Realizar Nuevo Diagnóstico
          </Button>
        </motion.div>

        {/* Logo footer */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1.8 }}
        >
          <img src={logoPath} alt="AILINK Logo" className="h-10 mx-auto" />
        </motion.div>
      </div>
    </div>
  );
}