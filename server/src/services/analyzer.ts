/**
 * Rules-Based Message Analyzer
 *
 * This is a deterministic, rule-based text analyzer. It is NOT an AI language model.
 * It searches for pattern signatures associated with harmful communication and
 * returns structured observations. It cannot determine sender intent, predict
 * criminality, or replace professional judgment.
 */

interface AnalysisFlag {
  type: string;
  label: string;
  excerpt: string;
  explanation: string;
}

interface AnalysisResult {
  severity: 'none' | 'context-needed' | 'concerning' | 'urgent';
  flags: AnalysisFlag[];
  summary: string;
  nextSteps: string[];
  disclaimer: string;
}

interface Rule {
  type: string;
  label: string;
  patterns: RegExp[];
  severity: 'urgent' | 'concerning' | 'context-needed';
  explanation: string;
  excerpt: (match: string) => string;
}

const RULES: Rule[] = [
  {
    type: 'direct-threat',
    label: 'Direct Threat Language',
    patterns: [
      /\b(i('ll| will)|you('re| are) going to|you will)\s+(regret|pay|suffer|hurt|die|be sorry|be punished)\b/i,
      /\b(kill|harm|hurt|destroy|ruin|end you)\b.{0,30}/i,
      /\b(watch your back|you('re| are) dead|i know where you (live|are|work))\b/i,
      /\byou('ll| will) (regret|pay for) (this|ignoring|ghosting)\b/i,
    ],
    severity: 'urgent',
    explanation: 'The message contains language that directly threatens harm, punishment, or violence towards the recipient.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'coercive-demand',
    label: 'Coercive or Threatening Demand',
    patterns: [
      /\b(send|give|transfer|share|do what i say|do it) (or|else|otherwise).{0,60}(regret|suffer|pay|expose|share|tell everyone|leak)/i,
      /\b(you better|you must|you have to).{0,60}(or else|otherwise|if you don't|if you refuse)/i,
      /\b(if you don't|unless you).{0,60}(i('ll| will)|you will|everyone will)\b/i,
    ],
    severity: 'urgent',
    explanation: 'The message appears to use "if you don\'t … then …" coercive framing to compel the recipient to act under threat.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'intimate-material-pressure',
    label: 'Pressure for Intimate Material',
    patterns: [
      /\b(send|share|give me).{0,30}(nudes?|naked|photos?|pics?|videos?|clips?)\b/i,
      /\b(intimate|private|explicit).{0,30}(photos?|images?|videos?|content)\b.{0,40}(send|share|give|forward)/i,
      /\b(what i have|those photos?|those videos?).{0,60}(share|leak|send|post|everyone)\b/i,
    ],
    severity: 'urgent',
    explanation: 'The message appears to request or threaten to distribute intimate or private imagery, which can constitute a criminal offence in many jurisdictions.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'repeated-unwanted-contact',
    label: 'Repeated Unwanted Contact Indicators',
    patterns: [
      /\b(i('ve| have) sent|i('ve| have) called|i('ve| have) messaged|i texted).{0,30}(times?|again|again and again|multiple)\b/i,
      /\b(why (aren't|are you not|won't|don't) you respond(ing)?|you're ignoring me|stop ignoring|answer me)\b/i,
      /\b(i will (keep|continue) (messaging|calling|texting|contacting))\b/i,
    ],
    severity: 'concerning',
    explanation: 'The message contains language suggesting persistent or unwanted contact, which is a pattern associated with stalking and harassment.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'credential-phishing',
    label: 'Credential or Verification Request',
    patterns: [
      /\b(verify|confirm|enter|provide|share|send).{0,30}(password|passcode|otp|pin|one.?time|verification code|auth code|2fa code)\b/i,
      /\b(click (here|this link|the link below)|follow this link).{0,60}(verify|confirm|secure|update|access your account)\b/i,
      /\b(your account (has been|is|will be) (suspended|locked|disabled|compromised|hacked))\b/i,
    ],
    severity: 'urgent',
    explanation: 'The message contains language commonly used in phishing attacks: requesting verification codes, passwords, or directing the recipient to click a link to "secure" their account.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'impersonation',
    label: 'Potential Impersonation',
    patterns: [
      /\b(i('m| am) (from|calling from|contacting from).{0,30}(microsoft|google|apple|amazon|bank|government|police|interpol|nbi|irs|hmrc|income tax))\b/i,
      /\b(this is an? (official|automated|urgent|important) (message|notice|alert|warning) from)\b/i,
      /\b(we have detected|we noticed|suspicious activity on your account)\b/i,
    ],
    severity: 'concerning',
    explanation: 'The message claims to be from a major institution or authority. Unsolicited messages claiming official status are a common social engineering tactic.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'financial-pressure',
    label: 'Financial Pressure or Scam Indicators',
    patterns: [
      /\b(send|transfer|pay|wire|deposit).{0,30}(money|cash|rupees?|dollars?|pounds?|usd|inr|gbp|eur|bitcoin|crypto|btc|eth)\b/i,
      /\b(you('ve| have) won|congratulations.{0,30}(prize|winner|reward|gift|lottery))\b/i,
      /\b(advance fee|processing fee|release fee|transfer fee).{0,60}(send|pay|transfer)\b/i,
    ],
    severity: 'concerning',
    explanation: 'The message contains language associated with financial scams: requests for money transfers, advance fees, or unexpected prize notifications.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'location-surveillance',
    label: 'Surveillance or Location Monitoring Language',
    patterns: [
      /\b(i know where you (are|live|work|go|went)|i('ve| have) been watching|i saw you|i('ve| have) been following)\b/i,
      /\b(i('m| am) watching|i can see you|i('ve| have) been tracking)\b/i,
    ],
    severity: 'urgent',
    explanation: 'The message contains language suggesting the sender may be monitoring or tracking the recipient\'s movements, which can indicate stalking behaviour.',
    excerpt: (m) => m.trim(),
  },
  {
    type: 'isolation-tactic',
    label: 'Isolation or Control Language',
    patterns: [
      /\b(don't tell|don't talk to|keep this (secret|between us|private)|don't let anyone know)\b/i,
      /\b(stay away from|stop seeing|stop talking to).{0,30}(your (friends?|family|parents?|partner))\b/i,
      /\b(you only need me|i'm the only one who (cares?|loves? you|understands? you))\b/i,
    ],
    severity: 'concerning',
    explanation: 'The message contains language associated with coercive control: attempting to isolate the recipient from their support network or enforce secrecy.',
    excerpt: (m) => m.trim(),
  },
];

function findMatches(message: string, rule: Rule): string[] {
  const found: string[] = [];
  for (const pattern of rule.patterns) {
    const match = message.match(pattern);
    if (match && match[0]) {
      found.push(match[0]);
    }
  }
  return found;
}

function getSurroundingContext(message: string, matchStr: string, windowSize = 80): string {
  const idx = message.toLowerCase().indexOf(matchStr.toLowerCase());
  if (idx === -1) return matchStr;
  const start = Math.max(0, idx - 20);
  const end = Math.min(message.length, idx + matchStr.length + windowSize);
  let excerpt = message.slice(start, end);
  if (start > 0) excerpt = '…' + excerpt;
  if (end < message.length) excerpt = excerpt + '…';
  return excerpt;
}

export function analyzeMessage(message: string, _context?: string): AnalysisResult {
  const flags: AnalysisFlag[] = [];
  let highestSeverity: 'none' | 'context-needed' | 'concerning' | 'urgent' = 'none';

  const severityOrder: Record<string, number> = {
    none: 0,
    'context-needed': 1,
    concerning: 2,
    urgent: 3,
  };

  const seenTypes = new Set<string>();

  for (const rule of RULES) {
    const matches = findMatches(message, rule);
    if (matches.length > 0 && !seenTypes.has(rule.type)) {
      seenTypes.add(rule.type);
      const firstMatch = matches[0];
      const excerpt = getSurroundingContext(message, firstMatch);

      flags.push({
        type: rule.type,
        label: rule.label,
        excerpt,
        explanation: rule.explanation,
      });

      if (severityOrder[rule.severity] > severityOrder[highestSeverity]) {
        highestSeverity = rule.severity;
      }
    }
  }

  // If no flags found, check if message is ambiguous
  if (flags.length === 0) {
    // Simple ambiguity check
    const ambiguousPatterns = [
      /\b(meet|come over|let's talk|we need to talk)\b/i,
      /\b(i miss you|where are you|why (haven't|aren't) you)\b/i,
    ];
    for (const p of ambiguousPatterns) {
      if (p.test(message)) {
        highestSeverity = 'context-needed';
        break;
      }
    }
  }

  const summary = buildSummary(highestSeverity, flags.length);
  const nextSteps = buildNextSteps(highestSeverity, flags);

  return {
    severity: highestSeverity,
    flags,
    summary,
    nextSteps,
    disclaimer:
      'This analysis was produced by a rules-based pattern matcher. It is not an AI language model and cannot determine sender intent, verify facts, or predict behaviour. The analysis reflects text patterns only. If you are in immediate danger, contact emergency services. This tool is not a substitute for professional legal, psychological, or law-enforcement advice.',
  };
}

function buildSummary(severity: string, flagCount: number): string {
  switch (severity) {
    case 'urgent':
      return `${flagCount} urgent concern${flagCount !== 1 ? 's' : ''} detected. The message contains language associated with direct threats, coercion, or high-risk patterns. If you are in immediate danger, contact emergency services now.`;
    case 'concerning':
      return `${flagCount} concerning pattern${flagCount !== 1 ? 's' : ''} detected. The message contains language that may indicate harassment, manipulation, or a scam attempt. Review the flagged excerpts carefully.`;
    case 'context-needed':
      return 'The message contains language that may be ambiguous. The meaning could vary significantly depending on your relationship with the sender and previous conversations.';
    default:
      return 'No clear warning signs were detected in this message. The analyzer did not identify patterns associated with threats, coercion, phishing, or harassment. If something still concerns you, trust your instincts.';
  }
}

function buildNextSteps(severity: string, flags: AnalysisFlag[]): string[] {
  const steps: string[] = [];

  if (severity === 'urgent' || severity === 'concerning') {
    steps.push('Preserve a copy of this message, including any timestamps and sender information, before blocking or deleting.');
    steps.push('Do not respond to the sender — a response can escalate the situation or signal that the contact method is active.');
  }

  if (flags.some((f) => f.type === 'direct-threat' || f.type === 'location-surveillance')) {
    steps.push('If you feel you are in immediate physical danger, contact your local emergency services (police/ambulance).');
    steps.push('Consider reporting the sender to the platform and filing a formal complaint with the cybercrime authority in your area.');
  }

  if (flags.some((f) => f.type === 'credential-phishing' || f.type === 'financial-pressure' || f.type === 'impersonation')) {
    steps.push('Do not click any links, provide any codes, or transfer any money. Legitimate organisations do not request passwords or OTPs via chat.');
    steps.push('Contact the organisation directly using a verified number or website if you think the message might be genuine.');
  }

  if (flags.some((f) => f.type === 'intimate-material-pressure')) {
    steps.push('Do not send any requested images or content. Doing so may escalate rather than resolve the situation.');
    steps.push('Contact a support organisation such as a cybercrime helpline or digital rights group in your area.');
  }

  if (severity === 'context-needed') {
    steps.push('If the message is from someone you don\'t know, treat it with caution.');
    steps.push('Discuss the message with a trusted friend or family member for a second opinion.');
  }

  steps.push('Consider saving the analysis as an incident record using the "Save as Incident" button below.');

  return steps;
}

export const SAMPLE_MESSAGES = [
  {
    id: 'sample-1',
    label: 'Threatening message (urgent)',
    message: 'I know where you live and where you work. You will regret ignoring me. I\'ve been watching you and I\'ll make sure you pay for this.',
    context: 'Received from an unknown number after blocking them on Instagram.',
  },
  {
    id: 'sample-2',
    label: 'Phishing attempt (urgent)',
    message: 'ALERT: Your account has been compromised. Click here immediately to verify your identity and secure your account. Please provide your password and the OTP sent to your phone.',
    context: 'Message received via email, claiming to be from my bank.',
  },
  {
    id: 'sample-3',
    label: 'Coercion with intimate material (urgent)',
    message: 'Send me what I want or everyone will see those photos. You have 24 hours. Don\'t try to report me or it gets worse.',
    context: '',
  },
  {
    id: 'sample-4',
    label: 'Repeated unwanted contact (concerning)',
    message: 'Why aren\'t you responding? I\'ve called you 12 times. I\'ve sent messages again and again. You can\'t keep ignoring me. I will keep messaging until you answer.',
    context: 'Ex-partner who was asked not to make contact.',
  },
  {
    id: 'sample-5',
    label: 'Impersonation scam (concerning)',
    message: 'This is an official message from the Income Tax Department. We have detected suspicious activity on your file. Please transfer ₹5,000 as a processing fee to avoid arrest.',
    context: '',
  },
  {
    id: 'sample-6',
    label: 'Financial scam (concerning)',
    message: 'Congratulations! You have been selected as a prize winner. To claim your reward of ₹50,000, please pay an advance processing fee of ₹2,000 and provide your bank account details.',
    context: '',
  },
  {
    id: 'sample-7',
    label: 'Ambiguous message (context needed)',
    message: 'We need to talk. I know you\'ve been avoiding me. Just meet me somewhere and we can sort this out. I miss you.',
    context: 'From a former friend after a falling out.',
  },
  {
    id: 'sample-8',
    label: 'Benign message (no concerns)',
    message: 'Hi, I found your lost wallet near the coffee shop. It had your ID card in it so I could identify you. Let me know how you would like to collect it.',
    context: '',
  },
];
