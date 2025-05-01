import { useState } from "react";
import { FormData } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FormStep from "@/components/FormStep";
import ProgressIndicator from "@/components/ProgressIndicator";

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

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
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
      if (!formData.user_email) {
        newErrors.user_email = "El correo electrónico es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
        newErrors.user_email = "Por favor, introduce un correo electrónico válido";
      }
      
      if (!formData.user_city_region) {
        newErrors.user_city_region = "La ciudad/región es requerida";
      }
    } 
    else if (currentStep === 2) {
      if (!formData.biggest_challenge) {
        newErrors.biggest_challenge = "Por favor, selecciona una opción";
      }
    }
    else if (currentStep === 5) {
      if (!formData.terms_accepted) {
        newErrors.terms_accepted = "Debes aceptar para continuar";
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
        // Here you would replace with your actual webhook URL
        const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://your-webhook-url.com/endpoint';
        
        await apiRequest('POST', webhookUrl, formData);
        
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
    <>
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 relative overflow-hidden">
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
      </div>
    </>
  );
}
