'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageCircle, Send, X, Sparkles, ExternalLink } from 'lucide-react';
import { Articulo } from '@/lib/types';

interface ArticleChatProps {
  articulo: Articulo;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ArticleChat({ articulo }: ArticleChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build context from article
  const articuloContext = `
Título: ${articulo.contenidoIA.titulo}
Tipo de documento: ${articulo.metadata.tipoDocumento} ${articulo.metadata.numeroDocumento}
Organismo emisor: ${articulo.metadata.organismoEmisor}
URL original: ${articulo.metadata.urlOriginal}

Resumen: ${articulo.contenidoIA.resumen}

Puntos clave:
${articulo.contenidoIA.puntosClaves.map((p, i) => `${i + 1}. ${p.titulo}: ${p.descripcion}`).join('\n')}

¿A quién afecta?
${articulo.contenidoIA.aQuienAfecta.map(g => `- ${g.grupo}: ${g.descripcion}`).join('\n')}

Texto original:
${articulo.textoOriginal.articulos.map(a => `Art. ${a.numero} - ${a.titulo}: ${a.contenido}`).join('\n\n')}
  `.trim();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setInput('');
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content,
          })),
          articuloContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update the assistant message with streaming content
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId
              ? { ...msg, content: assistantContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId
            ? { ...msg, content: 'Lo siento, hubo un error al procesar tu pregunta. Verificá tu conexión e intentá de nuevo.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    '¿Qué plazos establece?',
    '¿Cómo me afecta?',
    '¿Qué beneficios tiene?',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 flex items-center gap-2 bg-accent text-white px-4 py-3 rounded-full shadow-lg hover:bg-accent/90 transition-all z-40 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Preguntale a la IA</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Panel */}
      <div className="fixed z-50 bg-bg border border-border shadow-2xl flex flex-col
        inset-x-0 bottom-0 h-[60vh] max-h-[500px] rounded-t-xl
        lg:inset-auto lg:bottom-8 lg:right-8 lg:w-[400px] lg:h-[600px] lg:max-h-[80vh] lg:rounded-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-bg-surface lg:rounded-t-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-medium text-text-primary">Chat sobre este artículo</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-border/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4">
              <div className="bg-accent-soft p-3 rounded-lg">
                <p className="text-sm text-text-secondary">
                  Soy un asistente de IA que puede responder preguntas sobre este artículo del Boletín Oficial.
                  Para información oficial, consultá siempre{' '}
                  <a
                    href={articulo.metadata.urlOriginal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-accent hover:underline"
                  >
                    el documento original
                    <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-text-muted">Preguntas sugeridas:</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(question)}
                      className="text-xs px-3 py-1.5 bg-bg-surface border border-border rounded-full hover:bg-border/20 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-bg-surface text-text-primary'
                }`}
              >
                {message.content || (
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border shrink-0 bg-bg lg:rounded-b-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hacé una pregunta sobre este artículo..."
              className="flex-1 px-4 py-2.5 text-sm bg-bg-surface border border-border rounded-full focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-accent text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
