import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! I am your SmileAura AI Assistant. How can I help you with your dental needs today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI immediately
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Prepare history format
      // Skip the first initial assistant greeting because Gemini history must start with 'user'
      const history = messages
        .slice(1)
        .filter(msg => msg.role !== 'system') // If any system messages exist
        .map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          content: msg.content
        }));

      const res = await axios.post('/api/ai/chat', {
        message: userMessage,
        history: history,
      });

      if (res.data && res.data.reply) {
        setMessages([...newMessages, { role: 'ai', content: res.data.reply }]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...newMessages, { role: 'ai', content: 'Oops! I am having trouble connecting to my neural network right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-8 h-screen flex flex-col">
      <div className="bg-white rounded-2xl shadow-2xl flex-grow overflow-hidden flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-4 flex items-center shadow-md z-10">
          <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-teal-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.433 4.433 0 002.771 2.767 4.493 4.493 0 004.307-1.757M8.41 9.63c.16-.16.326-.312.493-.456m4.446 2.47a6.002 6.002 0 00-2.73-2.73" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">SmileAura AI Assistant</h1>
            <p className="text-teal-50 text-sm font-medium">Powered by Gemini AI</p>
          </div>
          <div className="ml-auto">
             <button 
                onClick={() => navigate('/booking')}
                className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-full transition-all duration-300 font-semibold border border-white/40"
             >
                Book Appointment
             </button>
          </div>
        </div>
        
        {/* Chat window */}
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50 scroll-smooth">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div 
                  className={`max-w-[75%] rounded-2xl p-4 shadow-sm relative transition-all duration-300
                    ${msg.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 border-gray-100 border rounded-bl-sm group-hover:shadow-md'
                    }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-full shadow-inner focus:ring-2 focus:ring-teal-500 focus:border-teal-500 py-4 pl-6 pr-16 outline-none transition-all duration-300"
              placeholder="Ask about dental care, symptoms, or our services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default AIAssistant;
