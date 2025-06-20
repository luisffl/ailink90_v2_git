import { motion } from "framer-motion";
import { CheckCircle, Download, RotateCcw, Target, Users, AlertCircle, Lightbulb, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl bg-zinc-900 border-zinc-700 shadow-2xl">
        <CardHeader className="text-center border-b border-zinc-700">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl text-white mb-2">
            ¡Hola, {datos.nombre}!
          </CardTitle>
          <p className="text-zinc-400 text-lg">
            {datos.resumen_personal}
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid gap-8">
            {/* Tu Nicho */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Tu Nicho Personalizado
              </h3>
              <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-600">
                <CardContent className="p-6">
                  <p className="text-white text-lg">{datos.nicho}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* ICP y Dolor */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Tu Cliente Ideal
                </h3>
                <Card className="bg-zinc-800 border-zinc-600">
                  <CardContent className="p-6">
                    <p className="text-zinc-300">{datos.icp}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Su Dolor Principal
                </h3>
                <Card className="bg-zinc-800 border-zinc-600">
                  <CardContent className="p-6">
                    <p className="text-zinc-300">{datos.dolor}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* NSVP */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Tu Propuesta de Valor Única
              </h3>
              <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-600">
                <CardContent className="p-6">
                  <p className="text-green-100 text-lg">{datos.nsvp}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Oferta */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Tu Oferta Específica
              </h3>
              <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-600">
                <CardContent className="p-6">
                  <p className="text-yellow-100 text-lg">{datos.oferta}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Idea de Automatización */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Tu Idea de Automatización
              </h3>
              <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-600">
                <CardContent className="p-6">
                  <p className="text-cyan-100 text-lg">{datos.idea_automatizacion}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Botones de Acción */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t border-zinc-700"
          >
            <Button 
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Diagnóstico PDF
            </Button>
            <Button 
              onClick={onRestart}
              variant="outline"
              className="border-zinc-600 text-white hover:bg-zinc-800 px-8 py-3"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Realizar Nuevo Diagnóstico
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}