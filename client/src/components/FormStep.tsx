import { FormStepProps } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function FormStep({
  step,
  currentStep,
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}: FormStepProps) {
  const isActive = step === currentStep;
  
  if (!isActive) return null;
  
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } }
  };

  return (
    <motion.div
      className={`${isActive ? 'block' : 'hidden'}`}
      initial="hidden"
      animate="visible"
      variants={stepVariants}
    >
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Información básica</h2>
          
          <div className="mb-6">
            <Label htmlFor="user_email" className="text-sm font-medium mb-1 block">
              Correo electrónico <span className="text-[#2f5aff]">*</span>
            </Label>
            <Input
              id="user_email"
              value={formData.user_email}
              onChange={(e) => updateFormData("user_email", e.target.value)}
              placeholder="tu@email.com"
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]"
            />
            {errors.user_email && (
              <p className="text-red-500 text-sm mt-1">{errors.user_email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="user_city_region" className="text-sm font-medium mb-1 block">
              Ciudad/Región <span className="text-[#2f5aff]">*</span>
            </Label>
            <Input
              id="user_city_region"
              value={formData.user_city_region}
              onChange={(e) => updateFormData("user_city_region", e.target.value)}
              placeholder="Madrid, Barcelona, etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]"
            />
            {errors.user_city_region && (
              <p className="text-red-500 text-sm mt-1">{errors.user_city_region}</p>
            )}
          </div>
          
          <div className="flex justify-end mt-8">
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-[#2f5aff] text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Tu experiencia actual</h2>
          
          <div className="mb-6">
            <Label htmlFor="current_skills" className="text-sm font-medium mb-1 block">
              ¿Qué habilidades o experiencia tienes actualmente?
            </Label>
            <Textarea
              id="current_skills"
              value={formData.current_skills}
              onChange={(e) => updateFormData("current_skills", e.target.value)}
              placeholder="Describe tus habilidades relevantes..."
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0] resize-none"
              rows={4}
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="biggest_challenge" className="text-sm font-medium mb-1 block">
              ¿Cuál es tu mayor desafío? <span className="text-[#2f5aff]">*</span>
            </Label>
            <Select
              value={formData.biggest_challenge}
              onValueChange={(value) => updateFormData("biggest_challenge", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No sé qué nicho elegir">No sé qué nicho elegir</SelectItem>
                <SelectItem value="No sé qué servicio ofrecer">No sé qué servicio ofrecer</SelectItem>
                <SelectItem value="Miedo a empezar">Miedo a empezar</SelectItem>
                <SelectItem value="Falta de tiempo">Falta de tiempo</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.biggest_challenge && (
              <p className="text-red-500 text-sm mt-1">{errors.biggest_challenge}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-[#B0B0B0] font-medium transition-colors hover:text-[#0a0f2c]"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-[#2f5aff] text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Tu negocio ideal</h2>
          
          <div className="mb-6">
            <Label htmlFor="potential_niches" className="text-sm font-medium mb-1 block">
              ¿Qué nichos te interesan?
            </Label>
            <Textarea
              id="potential_niches"
              value={formData.potential_niches}
              onChange={(e) => updateFormData("potential_niches", e.target.value)}
              placeholder="Ej: Restaurantes locales, Gimnasios, Consultoría..."
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0] resize-none"
              rows={4}
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="business_goals" className="text-sm font-medium mb-1 block">
              ¿Cuáles son tus objetivos de negocio a corto plazo?
            </Label>
            <Input
              id="business_goals"
              value={formData.business_goals}
              onChange={(e) => updateFormData("business_goals", e.target.value)}
              placeholder="Ej: Conseguir 5 clientes en 3 meses..."
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]"
            />
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-[#B0B0B0] font-medium transition-colors hover:text-[#0a0f2c]"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-[#2f5aff] text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Recursos disponibles</h2>
          
          <div className="mb-6">
            <Label htmlFor="time_available" className="text-sm font-medium mb-1 block">
              ¿Cuántas horas semanales puedes dedicar a tu negocio?
            </Label>
            <Select
              value={formData.time_available}
              onValueChange={(value) => updateFormData("time_available", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menos de 5 horas">Menos de 5 horas</SelectItem>
                <SelectItem value="5-10 horas">5-10 horas</SelectItem>
                <SelectItem value="11-20 horas">11-20 horas</SelectItem>
                <SelectItem value="21-30 horas">21-30 horas</SelectItem>
                <SelectItem value="Tiempo completo">Tiempo completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="budget_range" className="text-sm font-medium mb-1 block">
              ¿Cuál es tu presupuesto inicial para tu negocio?
            </Label>
            <Select
              value={formData.budget_range}
              onValueChange={(value) => updateFormData("budget_range", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0]">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menos de 500€">Menos de 500€</SelectItem>
                <SelectItem value="500-1000€">500-1000€</SelectItem>
                <SelectItem value="1001-3000€">1001-3000€</SelectItem>
                <SelectItem value="3001-5000€">3001-5000€</SelectItem>
                <SelectItem value="Más de 5000€">Más de 5000€</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-[#B0B0B0] font-medium transition-colors hover:text-[#0a0f2c]"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-[#2f5aff] text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Finalizar diagnóstico</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-[#0a0f2c]">
              Estás a punto de completar tu diagnóstico inicial. Después de enviar tus respuestas, 
              recibirás un análisis personalizado a tu correo electrónico.
            </p>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="additional_comments" className="text-sm font-medium mb-1 block">
              ¿Algo más que quieras contarnos?
            </Label>
            <Textarea
              id="additional_comments"
              value={formData.additional_comments}
              onChange={(e) => updateFormData("additional_comments", e.target.value)}
              placeholder="Cualquier detalle adicional que nos ayude a personalizar tu diagnóstico..."
              className="form-control-focus w-full px-4 py-3 rounded-lg border border-[#e0e0e0] resize-none"
              rows={3}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms_accepted"
                checked={formData.terms_accepted}
                onCheckedChange={(checked) => 
                  updateFormData("terms_accepted", checked === true)
                }
                className="mt-1"
              />
              <Label 
                htmlFor="terms_accepted" 
                className="text-sm text-[#B0B0B0]"
              >
                Acepto recibir el diagnóstico y comunicaciones relacionadas con AILINK Starter <span className="text-[#2f5aff]">*</span>
              </Label>
            </div>
            {errors.terms_accepted && (
              <p className="text-red-500 text-sm mt-1">{errors.terms_accepted}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-[#B0B0B0] font-medium transition-colors hover:text-[#0a0f2c]"
            >
              Atrás
            </Button>
            <Button
              type="submit"
              className="btn-primary-hover bg-[#2f5aff] text-white px-6 py-3 rounded-lg font-medium"
            >
              Obtener Mi Diagnóstico
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
