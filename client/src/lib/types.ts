export interface FormData {
  nombre_usuario: string;
  correo_electronico_usuario: string;
  ciudad_region_usuario: string;
  nichos_potenciales: string;
  tipos_negocio_preferidos: string[];
  mayor_desafio: string;
  habilidades_actuales: string;
  compromiso_tiempo: string;
  objetivo_inicial: string;
  comentarios_adicionales: string;
  terminos_aceptados: boolean;
  honeypot?: string; // Campo trampa para bots
  isSubmitting?: boolean;
}

export type DesafioOption = 
  | "No sé qué nicho elegir"
  | "No sé qué servicio ofrecer"
  | "Miedo a empezar / Síndrome del impostor"
  | "Me falta tiempo / Cómo organizarme"
  | "Dudas sobre la parte técnica"
  | "Otro";

export type TiempoOption = 
  | "Menos de 5 horas"
  | "5-10 horas"
  | "10-20 horas"
  | "Más de 20 horas (Tiempo completo)";

export type ObjetivoOption = 
  | "Conseguir mi primer cliente rápido"
  | "Generar un ingreso extra"
  | "Aprender sobre automatización e IA"
  | "Construir un negocio escalable"
  | "Validar la idea";

export type TipoNegocioOption =
  | "Negocios que venden a otros negocios (B2B)"
  | "Negocios que venden al consumidor final (B2C)"
  | "Servicios profesionales (abogados, consultores...)"
  | "Oficios y servicios a domicilio (fontaneros, electricistas...)"
  | "Tiendas físicas / Comercios"
  | "Negocios online";

export interface TipoNegocioWithId {
  id: string;
  label: TipoNegocioOption;
  checked: boolean;
}

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
