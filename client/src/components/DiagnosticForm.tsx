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
  
  const totalSteps = 5;

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
      if (!formData.mayor_desafio) {
        newErrors.mayor_desafio = "Por favor, selecciona una opción";
      }
      
      if (formData.tipos_negocio_preferidos.length === 0) {
        newErrors.tipos_negocio_preferidos = "Selecciona al menos un tipo de negocio";
      }
    }
    else if (currentStep === 3) {
      if (!formData.habilidades_actuales) {
        newErrors.habilidades_actuales = "Por favor, completa este campo";
      }
    }
    else if (currentStep === 4) {
      if (!formData.compromiso_tiempo) {
        newErrors.compromiso_tiempo = "Por favor, selecciona una opción";
      }
      
      if (!formData.objetivo_inicial) {
        newErrors.objetivo_inicial = "Por favor, selecciona un objetivo";
      }
    }
    else if (currentStep === 5) {
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
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si ya está en curso un envío, evitamos procesarlo de nuevo
    if (isSubmitting) {
      console.log("Envío en curso, evitando duplicación");
      return;
    }
    
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      // Actualizamos también el estado del formulario para deshabilitar el botón a nivel de renderizado
      setFormData(prev => ({ ...prev, isSubmitting: true }));
      
      // Preparar datos para enviar
      const dataToSend = {
        correo: formData.correo_electronico_usuario,
        ciudad: formData.ciudad_region_usuario,
        nichos: formData.nichos_potenciales,
        tipos_negocio: formData.tipos_negocio_preferidos.join(", "),
        desafio: formData.mayor_desafio,
        habilidades: formData.habilidades_actuales,
        tiempo: formData.compromiso_tiempo,
        objetivo: formData.objetivo_inicial,
        comentarios: formData.comentarios_adicionales,
        fecha: new Date().toISOString()
      };
      
      // Usamos nuestro proxy en el backend para evitar problemas de CORS
      try {
        console.log("Enviando datos a través del proxy del backend");
        
        // Enviamos al proxy del backend
        // Configuramos un timeout para abortar la solicitud si tarda demasiado
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
        
        fetch('/api/n8n-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend),
          signal: controller.signal
        })
        .then((response: Response) => {
          clearTimeout(timeoutId); // Limpiamos el timeout si la solicitud completa antes
          // Intentamos leer la respuesta como texto primero
          return response.text().then((text: string) => {
            let jsonData: any;
            try {
              // Intentamos parsear el texto como JSON
              jsonData = JSON.parse(text);
            } catch (e) {
              // Si no es JSON válido, usamos el texto como está
              jsonData = { message: text };
            }
            return { status: response.status, data: jsonData };
          });
        })
        .then(({ status, data }) => {
          console.log("Respuesta del proxy:", status, data);
          
          // Verificamos si la respuesta tiene el formato del diagnóstico
          const hasValidDiagnostico = 
            data && 
            typeof data === 'object' && 
            data.saludo && 
            data.diagnostico_nicho;
          
          // Siempre mostramos mensaje de éxito para la UI
          toast({
            title: "Éxito",
            description: "Diagnóstico enviado correctamente.",
            variant: "default"
          });
          
          setIsSubmitting(false);
          
          // Si tenemos datos válidos, los pasamos al componente padre
          if (hasValidDiagnostico) {
            onSubmitSuccess(data);
          } else {
            onSubmitSuccess();
          }
        })
        .catch(error => {
          console.error("Error en proxy:", error);
          // Incluso si hay error, continuamos con la UI
          toast({
            title: "Información",
            description: "Continuando con el diagnóstico...",
            variant: "default"
          });
          setIsSubmitting(false);
          onSubmitSuccess();
        });
      } catch (error) {
        console.error("Error general:", error);
        setIsSubmitting(false);
        onSubmitSuccess();
      }
    }
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
        <FormStep
          step={1}
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          validateCurrentStep={validateCurrentStep}
          errors={errors}
        />
        
        <FormStep
          step={2}
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          validateCurrentStep={validateCurrentStep}
          errors={errors}
        />
        
        <FormStep
          step={3}
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          validateCurrentStep={validateCurrentStep}
          errors={errors}
        />
        
        <FormStep
          step={4}
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          validateCurrentStep={validateCurrentStep}
          errors={errors}
        />
        
        <FormStep
          step={5}
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          validateCurrentStep={validateCurrentStep}
          errors={errors}
        />
      </form>
    </motion.div>
  );
}
