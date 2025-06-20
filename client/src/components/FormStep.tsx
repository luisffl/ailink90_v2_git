import { FormStepProps } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      className={`${isActive ? 'block' : 'hidden'} modern-form`}
      initial="hidden"
      animate="visible"
      variants={stepVariants}
    >
      {step === 1 && (
        <div>
          <h2 className="form-heading">Información básica</h2>
          
          <div className="mb-6">
            <Label htmlFor="nombre_usuario" className="text-sm font-medium mb-2 block text-gray-300">
              Tu Nombre <span className="text-blue-500">*</span>
            </Label>
            <Input
              id="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={(e) => updateFormData("nombre_usuario", e.target.value)}
              placeholder="Juan, María, etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg"
            />
            {errors.nombre_usuario && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre_usuario}</p>
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="correo_electronico_usuario" className="text-sm font-medium mb-2 block text-gray-300">
              Tu Correo Electrónico <span className="text-blue-500">*</span>
            </Label>
            <Input
              id="correo_electronico_usuario"
              value={formData.correo_electronico_usuario}
              onChange={(e) => updateFormData("correo_electronico_usuario", e.target.value)}
              placeholder="tu@email.com"
              className="form-control-focus w-full px-4 py-3 rounded-lg"
            />
            {errors.correo_electronico_usuario && (
              <p className="text-red-500 text-sm mt-1">{errors.correo_electronico_usuario}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="ciudad_region_usuario" className="text-sm font-medium mb-2 block text-gray-300">
              Tu Ciudad o Región Principal <span className="text-blue-500">*</span>
            </Label>
            <Input
              id="ciudad_region_usuario"
              value={formData.ciudad_region_usuario}
              onChange={(e) => updateFormData("ciudad_region_usuario", e.target.value)}
              placeholder="Madrid, Barcelona, etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg"
            />
            {errors.ciudad_region_usuario && (
              <p className="text-red-500 text-sm mt-1">{errors.ciudad_region_usuario}</p>
            )}
          </div>
          
          <div className="flex justify-end mt-10">
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="form-heading">Tu experiencia previa</h2>
          
          <div className="mb-6">
            <Label htmlFor="experiencia_previa" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Cuál es tu experiencia previa? <span className="text-blue-500">*</span>
              <br />
              <span className="text-xs text-gray-400 font-normal">
                (Trabajos, estudios, habilidades o actividades en las que tengas práctica)
              </span>
            </Label>
            <Textarea
              id="experiencia_previa"
              value={formData.experiencia_previa}
              onChange={(e) => updateFormData("experiencia_previa", e.target.value)}
              placeholder="Describe tu experiencia laboral, estudios, habilidades técnicas, hobbies profesionales, etc. Por ejemplo: 'Trabajé 5 años en ventas, estudié marketing digital, tengo experiencia con Excel y redes sociales...'"
              className="form-control-focus w-full px-4 py-3 rounded-lg min-h-[120px] resize-none"
              rows={5}
            />
            {errors.experiencia_previa && (
              <p className="text-red-500 text-sm mt-1">{errors.experiencia_previa}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-gray-400 font-medium transition-colors hover:text-white"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="form-heading">Tipo de colaboración</h2>
          
          <div className="mb-6">
            <Label htmlFor="tipo_colaboracion" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Con qué tipo de personas o empresas te interesaría trabajar o colaborar? <span className="text-blue-500">*</span>
            </Label>
            <Textarea
              id="tipo_colaboracion"
              value={formData.tipo_colaboracion}
              onChange={(e) => updateFormData("tipo_colaboracion", e.target.value)}
              placeholder="Describe el tipo de personas, empresas o sectores con los que te gustaría colaborar. Por ejemplo: 'Pequeñas empresas familiares', 'Startups tecnológicas', 'Profesionales independientes', 'Empresas del sector salud', etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg min-h-[120px] resize-none"
              rows={5}
            />
            {errors.tipo_colaboracion && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo_colaboracion}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-gray-400 font-medium transition-colors hover:text-white"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="form-heading">Oportunidades de mejora</h2>
          
          <div className="mb-6">
            <Label htmlFor="aspectos_mejorar" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Qué aspectos te gustaría mejorar o crees que podrían optimizarse en el trabajo de ese tipo de personas o empresas? <span className="text-blue-500">*</span>
            </Label>
            <Textarea
              id="aspectos_mejorar"
              value={formData.aspectos_mejorar}
              onChange={(e) => updateFormData("aspectos_mejorar", e.target.value)}
              placeholder="Describe los problemas, ineficiencias o áreas de mejora que has observado. Por ejemplo: 'Falta de presencia digital', 'Procesos manuales que se podrían automatizar', 'Falta de seguimiento a clientes', etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg min-h-[120px] resize-none"
              rows={5}
            />
            {errors.aspectos_mejorar && (
              <p className="text-red-500 text-sm mt-1">{errors.aspectos_mejorar}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-gray-400 font-medium transition-colors hover:text-white"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="form-heading">Ideas y proyectos</h2>
          
          <div className="mb-6">
            <Label htmlFor="ideas_proyectos" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Tienes alguna idea, proyecto o solución que se te haya ocurrido recientemente, relacionada o no con la inteligencia artificial? <span className="text-blue-500">*</span>
            </Label>
            <Textarea
              id="ideas_proyectos"
              value={formData.ideas_proyectos}
              onChange={(e) => updateFormData("ideas_proyectos", e.target.value)}
              placeholder="Comparte cualquier idea de negocio, proyecto, aplicación, servicio o solución que tengas en mente. No importa si está relacionada con IA o no. Por ejemplo: 'Una app para gestionar citas médicas', 'Un servicio de automatización de tareas', 'Una idea para mejorar la comunicación en equipos', etc."
              className="form-control-focus w-full px-4 py-3 rounded-lg min-h-[120px] resize-none"
              rows={5}
            />
            {errors.ideas_proyectos && (
              <p className="text-red-500 text-sm mt-1">{errors.ideas_proyectos}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-gray-400 font-medium transition-colors hover:text-white"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="form-heading">Comentarios finales</h2>
          
          <div className="mb-6">
            <Label htmlFor="comentarios_adicionales" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Hay algo más que te gustaría agregar o comentar?
            </Label>
            <Textarea
              id="comentarios_adicionales"
              value={formData.comentarios_adicionales}
              onChange={(e) => updateFormData("comentarios_adicionales", e.target.value)}
              placeholder="Cualquier información adicional que consideres relevante..."
              className="form-control-focus w-full px-4 py-3 rounded-lg min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="mb-8">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terminos_aceptados"
                checked={formData.terminos_aceptados}
                onChange={(e) => updateFormData("terminos_aceptados", e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor="terminos_aceptados" className="text-sm text-gray-300 cursor-pointer">
                Acepto que mis datos sean utilizados para generar un diagnóstico personalizado y acepto recibir información relevante sobre el programa. <span className="text-blue-500">*</span>
              </Label>
            </div>
            {errors.terminos_aceptados && (
              <p className="text-red-500 text-sm mt-1">{errors.terminos_aceptados}</p>
            )}
          </div>
          
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              onClick={prevStep}
              variant="ghost"
              className="text-gray-400 font-medium transition-colors hover:text-white"
            >
              Atrás
            </Button>
            <Button
              type="submit"
              disabled={formData.isSubmitting}
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formData.isSubmitting ? "Procesando..." : "Enviar Diagnóstico"}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}