import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, Sparkles, RefreshCw } from "lucide-react";

interface AIAssistantProps {
  diagnosticoData: any;
}

interface Message {
  role: "assistant" | "user";
  content: string;
  isLoading?: boolean;
}

export default function AIAssistant({ diagnosticoData }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Esta función simula una respuesta de IA basada en los datos del diagnóstico
  const generateAIResponse = (userMessage: string, diagnostico: any): Promise<string> => {
    return new Promise((resolve) => {
      // Simulamos un tiempo de procesamiento
      setTimeout(() => {
        // Extraemos datos clave del diagnóstico para personalizar respuestas
        const nicho = diagnostico.diagnostico_nicho.nicho_sugerido;
        const problema = diagnostico.diagnostico_nicho.problema_principal;
        const desafio = diagnostico.impulso_personal.desafio_usuario;
        const accion = diagnostico.proximo_paso.accion_concreta;
        
        // Respuestas basadas en palabras clave en el mensaje del usuario
        const lowerCaseMessage = userMessage.toLowerCase();
        
        if (lowerCaseMessage.includes("empezar") || lowerCaseMessage.includes("cómo inicio")) {
          resolve(
            `Basándome en tu diagnóstico, te recomiendo empezar con un enfoque simple: ${accion}. ` +
            `Dado que tu nicho es ${nicho}, puedes crear una oferta básica que resuelva el problema de ${problema} ` +
            `sin complicarte demasiado. La clave es comenzar, aunque sea con algo pequeño.`
          );
        } 
        else if (lowerCaseMessage.includes("competencia") || lowerCaseMessage.includes("mercado")) {
          resolve(
            `En el nicho de ${nicho}, hay competencia pero también oportunidades. ` +
            `El problema principal que debes resolver es: ${problema}. ` +
            `La mayoría de competidores no están abordando esto efectivamente. ` +
            `Puedes diferenciarte enfocándote específicamente en este punto de dolor.`
          );
        }
        else if (lowerCaseMessage.includes("miedo") || lowerCaseMessage.includes("duda") || lowerCaseMessage.includes("inseguridad")) {
          resolve(
            `Entiendo que puedas sentir ${desafio}. Es normal al iniciar un nuevo proyecto. ` +
            `Mi recomendación es que dividas tu acción principal "${accion}" en pasos más pequeños. ` +
            `Cada pequeño avance te dará confianza. No necesitas tenerlo todo perfecto desde el inicio.`
          );
        }
        else {
          // Respuesta genérica personalizada con datos del diagnóstico
          resolve(
            `Basándome en tu diagnóstico, te recomiendo enfocarte en el nicho de ${nicho}. ` +
            `Este mercado tiene una necesidad clara: ${problema}. ` +
            `Considerando tu desafío personal de "${desafio}", ` +
            `te sugiero seguir este próximo paso: ${accion}. ` +
            `¿Hay algo específico sobre este enfoque que quieras que profundice?`
          );
        }
      }, 2000);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Mensaje inicial del asistente
    setMessages([
      {
        role: "assistant",
        content: `¡Hola! Soy tu Asistente IA de AILINK, estoy aquí para ayudarte con tu diagnóstico. 
        Puedo responder preguntas sobre tu nicho recomendado, explicar conceptos o darte ideas para implementar 
        tu próximo paso. ¿En qué puedo ayudarte?`
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    
    // Mostrar que el asistente está escribiendo
    setIsTyping(true);
    
    try {
      // Generar respuesta basada en el diagnóstico
      const response = await generateAIResponse(userMessage, diagnosticoData);
      
      // Añadir respuesta del asistente
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error generando respuesta:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, tuve un problema al generar una respuesta. Por favor, intenta de nuevo." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    
    // Obtener el último mensaje del usuario
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === "user");
    if (lastUserMessageIndex === -1) return;
    
    const userMessage = messages[messages.length - 1 - lastUserMessageIndex].content;
    
    // Eliminar la última respuesta del asistente
    setMessages(prev => prev.slice(0, prev.length - 1));
    
    // Mostrar que el asistente está escribiendo
    setIsTyping(true);
    
    try {
      // Generar una nueva respuesta
      const response = await generateAIResponse(userMessage, diagnosticoData);
      
      // Añadir la nueva respuesta
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error regenerando respuesta:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, tuve un problema al regenerar una respuesta. Por favor, intenta de nuevo." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div 
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Bot size={18} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Asistente IA AILINK</h3>
        </div>
        <div className="symbolic-marker">◈ IA ◈</div>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <motion.div 
            key={idx}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`flex gap-3 max-w-[80%] ${
                message.role === "user" 
                  ? "bg-blue-500/10 text-white" 
                  : "bg-[#1a1a1a] text-gray-200"
              } p-3 rounded-lg`}
            >
              <div className="flex-shrink-0 mt-1">
                {message.role === "user" ? (
                  <User size={16} className="text-blue-400" />
                ) : (
                  <Bot size={16} className="text-blue-400" />
                )}
              </div>
              <div>
                <p className="whitespace-pre-line text-sm">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-[#1a1a1a] p-3 rounded-lg flex items-center gap-2">
              <Bot size={16} className="text-blue-400" />
              <div className="flex items-center">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-[#333]">
        <div className="flex gap-2">
          <motion.button
            className="p-2 rounded-md text-blue-400 hover:bg-blue-500/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegenerate}
            disabled={messages.length < 2 || isTyping}
          >
            <RefreshCw size={18} />
          </motion.button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Haz una pregunta sobre tu diagnóstico..."
              className="w-full h-10 px-4 py-2 pr-10 bg-[#1a1a1a] border border-[#333] focus:border-blue-500 rounded-md outline-none text-white resize-none"
              disabled={isTyping}
            />
            <div className="absolute right-2 top-2 text-blue-400 opacity-50">
              <Sparkles size={16} />
            </div>
          </div>
          <motion.button
            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}