import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Users, Check } from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { SafetyMode } from '../types';
import { Button } from '../components/UI';
import { Logo } from '../components/Logo';

export const OnboardingPage: React.FC = () => {
  const { mode: currentMode, completeOnboarding } = useSafetyMode();
  const [selected, setSelected] = useState<SafetyMode>(currentMode);
  const navigate = useNavigate();

  const handleFinish = () => {
    completeOnboarding(selected);
    navigate('/dashboard');
  };

  const modes: {
    id: SafetyMode;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    features: string[];
    badge?: string;
  }[] = [
    {
      id: 'everyday',
      title: 'Everyday Safety',
      subtitle: 'For general commuting, public spaces, and standard personal security awareness.',
      icon: <User className="w-6 h-6 text-[#00E5BE]" />,
      features: [
        'Balanced local hazard alerts (streetlights, stray dogs, road closures)',
        'Trip check-in timers & transit logging',
        'Phishing & financial scam message analyzer',
        'Standard digital hygiene checklist',
      ],
    },
    {
      id: 'womens',
      title: "Women's Safety",
      subtitle: 'Prioritized guidance for well-lit routes, harassment defense, and rapid emergency check-ins.',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      features: [
        'Highlighted dark street & isolated transit hazard warnings',
        'Harassment defender tuned for blackmail & coercive language',
        'Quick ride verification logging (cab license, driver name)',
        'Speedy emergency contact check-in protocols',
      ],
      badge: 'POPULAR',
    },
    {
      id: 'child-teen',
      title: 'Child & Teen Safety',
      subtitle: 'Age-appropriate digital safety education, stranger contact alerts, and guardian workflows.',
      icon: <Users className="w-6 h-6 text-teal-400" />,
      features: [
        'Conservative privacy guidelines & anti-oversharing checklist',
        'Protection alerts against online grooming & peer pressure',
        'Educational safety explanations in plain language',
        'Safe-arrival check-ins with trusted family members',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#00E5BE] selection:text-[#070a12]">
      {/* Top Logo Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        <div className="flex justify-center mb-5">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Choose Your Safety Profile
        </h1>
        <p className="mt-3 text-stone-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          ShieldSafe tailors recommendations, dashboard shortcuts, and checklist items to your immediate needs. You can change this anytime.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl px-4 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {modes.map((m) => {
            const isSelected = selected === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`relative rounded-2xl p-6 cursor-pointer border-2 transition-all ${
                  isSelected
                    ? 'border-[#00E5BE] bg-[#0d1728] shadow-lg shadow-teal-950/60 ring-2 ring-[#00E5BE]/20'
                    : 'border-stone-800 bg-[#0d1424] hover:border-stone-700 hover:bg-[#10192e]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-[#132034] border border-stone-700/80 shrink-0">
                      {m.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-white text-base sm:text-lg">{m.title}</h3>
                        {m.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">{m.subtitle}</p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-[#00E5BE] bg-[#00E5BE] text-[#070a12]' : 'border-stone-600 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-200">
                  {m.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1424] p-6 rounded-2xl border border-stone-800 shadow-md">
          <div className="text-xs sm:text-sm text-stone-300">
            Selected Profile: <span className="font-bold text-[#00E5BE]">{modes.find(m => m.id === selected)?.title}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto text-xs"
            >
              Skip for now
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={handleFinish}
              className="w-full sm:w-auto px-8 text-xs font-bold shadow-md shadow-teal-500/20"
            >
              Confirm & Open Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
