// Profanity filter for English and Nepali bad words
const englishBadWords = [
  // Test word for debugging
  'badword', 'test',
  // Common English profanity
  'fuck', 'shit', 'bitch', 'damn', 'hell', 'ass', 'bastard', 'crap',
  'piss', 'dick', 'cock', 'pussy', 'whore', 'slut', 'fag', 'nigger',
  'retard', 'idiot', 'stupid', 'moron', 'dumb', 'gay', 'lesbian',
  // Variations and leetspeak
  'f*ck', 'sh*t', 'b*tch', 'f**k', 'sh**', 'fuk', 'fck', 'sht',
  'btch', 'dmn', 'azz', 'a$$', 'fuk', 'fuq', 'fuc', 'shyt',
  // Internet slang
  'wtf', 'stfu', 'gtfo', 'kys', 'kms',
  // Double meanings and inappropriate usernames
  'sexy', 'hot', 'horny', 'nude', 'naked', 'porn', 'sex', 'boobs',
  'boob', 'tits', 'nipple', 'penis', 'vagina', 'anal', 'oral',
  'masturbate', 'orgasm', 'climax', 'erotic', 'kinky', 'fetish',
  // Inappropriate behaviors
  'rape', 'molest', 'abuse', 'violence', 'kill', 'murder', 'suicide',
  'terrorist', 'bomb', 'weapon', 'drug', 'cocaine', 'weed', 'marijuana',
  // System/Admin impersonation
  'admin', 'moderator', 'mod', 'system', 'server', 'bot', 'official',
  'staff', 'owner', 'creator', 'developer', 'support'
];

const nepaliBadWords = [
  // Common Nepali profanity (romanized)
  'muji', 'muj', 'randi', 'rand', 'machikne', 'machikni', 'kuti',
  'kutkuti', 'bhalu', 'sali', 'sala', 'chikne', 'chikni', 'lado',
  'puti', 'bhan', 'bhanchod', 'madarchod', 'behenchod', 'chod',
  'gandu', 'gandhu', 'gaandu', 'rascal', 'kale', 'kali', 'boksi',
  'jatha', 'jat', 'thulo', 'sano', 'budhi', 'budha', 'murkha',
  'bewakoof', 'pagal', 'pagli', 'khate', 'khati', 'jhyau',
  // Double meanings and inappropriate
  'sexy', 'hot', 'ramro', 'mitho', 'chikna', 'sundara', 'sundar',
  'pyaro', 'pyari', 'maya', 'prem', 'love', 'kiss', 'hug',
  // More Nepali inappropriate

  // Devanagari script common bad words
  'मुजी', 'रण्डी', 'माचिक्ने', 'कुटी', 'साली', 'साला', 'चिक्ने',
  'लाडो', 'पुटी', 'भान', 'भानचोड', 'मादरचोड', 'बहेनचोड',
  'गाण्डु', 'जाठा', 'मुर्खा', 'बेवकूफ', 'पागल', 'खाटे',
  'चोर', 'ठग', 'धोका', 'झुटो', 'नक्कली', 'फाल्तु'
];

// Combine all bad words
const allBadWords = [...englishBadWords, ...nepaliBadWords];

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;

  // Normalize text - remove extra spaces, convert to lowercase
  const normalizedText = text.toLowerCase().trim();

  console.log('Checking text:', normalizedText);
  console.log('Against words:', allBadWords.slice(0, 5)); // Show first 5 words for debugging

  // Simple check - just look for bad words in the text
  for (const word of allBadWords) {
    const lowerWord = word.toLowerCase();
    if (normalizedText.includes(lowerWord)) {
      console.log('Found bad word:', word);
      return true;
    }
  }

  console.log('No bad words found');
  return false;
};

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  
  // Replace bad words with asterisks
  for (const word of allBadWords) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  }
  
  return filteredText;
};

export const getBadWordWarning = () => {
  const warnings = [
    "Please keep the chat respectful! 🙏",
    "Let's maintain a friendly environment! 😊",
    "Bad words are not allowed here! ⚠️",
    "Keep it clean, friend! 🧼",
    "This chat is for everyone - please be nice! 💝"
  ];

  return warnings[Math.floor(Math.random() * warnings.length)];
};

export const getUsernameWarning = () => {
  const warnings = [
    "Please choose a more appropriate username! 😊",
    "That username is not allowed. Try something else! 🙏",
    "Username contains inappropriate content. Please change it! ⚠️",
    "Let's keep usernames family-friendly! 💝",
    "Choose a cleaner username please! 🧼"
  ];

  return warnings[Math.floor(Math.random() * warnings.length)];
};

export const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;

  // Check length
  if (username.length < 2 || username.length > 20) return false;

  // Check for profanity
  if (containsProfanity(username)) return false;

  // Check for only numbers (not allowed)
  if (/^\d+$/.test(username)) return false;

  // Check for special characters (only allow letters, numbers, underscore, dash)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return false;

  return true;
};

export default {
  containsProfanity,
  filterProfanity,
  getBadWordWarning,
  getUsernameWarning,
  isValidUsername
};
