import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Check, ChevronRight, Activity, Zap, Wind, Sparkles, 
  RefreshCw, Calculator, User, Heart, Scale, Calendar, Ruler, ChevronUp, ChevronDown 
} from 'lucide-react';

/* --- STYLES & ANIMATIONS --- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');

    :root {
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Manrope', sans-serif;
      --color-stone-900: #1c1917;
    }

    body {
      margin: 0;
      overflow: hidden;
      font-family: var(--font-body);
      background-color: #F8F6F2;
      color: #1c1917;
    }

    /* --- BACKGROUND BLOBS --- */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 0.6;
      z-index: 0;
      mix-blend-mode: multiply;
    }

    /* --- ANIMATIONS --- */
    .slide-enter { animation: slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .fade-enter { animation: fadeIn 0.8s ease forwards; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* --- UI ELEMENTS --- */
    .glass-card {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.08);
    }
    
    .font-serif { font-family: var(--font-heading); }
    
    .minimal-input {
      background: transparent;
      border: none;
      border-bottom: 2px solid rgba(28, 25, 23, 0.1);
      font-family: var(--font-heading);
      font-size: 2.5rem;
      color: #1c1917;
      width: 100%;
      text-align: center;
      transition: all 0.3s ease;
      padding-bottom: 0.5rem;
    }
    .minimal-input:focus {
      outline: none;
      border-color: #F97316;
      transform: scale(1.02);
    }

    /* --- CUSTOM SLIDER TRACKS --- */
    input[type=range] { -webkit-appearance: none; background: transparent; }
    
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 32px; width: 32px;
      border-radius: 50%; 
      background: #1c1917;
      cursor: pointer; margin-top: -14px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: 2px solid white;
      transition: transform 0.1s;
    }
    input[type=range]:active::-webkit-slider-thumb {
      transform: scale(1.1);
      background: #F97316;
    }
    
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%; height: 6px;
      cursor: pointer; 
      background: linear-gradient(to right, #e7e5e4 0%, #e7e5e4 100%);
      border-radius: 3px;
    }

    .option-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); border: 2px solid transparent; }
    .option-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.8); }
    
    .option-card.selected {
      background: white;
      transform: scale(1.02);
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .option-card.selected.orange { border-color: #fdba74; }
    .option-card.selected.purple { border-color: #d8b4fe; }
    .option-card.selected.green { border-color: #86efac; }

    /* --- RAINBOW SHIMMER --- */
    @property --hue-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
    @keyframes rotate-hue { from { --hue-angle: 0deg; } to { --hue-angle: 360deg; } }
    @keyframes pop-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    
    .rainbow-glass {
      background: linear-gradient(
        135deg, 
        hsla(var(--hue-angle), 80%, 95%, 0.95) 0%, 
        hsla(calc(var(--hue-angle) + 60deg), 70%, 90%, 0.7) 25%,
        hsla(calc(var(--hue-angle) + 120deg), 70%, 90%, 0.7) 50%,
        hsla(calc(var(--hue-angle) + 180deg), 70%, 90%, 0.7) 75%,
        hsla(var(--hue-angle), 80%, 95%, 0.95) 100%
      );
      border: 2px solid rgba(255, 255, 255, 0.8);
      animation: pop-in 0.6s ease-out forwards, rotate-hue 10s linear infinite;
    }
  `}</style>
);

/* --- DYNAMIC BACKGROUND --- */
const AmbientBackground = ({ step }) => {
  const config = {
    0: { b1: { top: '50%', left: '50%', bg: '#FFD166', transform: 'translate(-50%, -50%)' }, b2: { bottom: '-20%', right: '-20%', bg: '#EF476F' } }, 
    1: { b1: { top: '-20%', left: '20%', bg: '#06D6A0' }, b2: { bottom: '-10%', right: '10%', bg: '#118AB2' } }, 
    2: { b1: { top: '30%', left: '-20%', bg: '#FFD166' }, b2: { bottom: '-10%', right: '-10%', bg: '#118AB2' } }, 
    3: { b1: { top: '-20%', left: '40%', bg: '#EF476F' }, b2: { bottom: '10%', left: '-10%', bg: '#FFD166' } }, 
    4: { b1: { top: '40%', left: '-20%', bg: '#118AB2' }, b2: { bottom: '-20%', right: '-10%', bg: '#06D6A0' } }, 
    5: { b1: { top: '10%', right: '10%', bg: '#EF476F' }, b2: { bottom: '0%', left: '0%', bg: '#FFD166' } }, 
    6: { b1: { top: '-10%', left: '-10%', bg: '#06D6A0' }, b2: { bottom: '-10%', right: '-10%', bg: '#118AB2' } }, 
    7: { b1: { top: '20%', left: '20%', bg: '#118AB2' }, b2: { bottom: '20%', right: '20%', bg: '#EF476F' } }, 
    8: { b1: { top: '-10%', right: '30%', bg: '#FFD166' }, b2: { bottom: '0%', left: '-10%', bg: '#06D6A0' } }, 
    9: { b1: { top: '50%', left: '50%', bg: '#ffffff', opacity: 0.9, transform: 'translate(-50%, -50%)' } } 
  };
  const current = config[step] || config[0];
  const common = { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', transition: 'all 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)', opacity: 0.5, zIndex: 0, width: '60vw', height: '60vw' };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div style={{ ...common, ...current.b1 }} />
      <div style={{ ...common, ...current.b2 }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

/* --- UI COMPONENTS --- */

const Logo = () => (
  <div className="inline-block relative mb-2">
    <h1 className="font-serif text-4xl text-stone-900 leading-tight tracking-tight">
      Simpli<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">fit</span>
    </h1>
  </div>
);

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-stone-200/50 backdrop-blur-sm">
    <div 
      className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700 ease-out" 
      style={{ width: `${((current) / total) * 100}%` }}
    />
  </div>
);

const NavigationButtons = ({ onNext, onPrev, disabled = false }) => (
  <div className="flex items-center justify-between pt-10">
    <button onClick={onPrev} className="px-4 py-2 text-stone-400 hover:text-stone-900 font-bold uppercase text-xs tracking-widest transition-colors">Back</button>
    <button onClick={onNext} disabled={disabled} className="btn-hover-effect bg-stone-900 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"><ChevronRight size={28} /></button>
  </div>
);

const UnitToggle = ({ units, setUnits }) => (
  <div className="flex justify-center mb-8">
    <div className="bg-white/60 p-1 rounded-full flex gap-1 shadow-sm border border-white backdrop-blur-sm">
      {['metric', 'imperial'].map((u) => (
        <button key={u} onClick={() => setUnits(u)} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${units === u ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-white/50'}`}>{u}</button>
      ))}
    </div>
  </div>
);

