import { motion } from "framer-motion";
import { CheckCircle, Download, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/ailink-logo.jpeg";

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
  url_pdf?: string;
}

export default function SuccessMessage({ onRestart, diagnosticoData }: SuccessMessageProps) {
  const { toast } = useToast();

  console.log("SuccessMessage renderizado con datos:", diagnosticoData);

  const handleDownloadPDF = () => {
    if (datos.url_pdf) {
      window.open(datos.url_pdf, '_blank');
      toast({
        title: "Descargando PDF",
        description: "El diagnóstico se está abriendo en una nueva pestaña",
        duration: 3000,
      });
    } else {
      toast({
        title: "PDF no disponible",
        description: "El PDF aún se está generando, inténtalo en unos momentos",
        duration: 3000,
      });
    }
  };

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

  const secciones = [
    {
      titulo: "Tu Nicho Personalizado",
      contenido: datos.nicho,
      icono: "🎯",
      color: "from-blue-500/10 to-cyan-500/5",
      delay: 0.6
    },
    {
      titulo: "Tu Cliente Ideal",
      contenido: datos.icp,
      icono: "👥",
      color: "from-purple-500/10 to-pink-500/5",
      delay: 0.8
    },
    {
      titulo: "Su Dolor Principal",
      contenido: datos.dolor,
      icono: "⚡",
      color: "from-red-500/10 to-orange-500/5",
      delay: 1.0
    },
    {
      titulo: "Tu Propuesta de Valor Única",
      contenido: datos.nsvp,
      icono: "💎",
      color: "from-emerald-500/10 to-green-500/5",
      delay: 1.2,
      destacado: false
    },
    {
      titulo: "Tu Oferta Específica",
      contenido: datos.oferta,
      icono: "🎁",
      color: "from-yellow-500/10 to-amber-500/5",
      delay: 1.4
    },
    {
      titulo: "Tu Idea de Automatización",
      contenido: datos.idea_automatizacion,
      icono: "🤖",
      color: "from-indigo-500/10 to-purple-500/5",
      delay: 1.6
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#121212] py-12 px-4 relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        
        {/* Header refinado */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-4 opacity-70">
            <span className="symbolic-marker text-sm tracking-[0.3em] font-light">
              ✧ DIAGNÓSTICO COMPLETADO ✧
            </span>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 0.2
            }}
            className="relative mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
            </div>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-xl"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-light mb-8 text-white leading-tight tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            ¡Hola, <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-medium">
              {datos.nombre}
            </span>!
          </motion.h1>
          
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              {datos.resumen_personal}
            </p>
          </motion.div>
        </motion.div>

        {/* Grid de secciones mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16">
          {secciones.map((seccion, index) => (
            <motion.div
              key={seccion.titulo}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: seccion.delay, 
                duration: 0.8,
                ease: "easeOut"
              }}
              className="relative group h-full"
            >
              <div className={`
                glass-card p-8 md:p-10 relative overflow-hidden transition-all duration-500 h-full flex flex-col
                ${seccion.destacado ? 'border-blue-500/30 shadow-blue-500/20 shadow-2xl lg:col-span-2' : ''}
                hover:border-white/20 hover:shadow-xl hover:scale-[1.02]
              `}>
                {/* Fondo gradiente sutil */}
                <div className={`absolute inset-0 bg-gradient-to-br ${seccion.color} opacity-50`}></div>
                
                {/* Contenido */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`
                      text-2xl md:text-3xl p-3 rounded-xl backdrop-blur-sm border border-white/10 flex-shrink-0
                      ${seccion.destacado ? 'bg-blue-500/20' : 'bg-white/5'}
                    `}>
                      {seccion.icono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className={`
                        text-lg md:text-xl font-medium mb-4 tracking-wide leading-tight
                        ${seccion.destacado ? 'text-blue-200' : 'text-white'}
                      `}>
                        {seccion.titulo}
                        {seccion.destacado && (
                          <Sparkles className="inline-block ml-2 h-4 w-4 text-blue-400" />
                        )}
                      </h2>
                    </div>
                  </div>
                  
                  <div className={`
                    p-6 rounded-xl backdrop-blur-sm border border-white/5 flex-grow flex items-center
                    ${seccion.destacado ? 'bg-blue-500/10' : 'bg-white/5'}
                  `}>
                    <p className={`
                      text-base md:text-lg leading-relaxed font-light w-full
                      ${seccion.destacado ? 'text-blue-100' : 'text-gray-200'}
                    `}>
                      {seccion.contenido}
                    </p>
                  </div>
                </div>
                
                {/* Efectos hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                               transform translate-x-[-100%] group-hover:translate-x-[100%] 
                               transition-transform duration-1000"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botones de acción mejorados */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
        >
          <Button 
            onClick={handleDownloadPDF}
            disabled={!datos.url_pdf}
            className="btn-primary px-10 py-4 text-lg font-medium rounded-xl
                       bg-gradient-to-r from-blue-600 to-emerald-600 
                       hover:from-blue-700 hover:to-emerald-700
                       disabled:from-gray-600 disabled:to-gray-700
                       shadow-lg hover:shadow-xl transition-all duration-300
                       transform hover:scale-105"
          >
            <Download className="w-5 h-5 mr-3" />
            {datos.url_pdf ? 'Descargar Diagnóstico PDF' : 'Generando PDF...'}
          </Button>
          
          <Button 
            onClick={onRestart}
            variant="outline"
            className="btn-secondary px-10 py-4 text-lg font-medium rounded-xl
                       border-2 border-white/20 bg-white/5 backdrop-blur-sm
                       hover:bg-white/10 hover:border-white/30
                       shadow-lg hover:shadow-xl transition-all duration-300
                       transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Realizar Nuevo Diagnóstico
          </Button>
        </motion.div>

        {/* Logo footer mejorado */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 2 }}
        >
          <div className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <img src={logoPath} alt="AILINK Logo" className="h-12 mx-auto opacity-80" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}