export interface FormData {
  nombre_usuario: string;
  correo_electronico_usuario: string;
  ciudad_region_usuario: string;
  experiencia_previa: string;
  tipo_colaboracion: string;
  aspectos_mejorar: string;
  ideas_proyectos: string;
  comentarios_adicionales: string;
  terminos_aceptados: boolean;
  honeypot?: string; // Campo trampa para bots
  isSubmitting?: boolean;
}

// Tipos removidos ya que no se usan con las nuevas preguntas

export interface FormStepProps {
  step: number;
  currentStep: number;
  formData: FormData;
  updateFormData: <T extends string | boolean | string[]>(field: keyof FormData, value: T) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateCurrentStep: () => boolean;
  errors: Record<string, string>;
}

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