/* --- MAIN APP --- */

const App = () => {
  const [step, setStep] = useState(0); 
  const [introSlide, setIntroSlide] = useState(0); 
  
  const [formData, setFormData] = useState({
    name: '', sex: 'female', units: 'imperial', 
    age: '', height: 170, weight: 70, targetWeight: 65, 
    activity: 1.2, goal: 'weight_loss'
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));

  const getDisplayHeight = () => {
    if (formData.units === 'metric') return { val: formData.height, unit: 'cm' };
    const totalInches = formData.height / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { val: `${ft}'${inches}"`, unit: 'ft/in' };
  };

  const getDisplayWeight = (kgVal) => {
    if (formData.units === 'metric') return { val: Math.round(kgVal), unit: 'kg' };
    return { val: Math.round(kgVal * 2.20462), unit: 'lbs' };
  };

  const steps = [
    <WelcomeView slide={introSlide} setSlide={setIntroSlide} onFinish={next} />,
    <NameView onNext={next} formData={formData} setFormData={setFormData} />,
    <BioView onNext={next} onPrev={prev} formData={formData} setFormData={setFormData} />,
    <HeightView onNext={next} onPrev={prev} formData={formData} setFormData={setFormData} getDisplay={getDisplayHeight} />,
    <WeightView onNext={next} onPrev={prev} formData={formData} setFormData={setFormData} getDisplay={getDisplayWeight} />,
    <GoalView onNext={next} onPrev={prev} formData={formData} setFormData={setFormData} />,
    <TargetWeightView onNext={next} onPrev={prev} formData={formData} setFormData={setFormData} getDisplay={getDisplayWeight} />,
    <EducationScaleView onNext={next} onPrev={prev} />,
    <TimelineView onNext={next} onPrev={prev} formData={formData} />,
    <MythView onNext={next} />,
    <BlueprintView formData={formData} onRestart={() => setStep(0)} />
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-6 md:p-12">
      <GlobalStyles />
      <AmbientBackground step={step} />
      {step > 0 && <ProgressBar current={step} total={10} />}
      {step > 0 && step < 10 && <div className="absolute top-12 left-0 w-full text-center z-20 fade-enter"><Logo /></div>}
      <div key={step} className="slide-enter w-full max-w-xl relative z-10 mt-8">
        {steps[step]}
      </div>
    </div>
  );
};

