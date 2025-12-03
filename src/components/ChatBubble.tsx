import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, ExternalLink } from 'lucide-react';

// ============================================
// CONFIGURACIÓN - MODIFICA ESTOS VALORES
// ============================================
const CONFIG = {
  // Webhook de n8n
  webhookUrl: 'https://daniel9romero.app.n8n.cloud/webhook/0150c20a-915c-4ab8-bc99-716be8e97bae',

  // Información del asistente
  assistantName: 'José Daniel López Romero',
  assistantRole: 'Investigador LCZ',
  assistantPhoto: `${import.meta.env.BASE_URL}Fotito.jpg`,

  // Textos personalizables
  welcomeMessage: '¡Hola! Soy José Daniel y estás viendo el mapa de Zonas Climáticas Locales de la Ciudad de México. Si tienes alguna duda sobre el proyecto, estoy aquí para apoyarte.',
  inputPlaceholder: 'Escribe tu pregunta sobre LCZ...',
  footerHint: 'Pregunta sobre el proyecto',
  loadingText: 'Escribiendo...',
  errorMessage: 'Lo siento, hubo un error. Por favor intenta de nuevo.',

  // Enlace de contacto
  portfolioUrl: 'https://daniel9romero.github.io/Portafolio/',

  // Colores (usa clases de Tailwind o valores hex)
  accentColor: 'blue-500',
  accentColorHex: 'rgba(59, 130, 246, 0.5)',

  // Posición del chat
  bubblePosition: 'bottom-6 left-6',
  windowPosition: 'bottom-24 left-6',

  // Tamaños
  bubbleSize: 'w-16 h-16',
  windowSize: 'w-[380px] h-[500px]',

  // Tiempo para mostrar notificación (ms)
  notificationDelay: 5000,
};
// ============================================

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simular notificación después del tiempo configurado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true);
      }
    }, CONFIG.notificationDelay);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasNotification(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta');
      }

      const contentType = response.headers.get('content-type');
      let botText: string;

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        botText = data.response || data.output || data.message || data;
      } else {
        botText = await response.text();
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botText || 'Lo siento, no pude procesar tu pregunta.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: CONFIG.errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed ${CONFIG.bubblePosition} z-50`}
          >
            {/* Notification badge */}
            <AnimatePresence>
              {hasNotification && (
                <>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full"
                  />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10 border-2 border-black"
                  >
                    1
                  </motion.span>
                </>
              )}
            </AnimatePresence>

            {/* Botón con foto */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChat}
              className={`${CONFIG.bubbleSize} rounded-full shadow-2xl overflow-hidden border-3 border-${CONFIG.accentColor}/60 hover:border-${CONFIG.accentColor} transition-all duration-300`}
              style={{
                boxShadow: `0 0 25px ${CONFIG.accentColorHex}, 0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <img
                src={CONFIG.assistantPhoto}
                alt="Chat Assistant"
                className="w-full h-full object-cover"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${CONFIG.windowPosition} z-50 ${CONFIG.windowSize} bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r from-${CONFIG.accentColor}/20 to-green-600/20 px-4 py-3 flex items-center gap-3 border-b border-white/10`}>
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 border-${CONFIG.accentColor}/50`}>
                <img
                  src={CONFIG.assistantPhoto}
                  alt="Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{CONFIG.assistantName}</h3>
                <p className={`text-${CONFIG.accentColor} text-xs`}>{CONFIG.assistantRole}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] bg-white/10 text-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                    <p className="text-sm leading-relaxed">{CONFIG.welcomeMessage}</p>
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.isUser
                        ? `bg-${CONFIG.accentColor} text-black rounded-br-sm`
                        : 'bg-white/10 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${message.isUser ? 'text-black/50' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className={`animate-spin text-${CONFIG.accentColor}`} />
                      <span className="text-sm text-gray-400">{CONFIG.loadingText}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={CONFIG.inputPlaceholder}
                  disabled={isLoading}
                  className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-${CONFIG.accentColor}/50 focus:ring-1 focus:ring-${CONFIG.accentColor}/30 transition-all disabled:opacity-50`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-3 bg-${CONFIG.accentColor} rounded-xl text-black hover:bg-${CONFIG.accentColor}/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send size={18} />
                </button>
              </div>
              <a
                href={CONFIG.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-3 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white text-xs transition-all"
              >
                <ExternalLink size={14} />
                Contacto
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
