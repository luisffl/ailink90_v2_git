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
      // Validación de honeypot - Si el campo está relleno, es probablemente un bot
      if (formData.honeypot) {
        console.log("Detectado posible bot por el honeypot");
        // Simulamos éxito pero no enviamos nada realmente
        toast({
          title: "Enviando datos...",
          description: "Procesando tu diagnóstico",
          duration: 3000
        });
        // Esperamos un tiempo aleatorio para simular el envío
        setTimeout(() => {
          setFormData(prev => ({ ...prev, isSubmitting: false }));
          onSubmitSuccess(); // Llamamos al callback con datos vacíos
        }, 3000 + Math.random() * 2000);
        return;
      }
      
      const dataToSend = {
        nombre: formData.nombre_usuario,
        correo: formData.correo_electronico_usuario,
        ciudad: formData.ciudad_region_usuario,
        experiencia_previa: formData.experiencia_previa,
        tipo_colaboracion: formData.tipo_colaboracion,
        aspectos_mejorar: formData.aspectos_mejorar,
        ideas_proyectos: formData.ideas_proyectos,
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
            // Personalizar el saludo con el nombre del usuario
            if (data.saludo && formData.nombre_usuario) {
              // Si la respuesta incluye "Hola" o similar, añadimos el nombre
              if (data.saludo.includes("Hola")) {
                data.saludo = `Hola, ${formData.nombre_usuario}`;
              }
            }
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
