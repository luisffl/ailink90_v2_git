import { useState } from "react";
import { FormData } from "@/lib/types";
import DiagnosticForm from "@/components/DiagnosticForm";
import SuccessMessage from "@/components/SuccessMessage";
import logoPath from "../assets/logo.png";

const initialFormData: FormData = {
  user_email: "",
  user_city_region: "",
  current_skills: "",
  biggest_challenge: "",
  potential_niches: "",
  business_goals: "",
  time_available: "",
  budget_range: "",
  additional_comments: "",
  terms_accepted: false,
};

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
      <header className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <img src={logoPath} alt="AILINK Logo" className="h-16 md:h-20" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#0a0f2c]">
          Guía de Diagnóstico Inicial
        </h1>
        <p className="text-silver text-lg max-w-xl mx-auto">
          Completa este breve cuestionario para recibir un diagnóstico personalizado 
          para tu negocio con AILINK Starter.
        </p>
      </header>

      {isSubmitted ? (
        <SuccessMessage onRestart={handleRestart} />
      ) : (
        <DiagnosticForm 
          formData={formData} 
          setFormData={setFormData}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
