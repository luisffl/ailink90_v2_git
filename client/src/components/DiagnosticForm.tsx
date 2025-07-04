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
  onSubmitError?: (
    error: any,
    type?: "processing" | "validation" | "network" | "unknown",
  ) => void;
  userSessionId?: string;
}

export default function DiagnosticForm({
  formData,
  setFormData,
  onSubmitSuccess,
  onSubmitError,
  onSubmitStart,
  userSessionId,
}: DiagnosticFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;

  const updateFormData = <T extends string | boolean | string[]>(
    field: keyof FormData,
    value: T,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    // Helper function to check if text contains meaningful content
    const hasMinimumContent = (
      text: string,
      minWords: number = 3,
      minLength: number = 10,
    ) => {
      if (!text || text.trim().length < minLength) return false;
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 1);
      return words.length >= minWords;
    };

    const isValidName = (name: string) => {
      if (!name || name.trim().length < 2) return false;
      // Check for meaningful name (not just repeated characters or numbers)
      const cleanName = name.trim();
      if (/^(.)\1*$/.test(cleanName)) return false; // Same character repeated
      if (/^\d+$/.test(cleanName)) return false; // Only numbers
      if (cleanName.length < 2) return false;
      return true;
    };

    const isValidLocation = (location: string) => {
      if (!location || location.trim().length < 2) return false;
      const cleanLocation = location.trim();
      if (/^(.)\1*$/.test(cleanLocation)) return false; // Same character repeated
      if (/^\d+$/.test(cleanLocation)) return false; // Only numbers
      return true;
    };

    // Validation rules for each step
    if (currentStep === 1) {
      if (!isValidName(formData.nombre_usuario)) {
        newErrors.nombre_usuario =
          "Por favor, introduce un nombre válido (mínimo 2 caracteres)";
      }

      if (!formData.correo_electronico_usuario) {
        newErrors.correo_electronico_usuario =
          "El correo electrónico es requerido";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico_usuario)
      ) {
        newErrors.correo_electronico_usuario =
          "Por favor, introduce un correo electrónico válido";
      }

      if (!isValidLocation(formData.ciudad_region_usuario)) {
        newErrors.ciudad_region_usuario =
          "Por favor, introduce una ciudad/región válida";
      }
    } else if (currentStep === 2) {
      if (!hasMinimumContent(formData.experiencia_previa, 3, 10)) {
        newErrors.experiencia_previa =
          "Por favor, describe tu experiencia previa con más detalle (mínimo 10 caracteres, 3 palabras)";
      }
    } else if (currentStep === 3) {
      if (!hasMinimumContent(formData.tipo_colaboracion, 3, 10)) {
        newErrors.tipo_colaboracion =
          "Por favor, describe el tipo de colaboración que buscas con más detalle (mínimo 10 caracteres, 3 palabras)";
      }
    } else if (currentStep === 4) {
      if (!hasMinimumContent(formData.aspectos_mejorar, 3, 10)) {
        newErrors.aspectos_mejorar =
          "Por favor, describe qué aspectos te gustaría mejorar con más detalle (mínimo 10 caracteres, 3 palabras)";
      }
    } else if (currentStep === 5) {
      if (!hasMinimumContent(formData.ideas_proyectos, 3, 10)) {
        newErrors.ideas_proyectos =
          "Por favor, comparte tus ideas o proyectos con más detalle (mínimo 10 caracteres, 3 palabras)";
      }
    } else if (currentStep === 6) {
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
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === totalSteps) {
        // En el último paso, ejecutar el envío
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
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
    setFormData((prev) => ({ ...prev, isSubmitting: true }));
    
    // Notificar al componente padre que se inició el procesamiento
    if (onSubmitStart) {
      onSubmitStart();
    }

    toast({
      title: "Procesando diagnóstico...",
      description: "Enviando datos al sistema de análisis",
      duration: 5000,
    });

    // Preparar payload para el webhook de n8n
    const webhookPayload = {
      nombre: formData.nombre_usuario,
      correo: formData.correo_electronico_usuario,
      experiencia_previa: formData.experiencia_previa,
      publico_interes: formData.tipo_colaboracion,
      mejora_deseada: formData.aspectos_mejorar,
      idea_libre: formData.ideas_proyectos,
      horas_semana: "5-10", // Por ahora fijo, podemos hacer una pregunta específica después
      userSessionId, // ID único para identificar este usuario específico
    };

    console.log("Enviando payload al webhook:", webhookPayload);

    // Enviar al webhook de n8n a través del proxy del backend
    fetch("/api/n8n-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    })
      .then((response) => {
        console.log("Respuesta del proxy - Status:", response.status);
        if (!response.ok) {
          if (response.status >= 500) {
            throw new Error(`Error del servidor (${response.status})`);
          } else if (response.status === 403) {
            throw new Error("Error de autenticación del webhook");
          } else {
            throw new Error(`Error HTTP: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos recibidos del webhook:", data);

        setIsSubmitting(false);
        setFormData((prev) => ({ ...prev, isSubmitting: false }));

        // Verificar si la respuesta contiene un error
        if (data.error || data.message === "Authorization data is wrong!") {
          const errorMsg =
            data.error || data.message || "Error en la respuesta del servidor";
          throw new Error(errorMsg);
        }

        toast({
          title: "Diagnóstico completado",
          description: "Tu análisis personalizado está listo",
          variant: "default",
        });

        // Pasar los datos procesados del webhook al componente padre
        onSubmitSuccess(data);
      })
      .catch((error) => {
        console.error("Error al enviar al webhook:", error);

        setIsSubmitting(false);
        setFormData((prev) => ({ ...prev, isSubmitting: false }));

        // Determinar el tipo de error
        let errorType: "processing" | "validation" | "network" | "unknown" =
          "unknown";

        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          errorType = "network";
        } else if (
          error.message.includes("autenticación") ||
          error.message.includes("Authorization")
        ) {
          errorType = "processing";
        } else if (error.message.includes("HTTP error")) {
          errorType = "network";
        }

        toast({
          title: "Error en el procesamiento",
          description:
            "Hubo un problema al procesar tu diagnóstico. Intenta nuevamente.",
          variant: "destructive",
        });

        // Llamar al manejador de errores si está disponible
        if (onSubmitError) {
          onSubmitError(error, errorType);
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <form onSubmit={handleSubmit} className="relative">
        {/* Campo honeypot invisible para humanos pero visible para bots */}
        <div
          style={{
            opacity: 0,
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            height: 0,
            width: 0,
            zIndex: -1,
          }}
        >
          <label htmlFor="honeypot">Déjalo en blanco:</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            value={formData.honeypot || ""}
            onChange={(e) => updateFormData("honeypot", e.target.value)}
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
