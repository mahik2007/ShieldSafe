import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, User, Users, Check } from 'lucide-react';
import { useSafetyMode } from '../hooks/useSafetyMode';
import { SafetyMode } from '../types';
import { Button } from '../components/UI';

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
    iconBg: string;
    features: string[];
    badge?: string;
  }[] = [
    {
      id: 'everyday',
      title: 'Everyday Safety',
      subtitle: 'For general commuting, public spaces, and standard personal security awareness.',
      icon: <User className="w-6 h-6 text-teal-700" />,
      iconBg: 'bg-teal-50 border-teal-100',
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
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      features: [
        'Highlighted dark street & isolated transit hazard warnings',
        'Harassment defender tuned for blackmail & coercive language',
        'Quick ride verification logging (cab license, driver name)',
        'Speedy emergency contact check-in protocols',
      ],
      badge: 'Popular',
    },
    {
      id: 'child-teen',
      title: 'Child & Teen Safety',
      subtitle: 'Age-appropriate digital safety education, stranger contact alerts, and guardian workflows.',
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      features: [
        'Conservative privacy guidelines & anti-oversharing checklist',
        'Protection alerts against online grooming & peer pressure',
        'Educational safety explanations in plain language',
        'Safe-arrival check-ins with trusted family members',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-800 to-teal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-900/20 mb-5">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Choose Your Safety Profile
        </h1>
        <p className="mt-2 text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
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
                className={`relative rounded-2xl p-6 cursor-pointer border-2 transition-all ring-1 ${
                  isSelected
                    ? 'border-teal-600 bg-white shadow-brand ring-teal-600/10'
                    : 'border-stone-200 bg-white hover:border-stone-300 ring-black/5 hover:shadow-card'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl border ${m.iconBg}`}>
                      {m.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900 text-base">{m.title}</h3>
                        {m.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{m.subtitle}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  {m.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-card ring-1 ring-black/5">
          <div className="text-xs text-stone-500">
            Selected: <span className="font-semibold text-stone-800">{modes.find(m => m.id === selected)?.title}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Skip for now
            </Button>
            <Button
              size="md"
              onClick={handleFinish}
              className="w-full sm:w-auto px-8"
            >
              Confirm & Open Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

