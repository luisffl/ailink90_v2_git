import { useState } from "react";
import { FormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import FormStep from "@/components/FormStep";
import ProgressIndicator from "@/components/ProgressIndicator";
import { motion } from "framer-motion";

interface DiagnosticFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmitSuccess: () => void;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      
      try {
        // Enviar datos al webhook
        const webhookUrl = "https://ailink.app.n8n.cloud/webhook-test/3f5e399a-5c46-4b10-8220-8ccdf0388a3b";
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        onSubmitSuccess();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "Hubo un error al enviar el formulario. Por favor intenta de nuevo.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
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
