import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translateCarbon, formatCarbon } from '../utils/impactTranslator';
import { 
  Send, 
  Bot, 
  User, 
  Trash2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const AICoach: React.FC = () => {
  const { breakdown, recommendations, profile, highContrast, units } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize coach welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'coach',
          text: `Hi ${profile.name || 'Eco Warrior'}! I'm your Sustainability Coach. I have analyzed your carbon assessment and identified that your highest emissions come from **${getTopHotspotName()}**. 

How can I help you today? You can select one of the quick queries below or type a custom question!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [profile.name]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getTopHotspotName = () => {
    const cats = [
      { name: 'Transportation', val: breakdown.transport },
      { name: 'Home Energy', val: breakdown.energy },
      { name: 'Diet & Food', val: breakdown.food },
      { name: 'Shopping habits', val: breakdown.shopping },
      { name: 'Waste production', val: breakdown.waste }
    ];
    cats.sort((a, b) => b.val - a.val);
    return cats[0].name;
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate coach analysis and reply based on sustainability intelligence
    setTimeout(() => {
      let replyText = '';
      const query = textToSend.toLowerCase();

      if (query.includes('electricity') || query.includes('energy') || query.includes('power')) {
        const energySavings = recommendations.find(r => r.category === 'energy');
        const eq = energySavings ? translateCarbon(energySavings.rawSavingsKg) : null;
        
        replyText = `Based on your profile, your electricity consumption is **${profile.electricityMonthly} kWh/month**, emitting **${formatCarbon(breakdown.energy, units)} annually**. 
        
        Here is my top recommendation: **${energySavings?.name || 'Switch to Renewable Energy'}**. 
        Doing this will save approx **${formatCarbon(energySavings?.rawSavingsKg || 50, units)} monthly** which is equivalent to:
        - Planting **${eq?.trees || 3} trees** monthly.
        - Saving **${eq?.electricityDays || 10} days** of household electricity.
        - Preventing **${eq?.drivingKm || 120} km** of car driving emissions.`;
      } 
      
      else if (query.includes('priority') || query.includes('score') || query.includes('formula')) {
        replyText = `The **AI Priority Score** is calculated using this mathematical formula:
        
        $$\\text{Priority Score} = \\frac{\\text{Estimated Carbon Savings (kg CO}_2\\text{) } \\times \\text{ Impact Weight}}{\\text{Effort Level (1-3) } \\times \\text{ Effort Weight}}$$
        
        This helps prioritize high-impact actions that require low personal effort (e.g. unplugging idle standby gadgets or setting up a green energy plan) over actions that have high difficulty but lower savings.`;
      } 
      
      else if (query.includes('food') || query.includes('diet') || query.includes('meat') || query.includes('vegetarian')) {
        const dietSavings = recommendations.find(r => r.category === 'food');
        const eq = dietSavings ? translateCarbon(dietSavings.rawSavingsKg) : null;

        replyText = `Your diet selection is registered as **${profile.dietType.replace('_', ' ')}**, generating **${formatCarbon(breakdown.food, units)} annually**.
        
        By switching to vegetarian meals twice weekly, you can save **${formatCarbon(dietSavings?.rawSavingsKg || 15, units)} per month**. That's equivalent to preventing **${eq?.drivingKm || 80} km** of driving or planting **${eq?.trees || 2} trees**! For maximum savings, consider moving toward local organic sourcing, which lowers logistical food transport footprints.`;
      } 
      
      else if (query.includes('translate') || query.includes('48') || query.includes('saving')) {
        const trans48 = translateCarbon(48);
        const trans120 = translateCarbon(120);
        replyText = `Under the **Environmental Impact Translator**, carbon numbers map to tangible real-world savings:
        
        - **48 kg CO₂ Saved** = Planting **${trans48.trees} Trees**, saving **${trans48.drivingKm} km** of driving, or **${trans48.electricityDays} days** of home electricity.
        - **120 kg CO₂ Saved** = Planting **${trans120.trees} Trees**, saving **${trans120.drivingKm} km** of driving, or **${trans120.electricityDays} days** of home electricity.
        
        Every small habit logged contributes directly to these planetary offsets!`;
      } 
      
      else if (query.includes('transport') || query.includes('car') || query.includes('flight') || query.includes('commute')) {
        const transSavings = recommendations.find(r => r.category === 'transport');
        const eq = transSavings ? translateCarbon(transSavings.rawSavingsKg) : null;

        replyText = `Your commute type is **${profile.commuteType.replace('_', ' ')}** over **${profile.commuteDistance} km/week**. Combined with flights, your transportation footprint is **${formatCarbon(breakdown.transport, units)} yearly**.
        
        I recommend switching your commute to public/active transit twice weekly. This will save **${formatCarbon(transSavings?.rawSavingsKg || 25, units)} monthly**, diverting tailpipe emissions equivalent to planting **${eq?.trees || 2} trees** or saving **${eq?.drivingKm || 150} km** of combustion driving!`;
      }
      
      else {
        replyText = `I have logged your question regarding carbon reductions. Looking at your data, your annual emissions profile is **${formatCarbon(breakdown.total, units)}**. 

To offset this, I suggest checking the **Carbon Simulator** to model changes, or prioritizing your highest scoring Action Cards:
1. **${recommendations[0]?.name || 'Unplug Standby Electronics'}** (Priority Score: ${recommendations[0]?.priorityScore || 10})
2. **${recommendations[1]?.name || 'Switch to Green Energy'}** (Priority Score: ${recommendations[1]?.priorityScore || 8})

Is there a specific category you would like to tackle first?`;
      }

      const coachMsg: ChatMessage = {
        id: `msg_${Date.now()}_c`,
        sender: 'coach',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickPrompt = (text: string) => {
    handleSendMessage(text);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const quickPrompts = [
    { text: 'Why is my food footprint so high?', label: 'Food Footprint' },
    { text: 'Explain the Priority Score calculation.', label: 'Priority Formula' },
    { text: 'How do I lower my home electricity footprint?', label: 'Energy Reduction' },
    { text: 'Can you translate 48 kg CO2 saved?', label: 'Translate 48kg' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            AI Sustainability Coach
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Encouraging, expert advice on reducing carbon, customized to your profile.
          </p>
        </div>
      </div>

      <div className={`glass-card flex flex-col h-[550px] overflow-hidden ${
        highContrast ? 'border-2 border-white bg-black' : ''
      }`}>
        {/* Chat header */}
        <div className={`p-4 border-b flex justify-between items-center ${
          highContrast ? 'border-white bg-black' : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg ${highContrast ? 'bg-white text-black' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">EcoWise Coach</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                Expert Advisor Active
              </div>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1 focus:outline-none"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div 
                key={msg.id}
                className={`flex ${isCoach ? 'justify-start' : 'justify-end'} items-start space-x-2.5`}
              >
                {isCoach && (
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    highContrast ? 'bg-white text-black border' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                  }`}>
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs leading-relaxed space-y-2 ${
                  isCoach
                    ? highContrast
                      ? 'bg-black border border-white text-white'
                      : 'bg-white/5 border border-white/5 text-slate-200'
                    : highContrast
                      ? 'bg-white text-black font-bold'
                      : 'bg-emerald-500 text-slate-950 font-medium'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[8px] text-right text-slate-400 mt-1">
                    {msg.timestamp}
                  </span>
                </div>

                {!isCoach && (
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    highContrast ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-3 text-xs flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompt chips */}
        {messages.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 select-none border-t border-white/5 bg-slate-950/20">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(p.text)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all focus:outline-none ${
                  highContrast 
                    ? 'border-white text-white hover:bg-white/20' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className={`p-3 border-t flex items-center space-x-2 ${
            highContrast ? 'border-white bg-black' : 'bg-slate-900/60 border-white/5'
          }`}
        >
          <input
            type="text"
            placeholder="Ask the sustainability coach..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 ${
              highContrast ? 'bg-black border-white text-white focus:border-white' : ''
            }`}
            aria-label="Ask sustainability question"
          />
          <button
            type="submit"
            className={`p-2 rounded-lg transition-all focus:outline-none ${
              highContrast
                ? 'bg-white text-black hover:bg-slate-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
            aria-label="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
