export interface FormData {
  user_email: string;
  user_city_region: string;
  current_skills: string;
  biggest_challenge: string;
  potential_niches: string;
  business_goals: string;
  time_available: string;
  budget_range: string;
  additional_comments: string;
  terms_accepted: boolean;
}

export type ChallengeOption = 
  | "No sé qué nicho elegir"
  | "No sé qué servicio ofrecer"
  | "Miedo a empezar"
  | "Falta de tiempo"
  | "Otro";

export type TimeOption = 
  | "Menos de 5 horas"
  | "5-10 horas"
  | "11-20 horas"
  | "21-30 horas"
  | "Tiempo completo";

export type BudgetOption = 
  | "Menos de 500€"
  | "500-1000€"
  | "1001-3000€"
  | "3001-5000€"
  | "Más de 5000€";

export interface FormStepProps {
  step: number;
  currentStep: number;
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string | boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateCurrentStep: () => boolean;
  errors: Record<string, string>;
}

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
