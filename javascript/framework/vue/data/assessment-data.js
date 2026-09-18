// AWARENESS ASSESSMENT DATA
// ========================
// PLACEHOLDER CONTENT - NOT FINAL
// This file contains 15 placeholder questions for the Awareness Assessment.
// These are clearly marked as placeholders and should be replaced with
// researched, scenario-based questions before production use.
//
// Topics covered: phishing, spear phishing, vishing, smishing, pretexting,
// quishing (QR phishing), safe practices
//
// Contract (per backend-node/routes/assessments.js):
// - Fixed 15-question bank
// - Scored client-side
// - Submit payload: { score, total, level, level_key, by_topic, weak_areas }
// - Levels: Beginner, Intermediate, Advanced

export default {
  moduleName: 'Cybersecurity Awareness Assessment',
  moduleId: 'assessment',
  totalQuestions: 15,
  standardCount: 8,
  scenarioBasedCount: 7,
  questions: [
    // PHISHING (2 questions)
    {
      id: 'assessment-1',
      questionText: '[PLACEHOLDER] You receive an email from your bank asking you to verify your account by clicking a link. What should you do?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link immediately to verify' },
        { value: 'b', text: 'Delete the email and contact the bank directly' },
        { value: 'c', text: 'Reply with your account details' },
        { value: 'd', text: 'Forward to colleagues for verification' }
      ],
      correctAnswer: 'b',
      explanation: '[PLACEHOLDER EXPLANATION] Never click links in unsolicited emails. Contact the bank through official channels.'
    },
    {
      id: 'assessment-2',
      questionText: '[PLACEHOLDER] Which of these is a common sign of a phishing email?',
      questionType: 'standard',
      answerType: 'multiple',
      options: [
        { value: 'a', text: 'Urgent language threatening consequences' },
        { value: 'b', text: 'Generic greetings like "Dear Customer"' },
        { value: 'c', text: 'Mismatched sender domain' },
        { value: 'd', text: 'All of the above' }
      ],
      correctAnswer: ['a', 'b', 'c', 'd'],
      explanation: '[PLACEHOLDER EXPLANATION] Phishing emails often use urgency, generic greetings, and suspicious sender addresses.'
    },

    // SPEAR PHISHING (2 questions)
    {
      id: 'assessment-3',
      questionText: '[PLACEHOLDER] How does spear phishing differ from regular phishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'It targets specific individuals or organizations' },
        { value: 'b', text: 'It uses QR codes instead of links' },
        { value: 'c', text: 'It only targets mobile devices' },
        { value: 'd', text: 'It is always sent via SMS' }
      ],
      correctAnswer: 'a',
      explanation: '[PLACEHOLDER EXPLANATION] Spear phishing is highly targeted, using personal information to appear legitimate.'
    },
    {
      id: 'assessment-4',
      questionText: '[PLACEHOLDER] A colleague sends you an urgent request to transfer funds to a new account. What should you verify first?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Transfer immediately to avoid delay' },
        { value: 'b', text: 'Reply asking for more details' },
        { value: 'c', text: 'Verify through a separate communication channel' },
        { value: 'd', text: 'Check if the email signature looks official' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Always verify urgent requests through a different channel (phone call, in-person) before taking action.'
    },

    // VISHING (2 questions)
    {
      id: 'assessment-5',
      questionText: '[PLACEHOLDER] What is vishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via video calls' },
        { value: 'b', text: 'Phishing via voice calls' },
        { value: 'c', text: 'Phishing via SMS' },
        { value: 'd', text: 'Phishing via QR codes' }
      ],
      correctAnswer: 'b',
      explanation: '[PLACEHOLDER EXPLANATION] Vishing uses phone calls to deceive victims into revealing sensitive information.'
    },
    {
      id: 'assessment-6',
      questionText: '[PLACEHOLDER] You receive a call from "tech support" claiming your computer is infected. They ask for remote access. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Grant access immediately' },
        { value: 'b', text: 'Ask for their employee ID' },
        { value: 'c', text: 'Hang up and contact official tech support' },
        { value: 'd', text: 'Ask them to call back later' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Legitimate tech support never makes unsolicited calls asking for remote access.'
    },

    // SMISHING (2 questions)
    {
      id: 'assessment-7',
      questionText: '[PLACEHOLDER] What is smishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via social media' },
        { value: 'b', text: 'Phishing via SMS/text messages' },
        { value: 'c', text: 'Phishing via email' },
        { value: 'd', text: 'Phishing via voice calls' }
      ],
      correctAnswer: 'b',
      explanation: '[PLACEHOLDER EXPLANATION] Smishing uses text messages to trick victims into clicking malicious links or sharing information.'
    },
    {
      id: 'assessment-8',
      questionText: '[PLACEHOLDER] You receive a text message claiming you won a prize and need to click a link to claim it. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link to claim the prize' },
        { value: 'b', text: 'Reply with your personal details' },
        { value: 'c', text: 'Delete the message without clicking' },
        { value: 'd', text: 'Forward to friends' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Unsolicited prize claims via text are almost always smishing scams.'
    },

    // PRETEXTING (2 questions)
    {
      id: 'assessment-9',
      questionText: '[PLACEHOLDER] What is pretexting?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Creating a fake scenario to obtain information' },
        { value: 'b', text: 'Sending fake emails' },
        { value: 'c', text: 'Hacking into systems' },
        { value: 'd', text: 'Installing malware' }
      ],
      correctAnswer: 'a',
      explanation: '[PLACEHOLDER EXPLANATION] Pretexting involves inventing a fabricated scenario to manipulate victims into revealing information.'
    },
    {
      id: 'assessment-10',
      questionText: '[PLACEHOLDER] Someone claiming to be from IT asks for your password to "fix your account." What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Provide the password' },
        { value: 'b', text: 'Ask for their employee ID first' },
        { value: 'c', text: 'Refuse and report through official channels' },
        { value: 'd', text: 'Give a temporary password' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Legitimate IT staff never ask for passwords. Report this immediately.'
    },

    // QUISHING (2 questions)
    {
      id: 'assessment-11',
      questionText: '[PLACEHOLDER] What is quishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via QR codes' },
        { value: 'b', text: 'Phishing via quizzes' },
        { value: 'c', text: 'Phishing via quick links' },
        { value: 'd', text: 'Phishing via quotes' }
      ],
      correctAnswer: 'a',
      explanation: '[PLACEHOLDER EXPLANATION] Quishing uses QR codes to direct victims to malicious websites or download malware.'
    },
    {
      id: 'assessment-12',
      questionText: '[PLACEHOLDER] You see a QR code on a flyer promising a free gift. What should you do before scanning?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Scan immediately' },
        { value: 'b', text: 'Check if the URL looks legitimate after scanning' },
        { value: 'c', text: 'Verify the source and use a QR code scanner with security features' },
        { value: 'd', text: 'Ask friends to scan first' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Always verify the source of QR codes and use security-aware scanners.'
    },

    // SAFE PRACTICES (3 questions)
    {
      id: 'assessment-13',
      questionText: '[PLACEHOLDER] Which password practice is most secure?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Use the same password for all accounts' },
        { value: 'b', text: 'Use a password manager with unique passwords' },
        { value: 'c', text: 'Use simple passwords to remember them easily' },
        { value: 'd', text: 'Share passwords with trusted colleagues' }
      ],
      correctAnswer: 'b',
      explanation: '[PLACEHOLDER EXPLANATION] Password managers generate and store unique, complex passwords for each account.'
    },
    {
      id: 'assessment-14',
      questionText: '[PLACEHOLDER] What is two-factor authentication (2FA)?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Using two different passwords' },
        { value: 'b', text: 'Requiring two forms of verification to access an account' },
        { value: 'c', text: 'Logging in from two different devices' },
        { value: 'd', text: 'Having two email accounts' }
      ],
      correctAnswer: 'b',
      explanation: '[PLACEHOLDER EXPLANATION] 2FA requires something you know (password) and something you have (code, device).'
    },
    {
      id: 'assessment-15',
      questionText: '[PLACEHOLDER] You receive a file attachment from an unknown sender. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Open it to see what it is' },
        { value: 'b', text: 'Scan it with antivirus first' },
        { value: 'c', text: 'Delete it without opening' },
        { value: 'd', text: 'Forward to security team' }
      ],
      correctAnswer: 'c',
      explanation: '[PLACEHOLDER EXPLANATION] Never open attachments from unknown senders. Delete immediately.'
    }
  ]
}
