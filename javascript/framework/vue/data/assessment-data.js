// AWARENESS ASSESSMENT DATA
// ========================
// 21 questions, three for each of the seven topics. Every attempt asks all
// 21, in a new order, with the answer options shuffled
// (lib/shuffleOptions.js).
//
// Bakit lahat na at hindi 10 lang na random (puna ng expert review):
//   - Dati 10 ang hinuhugot nang random sa 20, kaya may paksang isang
//     tanong lang ang lumalabas. Isang mali roon, "weak area" na agad.
//   - Ngayon tatlo bawat paksa, at weak area lang kapag isa o wala ang
//     tama sa tatlo (WEAK_AREA_MAX_CORRECT sa AwarenessAssessment.js).
//
// Topics: phishing, spear phishing, vishing, smishing, pretexting,
// quishing (QR phishing), safe practices
//
// Contract (per backend-node/routes/assessments.js):
// - Scored client-side
// - Submit payload: { score, total, level, level_key, by_topic, weak_areas }
// - Levels: Beginner, Intermediate, Advanced

export const ASSESSMENT_TOPICS = [
  'phishing', 'spear-phishing', 'vishing', 'smishing',
  'pretexting', 'quishing', 'safe-practices'
]

export default {
  moduleName: 'Cybersecurity Awareness Assessment',
  moduleId: 'assessment',
  totalQuestions: 21,
  questionsPerAttempt: 21,
  questionsPerTopic: 3,
  standardCount: 9,
  scenarioBasedCount: 12,
  questions: [
    // PHISHING (3 questions)
    {
      id: 'assessment-1',
      topic: 'phishing',
      questionText: 'You receive an email from your bank asking you to verify your account by clicking a link. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link immediately to verify' },
        { value: 'b', text: 'Do not use the link. Contact the bank through its official app, website or phone number' },
        { value: 'c', text: 'Reply with your account details' },
        { value: 'd', text: 'Forward it to colleagues so they can check it' }
      ],
      correctAnswer: 'b',
      explanation: 'Contact the bank through a channel you already trust. Clicking the link or replying hands your details to whoever sent the email, and forwarding it spreads the risk to your colleagues.'
    },
    {
      id: 'assessment-2',
      topic: 'phishing',
      // Puna ni Flores: tatlo ang tamang sagot pero hindi sinasabi ng tanong.
      questionText: 'Which of these are common signs of a phishing email? (Select ALL that apply)',
      questionType: 'standard',
      answerType: 'multiple',
      options: [
        { value: 'a', text: 'Urgent language threatening consequences' },
        { value: 'b', text: 'Generic greetings like "Dear Customer"' },
        { value: 'c', text: 'A sender domain that does not match the real company' },
        { value: 'd', text: 'A calendar invite you expected from a colleague, sent from their usual work account' }
      ],
      correctAnswer: ['a', 'b', 'c'],
      explanation: 'Urgency, generic greetings and a mismatched sender domain are all common phishing signs, so all three should be ticked. An expected invite from a colleague\'s usual work account is normal activity.'
    },
    {
      id: 'assessment-16',
      topic: 'phishing',
      questionText: 'An email claims your account will be locked unless you act within 15 minutes. What is this technique called?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Creating false urgency' },
        { value: 'b', text: 'A standard security procedure' },
        { value: 'c', text: 'An account maintenance notice' },
        { value: 'd', text: 'An automated system alert' }
      ],
      correctAnswer: 'a',
      explanation: 'A short deadline is meant to rush you past careful checking. Real security procedures, maintenance notices and system alerts do not threaten to lock you out within minutes unless you click.'
    },

    // SPEAR PHISHING (3 questions)
    {
      id: 'assessment-3',
      topic: 'spear-phishing',
      questionText: 'How does spear phishing differ from regular phishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'It targets specific people or organizations using researched details' },
        { value: 'b', text: 'It always uses QR codes instead of links' },
        { value: 'c', text: 'It only targets mobile devices' },
        { value: 'd', text: 'It is always sent by SMS' }
      ],
      correctAnswer: 'a',
      explanation: 'Spear phishing is aimed at a chosen person and uses details about them to look believable. It can arrive by email, text, chat or QR code, so it is not tied to one channel or device.'
    },
    {
      id: 'assessment-4',
      topic: 'spear-phishing',
      questionText: 'A colleague sends you an urgent request to transfer funds to a new account. What should you do first?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Transfer immediately to avoid delay' },
        { value: 'b', text: 'Reply to the same message asking for more details' },
        { value: 'c', text: 'Verify the request through a separate channel you already trust' },
        { value: 'd', text: 'Check if the email signature looks official' }
      ],
      correctAnswer: 'c',
      explanation: 'Call or message the colleague on a number or account you already have. Replying to the same message may reach the attacker, and a signature is easy to copy, so neither proves who sent it.'
    },
    {
      id: 'assessment-17',
      topic: 'spear-phishing',
      questionText: 'You receive an email from your CEO asking for sensitive company data, addressed to you by name. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Send the data immediately since the CEO requested it' },
        { value: 'b', text: 'Reply to the email to confirm the request' },
        { value: 'c', text: 'Verify the request through a known, trusted channel before sending anything' },
        { value: 'd', text: 'Forward the email with the data attached to your supervisor' }
      ],
      correctAnswer: 'c',
      explanation: 'Attackers often pretend to be executives and use your real name. Replying goes back to the sender, and forwarding the data still sends it out, so check through a channel you already trust first.'
    },

    // VISHING (3 questions)
    {
      id: 'assessment-5',
      topic: 'vishing',
      questionText: 'What is vishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing through video files' },
        { value: 'b', text: 'Phishing through voice calls' },
        { value: 'c', text: 'Phishing through SMS' },
        { value: 'd', text: 'Phishing through QR codes' }
      ],
      correctAnswer: 'b',
      explanation: 'Vishing means voice phishing, done through phone or voice calls. Phishing by SMS is called smishing, and phishing with QR codes is called quishing.'
    },
    {
      id: 'assessment-6',
      topic: 'vishing',
      questionText: 'You receive a call from "tech support" claiming your computer is infected. They ask for remote access. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Grant access immediately' },
        { value: 'b', text: 'Ask for their employee ID and continue if they give one' },
        { value: 'c', text: 'Hang up and contact your official IT support yourself' },
        { value: 'd', text: 'Ask them to call back later' }
      ],
      correctAnswer: 'c',
      explanation: 'Real tech support does not make surprise calls asking for remote access. An employee ID is easy to make up, and asking them to call back keeps the scam going, so end the call and contact IT yourself.'
    },
    {
      id: 'assessment-18',
      topic: 'vishing',
      questionText: 'A caller claims to be from a government tax office and demands immediate payment by gift cards. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Pay immediately to avoid legal trouble' },
        { value: 'b', text: 'Ask for their badge number and pay if it looks real' },
        { value: 'c', text: 'Hang up and contact the tax office through its official number' },
        { value: 'd', text: 'Negotiate a smaller payment plan' }
      ],
      correctAnswer: 'c',
      explanation: 'Government offices do not demand payment by gift card over the phone. A badge number can be invented, and negotiating still means paying the scammer, so hang up and call the office yourself.'
    },

    // SMISHING (3 questions)
    {
      id: 'assessment-7',
      topic: 'smishing',
      questionText: 'What is smishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing through social media posts' },
        { value: 'b', text: 'Phishing through SMS or text messages' },
        { value: 'c', text: 'Phishing through email' },
        { value: 'd', text: 'Phishing through voice calls' }
      ],
      correctAnswer: 'b',
      explanation: 'Smishing is phishing by SMS or text message. Email phishing is just called phishing, and phishing by voice call is called vishing.'
    },
    {
      id: 'assessment-8',
      topic: 'smishing',
      questionText: 'You receive a text message claiming you won a prize and need to click a link to claim it. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link to claim the prize' },
        { value: 'b', text: 'Reply with your personal details' },
        { value: 'c', text: 'Do not click. Delete the message, or report it to your network\'s spam channel' },
        { value: 'd', text: 'Forward it to friends so they can try too' }
      ],
      correctAnswer: 'c',
      explanation: 'Surprise prize texts are a common smishing trick. Clicking or replying gives the scammer what they want, and forwarding it puts your friends at risk.'
    },
    {
      id: 'assessment-19',
      topic: 'smishing',
      questionText: 'You receive a text from your bank asking you to verify a transaction by clicking a link. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Click the link to verify immediately' },
        { value: 'b', text: 'Reply with your account number' },
        { value: 'c', text: 'Check the transaction through the bank\'s official app or hotline' },
        { value: 'd', text: 'Ignore it and never check the transaction' }
      ],
      correctAnswer: 'c',
      explanation: 'Check through the bank\'s own app or hotline. The link or a reply may go to a scammer, and ignoring it completely means a real problem with your account could go unnoticed.'
    },

    // PRETEXTING (3 questions)
    {
      id: 'assessment-9',
      topic: 'pretexting',
      questionText: 'What is pretexting?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Making up a believable story or role to get information or access' },
        { value: 'b', text: 'Sending a fake email to many people at once' },
        { value: 'c', text: 'Breaking into a system with software exploits' },
        { value: 'd', text: 'Installing malware on a device' }
      ],
      correctAnswer: 'a',
      explanation: 'Pretexting relies on a made-up story or role, like an auditor or new vendor, to make a request feel normal. Mass fake emails, software exploits and malware are different attacks.'
    },
    {
      id: 'assessment-10',
      topic: 'pretexting',
      questionText: 'Someone claiming to be from IT asks for your password to "fix your account." What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Provide the password' },
        { value: 'b', text: 'Give the password once they tell you their employee ID' },
        { value: 'c', text: 'Refuse and report it through your official IT channel' },
        { value: 'd', text: 'Give them a temporary password instead' }
      ],
      correctAnswer: 'c',
      explanation: 'Real IT staff do not need your password. An employee ID can be faked, and any password you share, even a temporary one, can be used to get in.'
    },
    {
      id: 'assessment-20',
      topic: 'pretexting',
      questionText: 'A delivery person asks for your full name and birth date to verify a package. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Provide the information to receive the package' },
        { value: 'b', text: 'Give the details if they show a company ID' },
        { value: 'c', text: 'Refuse and check the delivery through the courier\'s official app or hotline' },
        { value: 'd', text: 'Give only your birth date' }
      ],
      correctAnswer: 'c',
      explanation: 'Couriers do not need your birth date to hand over a package. A company ID can be faked, and even part of your personal details can help someone steal your identity.'
    },

    // QUISHING (3 questions)
    {
      id: 'assessment-11',
      topic: 'quishing',
      questionText: 'What is quishing?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Phishing that uses a QR code to hide a link' },
        { value: 'b', text: 'Phishing through online quizzes' },
        { value: 'c', text: 'Phishing through shortened links' },
        { value: 'd', text: 'Phishing through fake quotes or invoices' }
      ],
      correctAnswer: 'a',
      explanation: 'Quishing means QR code phishing: the harmful link is hidden inside a QR code, so you cannot see where it goes before scanning. Quizzes, short links and fake invoices are other tricks.'
    },
    {
      id: 'assessment-12',
      topic: 'quishing',
      questionText: 'You see a QR code on a flyer promising a free gift. What should you do before scanning?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Scan immediately' },
        { value: 'b', text: 'Scan it first, then decide if the site looks real' },
        { value: 'c', text: 'Check who posted it, and preview the web address before opening it' },
        { value: 'd', text: 'Ask a friend to scan it first' }
      ],
      correctAnswer: 'c',
      explanation: 'Check where the code came from and look at the address your phone shows before opening it. Scanning first can already take you to a harmful page, and having a friend scan it only moves the risk to them.'
    },
    {
      id: 'assessment-21',
      topic: 'quishing',
      questionText: 'An email from "IT" asks you to scan a QR code with your phone to keep your work account active. What should you do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Scan it quickly so your account is not locked' },
        { value: 'b', text: 'Scan it with your work laptop\'s webcam instead of your phone' },
        { value: 'c', text: 'Do not scan it. Go to the official sign-in page yourself or ask IT through a known channel' },
        { value: 'd', text: 'Reply to the email to ask if the QR code is safe' }
      ],
      correctAnswer: 'c',
      explanation: 'An unexpected QR code asking you to sign in should be treated like a suspicious link. Scanning it on any device opens the hidden page, and replying to the email only reaches the sender, who may be the attacker.'
    },

    // SAFE PRACTICES (3 questions)
    {
      id: 'assessment-13',
      topic: 'safe-practices',
      questionText: 'Which password practice is most secure?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Use the same password for all accounts' },
        { value: 'b', text: 'Use a password manager with a unique password for each account' },
        { value: 'c', text: 'Use simple passwords so they are easy to remember' },
        { value: 'd', text: 'Share passwords with trusted colleagues' }
      ],
      correctAnswer: 'b',
      explanation: 'A password manager lets you keep a long, unique password for every account. Reused or simple passwords are easy to guess or reuse after a leak, and shared passwords can no longer be controlled.'
    },
    {
      id: 'assessment-14',
      topic: 'safe-practices',
      questionText: 'What is two-factor authentication (2FA)?',
      questionType: 'standard',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Using two different passwords' },
        { value: 'b', text: 'Needing two different kinds of proof to sign in, such as a password and a code from an app' },
        { value: 'c', text: 'Logging in from two different devices' },
        { value: 'd', text: 'Having two email accounts' }
      ],
      correctAnswer: 'b',
      explanation: '2FA asks for two different kinds of proof, usually something you know and something you have. Two passwords are both things you know, and using two devices or two email accounts does not add a second check.'
    },
    {
      id: 'assessment-15',
      topic: 'safe-practices',
      // Puna nina Pena at Castro: dati parehong puwedeng tama ang "Delete it"
      // at "Forward to security team". Isa na lang ang pinakamainam na sagot.
      questionText: 'You receive an unexpected file attachment at work from a sender you do not know. What is the best thing to do?',
      questionType: 'scenario-based',
      answerType: 'single',
      options: [
        { value: 'a', text: 'Open it to see what it is' },
        { value: 'b', text: 'Scan it with antivirus, then open it if nothing is found' },
        { value: 'c', text: 'Reply to the sender and ask what the file is' },
        { value: 'd', text: 'Do not open it, and report it through your IT or security team\'s reporting channel' }
      ],
      correctAnswer: 'd',
      explanation: 'Leave it unopened and report it, so your IT or security team can check it and warn others. Antivirus does not catch every new threat, opening it risks infection, and replying confirms your address to the sender.'
    }
  ]
}
