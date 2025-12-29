import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Utensils, 
  BookOpen, 
  ChevronDown, 
  CheckCircle,
  MoreHorizontal,
  Leaf,
  Droplet,
  Activity,
  Moon,
  Sun,
  Sunrise,
  User,
  X,
  Info,
  Loader2,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Send
} from 'lucide-react';

/* --- CONFIGURATION --- */
const apiKey = ""; // API Key injected by environment

/* --- STYLES --- */
const HomeStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');

    :root {
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Manrope', sans-serif;
    }

    body {
      background-color: #F8F6F2;
      font-family: var(--font-body);
      color: #1c1917;
      margin: 0;
    }

    /* Soft Breathing Background */
    @keyframes breathe-bg {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .pulse-container {
      background: linear-gradient(-45deg, #f3e7e9, #e3eeff, #e8f3e8);
      background-size: 400% 400%;
      animation: breathe-bg 15s ease infinite;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.75); 
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
    }
    
    /* --- BOLD SHIMMER ANIMATIONS --- */
    @keyframes rainbow-slide {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @keyframes pop-in-shimmer {
       0% { transform: scale(0.95); box-shadow: 0 0 0 rgba(0,0,0,0); }
       50% { transform: scale(1.03); box-shadow: 0 20px 50px rgba(100, 200, 255, 0.4); }
       100% { transform: scale(1); box-shadow: 0 10px 40px rgba(100, 200, 255, 0.2); }
    }

    @keyframes flash-settle {
      0% { filter: saturate(2) brightness(1.1); border-color: rgba(255,255,255,1); }
      100% { filter: saturate(1) brightness(1); border-color: rgba(255,255,255,0.8); }
    }

    .rainbow-glass {
      background: linear-gradient(
        110deg, 
        rgba(255, 255, 255, 0.9) 10%, 
        rgba(255, 180, 190, 0.4) 30%, 
        rgba(180, 240, 255, 0.4) 50%, 
        rgba(255, 250, 180, 0.4) 70%, 
        rgba(255, 255, 255, 0.9) 90%
      );
      background-size: 200% 200%;
      border: 2px solid rgba(255, 255, 255, 0.8);
      animation: 
        pop-in-shimmer 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
        flash-settle 2s ease-out forwards,
        rainbow-slide 4s linear infinite;
    }

    .font-serif { font-family: var(--font-heading); }
    
    .interact-card {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .interact-card:active {
      transform: scale(0.98);
    }

    /* Modal Animation */
    @keyframes modal-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-enter {
      animation: modal-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Scanner Bloom */
    @keyframes holographic-pulse {
      0% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 0.7; transform: scale(1.1); }
      100% { opacity: 0.3; transform: scale(0.8); }
    }
    
    .scanner-bloom {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(160,230,255,0.4) 40%, rgba(255,180,190,0.4) 60%, rgba(255,255,255,0) 80%);
      filter: blur(20px);
      animation: holographic-pulse 2s ease-in-out infinite;
      pointer-events: none;
    }
    
    .scanner-reticle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 30px;
      box-shadow: 0 0 30px rgba(255,255,255,0.1);
    }
    
    .scanner-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: rgba(255,255,255,0.8);
      border-style: solid;
      transition: all 0.5s ease;
    }
    .is-scanning .scanner-corner {
      border-color: #a5f3fc;
      box-shadow: 0 0 10px #a5f3fc;
    }
  `}</style>
);

/* --- DATA: THE "WHY" CONTENT --- */
const WHY_CONTENT = {
  calories: {
    title: "Why Count Calories?",
    myth: "Myth: 'Calorie counting is obsessive and doesn't work.'",
    truth: "Truth: Energy balance is the physics of weight loss. You don't need to be perfect, but you do need awareness. Think of this as a budget, not a restriction.",
    icon: Utensils,
    color: "bg-emerald-100 text-emerald-800"
  },
  hydration: {
    title: "Why 3 Liters?",
    myth: "Myth: 'You only need to drink when you feel thirsty.'",
    truth: "Truth: By the time you feel thirsty, you're already dehydrated. Water is critical for energy, skin health, and digestion. It's the cheapest performance enhancer.",
    icon: Droplet,
    color: "bg-blue-100 text-blue-800"
  },
  movement: {
    title: "Why 30 Minutes?",
    myth: "Myth: 'If you don't sweat buckets, it doesn't count.'",
    truth: "Truth: Consistency beats intensity. A 30-minute walk every day does more for your long-term heart health than one brutal gym session a week.",
    icon: Activity,
    color: "bg-purple-100 text-purple-800"
  }
};

/* --- API UTILS --- */
const callGemini = async (payload) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      attempts++;
      const delay = Math.pow(2, attempts) * 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Failed to contact Gemini API after retries");
};

const App = () => {
  const [mealLogged, setMealLogged] = useState(false);
  const [timeContext, setTimeContext] = useState('day'); 
  const [activeWhy, setActiveWhy] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'learn', 'profile', 'coach'
  
  // Camera/AI State
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeContext('morning');
    else if (hour >= 11 && hour < 19) setTimeContext('day');
    else setTimeContext('evening');
  }, []);

  // --- AI CAMERA LOGIC ---
  const handleSnap = async () => {
    setIsScanning(true);
    
    // PROMPT ENGINEERING: The Nutritional Co-Pilot
    const systemInstruction = `You are a friendly, science-based nutritionist. Analyze the food in the image. 
    Return valid JSON ONLY with this structure: 
    {
      "name": "Food Name",
      "cals": Number,
      "macros": { "protein": Number, "carbs": Number, "fats": Number },
      "micros": "A short sentence highlighting vitamins/minerals",
      "tip": "A 1-sentence encouraging fact or pairing suggestion. Be kind."
    }`;

    // In a real app, we would send the base64 image here. 
    // Since we can't capture camera in preview, we simulate the call structure.
    try {
      // Mocking the API call for visual prototype, but structure is ready:
      // const response = await callGemini({ contents: [{ parts: [{ text: "Analyze this food", inlineData: { ... } }] }], systemInstruction: ... });
      
      // Simulated Delay & Response
      await new Promise(r => setTimeout(r, 2500));
      
      setScanResult({
        name: "Avocado Toast & Poached Egg",
        cals: 480,
        macros: {
          protein: 18,
          carbs: 35,
          fats: 28
        },
        micros: "Rich in Vitamin D, Potassium, and healthy Monounsaturated Fats.",
        tip: "The fat from the avocado helps your body absorb the nutrients in the egg. Perfect combo!"
      });
    } catch (error) {
      console.error("Scanning failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  const confirmScan = () => {
    setScanResult(null);
    setCameraOpen(false);
    setMealLogged(true); // Triggers the Rainbow Reward
  };

  // --- VIEWS ---

  const HomeFeed = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {timeContext === 'morning' && <><LessonCard /><RitualsCard /><NourishmentCard /></>}
        {timeContext === 'day' && <><NourishmentCard /><RitualsCard /><LessonCard /></>}
        {timeContext === 'evening' && <><RitualsCard /><NourishmentCard /><LessonCard /></>}
    </div>
  );

  const LearnFeed = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-serif text-3xl text-stone-900">The Library</h2>
      <div className="space-y-4">
        {[{ title: "Energy Balance 101", cat: "Fundamentals", color: "bg-orange-100 text-orange-800" }, { title: "Protein Leverage", cat: "Nutrition", color: "bg-green-100 text-green-800" }, { title: "Sleep & Recovery", cat: "Lifestyle", color: "bg-blue-100 text-blue-800" }].map((item, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold ${item.color}`}>{i+1}</div>
               <div><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.cat}</p><h4 className="font-serif text-lg text-stone-800">{item.title}</h4></div>
             </div>
             <ChevronRight className="text-stone-300 group-hover:text-stone-800 transition-colors" size={20}/>
          </div>
        ))}
      </div>
    </div>
  );

  const CoachFeed = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
      { role: 'ai', text: "Hi Alex! I've noticed you've been consistent with your protein this week. How are you feeling about your energy levels today?" }
    ]);

    const sendChat = async () => {
      if(!input.trim()) return;
      const newMsg = { role: 'user', text: input };
      setMessages(prev => [...prev, newMsg]);
      setInput('');
      
      // Mocking the Gemini Chat Response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "That's great to hear. Since you're feeling energetic, we might consider increasing your step goal by 500 steps tomorrow. Would you like to try that?" }]);
      }, 1500);
    };

    return (
      <div className="h-[calc(100vh-200px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-stone-900 text-white rounded-tr-none' : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                </div>
             </div>
           ))}
        </div>
        <div className="p-4 glass-panel rounded-t-[2rem] border-t border-white">
           <div className="flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask your coach..."
               className="flex-1 bg-white/50 border-none rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-stone-200 outline-none"
               onKeyDown={(e) => e.key === 'Enter' && sendChat()}
             />
             <button onClick={sendChat} className="bg-stone-900 text-white p-3 rounded-xl hover:scale-105 transition-transform">
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    );
  };

  const ProfileFeed = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="text-center mb-8">
         <div className="w-24 h-24 mx-auto bg-stone-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4"><span className="font-serif text-4xl text-stone-500">A</span></div>
         <h2 className="font-serif text-2xl text-stone-900">Alex's Protocol</h2>
         <p className="text-stone-500 text-sm">Member since Nov 2024</p>
       </div>
       <div className="glass-panel p-6 rounded-[2rem] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-stone-100"><span className="font-bold text-stone-700">Current Goal</span><span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">Fat Loss</span></div>
          <div className="flex justify-between items-center pb-4 border-b border-stone-100"><span className="font-bold text-stone-700">Daily Calorie Target</span><span className="font-serif text-lg">2,200 kcal</span></div>
          <button className="w-full py-3 text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-800">Adjust Goals</button>
       </div>
    </div>
  );

  /* --- CARDS --- */
  
  const LessonCard = () => (
    <section className="glass-panel p-6 rounded-[2rem] interact-card cursor-pointer group border-l-4 border-l-orange-200">
      <div className="flex justify-between items-start mb-4"><span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold tracking-widest uppercase">Golden Rule #04</span><BookOpen size={20} className="text-stone-400 group-hover:text-orange-500 transition-colors" /></div>
      <h3 className="font-serif text-2xl text-stone-900 mb-3 leading-tight">The Myth of <br/><span className="italic text-orange-600">"Starvation Mode"</span></h3>
      <p className="text-base text-stone-600 leading-relaxed mb-4">Your body doesn't hold onto fat because you ate too little today. Energy balance is math, but hormones make it feel complex...</p>
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">Read 2 min Lesson <ChevronDown size={14} className="ml-1" /></div>
    </section>
  );

  const NourishmentCard = () => (
    <section className={`rounded-[2rem] relative overflow-hidden transition-all duration-300 ${mealLogged ? 'rainbow-glass p-1' : 'glass-panel p-1'}`}>
      {!mealLogged && <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-200 to-teal-200 opacity-50"></div>}
      <div className="p-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-serif text-2xl text-stone-900">Nourishment</h3>
            <button onClick={() => setActiveWhy('calories')} className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-colors group">
               <Info size={12} className="text-stone-400 mr-2 group-hover:text-stone-800" /><span className="text-xs font-bold text-stone-600 uppercase tracking-wider mr-2 group-hover:text-stone-900">Remaining</span><span className="text-sm font-serif font-bold text-stone-900">1,200 kcal</span>
            </button>
          </div>
          <div className="flex gap-1"><div className="h-10 w-2 bg-emerald-500 rounded-full"></div><div className="h-10 w-2 bg-emerald-500 rounded-full"></div><div className="h-10 w-2 bg-emerald-200 rounded-full"></div><div className="h-10 w-2 bg-emerald-100/50 rounded-full"></div></div>
        </div>
        {mealLogged ? (
           <div className="bg-white/60 rounded-2xl p-5 flex items-center justify-between border border-white backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 shadow-sm border border-green-200"><CheckCircle size={24} /></div><div><p className="font-bold text-base text-stone-900">Lunch Logged</p><p className="text-sm text-stone-600">Avocado Toast • 480kcal</p></div></div>
             <button onClick={() => setMealLogged(false)} className="text-stone-400 hover:text-stone-800 p-2"><MoreHorizontal size={24} /></button>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setCameraOpen(true)} className="col-span-2 bg-stone-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 interact-card shadow-xl shadow-stone-200 transition-colors"><Camera size={22} /><span className="text-sm font-bold tracking-widest uppercase">Scan Meal (AI)</span></button>
            <button className="bg-white/50 border border-white hover:bg-white text-stone-700 py-4 rounded-2xl flex flex-col items-center justify-center interact-card transition-colors"><Utensils size={20} className="mb-2 opacity-60"/><span className="text-[10px] font-bold tracking-widest uppercase">Portions</span></button>
            <button className="bg-white/50 border border-white hover:bg-white text-stone-700 py-4 rounded-2xl flex flex-col items-center justify-center interact-card transition-colors"><span className="font-serif italic text-xl leading-none mb-1">123</span><span className="text-[10px] font-bold tracking-widest uppercase">Manual</span></button>
          </div>
        )}
      </div>
    </section>
  );

  const RitualsCard = () => (
    <section className="glass-panel p-6 rounded-[2rem]">
       <h3 className="font-serif text-2xl text-stone-900 mb-6">Daily Rituals</h3>
       <div className="space-y-4">
         <div onClick={() => setActiveWhy('hydration')} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white group cursor-pointer hover:bg-white transition-colors shadow-sm">
            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Droplet size={22} strokeWidth={2} /></div><div><span className="block font-serif text-lg text-stone-800 group-hover:text-blue-600 transition-colors">Hydration</span><span className="text-xs font-bold text-stone-500 uppercase tracking-wider">0 / 3 Liters</span></div></div>
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 group-hover:border-blue-400 transition-colors flex items-center justify-center"><Info size={12} className="text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
         </div>
         <div onClick={() => setActiveWhy('movement')} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white group cursor-pointer hover:bg-white transition-colors shadow-sm">
            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><Activity size={22} strokeWidth={2} /></div><div><span className="block font-serif text-lg text-stone-800 group-hover:text-purple-600 transition-colors">Movement</span><span className="text-xs font-bold text-stone-500 uppercase tracking-wider">30 mins goal</span></div></div>
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 group-hover:border-purple-400 transition-colors flex items-center justify-center"><Info size={12} className="text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
         </div>
       </div>
    </section>
  );

  const AICameraModal = () => (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      <div className={`relative flex-1 bg-stone-800 overflow-hidden ${isScanning ? 'is-scanning' : ''}`}>
        {!scanResult ? (
          <>
            <img src="https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800" alt="Viewfinder" className="w-full h-full object-cover opacity-80" />
            {isScanning && <div className="scanner-bloom"></div>}
            <div className="scanner-reticle"><div className="scanner-corner border-t-2 border-l-2 -top-1 -left-1 rounded-tl-lg"></div><div className="scanner-corner border-t-2 border-r-2 -top-1 -right-1 rounded-tr-lg"></div><div className="scanner-corner border-b-2 border-l-2 -bottom-1 -left-1 rounded-bl-lg"></div><div className="scanner-corner border-b-2 border-r-2 -bottom-1 -right-1 rounded-br-lg"></div></div>
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div className="flex justify-between items-center text-white"><button onClick={() => setCameraOpen(false)}><X size={24}/></button><div className="flex flex-col items-center"><span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">Simplifit Vision</span>{isScanning && <span className="text-xs text-cyan-200 font-serif italic animate-pulse">Analyzing molecular structure...</span>}</div><Info size={24}/></div>
              <div className="flex justify-center mb-8">
                {isScanning ? (
                  <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 font-bold text-sm border border-white/20"><Loader2 size={18} className="animate-spin text-cyan-300"/> Processing...</div>
                ) : (
                  <button onClick={handleSnap} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-90 transition-transform hover:bg-white/30"><div className="w-16 h-16 bg-white rounded-full"></div></button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-[#FDFBF7] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl modal-enter overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400"></div>
              <div className="flex items-start justify-between mb-6"><div><div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-cyan-600" /><p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Analysis Complete</p></div><h3 className="font-serif text-2xl text-stone-900 leading-tight">{scanResult.name}</h3></div><div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm"><CheckCircle className="text-emerald-500" size={24}/></div></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200"><p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">Calories</p><p className="font-serif text-2xl text-stone-900">{scanResult.cals}</p></div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100"><p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mb-1">Protein</p><p className="font-serif text-2xl text-purple-900">{scanResult.macros.protein}g</p></div>
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100"><p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mb-1">Carbs</p><p className="font-serif text-2xl text-orange-900">{scanResult.macros.carbs}g</p></div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100"><p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Fats</p><p className="font-serif text-2xl text-blue-900">{scanResult.macros.fats}g</p></div>
              </div>
              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl mb-6"><p className="text-xs font-bold text-cyan-700 uppercase tracking-widest mb-1">Micronutrient Profile</p><p className="font-serif text-stone-700 italic mb-2">"{scanResult.micros}"</p><div className="h-px w-full bg-cyan-200 my-2"></div><p className="text-xs text-cyan-800 leading-snug"><span className="font-bold">Simplifit Verdict: </span>{scanResult.tip}</p></div>
              <div className="flex gap-3"><button onClick={() => setScanResult(null)} className="flex-1 py-3 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-600">Retake</button><button onClick={confirmScan} className="flex-[2] py-4 bg-stone-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-stone-300">Log Meal</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const WhyModal = ({ type, onClose }) => {
    const content = WHY_CONTENT[type];
    const Icon = content.icon;
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="modal-enter relative w-full max-w-sm bg-[#FDFBF7] rounded-[2rem] p-8 shadow-2xl border border-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 rounded-full transition-colors"><X size={20} /></button>
          <div className={`w-14 h-14 rounded-2xl ${content.color} flex items-center justify-center mb-6`}><Icon size={28} /></div>
          <h3 className="font-serif text-2xl text-stone-900 mb-4">{content.title}</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100"><p className="text-sm text-red-800 font-medium leading-relaxed italic">{content.myth}</p></div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100"><p className="text-sm text-stone-700 leading-relaxed font-medium">{content.truth}</p></div>
          </div>
          <button onClick={onClose} className="w-full mt-8 py-4 bg-stone-900 text-white rounded-xl font-bold tracking-widest uppercase text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform">Got it, thanks</button>
        </div>
      </div>
    );
  };

  const getGreeting = () => {
    if (timeContext === 'morning') return { icon: Sunrise, text: 'Good Morning' };
    if (timeContext === 'evening') return { icon: Moon, text: 'Good Evening' };
    return { icon: Sun, text: 'Good Afternoon' };
  };
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="min-h-screen pulse-container relative overflow-x-hidden">
      <HomeStyles />
      {activeWhy && <WhyModal type={activeWhy} onClose={() => setActiveWhy(null)} />}
      {cameraOpen && <AICameraModal />}

      <header className="fixed top-0 w-full z-20 px-6 py-4 flex justify-between items-center glass-panel rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-stone-600">
             <GreetingIcon size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase mb-1">Today's Pulse</h2>
            <h1 className="font-serif text-2xl text-stone-900 font-medium">{greeting.text}, Alex</h1>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-40 px-4 md:px-6 max-w-lg mx-auto">
         {activeTab === 'home' && <HomeFeed />}
         {activeTab === 'learn' && <LearnFeed />}
         {activeTab === 'coach' && <CoachFeed />}
         {activeTab === 'profile' && <ProfileFeed />}
      </main>

      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-30 w-[90%] max-w-sm justify-between">
        <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 group">
           <Leaf size={24} className={`transition-colors ${activeTab === 'home' ? 'text-emerald-300' : 'text-stone-400 group-hover:text-white'}`} />
           <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'home' ? 'text-white' : 'text-stone-500 group-hover:text-white'}`}>Home</span>
        </button>
        <button onClick={() => setActiveTab('learn')} className="flex flex-col items-center gap-1 group">
           <BookOpen size={24} className={`transition-colors ${activeTab === 'learn' ? 'text-emerald-300' : 'text-stone-400 group-hover:text-white'}`} />
           <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'learn' ? 'text-white' : 'text-stone-500 group-hover:text-white'}`}>Learn</span>
        </button>
        <button onClick={() => setActiveTab('coach')} className="flex flex-col items-center gap-1 group">
           <MessageCircle size={24} className={`transition-colors ${activeTab === 'coach' ? 'text-emerald-300' : 'text-stone-400 group-hover:text-white'}`} />
           <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'coach' ? 'text-white' : 'text-stone-500 group-hover:text-white'}`}>Coach</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center gap-1 group">
           <User size={24} className={`transition-colors ${activeTab === 'profile' ? 'text-emerald-300' : 'text-stone-400 group-hover:text-white'}`} />
           <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-stone-500 group-hover:text-white'}`}>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;