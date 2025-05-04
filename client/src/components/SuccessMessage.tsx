import { motion } from "framer-motion";
import { 
  CheckCircle, ArrowRight, Lightbulb, MapPin, Target, Trophy, Clock,
  Activity, BarChart3, Users, LineChart, Rocket, Zap, Shield, Brain,
  Download, FileText
} from "lucide-react";
import logoPath from "../assets/logo.png";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Función para generar el PDF
  const generatePDF = async () => {
    if (!contentRef.current || !diagnostico) return;
    
    try {
      setGeneratingPDF(true);
      
      // Mensaje de carga
      toast({
        title: "Generando PDF",
        description: "Preparando la descarga, esto puede tardar unos segundos...",
        duration: 3000,
      });
      
      // Obtener el elemento DOM a capturar
      const contentElement = contentRef.current;
      
      // Función para manejar posibles imágenes inválidas
      const handleImageErrors = () => {
        // Deshabilitamos temporalmente las animaciones para la captura
        const animations = contentElement.querySelectorAll('.animate-spin, motion-safe:animate-pulse');
        animations.forEach((element: Element) => {
          if (element instanceof HTMLElement) {
            element.style.animation = 'none';
          }
        });
        
        // Aplicamos un estilo a todas las imágenes para asegurar que cargan correctamente
        const images = contentElement.querySelectorAll('img');
        images.forEach((img: HTMLImageElement) => {
          // Forzamos el completado de carga
          if (!img.complete) {
            img.style.display = 'none';
          }
        });
      };
      
      // Procesamos las imágenes antes de generar el PDF
      handleImageErrors();
      
      // Esperamos un momento para asegurar que los cambios de estilo se aplican
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Configurar opciones para html2canvas con manejo de errores mejorado
      const canvas = await html2canvas(contentElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#000000",
        windowWidth: 1200, // Ancho fijo para mejor calidad
        allowTaint: true, // Permitir imágenes de otros dominios
        imageTimeout: 5000, // 5 segundos máximo para cargar imágenes
        ignoreElements: (element) => {
          // Ignorar elementos problemáticos
          return element.classList.contains('ignore-in-pdf');
        },
        onclone: (documentClone) => {
          // Ajustes adicionales al clonar el documento
          const clone = documentClone.querySelector('[data-pdfcontent]');
          if (clone) {
            clone.querySelectorAll('.ignore-in-pdf').forEach(el => {
              el.remove();
            });
          }
          return documentClone;
        }
      });
      
      // Determinar las dimensiones del PDF (A4)
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Comprobar que tenemos datos de diagnóstico válidos para los metadatos
      const nichoSugerido = diagnostico?.diagnostico_nicho?.nicho_sugerido || 'Personalizado';
      
      // Añadir metadatos al PDF
      pdf.setProperties({
        title: `Diagnóstico Operativo - ${nichoSugerido}`,
        subject: 'AILINK - Diagnóstico Operativo Empresarial',
        author: 'AILINK Starter',
        keywords: 'diagnóstico, emprendimiento, nicho de mercado',
        creator: 'AILINK Diagnostic App'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Verificar si necesitamos múltiples páginas
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledHeight = imgHeight * ratio;
      
      // Si el contenido es muy largo, lo dividimos en múltiples páginas
      if (scaledHeight > pdfHeight - 20) { // 20mm de margen total
        const contentPieces = Math.ceil(scaledHeight / (pdfHeight - 20));
        const pieceHeight = imgHeight / contentPieces;
        
        for (let i = 0; i < contentPieces; i++) {
          // Añadir página nueva después de la primera
          if (i > 0) {
            pdf.addPage();
          }
          
          // Coordenadas de la porción a cortar
          const sy = pieceHeight * i;
          const sHeight = Math.min(pieceHeight, imgHeight - sy);
          
          // Añadir la pieza de la imagen
          // Usamos solo los parámetros necesarios para evitar errores
          pdf.addImage(
            imgData, 
            'PNG', 
            10, // Margen X
            10, // Margen Y
            pdfWidth - 20, // Ancho con margen
            (sHeight * ratio) // Alto proporcional de la pieza
          );
        }
      } else {
        // El contenido cabe en una sola página
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10; // Margen superior
        
        // Añadir imagen al PDF
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      }
      
      // Nombre personalizado para el archivo con validación
      let fileName = "Diagnóstico_Operativo";
      
      // Solo agregamos el nicho si existe y es válido
      if (diagnostico?.diagnostico_nicho?.nicho_sugerido) {
        // Obtenemos solo los primeros 20 caracteres y reemplazamos espacios con guiones bajos
        const nichoParaArchivo = diagnostico.diagnostico_nicho.nicho_sugerido
          .slice(0, 20)
          .replace(/\s+/g, '_')
          .replace(/[^\w-]/g, ''); // Eliminar caracteres no alfanuméricos
          
        if (nichoParaArchivo) {
          fileName += `_${nichoParaArchivo}`;
        }
      }
      
      // Añadir extensión y guardar
      fileName += ".pdf";
      pdf.save(fileName);
      
      // Notificar éxito
      toast({
        title: "PDF generado correctamente",
        description: "El archivo se ha descargado en tu dispositivo.",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      
      // Notificar error
      toast({
        title: "Error al generar el PDF",
        description: "No se pudo generar el documento. Intenta de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

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
        
        <div className="flex items-center justify-center mt-6">
          <div className="relative w-20 h-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/80"
                style={{ left: `${i * 25}%` }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
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
      <div ref={contentRef} className="glass-card p-10 mb-8 relative column-container">
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
            {diagnostico.saludo}, tu camino al éxito empieza aquí
          </motion.h1>
          
          <motion.div
            className="max-w-lg mx-auto text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-gray-300 text-lg">
              Este diagnóstico personalizado es tu primer paso hacia una vida de libertad financiera y realización personal.
            </p>
          </motion.div>
          
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
                content: diagnostico.impulso_personal.ventaja_habilidad || "Aprovecha tus conocimientos únicos para diferenciarte en este mercado."
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
            <div className="relative hidden md:flex justify-between items-center pt-2 pb-12">
              {/* Timeline Track - Desktop */}
              <div className="absolute h-1 w-full bg-[#222] top-7 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute h-full bg-gradient-to-r from-blue-500/50 to-blue-400/20 left-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.9, duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              {/* Timeline Points - Desktop */}
              {[
                { label: "Diagnóstico", icon: <Activity size={16} className="text-blue-400" /> },
                { label: "Propuesta de valor", icon: <BarChart3 size={16} className="text-blue-400" /> },
                { label: "Primer cliente", icon: <Users size={16} className="text-blue-400" /> },
                { label: "Optimización", icon: <LineChart size={16} className="text-blue-400" /> },
                { label: "Escalabilidad", icon: <Rocket size={16} className="text-blue-400" /> }
              ].map((point, index) => (
                <motion.div 
                  key={`timeline-point-${index}`}
                  className={`relative z-10 flex flex-col items-center gap-1`}
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
            
            {/* Timeline vertical para móviles */}
            <div className="md:hidden space-y-4 pt-2 pb-8 ml-4">
              <div className="relative pl-8 border-l-2 border-[#333]">
                {[
                  { label: "Diagnóstico", icon: <Activity size={16} className="text-blue-400" />, completed: true },
                  { label: "Propuesta de valor", icon: <BarChart3 size={16} className="text-blue-400" />, active: true },
                  { label: "Primer cliente", icon: <Users size={16} className="text-gray-500" /> },
                  { label: "Optimización", icon: <LineChart size={16} className="text-gray-500" /> },
                  { label: "Escalabilidad", icon: <Rocket size={16} className="text-gray-500" /> }
                ].map((point, index) => (
                  <motion.div 
                    key={`mobile-timeline-${index}`}
                    className="mb-5 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className={`absolute -left-[26px] top-0 w-4 h-4 rounded-full 
                      ${point.completed ? 'bg-blue-500 shadow-md shadow-blue-500/30' : 
                        point.active ? 'bg-blue-500/80 border border-blue-400/30' : 'bg-[#333]'} 
                      flex items-center justify-center`}
                    >
                      {(point.completed || point.active) && 
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                        >
                          {point.icon}
                        </motion.div>
                      }
                    </div>
                    
                    <div className={`${point.active ? 'text-blue-400 font-medium' : 
                      point.completed ? 'text-blue-400/80' : 'text-gray-500'}`}
                    >
                      {point.label}
                    </div>
                    
                    {point.active && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                        className="text-xs text-gray-400 mt-1"
                      >
                        Tu punto actual
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
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

        {/* Footer and button section */}
        <div className="section-divider mt-16" />
        <motion.div 
          className="text-center mt-16 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          <div className="mb-8">
            <span className="symbolic-marker">⧫ FINALIZADO ⧫</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
            {/* Botón de descarga PDF */}
            <div className="relative inline-block overflow-hidden group">
              <motion.button
                onClick={generatePDF}
                disabled={generatingPDF}
                className="bg-blue-600/20 border border-blue-500/40 group-hover:border-blue-500 text-blue-400 group-hover:text-blue-300 py-3 px-8 rounded-md text-lg transition-all duration-500 relative z-10 flex items-center gap-3"
                whileHover={{ 
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ y: 0 }}
              >
                {generatingPDF ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    <span className="relative z-10">Generando PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    <span className="relative z-10">Descargar PDF</span>
                  </>
                )}
              </motion.button>
              <motion.div 
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md bg-gradient-to-r from-blue-800/20 via-blue-700/10 to-blue-800/20"
                initial={{ scale: 0.5 }}
                whileHover={{ 
                  scale: 1,
                  boxShadow: "0 5px 20px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
            
            {/* Botón volver */}
            <div className="relative inline-block overflow-hidden group">
              <motion.button
                onClick={onRestart}
                className="bg-transparent border border-blue-500/40 group-hover:border-blue-500 text-blue-400 group-hover:text-blue-300 py-3 px-8 rounded-md text-lg transition-all duration-500 relative z-10"
                whileHover={{ 
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ y: 0 }}
              >
                <span className="relative z-10">Volver al inicio</span>
              </motion.button>
              <motion.div 
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md bg-gradient-to-r from-blue-800/10 via-blue-700/5 to-blue-800/10"
                initial={{ scale: 0.5 }}
                whileHover={{ 
                  scale: 1,
                  boxShadow: "0 5px 20px rgba(59, 130, 246, 0.2)"
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
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