import { useState } from "react";
import { FormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import FormStep from "@/components/FormStep";
import ProgressIndicator from "@/components/ProgressIndicator";
import { motion } from "framer-motion";

interface DiagnosticFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmitSuccess: (response?: any) => void;
}

export default function DiagnosticForm({ 
  formData, 
  setFormData, 
  onSubmitSuccess 
}: DiagnosticFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const totalSteps = 6;

  const updateFormData = <T extends string | boolean | string[]>(field: keyof FormData, value: T) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation rules for each step
    if (currentStep === 1) {
      if (!formData.nombre_usuario) {
        newErrors.nombre_usuario = "Tu nombre es requerido";
      }
      
      if (!formData.correo_electronico_usuario) {
        newErrors.correo_electronico_usuario = "El correo electrónico es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico_usuario)) {
        newErrors.correo_electronico_usuario = "Por favor, introduce un correo electrónico válido";
      }
      
      if (!formData.ciudad_region_usuario) {
        newErrors.ciudad_region_usuario = "La ciudad/región es requerida";
      }
    } 
    else if (currentStep === 2) {
      if (!formData.experiencia_previa) {
        newErrors.experiencia_previa = "Por favor, describe tu experiencia previa";
      }
    }
    else if (currentStep === 3) {
      if (!formData.tipo_colaboracion) {
        newErrors.tipo_colaboracion = "Por favor, describe el tipo de colaboración que buscas";
      }
    }
    else if (currentStep === 4) {
      if (!formData.aspectos_mejorar) {
        newErrors.aspectos_mejorar = "Por favor, describe qué aspectos te gustaría mejorar";
      }
    }
    else if (currentStep === 5) {
      if (!formData.ideas_proyectos) {
        newErrors.ideas_proyectos = "Por favor, comparte tus ideas o proyectos";
      }
    }
    else if (currentStep === 6) {
      if (!formData.terminos_aceptados) {
        newErrors.terminos_aceptados = "Debes aceptar para continuar";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === totalSteps) {
        // En el último paso, ejecutar el envío
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    console.log("handleSubmit ejecutado - Paso actual:", currentStep);
    
    // Si ya está en curso un envío, evitamos procesarlo de nuevo
    if (isSubmitting) {
      console.log("Envío en curso, evitando duplicación");
      return;
    }
    
    // Verificar que estamos en el último paso antes de enviar
    if (currentStep !== totalSteps) {
      console.log("No estamos en el último paso, no enviando");
      return;
    }
    
    if (!validateCurrentStep()) {
      console.log("Validación falló");
      return;
    }
    
    console.log("Validación exitosa, procediendo con envío");
    setIsSubmitting(true);
    setFormData(prev => ({ ...prev, isSubmitting: true }));
    
    toast({
      title: "Procesando diagnóstico...",
      description: "Generando tu análisis personalizado",
      duration: 3000
    });
    
    // Datos de diagnóstico de prueba personalizados
    const diagnosticoDePrueba = {
      saludo: `Hola, ${formData.nombre_usuario}`,
      ciudad_region: formData.ciudad_region_usuario,
      diagnostico_nicho: {
        nicho_sugerido: "Consultoría en automatización de procesos empresariales",
        razon_clave: "Basado en tu experiencia y el tipo de colaboración que buscas, este nicho te permitirá ayudar a empresas a optimizar sus operaciones.",
        problema_principal: "Muchas empresas pequeñas y medianas tienen procesos manuales ineficientes que les consumen tiempo y recursos valiosos.",
        solucion_mvp: "Ofrecer auditorías de procesos y propuestas de automatización personalizadas para cada cliente."
      },
      impulso_personal: {
        desafio_usuario: "Identificar oportunidades de mejora en diferentes sectores",
        consejo_reto: "Comienza enfocándote en un sector específico donde puedas desarrollar expertise profunda.",
        habilidades_usuario: formData.experiencia_previa,
        ventaja_habilidad: "Tu experiencia previa te dará credibilidad y te permitirá entender mejor las necesidades de los clientes."
      },
      proximo_paso: {
        modulo: "Definición de propuesta de valor",
        accion_concreta: "Identifica 3 empresas del tipo que mencionaste y analiza sus procesos actuales.",
        compromiso_comunidad: "Comparte tus hallazgos sobre oportunidades de mejora identificadas."
      }
    };
    
    // Simular procesamiento
    setTimeout(() => {
      console.log("Finalizando envío con diagnóstico de prueba");
      setIsSubmitting(false);
      setFormData(prev => ({ ...prev, isSubmitting: false }));
      
      toast({
        title: "Diagnóstico completado",
        description: "Tu análisis personalizado está listo",
        variant: "default"
      });
      
      onSubmitSuccess(diagnosticoDePrueba);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      
      <form onSubmit={handleSubmit} className="relative">
        {/* Campo honeypot invisible para humanos pero visible para bots */}
        <div style={{ opacity: 0, position: 'absolute', top: '-9999px', left: '-9999px', height: 0, width: 0, zIndex: -1 }}>
          <label htmlFor="honeypot">Déjalo en blanco:</label>
          <input 
            type="text" 
            id="honeypot" 
            name="honeypot" 
            value={formData.honeypot || ''}
            onChange={(e) => updateFormData('honeypot', e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        
        {Array.from({ length: totalSteps }, (_, index) => (
          <FormStep
            key={index + 1}
            step={index + 1}
            currentStep={currentStep}
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            validateCurrentStep={validateCurrentStep}
            errors={errors}
          />
        ))}
      </form>
    </motion.div>
  );
}