/* --- VIEWS --- */

const WelcomeView = ({ slide, setSlide, onFinish }) => {
  const content = [
    { title: "Welcome to Simplifit", subtitle: "A new way to think about your body.", icon: Sparkles },
    { title: "Biology, not Magic.", subtitle: "We use established science to build a protocol that actually works.", icon: User },
    { title: "Let's build your plan.", subtitle: "We'll gather some data to custom build your roadmap.", icon: Calculator }
  ];
  const current = content[slide];
  const Icon = current.icon;
  return (
    <div key={slide} className="text-center space-y-8 fade-enter min-h-[450px] flex flex-col justify-center items-center">
       <Logo />
       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 border border-stone-50"><Icon size={36} className="text-stone-900" strokeWidth={1.5} /></div>
       <div className="space-y-4 max-w-xs"><h1 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">{current.title}</h1><p className="font-body text-stone-500 text-lg">{current.subtitle}</p></div>
       <button onClick={() => slide < 2 ? setSlide(s => s + 1) : onFinish()} className="mt-8 btn-hover-effect bg-stone-900 text-white px-10 py-4 rounded-full font-body text-sm tracking-widest uppercase shadow-lg hover:bg-black transition-colors">{slide < 2 ? "Continue" : "Start"}</button>
       <div className="flex gap-3 mt-6">{[0,1,2].map(i => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? 'w-8 bg-stone-900' : 'w-2 bg-stone-300'}`} />)}</div>
    </div>
  );
};

const NameView = ({ onNext, formData, setFormData }) => (
  <div className="text-center space-y-12">
    <div className="space-y-4"><span className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase bg-teal-100 px-4 py-1.5 rounded-full">First Impressions</span><h2 className="font-serif text-4xl md:text-5xl text-stone-900">What should we call you?</h2></div>
    <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="minimal-input" autoFocus onKeyDown={(e) => e.key === 'Enter' && formData.name && onNext()} />
    <button disabled={!formData.name} onClick={onNext} className="btn-hover-effect bg-white border border-stone-200 text-stone-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg disabled:opacity-50"><ArrowRight className="w-6 h-6" /></button>
  </div>
);

const BioView = ({ onNext, onPrev, formData, setFormData }) => (
  <div className="space-y-10 text-center">
    <UnitToggle units={formData.units} setUnits={(u) => setFormData({...formData, units: u})} />
    <div className="space-y-2"><h2 className="font-serif text-4xl text-stone-900">The Basics</h2><p className="text-stone-500">Biological sex affects metabolic rate calculations.</p></div>
    <div className="flex justify-center gap-4">{['female', 'male'].map(s => <button key={s} onClick={() => setFormData({...formData, sex: s})} className={`px-8 py-4 rounded-2xl border-2 font-bold capitalize transition-all text-sm tracking-wide ${formData.sex === s ? 'border-stone-900 bg-stone-900 text-white shadow-lg' : 'border-white text-stone-500 bg-white/50 hover:bg-white'}`}>{s}</button>)}</div>
    <div className="space-y-4 pt-4"><p className="text-xs font-bold uppercase tracking-widest text-stone-400">Age</p><div className="relative w-24 mx-auto"><input type="number" placeholder="30" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full text-center font-serif text-5xl bg-transparent border-b-2 border-stone-200 focus:border-orange-400 outline-none text-stone-900 py-2" /></div></div>
    <NavigationButtons onNext={onNext} onPrev={onPrev} disabled={!formData.age} />
  </div>
);

const HeightView = ({ onNext, onPrev, formData, setFormData, getDisplay }) => {
  const display = getDisplay();
  const handleChange = (e) => { let val = parseInt(e.target.value); if (formData.units === 'metric') setFormData({...formData, height: val}); else setFormData({...formData, height: val * 2.54}); };
  const rangeProps = formData.units === 'metric' ? { min: 120, max: 220, val: formData.height } : { min: 48, max: 84, val: Math.round(formData.height / 2.54) };

  return (
    <div className="space-y-10 text-center">
      <UnitToggle units={formData.units} setUnits={(u) => setFormData({...formData, units: u})} />
      <div className="space-y-2"><h2 className="font-serif text-4xl text-stone-900">Height</h2><p className="text-stone-500">Used to calculate your metabolic baseline.</p></div>
      <div className="flex flex-col items-center gap-8">
         <div className="relative h-64 w-32 border-l-2 border-stone-300 flex flex-col justify-end">
            <div className="w-full bg-stone-900 rounded-r-lg transition-all duration-100 relative" style={{ height: `${((rangeProps.val - rangeProps.min) / (rangeProps.max - rangeProps.min)) * 100}%`, minHeight: '10%' }}>
               <div className="absolute -top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap"><span className="font-serif text-2xl text-stone-900">{display.val}</span></div>
            </div>
            <div className="absolute left-0 top-0 h-full w-2 flex flex-col justify-between py-2">{[...Array(5)].map((_,i) => <div key={i} className="w-2 h-px bg-stone-300"></div>)}</div>
         </div>
         <div className="w-full max-w-xs px-4"><input type="range" min={rangeProps.min} max={rangeProps.max} value={rangeProps.val} onChange={handleChange} className="w-full" /><p className="text-xs text-stone-400 mt-4 uppercase tracking-widest">Slide to adjust</p></div>
      </div>
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const WeightView = ({ onNext, onPrev, formData, setFormData, getDisplay }) => {
  const display = getDisplay(formData.weight);
  const handleChange = (e) => { let val = parseInt(e.target.value); if (formData.units === 'metric') setFormData({...formData, weight: val}); else setFormData({...formData, weight: val / 2.20462}); };
  const rangeProps = formData.units === 'metric' ? { min: 40, max: 180, val: Math.round(formData.weight) } : { min: 90, max: 400, val: Math.round(formData.weight * 2.20462) };

  return (
    <div className="space-y-12 text-center">
      <UnitToggle units={formData.units} setUnits={(u) => setFormData({...formData, units: u})} />
      <div className="space-y-2"><h2 className="font-serif text-4xl text-stone-900">Current Weight</h2><p className="text-stone-500">This is just a data point. It doesn't define you.</p></div>
      <div className="space-y-8">
         <div className="inline-block border-b-2 border-stone-200 px-8 py-2"><span className="font-serif text-6xl text-stone-900">{display.val}</span><span className="text-stone-400 font-bold uppercase text-sm tracking-widest ml-2">{display.unit}</span></div>
         <div className="w-full max-w-xs mx-auto"><input type="range" min={rangeProps.min} max={rangeProps.max} value={rangeProps.val} onChange={handleChange} className="w-full" /></div>
      </div>
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const GoalView = ({ onNext, onPrev, formData, setFormData }) => {
  const goals = [
    { id: 'weight_loss', title: 'Lose Weight', desc: 'Sustainable fat loss', icon: Wind, color: 'orange' },
    { id: 'muscle_gain', title: 'Build Muscle', desc: 'Strength & hypertrophy', icon: Activity, color: 'purple' },
    { id: 'maintenance', title: 'Maintain', desc: 'Health & longevity', icon: Heart, color: 'green' }
  ];
  return (
    <div className="space-y-8">
      <div className="text-center"><h2 className="font-serif text-4xl text-stone-900">Primary Objective</h2><p className="text-stone-500">We'll tailor your macros to this target.</p></div>
      <div className="grid gap-4">
        {goals.map((g) => (
          <button key={g.id} onClick={() => setFormData({...formData, goal: g.id})} className={`option-card p-6 rounded-3xl flex items-center gap-6 text-left border-2 ${formData.goal === g.id ? `selected ${g.color}` : 'border-transparent glass-card'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${formData.goal === g.id ? 'bg-stone-900 text-white' : 'bg-white text-stone-400'}`}><g.icon size={24} /></div>
            <div><span className="font-serif text-xl text-stone-900 block mb-1">{g.title}</span><span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{g.desc}</span></div>
          </button>
        ))}
      </div>
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const TargetWeightView = ({ onNext, onPrev, formData, setFormData, getDisplay }) => {
  if (formData.goal === 'maintenance') {
    return (
      <div className="text-center space-y-8 pt-10">
         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Heart size={40} /></div>
         <h2 className="font-serif text-4xl text-stone-900">Great Choice</h2>
         <p className="text-stone-600 text-lg max-w-xs mx-auto">Maintenance is the key to long-term health. We will set your calories to support your current body mass.</p>
         <NavigationButtons onNext={onNext} onPrev={onPrev} />
      </div>
    )
  }
  const display = getDisplay(formData.targetWeight);
  const handleChange = (e) => { let val = parseInt(e.target.value); if (formData.units === 'metric') setFormData({...formData, targetWeight: val}); else setFormData({...formData, targetWeight: val / 2.20462}); };
  const rangeProps = formData.units === 'metric' ? { min: 40, max: 180, val: Math.round(formData.targetWeight) } : { min: 90, max: 400, val: Math.round(formData.targetWeight * 2.20462) };

  return (
    <div className="space-y-12 text-center">
      <div className="space-y-2"><h2 className="font-serif text-4xl text-stone-900">Target Weight</h2><p className="text-stone-500">Where do you want to be?</p></div>
      <div className="space-y-8">
         <div className="inline-block border-b-2 border-stone-200 px-8 py-2"><span className="font-serif text-6xl text-stone-900">{display.val}</span><span className="text-stone-400 font-bold uppercase text-sm tracking-widest ml-2">{display.unit}</span></div>
         <div className="w-full max-w-xs mx-auto"><input type="range" min={rangeProps.min} max={rangeProps.max} value={rangeProps.val} onChange={handleChange} className="w-full" /></div>
      </div>
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const EducationScaleView = ({ onNext, onPrev }) => (
  <div className="text-center space-y-8 pt-4">
    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-blue-100"><Scale size={40} strokeWidth={1.5} /></div>
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-stone-900">A Note on Gravity</h2>
      <div className="glass-card p-8 rounded-[2rem] text-left space-y-6">
        <div><h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Activity size={16} className="text-blue-500"/>Weight fluctuates daily.</h4><p className="text-stone-600 text-sm leading-relaxed">Water, salt, and hormones can shift the scale by 1-3 kg daily. This is normal noise, not fat gain.</p></div>
        <div className="h-px bg-stone-200 w-full"></div>
        <div><h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><ChevronRight size={16} className="text-blue-500"/>Focus on the Trend.</h4><p className="text-stone-600 text-sm leading-relaxed">Simplifit uses a <span className="font-bold">Moving Average</span>. We ignore the daily spikes and focus on the weekly direction.</p></div>
      </div>
    </div>
    <NavigationButtons onNext={onNext} onPrev={onPrev} />
  </div>
);

const TimelineView = ({ onNext, onPrev, formData }) => {
  const getTimeline = () => {
    const diff = Math.abs(formData.weight - formData.targetWeight);
    const ratePerWeek = formData.weight * 0.0075; 
    const weeks = Math.ceil(diff / ratePerWeek);
    const date = new Date();
    date.setDate(date.getDate() + (weeks * 7));
    return { weeks, dateStr: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), isMaintenance: formData.goal === 'maintenance' };
  };
  const timeline = getTimeline();
  if (timeline.isMaintenance) { onNext(); return null; }

  return (
    <div className="text-center space-y-8 pt-4">
      <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-100"><Calendar size={40} strokeWidth={1.5} /></div>
      <div className="space-y-6">
        <span className="text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase bg-emerald-100 px-4 py-1.5 rounded-full">Your Trajectory</span>
        <h2 className="font-serif text-3xl text-stone-900">Realistic Expectations</h2>
        <div className="glass-card p-8 rounded-[2rem] space-y-4 border-l-4 border-emerald-400">
           <p className="text-stone-500 font-medium text-sm uppercase tracking-wider">Estimated Arrival</p>
           <h3 className="font-serif text-5xl text-stone-900">{timeline.dateStr}</h3>
           <p className="text-stone-600 text-sm leading-relaxed pt-2">Based on a safe, sustainable pace. No crash diets. Just consistency.</p>
        </div>
      </div>
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

const MythView = ({ onNext }) => {
  const [answered, setAnswered] = useState(false);
  return (
    <div className="text-center space-y-8 pt-4">
      <div className="space-y-2"><span className="text-xs font-bold tracking-[0.2em] text-orange-800 uppercase bg-orange-100 px-4 py-1.5 rounded-full">Final Calibration</span><h2 className="font-serif text-3xl text-stone-900">The "Magic Pill" Test</h2></div>
      {!answered ? (
        <div className="glass-card p-8 rounded-[2rem] space-y-8">
           <p className="font-serif text-2xl italic text-stone-700 leading-relaxed">"Is there a specific food that melts belly fat?"</p>
           <div className="flex gap-4">
             <button onClick={() => setAnswered(true)} className="flex-1 py-4 border-2 border-stone-200 rounded-2xl hover:bg-stone-50 font-bold uppercase text-xs tracking-widest transition-colors">Yes</button>
             <button onClick={() => setAnswered(true)} className="flex-1 py-4 border-2 border-stone-200 rounded-2xl hover:bg-stone-50 font-bold uppercase text-xs tracking-widest transition-colors">No</button>
           </div>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-500 space-y-8">
           <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-sm"><Check size={32} /></div>
           <p className="text-stone-700 text-lg max-w-xs mx-auto leading-relaxed">Exactly. <span className="font-bold">No food burns fat.</span> Only a caloric deficit does. You're ready.</p>
           <button onClick={onNext} className="btn-hover-effect bg-stone-900 text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-colors">Reveal My Protocol</button>
        </div>
      )}
    </div>
  );
};

const BlueprintView = ({ formData, onRestart }) => {
  const getTimeline = () => {
      if (formData.goal === 'maintenance') return "Maintenance Mode";
      const diff = Math.abs(formData.weight - formData.targetWeight);
      const weeks = Math.ceil(diff / (formData.weight * 0.0075));
      const date = new Date();
      date.setDate(date.getDate() + (weeks * 7));
      return `Target: ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  const calculateMacros = () => {
    let bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * (formData.age || 30));
    bmr += formData.sex === 'male' ? 5 : -161;
    let tdee = bmr * formData.activity;
    let targetCals = tdee;
    let protein = formData.weight * 2.0; 
    if (formData.goal === 'weight_loss') targetCals -= 500;
    else if (formData.goal === 'muscle_gain') targetCals += 250;
    return { cals: Math.round(targetCals), pro: Math.round(protein), timeline: getTimeline() };
  };

  const plan = calculateMacros();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rainbow-glass p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-600 w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase">Personalized Protocol</span>
            </div>
            <h2 className="font-serif text-4xl text-stone-900">The Science-Backed Plan</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-serif text-xl italic text-stone-500">{plan.timeline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="p-8 rounded-3xl bg-white/60 border border-white shadow-sm backdrop-blur-sm">
             <p className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-4">Daily Energy</p>
             <div className="flex items-baseline gap-1">
                <span className="font-serif text-6xl text-stone-900">{plan.cals}</span>
                <span className="font-body text-stone-600 font-medium">kcal</span>
             </div>
          </div>
          <div className="p-8 rounded-3xl bg-white/60 border border-white shadow-sm backdrop-blur-sm">
             <p className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-4">Daily Protein</p>
             <div className="flex items-baseline gap-1">
                <span className="font-serif text-6xl text-stone-900">{plan.pro}</span>
                <span className="font-body text-stone-600 font-medium">grams</span>
             </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200/50 flex justify-between items-center relative z-10">
           <div className="flex items-center gap-2 text-stone-400"><Calculator size={14} /><span className="text-[10px] uppercase tracking-widest font-bold">Calculated via Mifflin-St Jeor</span></div>
           <button onClick={onRestart} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-sm uppercase tracking-widest font-bold"><RefreshCw size={14} /> Recalibrate</button>
        </div>
      </div>
    </div>
  );
};

export default App;