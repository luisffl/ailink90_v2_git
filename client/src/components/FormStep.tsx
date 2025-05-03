import { FormStepProps, TipoNegocioOption } from "@/lib/types";
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

  const handleCheckboxChange = (option: TipoNegocioOption, checked: boolean) => {
    // Creamos una nueva copia del array actual
    const currentSelections = [...formData.tipos_negocio_preferidos];
    
    if (checked) {
      // Si se activó el checkbox y no está ya en la selección, añadirlo
      if (!currentSelections.includes(option)) {
        currentSelections.push(option);
      }
    } else {
      // Si se desactivó el checkbox, eliminar de la selección
      const index = currentSelections.indexOf(option);
      if (index > -1) {
        currentSelections.splice(index, 1);
      }
    }
    
    // Actualizar el estado con la nueva selección
    updateFormData("tipos_negocio_preferidos", currentSelections);
    
    // Para debugging
    console.log(`Checkbox ${option} changed to ${checked}`, currentSelections);
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
          <h2 className="form-heading">Tu perfil profesional</h2>
          
          <div className="mb-6">
            <Label htmlFor="mayor_desafio" className="text-sm font-medium mb-2 block text-gray-300">
              Mi mayor dificultad ahora mismo es: <span className="text-blue-500">*</span>
            </Label>
            <Select
              value={formData.mayor_desafio}
              onValueChange={(value) => updateFormData("mayor_desafio", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                <SelectItem value="No sé qué nicho elegir">No sé qué nicho elegir</SelectItem>
                <SelectItem value="No sé qué servicio ofrecer">No sé qué servicio ofrecer</SelectItem>
                <SelectItem value="Miedo a empezar / Síndrome del impostor">Miedo a empezar / Síndrome del impostor</SelectItem>
                <SelectItem value="Me falta tiempo / Cómo organizarme">Me falta tiempo / Cómo organizarme</SelectItem>
                <SelectItem value="Dudas sobre la parte técnica">Dudas sobre la parte técnica</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.mayor_desafio && (
              <p className="text-red-500 text-sm mt-1">{errors.mayor_desafio}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block text-gray-300">
              Prefiero trabajar con: (marca todas las que apliquen) <span className="text-blue-500">*</span>
            </Label>
            
            <div className="space-y-3 mt-2">
              {[
                "Negocios que venden a otros negocios (B2B)",
                "Negocios que venden al consumidor final (B2C)",
                "Servicios profesionales (abogados, consultores...)",
                "Oficios y servicios a domicilio (fontaneros, electricistas...)",
                "Tiendas físicas / Comercios",
                "Negocios online"
              ].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.replace(/[^a-zA-Z0-9]/g, '_')}
                    checked={formData.tipos_negocio_preferidos.includes(option as TipoNegocioOption)}
                    onCheckedChange={(checked) => handleCheckboxChange(option as TipoNegocioOption, checked === true)}
                    className="custom-checkbox"
                  />
                  <Label 
                    htmlFor={option.replace(/[^a-zA-Z0-9]/g, '_')} 
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {errors.tipos_negocio_preferidos && (
              <p className="text-red-500 text-sm mt-1">{errors.tipos_negocio_preferidos}</p>
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
          <h2 className="form-heading">Nichos y preferencias</h2>
          
          <div className="mb-6">
            <Label htmlFor="habilidades_actuales" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Qué habilidades o experiencia tienes actualmente? <span className="text-blue-500">*</span>
            </Label>
            <Textarea
              id="habilidades_actuales"
              value={formData.habilidades_actuales}
              onChange={(e) => updateFormData("habilidades_actuales", e.target.value)}
              placeholder="Ej: ventas, diseño, marketing, experiencia en algún sector..."
              className="form-control-focus w-full px-4 py-3 rounded-lg resize-none"
              rows={4}
            />
            {errors.habilidades_actuales && (
              <p className="text-red-500 text-sm mt-1">{errors.habilidades_actuales}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="nichos_potenciales" className="text-sm font-medium mb-2 block text-gray-300">
              Si ya tienes alguna idea de nicho en mente, escríbela aquí
            </Label>
            <Textarea
              id="nichos_potenciales"
              value={formData.nichos_potenciales}
              onChange={(e) => updateFormData("nichos_potenciales", e.target.value)}
              placeholder="Ej: Restaurantes locales, Gimnasios, Consultoría..."
              className="form-control-focus w-full px-4 py-3 rounded-lg resize-none"
              rows={3}
            />
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
          <h2 className="form-heading">Recursos y objetivos</h2>
          
          <div className="mb-6">
            <Label htmlFor="compromiso_tiempo" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Cuánto tiempo puedes dedicarle a esto semanalmente? <span className="text-blue-500">*</span>
            </Label>
            <Select
              value={formData.compromiso_tiempo}
              onValueChange={(value) => updateFormData("compromiso_tiempo", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                <SelectItem value="Menos de 5 horas">Menos de 5 horas</SelectItem>
                <SelectItem value="5-10 horas">5-10 horas</SelectItem>
                <SelectItem value="10-20 horas">10-20 horas</SelectItem>
                <SelectItem value="Más de 20 horas (Tiempo completo)">Más de 20 horas (Tiempo completo)</SelectItem>
              </SelectContent>
            </Select>
            {errors.compromiso_tiempo && (
              <p className="text-red-500 text-sm mt-1">{errors.compromiso_tiempo}</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="objetivo_inicial" className="text-sm font-medium mb-2 block text-gray-300">
              Mi meta principal al empezar es: <span className="text-blue-500">*</span>
            </Label>
            <Select
              value={formData.objetivo_inicial}
              onValueChange={(value) => updateFormData("objetivo_inicial", value)}
            >
              <SelectTrigger className="form-control-focus w-full px-4 py-3 rounded-lg">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                <SelectItem value="Conseguir mi primer cliente rápido">Conseguir mi primer cliente rápido</SelectItem>
                <SelectItem value="Generar un ingreso extra">Generar un ingreso extra</SelectItem>
                <SelectItem value="Aprender sobre automatización e IA">Aprender sobre automatización e IA</SelectItem>
                <SelectItem value="Construir un negocio escalable">Construir un negocio escalable</SelectItem>
                <SelectItem value="Validar la idea">Validar la idea</SelectItem>
              </SelectContent>
            </Select>
            {errors.objetivo_inicial && (
              <p className="text-red-500 text-sm mt-1">{errors.objetivo_inicial}</p>
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
          <h2 className="form-heading">Finalizar diagnóstico</h2>
          
          <div className="bg-blue-950/30 border border-blue-900/50 p-5 rounded-lg mb-6">
            <p className="text-sm text-gray-300">
              Estás a punto de completar tu diagnóstico inicial. Al enviar tus respuestas,
              nuestro sistema analizará tu información para crear un diagnóstico personalizado.
            </p>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="comentarios_adicionales" className="text-sm font-medium mb-2 block text-gray-300">
              ¿Algo más que quieras contarnos?
            </Label>
            <Textarea
              id="comentarios_adicionales"
              value={formData.comentarios_adicionales}
              onChange={(e) => updateFormData("comentarios_adicionales", e.target.value)}
              placeholder="Cualquier detalle adicional que nos ayude a personalizar tu diagnóstico..."
              className="form-control-focus w-full px-4 py-3 rounded-lg resize-none"
              rows={3}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terminos_aceptados"
                checked={formData.terminos_aceptados}
                onCheckedChange={(checked) => {
                  console.log("Términos aceptados: ", checked);
                  updateFormData("terminos_aceptados", checked === true);
                }}
                className="custom-checkbox mt-1"
              />
              <Label 
                htmlFor="terminos_aceptados" 
                className="text-sm text-gray-400"
              >
                Acepto recibir el diagnóstico y comunicaciones relacionadas con AILINK <span className="text-blue-500">*</span>
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
              className="btn-primary-hover bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
              disabled={formData.isSubmitting}
            >
              {formData.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : "Obtener Mi Diagnóstico"}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
