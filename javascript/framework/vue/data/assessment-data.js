// AWARENESS ASSESSMENT DATA
// ========================
// This file contains 20 questions for the Awareness Assessment.
// 10 questions are randomly selected per attempt from this 20-question pool.
//
// Topics covered: phishing, spear phishing, vishing, smishing, pretexting,
// quishing (QR phishing), safe practices
//
// Contract (per backend-node/routes/assessments.js):
// - 20-question pool, 10 questions per attempt
// - Scored client-side
// - Submit payload: { score, total, level, level_key, by_topic, weak_areas }
// - Levels: Beginner, Intermediate, Advanced

export default {
  moduleName: 'Cybersecurity Awareness Assessment',
  moduleId: 'assessment',
  totalQuestions: 20,
  questionsPerAttempt: 10,
  standardCount: 10,
  scenarioBasedCount: 10,
  questions: [
    // PHISHING (3 questions)
    {
      id: 'assessment-1',
      questionText: 'You receive an email from your bank asking you to verify your account by clicking a link. What should you do?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link immediately to verify' },
        { value: 'b', text: 'Delete the email and contact the bank directly' },
        { value: 'c', text: 'Reply with your account details' },
        { value: 'd', text: 'Forward to colleagues for verification' }
      ],
      correctAnswer: 'b',
      explanation: 'Never click links in unsolicited emails. Contact the bank through official channels.'
    },
    {
      id: 'assessment-2',
      questionText: 'Which of these is a common sign of a phishing email?',
      questionType: 'standard',
      answerType: 'multiple',
      options: [
        { value: 'a', text: 'Urgent language threatening consequences' },
        { value: 'b', text: 'Generic greetings like "Dear Customer"' },
        { value: 'c', text: 'Mismatched sender domain' },
        { value: 'd', text: 'All of the above' }
      ],
      correctAnswer: ['a', 'b', 'c', 'd'],
      explanation: 'Phishing emails often use urgency, generic greetings, and suspicious sender addresses.'
    },
    {
      id: 'assessment-16',
      questionText: 'An email claims your account will be locked unless you act within 15 minutes. What is this technique called?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Social engineering urgency' },
        { value: 'b', text: 'Standard security procedure' },
        { value: 'c', text: 'Account maintenance notification' },
        { value: 'd', text: 'Automated system alert' }
      ],
      correctAnswer: 'a',
      explanation: 'Creating artificial urgency is a common social engineering tactic to bypass critical thinking.'
    },

    // SPEAR PHISHING (3 questions)
    {
      id: 'assessment-3',
      questionText: 'How does spear phishing differ from regular phishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'It targets specific individuals or organizations' },
        { value: 'b', text: 'It uses QR codes instead of links' },
        { value: 'c', text: 'It only targets mobile devices' },
        { value: 'd', text: 'It is always sent via SMS' }
      ],
      correctAnswer: 'a',
      explanation: 'Spear phishing is highly targeted, using personal information to appear legitimate.'
    },
    {
      id: 'assessment-4',
      questionText: 'A colleague sends you an urgent request to transfer funds to a new account. What should you verify first?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Transfer immediately to avoid delay' },
        { value: 'b', text: 'Reply asking for more details' },
        { value: 'c', text: 'Verify through a separate communication channel' },
        { value: 'd', text: 'Check if the email signature looks official' }
      ],
      correctAnswer: 'c',
      explanation: 'Always verify urgent requests through a different channel (phone call, in-person) before taking action.'
    },
    {
      id: 'assessment-17',
      questionText: 'You receive an email from your CEO asking for sensitive company data, addressed to you by name. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Send the data immediately since the CEO requested it' },
        { value: 'b', text: 'Reply to confirm the request' },
        { value: 'c', text: 'Verify the request through a known, trusted channel' },
        { value: 'd', text: 'Forward to your supervisor' }
      ],
      correctAnswer: 'c',
      explanation: 'Spear phishing often impersonates executives. Always verify through a separate channel.'
    },

    // VISHING (3 questions)
    {
      id: 'assessment-5',
      questionText: 'What is vishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via video calls' },
        { value: 'b', text: 'Phishing via voice calls' },
        { value: 'c', text: 'Phishing via SMS' },
        { value: 'd', text: 'Phishing via QR codes' }
      ],
      correctAnswer: 'b',
      explanation: 'Vishing uses phone calls to deceive victims into revealing sensitive information.'
    },
    {
      id: 'assessment-6',
      questionText: 'You receive a call from "tech support" claiming your computer is infected. They ask for remote access. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Grant access immediately' },
        { value: 'b', text: 'Ask for their employee ID' },
        { value: 'c', text: 'Hang up and contact official tech support' },
        { value: 'd', text: 'Ask them to call back later' }
      ],
      correctAnswer: 'c',
      explanation: 'Legitimate tech support never makes unsolicited calls asking for remote access.'
    },
    {
      id: 'assessment-18',
      questionText: 'A caller claims to be from the IRS and demands immediate payment via gift cards. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Pay immediately to avoid legal trouble' },
        { value: 'b', text: 'Ask for their badge number' },
        { value: 'c', text: 'Hang up and contact the IRS directly' },
        { value: 'd', text: 'Negotiate a payment plan' }
      ],
      correctAnswer: 'c',
      explanation: 'Government agencies never demand payment via gift cards. This is a classic vishing scam.'
    },

    // SMISHING (3 questions)
    {
      id: 'assessment-7',
      questionText: 'What is smishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via social media' },
        { value: 'b', text: 'Phishing via SMS/text messages' },
        { value: 'c', text: 'Phishing via email' },
        { value: 'd', text: 'Phishing via voice calls' }
      ],
      correctAnswer: 'b',
      explanation: 'Smishing uses text messages to trick victims into clicking malicious links or sharing information.'
    },
    {
      id: 'assessment-8',
      questionText: 'You receive a text message claiming you won a prize and need to click a link to claim it. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link to claim the prize' },
        { value: 'b', text: 'Reply with your personal details' },
        { value: 'c', text: 'Delete the message without clicking' },
        { value: 'd', text: 'Forward to friends' }
      ],
      correctAnswer: 'c',
      explanation: 'Unsolicited prize claims via text are almost always smishing scams.'
    },
    {
      id: 'assessment-19',
      questionText: 'You receive a text from your bank asking you to verify a transaction by clicking a link. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link to verify immediately' },
        { value: 'b', text: 'Reply with your account number' },
        { value: 'c', text: 'Contact the bank using the official number' },
        { value: 'd', text: 'Ignore the message' }
      ],
      correctAnswer: 'c',
      explanation: 'Banks never ask you to click links in text messages. Always use official contact methods.'
    },

    // PRETEXTING (3 questions)
    {
      id: 'assessment-9',
      questionText: 'What is pretexting?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Creating a fake scenario to obtain information' },
        { value: 'b', text: 'Sending fake emails' },
        { value: 'c', text: 'Hacking into systems' },
        { value: 'd', text: 'Installing malware' }
      ],
      correctAnswer: 'a',
      explanation: 'Pretexting involves inventing a fabricated scenario to manipulate victims into revealing information.'
    },
    {
      id: 'assessment-10',
      questionText: 'Someone claiming to be from IT asks for your password to "fix your account." What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Provide the password' },
        { value: 'b', text: 'Ask for their employee ID first' },
        { value: 'c', text: 'Refuse and report through official channels' },
        { value: 'd', text: 'Give a temporary password' }
      ],
      correctAnswer: 'c',
      explanation: 'Legitimate IT staff never ask for passwords. Report this immediately.'
    },
    {
      id: 'assessment-20',
      questionText: 'A delivery person asks for your name and birth date to verify a package. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Provide the information to receive the package' },
        { value: 'b', text: 'Ask for their company ID' },
        { value: 'c', text: 'Refuse and verify through official delivery channels' },
        { value: 'd', text: 'Give only your name' }
      ],
      correctAnswer: 'c',
      explanation: 'Legitimate delivery services do not need personal information like birth dates to verify packages.'
    },

    // QUISHING (2 questions)
    {
      id: 'assessment-11',
      questionText: 'What is quishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing via QR codes' },
        { value: 'b', text: 'Phishing via quizzes' },
        { value: 'c', text: 'Phishing via quick links' },
        { value: 'd', text: 'Phishing via quotes' }
      ],
      correctAnswer: 'a',
      explanation: 'Quishing uses QR codes to direct victims to malicious websites or download malware.'
    },
    {
      id: 'assessment-12',
      questionText: 'You see a QR code on a flyer promising a free gift. What should you do before scanning?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Scan immediately' },
        { value: 'b', text: 'Check if the URL looks legitimate after scanning' },
        { value: 'c', text: 'Verify the source and use a QR code scanner with security features' },
        { value: 'd', text: 'Ask friends to scan first' }
      ],
      correctAnswer: 'c',
      explanation: 'Always verify the source of QR codes and use security-aware scanners.'
    },

    // SAFE PRACTICES (3 questions)
    {
      id: 'assessment-13',
      questionText: 'Which password practice is most secure?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Use the same password for all accounts' },
        { value: 'b', text: 'Use a password manager with unique passwords' },
        { value: 'c', text: 'Use simple passwords to remember them easily' },
        { value: 'd', text: 'Share passwords with trusted colleagues' }
      ],
      correctAnswer: 'b',
      explanation: 'Password managers generate and store unique, complex passwords for each account.'
    },
    {
      id: 'assessment-14',
      questionText: 'What is two-factor authentication (2FA)?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Using two different passwords' },
        { value: 'b', text: 'Requiring two forms of verification to access an account' },
        { value: 'c', text: 'Logging in from two different devices' },
        { value: 'd', text: 'Having two email accounts' }
      ],
      correctAnswer: 'b',
      explanation: '2FA requires something you know (password) and something you have (code, device).'
    },
    {
      id: 'assessment-15',
      questionText: 'You receive a file attachment from an unknown sender. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Open it to see what it is' },
        { value: 'b', text: 'Scan it with antivirus first' },
        { value: 'c', text: 'Delete it without opening' },
        { value: 'd', text: 'Forward to security team' }
      ],
      correctAnswer: 'c',
      explanation: 'Never open attachments from unknown senders. Delete immediately.'
    }
  ]
}
