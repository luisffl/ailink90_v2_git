import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPreview() {
  const [errorType, setErrorType] = useState<'processing' | 'validation' | 'network' | 'unknown'>('unknown');
  
  const handleRestart = () => {
    console.log("Botón de reinicio clickeado");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Controles para cambiar tipo de error */}
      <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-medium mb-3 text-gray-800">Preview del Error</h3>
        <div className="space-y-2">
          <Button
            size="sm"
            variant={errorType === 'processing' ? 'default' : 'outline'}
            onClick={() => setErrorType('processing')}
            className="w-full text-xs"
          >
            Error Procesamiento
          </Button>
          <Button
            size="sm"
            variant={errorType === 'validation' ? 'default' : 'outline'}
            onClick={() => setErrorType('validation')}
            className="w-full text-xs"
          >
            Error Validación
          </Button>
          <Button
            size="sm"
            variant={errorType === 'network' ? 'default' : 'outline'}
            onClick={() => setErrorType('network')}
            className="w-full text-xs"
          >
            Error Red
          </Button>
          <Button
            size="sm"
            variant={errorType === 'unknown' ? 'default' : 'outline'}
            onClick={() => setErrorType('unknown')}
            className="w-full text-xs"
          >
            Error Desconocido
          </Button>
        </div>
      </div>

      {/* Componente de error */}
      <ErrorMessage 
        onRestart={handleRestart}
        errorType={errorType}
        errorMessage="Este es un mensaje de error de ejemplo para el preview"
      />
    </div>
  );
}