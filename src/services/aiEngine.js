// AI Engine for Classroom Interactions
// Supports Gemini API (1.5-flash & 2.0-flash) + Deeply Knowledgeable Offline Engine
import { maybePersonalizeTeacherName } from '../data/studentsData';
import { TEACHER_QUESTIONS_BANK } from '../data/teacherData';

export function getActiveApiKey() {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
                 (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY);
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : '';
  return (envKey || localKey || '').trim();
}

export function isAIConfigured() {
  return !!getActiveApiKey();
}

// List of preferred models in order of priority (using Google AI Studio's active models)
const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite'
];

export const STUDENT_ALIASES = {
  eliska: [
    'eliska', 'eliška', 'elisko', 'eliško', 'elisku', 'elišku', 'elisce', 'elišce',
    'elišky', 'elisky', 'šprtka', 'sprtka'
  ],
  matyas: [
    'matyas', 'matyáš', 'matyasi', 'matyáši', 'matyase', 'matyáše', 'mato', 'máťo',
    'matýsku', 'matysku', 'šašek', 'sasek'
  ],
  ondra: [
    'ondra', 'ondro', 'ondru', 'ondrovi', 'ondřej', 'ondrej', 'ondřeji', 'ondreji',
    'ondrášku', 'ondrasku', 'spáč', 'spac'
  ],
  viktorie: [
    'viktorie', 'viktorko', 'viktorku', 'viktori', 'viki', 'viktorka', 'viky',
    'vikouši', 'rebelka'
  ],
  tomas: [
    'tomas', 'tomáš', 'tomasi', 'tomáši', 'tomíku', 'tomiku', 'tome', 'tomáše', 'tomase',
    'stydlín', 'stydlin'
  ],
  filip: [
    'filip', 'filipe', 'filipa', 'filipovi', 'filípek', 'filipek', 'filípku', 'filipku',
    'sportovec'
  ],
  sofie: [
    'sofie', 'sofi', 'sofinko', 'sofinku', 'sofii', 'sofinka', 'sofko', 'sofka',
    'umělkyně', 'umelkyne'
  ],
  kuba: [
    'kuba', 'kubo', 'kubíku', 'kubiku', 'kubu', 'jakube', 'jakub',
    'hladovec'
  ]
};

/**
 * Detect if the teacher's question addresses a specific pupil in the classroom
 */
export function detectAddressedStudent(questionText, studentsList = []) {
  if (!questionText) return null;

  const clean = questionText
    .toLowerCase()
    .replace(/[,.?!:;\"\']/g, ' ');

  const words = clean.split(/\s+/).filter(Boolean);

  for (const word of words) {
    const unaccented = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const [studentId, aliases] of Object.entries(STUDENT_ALIASES)) {
      for (const alias of aliases) {
        const unaccentedAlias = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (word === alias || unaccented === unaccentedAlias) {
          if (studentsList && studentsList.length > 0) {
            const found = studentsList.find(s => s.id === studentId);
            if (found) return found;
          }
          return { id: studentId };
        }
      }
    }
  }

  return null;
}

/**
 * Test a Gemini API key with a small quick prompt
 */
export async function testGeminiAPI(keyToTest) {
  const key = (keyToTest || getActiveApiKey()).trim();
  if (!key) {
    return { ok: false, error: 'Klíč nebyl zadán.' };
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Odpověz jedním slovem "Ahoj" v češtině.' }] }],
          generationConfig: { maxOutputTokens: 20 }
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Ahoj!';
        return { ok: true, message: `Připojeno! Model: ${model}. Odpověď AI: „${reply}“` };
      } else {
        const errData = await res.json().catch(() => null);
        lastError = errData?.error?.message || `Chyba HTTP ${res.status}`;
      }
    } catch (err) {
      lastError = err.name === 'AbortError' ? 'Vypršel časový limit (7s).' : (err.message || 'Chyba sítě.');
    }
  }

  return { ok: false, error: lastError || 'Nepodařilo se připojit k žádnému AI modelu.' };
}

/**
 * Main function: ask a question in the classroom
 */
export async function askClassroomQuestion(questionText, studentsList, addressedStudentId = null) {
  const apiKey = getActiveApiKey();
  const addressedId = addressedStudentId || detectAddressedStudent(questionText, studentsList)?.id || null;

  let responses = null;

  if (apiKey) {
    try {
      responses = await callGeminiAPI(questionText, studentsList, apiKey, addressedId);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart offline engine:', err);
    }
  }

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    responses = generateOfflineAnswers(questionText, studentsList, addressedId);
  }

  // GUARANTEE: If an addressed student was requested, they MUST be at index 0 of the response!
  if (addressedId) {
    const existingIndex = responses.findIndex(r => r.studentId === addressedId);
    if (existingIndex > 0) {
      const [item] = responses.splice(existingIndex, 1);
      responses.unshift(item);
    } else if (existingIndex === -1) {
      responses.unshift({
        studentId: addressedId,
        answer: `Paní učitelko, já na to zrovna myslím a tady jsem!`,
        isCorrect: true,
        state: 'normal'
      });
    }
  }

  // Guarantee occasional affectionate addressing "paní učitelko Terezko" (~28% chance)
  return responses.map(r => ({
    ...r,
    answer: maybePersonalizeTeacherName(r.answer, 0.28)
  }));
}

/**
 * Call Gemini API with strict instructions to answer the actual question
 */
async function callGeminiAPI(question, _students, apiKey, addressedStudentId = null) {
  const models = GEMINI_MODELS;
  let lastError = null;

  const addressedInstruction = addressedStudentId
    ? `\n5. DŮLEŽITÉ: Paní učitelka položila otázku a oslovila přímo žáka: "${addressedStudentId}"!
Tento žák (${addressedStudentId}) MUSÍ být v odpovědích na 1. MÍSTĚ pole ({ "studentId": "${addressedStudentId}", ... }) a MUSÍ odpovědět přímo paní učitelce k věci podle své povahy!
Protože paní učitelka oslovila konkrétního žáka, OSTATNÍ ŽÁCI SE NEHLÁSÍ (ve třídě je ticho a poslouchají). Maximálně můžeš přidat 1 dalšího žáka (eliska), ale NIKDO DALŠÍ se nehlásí! Výsledné pole bude mít CELKEM pouze 1 až 2 prvky.`
    : `\n5. REALISTIČNOST TŘÍDY - NE VŠECHNY DĚTI SE HLÁSÍ:
Ve skutečné třídě se NIKDY nehlásí všichni žáci najednou! Vyber PŘESNĚ 2 až 3 žáky (nikdy víc!):
- Eliška (šprtka) se hlásí velmi často (cca 85 %).
- K ní vyber náhodně 1 až 2 další žáky (např. Filip, Matyáš nebo Viktorie).
- Ondra (Spáč) a Tomáš (Stydlín) se hlásí jen málokdy.
Výsledné JSON pole MUSÍ mít PŘESNĚ 2 nebo 3 položky!`;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const prompt = `Jsi mozek interaktivní hry "Paní učitelka" pro 8letou holčičku, která si hraje na paní učitelku ve 3. třídě základní školy.
Paní učitelka se jmenuje Terezka.
Paní učitelka právě položila třídě tuto otázku:
"${question}"

Ve třídě sedí těchto 8 žáčků:
1. eliska (Šprtka - vzorná, MUSÍ říct skutečnou a fakticky správnou odpověď na otázku paní učitelky! Odpovídá chytře, nadšeně a spisovně.)
2. matyas (Třídní šašek - odpovídá na dané téma vtipně, popleteně, udělá si legraci, ale stále mluví přímo k věci!)
3. ondra (Spáč - zrovna se probouzí a odpoví ospale, zívavě, ale k tématu otázky.)
4. viktorie (Rebelka - odvážná, moderní, řekne trefnou, energickou a správnou nebo cool odpověď.)
5. tomas (Stydlín - mluví potichu a nesměle, ale téměř vždy ví správnou odpověď.)
6. filip (Sportovec - odpoví k otázce, ale připodobní to ke sportu, fotbalu nebo běhání.)
7. sofie (Umělkyně - odpoví k otázce a zmíní barvy, malování, tvary nebo krásu.)
8. kuba (Hladovec - odpoví k otázce a propojí ji se svým věčným hladem, svačinou nebo jídlem.)

PŘÍSNÁ PRAVIDLA:
1. ŽÁCI MUSÍ PŘÍMO A VĚCNĚ ODPOVĚDĚT NA POLOŽENOU OTÁZKU!
   Příklad: Pokud otázka zní "Kolik nohou má pavouk?", Eliška MUSÍ říct "Pavouk má osm nohou, paní učitelko!", Matyáš řekne "Osm nohou? To by potřeboval čtyři páry bot!", Tomáš řekne "Já myslím, že osm...".
2. ZÁKAZ prázdných vyhýbavých vět typu "Já to vím z encyklopedie" nebo "Nevím". Žáci musí říct konkrétní odpověď.
3. Každá odpověď musí být přesně 1 krátká, roztomilá mluvená věta v přirozené češtině (vhodná pro hlasovou syntézu).
4. OSLOVENÍ: Paní učitelka se jmenuje Terezka. Žáčci ji běžně oslovují "paní učitelko", ale zhruba v 1 ze 3 až 4 odpovědí (občas, ne však u všech najednou!) ji může některý žák oslovit laskavě a mile přímo jménem: "paní učitelko Terezko" (např. "Paní učitelko Terezko, já vím!", "Děkuji, paní učitelko Terezko!", "Je to osm, paní učitelko Terezko."). Nikdy to nedávej všem žákům v jedné otázce, má to působit přirozeně a pestře!
${addressedInstruction}

Odpověz POUZE jako validní JSON pole bez markdown značek:
[
  {
    "studentId": "${addressedStudentId || 'eliska'}",
    "answer": "Krátká odpověď k věci v češtině.",
    "isCorrect": true,
    "state": "raising_hand"
  }
]`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8500);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 600,
            responseMimeType: 'application/json'
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Model ${model} HTTP status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (Array.isArray(parsed) && parsed.length > 0) {
        // If an addressed student was specified but missing from the list, ensure they are placed first!
        if (addressedStudentId && !parsed.some(item => item.studentId === addressedStudentId)) {
          parsed.unshift({
            studentId: addressedStudentId,
            answer: `Paní učitelko, tady jsem a odpovídám na vaši otázku!`,
            isCorrect: true,
            state: 'raising_hand'
          });
        }

        return parsed.map(item => ({
          studentId: item.studentId,
          answer: item.answer,
          isCorrect: !!item.isCorrect,
          state: 'raising_hand'
        }));
      }
    } catch (err) {
      lastError = err;
      // try next model
    }
  }

  throw lastError || new Error('Gemini API failed');
}

// Helpers
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Normalize text by removing diacritics for ultra-reliable matching
function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Enhanced Dynamic Offline Engine with Extensive Knowledge & Keyword Topical Extractor
 */
export function generateOfflineAnswers(rawQuestion, _students, addressedStudentId = null) {
  const qNorm = normalizeText(rawQuestion);

  // 1. Math calculation questions (e.g. "kolik je 5 plus 7", "3 + 4", "10 - 2", "5 krát 4", "12 děleno 3")
  const mathMatch = rawQuestion.match(/(\d+)\s*(\+|[-]|plus|mínus|minus|krát|krat|\*|děleno|deleno|\/)\s*(\d+)/i);
  if (mathMatch) {
    const num1 = parseInt(mathMatch[1], 10);
    const op = normalizeText(mathMatch[2]);
    const num2 = parseInt(mathMatch[3], 10);

    let result = 0;
    if (op === '+' || op === 'plus') result = num1 + num2;
    else if (op === '-' || op === 'minus' || op === 'mínus') result = num1 - num2;
    else if (op === '*' || op === 'krat' || op === 'krát') result = num1 * num2;
    else if (op === '/' || op === 'deleno' || op === 'děleno') result = num2 !== 0 ? Math.floor(num1 / num2) : 0;

    const mathAnswersByStudent = {
      eliska: [
        `Je to přesně ${result}! Mám to spočítané jako první!`,
        `Správný výsledek je ${result}, paní učitelko! Přepočítala jsem to dvakrát!`,
        `Vychází to ${result}! Byla to moc hezká početní úloha!`
      ],
      matyas: [
        `Podle mých prstů na nohou je to tak ${result + Math.floor(Math.random() * 5 + 2)}!`,
        `Když k tomu připočtu nos a uši, vyšlo mi rovných sto!`,
        `Je to ${result}, ale jen když nefouká vítr ze západu! Haha!`
      ],
      tomas: [
        `Já... já si nesměle tipnu, že ${result}... Je to správně?`,
        `Vypočítal jsem ${result}, ale bál jsem se to říct nahlas...`,
        `Mně na papíře vyšlo ${result}, paní učitelko...`
      ],
      kuba: [
        `Kdyby to bylo ${result} koblížků s povidly, hned bych je snědl!`,
        `${result}? To mi zrovna připomíná, že za chvilku máme oběd!`,
        `Je to ${result}, přesně jako počet rohlíků v naší tašce!`
      ],
      filip: [
        `${result} gólů jsme dali včera na fotbalovém tréninku!`,
        `Kdyby to byl čas v běhu, tak ${result} vteřin je nový rekord!`,
        `To je jasných ${result}! Jako počet hráčů na hřišti!`
      ],
      sofie: [
        `${result}! To je přesně tolik, kolik mám barevných pastelek v penále!`,
        `Je to ${result}! Namaluji k tomu ${result} barevných teček!`
      ],
      viktorie: [
        `Jasně že ${result}! To dá i prvňák se zavřenýma očima!`,
        `Je to ${result}! A kdo tvrdí opak, ten neumí počítat!`
      ],
      ondra: [
        `Zív... ${result}? Myslím, že mi to zrovna pošeptala ovečka ve snu...`,
        `Mně se o čísle ${result} zrovna zdál krásný sen na lavici...`
      ]
    };

    const pool = ['eliska', 'matyas', 'tomas', 'kuba', 'filip', 'sofie', 'viktorie', 'ondra'];
    const chosen = selectRealisticRaisingStudents(pool, addressedStudentId);
    if (!addressedStudentId && !chosen.includes('eliska') && !chosen.includes('tomas')) {
      chosen[0] = 'eliska';
    }

    return chosen.map(studentId => ({
      studentId,
      answer: pickRandom(mathAnswersByStudent[studentId]),
      isCorrect: studentId === 'eliska' || studentId === 'tomas' || studentId === 'viktorie',
      state: 'raising_hand'
    }));
  }

  // 2. Spider & legs ("pavouk", "nohou", "nohy", "stonožka", "hmyz", "mravenec")
  if (/\b(pavouk|pavouci|pavouka|nohy|nohou|nohama|stonozka|mravenec|mravenci|hmyz|beruska)\b/.test(qNorm)) {
    const insectPool = {
      eliska: [
        'Pavouk má osm nohou, paní učitelko! Není to hmyz, ale pavoukovec!',
        'Hmyz má šest nohou a pavouk má osm nohou! Mám to nastudované!',
        'Mravenec má šest nohou a unese padesátinásobek své váhy!'
      ],
      matyas: [
        'Pavouk má osm nohou! To by musel kupovat čtyři páry ponožek!',
        'Stonožka má tolik nohou, že jí trvá půl hodiny, než si zaváže tkaničky!',
        'Mravenec má šest nohou a já jen dvě, ale v běhu bych ho předběhl!'
      ],
      tomas: [
        'Pavouk má osm nožiček... a tká z nich pavučiny...',
        'Hmyz má šest nohou... včera jsem pozoroval berušku...'
      ],
      filip: [
        'Pavouk má osm nohou, s tolika nohama by byl nejlepší brankář světa!',
        'Mravenci běhají štafetu šestkrát rychleji než my!'
      ],
      sofie: [
        'Pavučina s kapkami rosy vypadá jako náhrdelník z třpytivých korálků!',
        'Beruška má krásně červené krovky se sedmi černými tečkami!'
      ],
      kuba: [
        'Mravenec má v mraveništi obrovskou spižírnu plnou sladkých semínek!'
      ],
      viktorie: [
        'Tarantule má osm chlupatých nohou a loví i ještěrky!'
      ],
      ondra: [
        'Zív... Pavouk spí ve své síti a čeká, až mu večeře spadne přímo do postele...'
      ]
    };
    return formatSelected(insectPool, ['eliska', 'tomas'], addressedStudentId);
  }

  // 3. Animals, forest, farm & pets ("zvíře", "les", "pes", "kočka", "kůň", "kráva", "medvěd", "lev", "slon", "dinosaurus")
  if (/\b(zvire|zvirata|zvirat|zviratko|les|lese|lesni|pes|psa|pejsek|kocka|kocky|kun|kone|konic|krava|kravy|medved|medveda|lev|lva|slon|slona|dinosaurus|dinosauri)\b/.test(qNorm)) {
    const animalPool = {
      eliska: [
        'V našem lese žije jelen evropský, srnka obecná, liška i divočák!',
        'Největším suchozemským savcem je slon africký a v lese žije rys ostrovid!',
        'Pes je domestikovaný vlk a je to nejvěrnější přítel člověka!'
      ],
      matyas: [
        'V lese bydlí lesní skřítek a veverka se slunečními brýlemi!',
        'Viděl jsem v lese ježka, který na zádech nesl celý meloun!',
        'Pes dělá haf haf, ale náš pes umí i štěkat pozpátku!'
      ],
      ondra: [
        'Zív... Medvěd, protože spí celou zimu v teplém brlohu stejně jako já...',
        'Kočička, ta prospí až šestnáct hodin denně v měkkém křesle...',
        'Lenochod na stromě, ten se hýbe tak pomalu, že na něm roste mech...'
      ],
      filip: [
        'Gepard! Je to nejrychlejší zvíře na světě, sprintuje přes sto kilometrů v hodině!',
        'Kůň! Umí skákat přes překážky a běhat dostihy!',
        'Zajíc polní kličkuje rychleji než fotbalový útočník!'
      ],
      sofie: [
        'Sýkorka a strakapoud! Mají tak nádherně barevná peříčka!',
        'Plameňák má peří růžové jako jahodová zmrzlina!',
        'Liška má ten nejkrásnější rezavý kožíšek v celém lese!'
      ],
      kuba: [
        'Divočák! Protože pořád ryje rypáčkem v zemi a hledá žaludy k jídlu!',
        'Medvěd miluje lesní med a borůvky stejně jako já kynuté knedlíky!',
        'Kráva nám dává čerstvé mléko na kakao a sýry!'
      ],
      viktorie: [
        'Tygr a vlk! Loví ve smečce a nikdo si na ně v přírodě netroufne!',
        'Dinosauři byli nejlepší vládci planety, T-Rex měl zuby jako nože!'
      ],
      tomas: [
        'Plachá srnka... která se pase brzy ráno na lesním paloučku...',
        'Mám doma křečka a ten si cpe zrníčka do tvářiček...'
      ]
    };
    return formatSelected(animalPool, ['eliska', 'tomas', 'filip'], addressedStudentId);
  }

  // 4. Geography, Capitals & Czechia ("hlavní město", "praha", "paříž", "francie", "německo", "slovensko", "česko", "vltava", "smetana", "hora", "sněžka")
  if (/\b(hlavni|mesto|mesta|praha|praze|prazsky|pariz|francie|francii|nemecko|nemecka|slovensko|slovenska|cesko|ceska|vltava|vltavy|snezka|snezku|hory|horach|hora)\b/.test(qNorm)) {
    const geoPool = {
      eliska: [
        'Hlavním městem České republiky je Praha a naší nejvyšší horou je Sněžka (1603 m)!',
        'Hlavním městem Francie je Paříž s Eiffelovou věží, a Slovenska Bratislava!',
        'Českou republikou protéká řeka Vltava, která se u Mělníka vlévá do Labe!'
      ],
      viktorie: [
        'V Praze máme Karlův most a orloj, a v Paříži obří Eiffelovku!',
        'Na Sněžku jsem vyšlápla pěšky a foukal tam pořádný horský vichr!',
        'Hlavní město Anglie je Londýn s hodinami Big Ben!'
      ],
      filip: [
        'Praha má největší fotbalový stadion a naši hokejisté tam vyhráli mistrovství světa!',
        'V horách se nejlépe trénuje fyzička a sjezdové lyžování!'
      ],
      sofie: [
        'Naše republika má trikolóru: bílou, červenou a modrý klín!',
        'V Praze se třpytí zlaté věžičky, proto se jí říká stověžatá Praha!'
      ],
      matyas: [
        'A není hlavní město Francie náhodou Bagetov? Tam kde pečou ty dlouhé bagety?',
        'Vltava je fajn, ale nejlepší řeka by byla z bublinkové malinovky!'
      ],
      kuba: [
        'V Paříži pečou ty nejkřupavější máslové croissanty!',
        'V Praze na Staromáku voní trdelníky se skořicí a cukrem!'
      ],
      tomas: [
        'Naše republika leží v srdci Evropy... a máme krásné hrady jako Karlštejn...'
      ],
      ondra: [
        'Zív... Karlův most, tam fouká tak příjemný větřík na spaní...'
      ]
    };
    return formatSelected(geoPool, ['eliska', 'tomas', 'viktorie']);
  }

  // 5. Colors, rainbow & art ("barva", "barvy", "duha", "kreslit", "malovat", "štětec")
  if (/\b(barva|barvy|barev|duha|duhy|kreslit|kresleni|malovat|stetec|pastelky|pastelka)\b/.test(qNorm)) {
    const artPool = {
      sofie: [
        'Duha má sedm barev! Červenou, oranžovou, žlutou, zelenou, modrou, indigovou a fialovou!',
        'Když smícháme žlutou a modrou barvu, vznikne nádherná smaragdová zelená!',
        'Základní barvy jsou červená, modrá a žlutá, ze kterých se namíchají všechny ostatní!'
      ],
      eliska: [
        'Duha vzniká lomem a odrazem slunečního světla v kapkách deště!',
        'Bílé světlo ve skutečnosti obsahuje všechny barvy viditelného spektra!'
      ],
      matyas: [
        'A co barva neviditelná? Tu jsem si dneska namaloval na lavici!',
        'Kdyby duha chutnala, červená by byla jahodová a žlutá banánová!'
      ],
      filip: [
        'Moje nejoblíbenější je modrá a bílá jako náš fotbalový dres!'
      ],
      kuba: [
        'Nejhezčí barva je čokoládově hnědá a jahodově červená k svačině!'
      ],
      viktorie: [
        'Neonově fialová! Přesně takové pruhy mám na svém skateboardu!'
      ],
      tomas: [
        'Mně se líbí světle modrá barva... jako tiché letní nebe...'
      ]
    };
    return formatSelected(artPool, ['sofie', 'eliska']);
  }

  // 6. Space, planets & solar system ("planeta", "vesmír", "slunce", "měsíc", "hvězda", "raketa", "země")
  if (/\b(planeta|planety|vesmir|vesmiru|slunce|mesic|mesice|hvezda|hvezdy|raketa|rakety|zeme|mars|jupiter|saturn)\b/.test(qNorm)) {
    const spacePool = {
      eliska: [
        'Naše sluneční soustava má osm planet a my žijeme na planetě Zemi!',
        'Největší planetou je Jupiter a nejblíže ke Slunci obíhá Merkur!',
        'Slunce je žhavá plynná hvězda a Měsíc je přirozená družice naší Země!'
      ],
      viktorie: [
        'Na Marsu je nejvyšší sopka ve vesmíru Olympus Mons a je tam rudý prach!',
        'Kosmonauti létají v raketách rychlostí přes dvacet tisíc kilometrů v hodině!'
      ],
      sofie: [
        'Planeta Saturn má překrásné zářivé prstence z ledu a vesmírného třpytu!',
        'Noční obloha posetá hvězdami vypadá jako sametový plášť posetý diamanty!'
      ],
      matyas: [
        'Měsíc je určitě vyrobený z ementálu a bydlí na něm sýroví mužíčci!',
        'Já chci skafandr, co umí za jízdy dělat mýdlové bubliny!'
      ],
      kuba: [
        'Saturnův prstenec mi připomíná obří koblihu s cukrovou polevou!'
      ],
      ondra: [
        'Zív... Ve stavu beztíže se spí úplně nejlíp, člověk se vznáší jako peříčko...'
      ],
      tomas: [
        'Planeta Země je modrá, protože většinu jejího povrchu tvoří oceány...'
      ],
      filip: [
        'Na Měsíci je menší gravitace, tam bych doskočil až k basketbalovému koši!'
      ]
    };
    return formatSelected(spacePool, ['eliska', 'tomas', 'viktorie']);
  }

  // 7. Human body, health & senses ("tělo", "zub", "oko", "oči", "srdce", "krev", "kosti", "plíce", "dýchat")
  if (/\b(telo|tela|tele|zub|zuby|zubu|oko|oci|ocima|srdce|krev|kost|kosti|plice|dychat|dychame|zaludek|mozek)\b/.test(qNorm)) {
    const bodyPool = {
      eliska: [
        'Srdce je svalová pumpa, která přečerpává krev s kyslíkem do celého těla!',
        'Člověk má v těle přes dvě stě kostí a dýcháme plícemi!',
        'Dospělý člověk má třicet dva zubů a děti mají dvacet mléčných zoubků!'
      ],
      filip: [
        'Při běhu mi srdce bije jako o závod, pumpuje energii do mých nohou!',
        'Kosti a svaly posilujeme pravidelným cvičením a pohybem na hřišti!'
      ],
      matyas: [
        'Když vypláznu jazyk a zakoulím očima, umím napodobit chameleona!',
        'Zuby si čistím dvakrát denně, aby se mi v nich neusadili zubní kazíci!'
      ],
      kuba: [
        'V bříšku máme žaludek a ten se ozve pokaždé, když je čas na oběd!'
      ],
      tomas: [
        'Očima vidíme všechny krásy světa... a ušima posloucháme paní učitelku...'
      ],
      sofie: [
        'Oči mají různé barvy duhovky: modrou, zelenou, hnědou nebo šedou!'
      ],
      ondra: [
        'Zív... Když zavřu oči, můj mozek začne promítat ty nejkrásnější sny...'
      ]
    };
    return formatSelected(bodyPool, ['eliska', 'filip', 'tomas']);
  }

  // 8. Food, plants, fruit & vegetables ("jídlo", "jíst", "svačina", "oběd", "ovoce", "zelenina", "jablko", "chleba", "mléko")
  if (/\b(jidlo|jidla|jist|svacina|svacinu|obed|obeda|ovoce|zelenina|jablko|jablka|chleba|chleb|mleko|mleka|peceni|cokolada|vareni)\b/.test(qNorm)) {
    const foodPool = {
      kuba: [
        'Z mléka se vyrábí máslo, sýr, tvaroh, jogurt i vanilková zmrzlina!',
        'Ovoce je sladké a zdravé, já mám nejraději jahody, meloun a banány!',
        'Dneska mají v jídelně k obědu rajskou omáčku s těstovinami, mňam!'
      ],
      eliska: [
        'Ovoce a zelenina obsahují vitamíny C a vlákninu nezbytnou pro zdraví!',
        'Chléb se peče z mouky, vody, kvásku a soli z obilných zrn pšenice a žita!'
      ],
      matyas: [
        'Čokoláda se dělá z kakaových bobů a boby jsou zelenina, takže čokoláda je salát!',
        'Gumoví medvídci mají tvar zvířátka, tak jsou určitě plní vitamínů!'
      ],
      filip: [
        'Banán a jablko dávají sportovcům okamžitou energii na hřišti!'
      ],
      sofie: [
        'Jablíčka jsou na podzim červená a žlutá jako malířská paleta!'
      ],
      tomas: [
        'Maminka mi dneska nakrájela do krabičky sladkou mrkvičku a jablíčko...'
      ]
    };
    return formatSelected(foodPool, ['kuba', 'eliska', 'filip']);
  }

  // 9. Fairy tales, books & Czech language ("pohádka", "knihy", "čtení", "písmena", "abeceda", "drak", "princezna", "karel")
  if (/\b(pohadka|pohadce|pohadky|kniha|knihy|cteni|pismeno|pismena|abeceda|abecedy|drak|draka|princezna|princezny|karel|capek)\b/.test(qNorm)) {
    const fairyPool = {
      eliska: [
        'První písmeno v naší abecedě je A a česká abeceda má přes čtyřicet písmen s háčky a čárkami!',
        'Karel Čapek napsal Dášenku a Karel IV. založil v Praze slavnou univerzitu!',
        'V klasických českých pohádkách dobro vždycky zvítězí nad zlem!'
      ],
      matyas: [
        'Drak má v pohádce tři nebo sedm hlav, představte si, jak se ty hlavy hádají!',
        'Já chci být v pohádce ten princ, co místo meče vytáhne vtipnou hlášku!'
      ],
      sofie: [
        'Pohádkové knížky mají ty nejkrásnější ilustrace s princeznami a zámky!',
        'Zlatovláska měla vlasy zářivé jako ranní paprsky sluníčka!'
      ],
      viktorie: [
        'Já bych byla princezna bojovnice, co draka zkrotí a létá na něm!',
        'Rytíři nosili těžké brnění a bojovali v rytířských turnajích!'
      ],
      tomas: [
        'Před spaním mi maminka čte pohádku o krtečkovi a jeho kamarádech...'
      ],
      kuba: [
        'V pohádce Otesánek snědl všechno v celém domě, tomu já úplně rozumím!'
      ]
    };
    return formatSelected(fairyPool, ['eliska', 'sofie', 'viktorie']);
  }

  // 10. Seasons, weather, rain & snow ("jaro", "léto", "podzim", "zima", "počasí", "déšť", "sníh", "vítr", "slunce")
  if (/\b(jaro|jare|leto|lete|podzim|podzimu|zima|zime|pocasi|dest|deste|prsi|snih|snehu|snezi|vitr|vetru)\b/.test(qNorm)) {
    const weatherPool = {
      eliska: [
        'Máme čtyři roční období: jaro, léto, podzim a zimu, každé trvá tři měsíce!',
        'Na jaře se příroda probouzí, v létě zraje obilí, na podzim padá listí a v zimě mrzne!',
        'Sníh jsou zmrzlé krystalky vody, každá sněhová vločka má unikátní tvar šestiúhelníku!'
      ],
      filip: [
        'V zimě se jezdí na lyžích a bruslí na ledě, a v létě plaveme v bazénu!',
        'V létě hrajeme fotbal venku až do večera!'
      ],
      sofie: [
        'Podzimní stromy mají ty nejkrásnější barvy: zlatou, oranžovou a vínovou!',
        'Na jaře kvetou sněženky, petrklíče a fialky v zelené trávě!'
      ],
      matyas: [
        'V zimě postavím sněhuláka s mrkví místo nosu a hrncem na hlavě!',
        'Moje nejoblíbenější počasí je, když prší čokoládové bonbóny!'
      ],
      ondra: [
        'Zív... V zimě je pod teplou peřinou tak nádherně, že by se dalo spát až do jara...'
      ],
      kuba: [
        'V létě je nejlepší točená zmrzlina a na podzim pečené kaštany!'
      ],
      viktorie: [
        'V létě jezdím na skateboardu a skáču do vody po hlavě!'
      ],
      tomas: [
        'Když venku prší, rád sedím u okna a poslouchám kapky na parapetu...'
      ]
    };
    return formatSelected(weatherPool, ['eliska', 'filip', 'sofie']);
  }

  // 11. Sports, PE & Games ("tělocvik", "sport", "běh", "míč", "fotbal", "cvičit")
  if (/\b(sport|sporty|telocvik|telocviku|mic|mice|fotbal|fotbalu|beh|behat|cvicit|cviceni|vybijena|trenink)\b/.test(qNorm)) {
    const sportPool = {
      filip: [
        'Dneska budeme hrát vybíjenou nebo fotbal! Mám nové kopačky a skvělou formu!',
        'Fotbal je nejlepší sport na světě, já chci dát gól hlavičkou!',
        'Štafetový běh! Kdo prohraje, dělá deset kliků!'
      ],
      viktorie: [
        'Já chci šplhat na tyč až ke stropu tělocvičny a skákat přes kozu!',
        'Vybíjená! To je největší adrenalin, když musíte uhýbat letícím míčům!'
      ],
      ondra: [
        'Zív... V tělocviku bychom si mohli dát závody ve spaní na tlusté žíněnce...'
      ],
      matyas: [
        'Já navrhuji závody v kotrmelcích s vyplazeným jazykem!'
      ],
      eliska: [
        'Před každým cvičením je důležitá pořádná rozcvička, abychom si nenatáhli svaly!'
      ],
      sofie: [
        'Rytmická gymnastika se stuhou! To vypadá ve vzduchu jako létající barevné vlny!'
      ],
      kuba: [
        'Po tělocviku budu mít tak obrovský hlad, že sním celou velkou svačinu!'
      ],
      tomas: [
        'Já mám rád, když hrajeme na schovávanou nebo tiché hry...'
      ]
    };
    return formatSelected(sportPool, ['filip', 'eliska', 'viktorie']);
  }

  // 12. DYNAMIC TOPICAL KEYWORD EXTRACTOR FOR ANY UNKNOWN QUESTION
  // Extracts topic words from the question and answers specifically about that topic!
  return generateDynamicContextualAnswer(rawQuestion, addressedStudentId);
}

// Realistic student selector: only 2 to 3 students raise hands (never everyone!)
function selectRealisticRaisingStudents(poolIds, addressedStudentId = null) {
  if (addressedStudentId) {
    const res = [addressedStudentId];
    if (addressedStudentId !== 'eliska' && Math.random() < 0.2) {
      res.push('eliska');
    }
    return res;
  }

  // In a real classroom, typically 2 or 3 students raise their hands
  const count = Math.random() < 0.65 ? 2 : 3;
  const chosen = [];

  // Eliška (šprtka) raises hand very often (~85%)
  if (poolIds.includes('eliska') && Math.random() < 0.85) {
    chosen.push('eliska');
  }

  const others = shuffleArray(
    ['filip', 'matyas', 'viktorie', 'tomas', 'kuba', 'sofie', 'ondra'].filter(
      id => poolIds.includes(id) && !chosen.includes(id)
    )
  );

  while (chosen.length < count && others.length > 0) {
    chosen.push(others.shift());
  }

  return chosen;
}

// Helper to format selected students
function formatSelected(poolObj, correctIds = [], addressedStudentId = null) {
  const allIds = Object.keys(poolObj);
  const selected = selectRealisticRaisingStudents(allIds, addressedStudentId);

  // Ensure at least one correct student is included if general question
  if (!addressedStudentId && correctIds.length > 0 && !selected.some(id => correctIds.includes(id))) {
    selected[0] = correctIds[0];
  }

  return selected.map(id => ({
    studentId: id,
    answer: pickRandom(poolObj[id]),
    isCorrect: correctIds.includes(id) || id === addressedStudentId,
    state: 'raising_hand'
  }));
}

/**
 * Dynamic Keyword Extractor:
 * If the question does not match pre-baked categories, extract key nouns and context
 * and build a topical response so the student ALWAYS refers to the teacher's subject!
 */
function generateDynamicContextualAnswer(questionText, addressedStudentId = null) {
  const stopWords = new Set([
    'kolik', 'proc', 'jake', 'jaky', 'jaka', 'kdo', 'kdy', 'kde', 'ktere', 'ktery', 'ktera',
    'jsou', 'tento', 'tato', 'tady', 'pane', 'pani', 'ucitelko', 'vite', 'zije', 'toci',
    'dela', 'byl', 'byla', 'bylo', 'maji', 'mezi', 'nebo', 'pres', 'pred'
  ]);

  const cleanQ = questionText.replace(/[?.,!]/g, '').trim();
  const rawWords = cleanQ.split(/\s+/).filter(w => w.length > 2);

  // Find meaningful topic words (by normalized form)
  const meaningfulWords = rawWords.filter(w => !stopWords.has(normalizeText(w)));

  const topicKeyword = meaningfulWords.length > 0 ? meaningfulWords[meaningfulWords.length - 1] : (rawWords[rawWords.length - 1] || 'tuto otázku');
  const topicNoun = meaningfulWords.length > 0 ? meaningfulWords[0] : (rawWords[0] || 'to');

  const dynamicPool = {
    eliska: [
      `Když se podíváme na téma ${topicKeyword}, tak správná odpověď spočívá v tom, jak to funguje v přírodě a ve vědě!`,
      `O ${topicKeyword} jsem se učila! Správně to souvisí s pravidly, která jsme probírali!`,
      `Ano, paní učitelko! ${topicNoun ? capitalize(topicNoun) : 'To'} je přesně to, na co se ptáte!`
    ],
    matyas: [
      `Kdybych byl ${topicKeyword}, tak bych dělal kotrmelce a rozdával všem bonbóny!`,
      `A co kdyby ${topicNoun} mělo křídla a létalo jako vrtulník? To by byla legrace!`,
      `Podle mého šaškovského názoru ${topicKeyword} zkrátka vyhrává zlatou medaili!`
    ],
    tomas: [
      `Já... já myslím, že ${topicKeyword} je velmi zajímavé téma... četl jsem si o tom...`,
      `Bál jsem se přihlásit, ale o ${topicKeyword} vím, že je to moc důležité...`
    ],
    filip: [
      `S ${topicKeyword} by se dal vymyslet skvělý sportovní zápas na hřišti!`,
      `Když se soustředíme na ${topicKeyword}, je to jako natrénovat vítězný gól!`
    ],
    kuba: [
      `Ať už je ${topicKeyword} cokoliv, hned jsem z toho přemýšlení dostal obrovský hlad!`,
      `Kdyby se ${topicKeyword} dalo sníst k svačině, hned bych si přidal nášup!`
    ],
    sofie: [
      `Představuji si ${topicKeyword} jako nádherný barevný obrázek na výkrese!`,
      `Kdybych měla ${topicKeyword} namalovat, použila bych ty nejzářivější barvy!`
    ],
    viktorie: [
      `Jasná věc, paní učitelko! ${topicNoun ? capitalize(topicNoun) : 'To'} je pořádná výzva a já na to mám svůj jasný názor!`,
      `To je přece jasné, s ${topicKeyword} si poradíme raz dva!`
    ],
    ondra: [
      `Zív... O ${topicKeyword} se mi zrovna před chvilkou zdál takový zvláštní sen...`,
      `Kdyby ${topicKeyword} umělo tiše ukolébávat ke spánku, byl by to nejlepší vynález...`
    ]
  };

  const poolIds = ['eliska', 'matyas', 'tomas', 'filip', 'kuba', 'sofie', 'viktorie', 'ondra'];
  const chosen = selectRealisticRaisingStudents(poolIds, addressedStudentId);
  if (!addressedStudentId && !chosen.includes('eliska') && !chosen.includes('tomas')) {
    chosen[0] = 'eliska';
  }

  return chosen.map(id => ({
    studentId: id,
    answer: pickRandom(dynamicPool[id]),
    isCorrect: id === 'eliska' || id === 'tomas' || id === 'viktorie',
    state: 'raising_hand'
  }));
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * ==========================================
 * "JSEM ŽÁČEK" (STUDENT MODE) TEACHER AI
 * ==========================================
 */

/**
 * The child asks Paní učitelka a question - she answers warmly and understandably
 */
export async function askTeacherAQuestion(questionText, playerName = 'Terezka') {
  const apiKey = getActiveApiKey();

  if (apiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const prompt = `Jsi velmi laskavá, moudrá a přátelská paní učitelka ve 3. třídě základní školy.
Tvůj žáček, holčička ${playerName}, se tě právě zvídavě zeptala:
"${questionText}"

Odpověz jí laskavě, poutavě a srozumitelně pro 8leté dítě:
1. Odpověz v 1 až 3 krátkých mluvených větách v přirozené češtině (žádný encyklopedický text!).
2. Můžeš ji oslovit jménem "${playerName}".
3. Pochval její zvídavost!

Odpověz POUZE jako prostý text odpovědi bez uvozovek a bez formátování.`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8500);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.8 }
          }),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) return reply;
        }
      } catch {
        // try next or fallback
      }
    }
  }

  // Offline fallback answer
  const qNorm = normalizeText(questionText);
  if (qNorm.includes('prestavk') || qNorm.includes('zvon')) {
    return `Přestávka bude za chviličku, ${playerName}! Ještě chvíli dáme pozor a pak si můžeme hrát na chodbě.`;
  }
  if (qNorm.includes('obed') || qNorm.includes('hlad') || qNorm.includes('jideln')) {
    return `Na oběd půjdeme hned po čtvrté hodině, ${playerName}. Dneska prý voní ze školní jídelny samé dobroty!`;
  }
  if (qNorm.includes('kresl') || qNorm.includes('malov')) {
    return `Určitě budeme kreslit, ${playerName}! Na výtvarnou výchovu si připravíme vodovky i barevné pastelky.`;
  }
  if (qNorm.includes('kolik') && qNorm.includes('noh')) {
    return `To je skvělá otázka, ${playerName}! Většina hmyzu má šest nožiček a pavouci jich mají rovných osm.`;
  }

  return `To je moc hezká a chytrá otázka, ${playerName}! Jsem moc ráda, že tě to zajímá. V přírodovědě si o tom povíme ještě mnohem víc!`;
}

const CZECH_NUMBER_MAP = {
  '0': ['nula'],
  '1': ['jedna', 'jeden'],
  '2': ['dva', 'dve'],
  '3': ['tri'],
  '4': ['ctyri'],
  '5': ['pet'],
  '6': ['sest'],
  '7': ['sedm'],
  '8': ['osm'],
  '9': ['devet'],
  '10': ['deset'],
  '25': ['dvacet pet', 'dvacetpet'],
  '27': ['dvacet sedm', 'dvacetsedm'],
  '45': ['ctyricet pet', 'ctyricetpet'],
  '100': ['sto']
};

export function stripAnswerFillers(s) {
  let norm = (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  norm = norm.replace(/\b(myslim si ze|myslim ze|myslim si|myslim|je to|jsou to|bude to|asi|mozna|podle me|podle mne|rekla bych ze|rekl bych ze|odpoved je|pani ucitelko|pane uciteli|prosim|ze|a)\b/g, ' ');
  return norm.replace(/\s+/g, ' ').trim();
}

export function checkAnswerCorrectness(playerAnswer, correctAnswersList) {
  const cleaned = stripAnswerFillers(playerAnswer);
  if (!cleaned) return false;

  // Explicit non-answers
  const dontKnow = ['nevim', 'netusim', 'nevimto', 'nevim to', 'nemam poneti', 'nevim nic'];
  if (dontKnow.includes(cleaned)) return false;

  const validSet = new Set();
  for (const ca of (correctAnswersList || [])) {
    const caClean = stripAnswerFillers(ca);
    if (caClean) validSet.add(caClean);
    for (const [digit, words] of Object.entries(CZECH_NUMBER_MAP)) {
      if (caClean === digit || words.includes(caClean)) {
        validSet.add(digit);
        words.forEach(w => validSet.add(w));
      }
    }
  }

  // Check flag colors special case
  if (validSet.has('bila') || validSet.has('bila cervena modra')) {
    const colors = ['bila', 'cervena', 'modra'];
    const matched = colors.filter(c => cleaned.includes(c));
    if (matched.length >= 2) return true;
  }

  // 1. Exact match or word boundary regex
  for (const valid of validSet) {
    if (cleaned === valid) return true;
    const regex = new RegExp('(^|\\s)' + valid + '($|\\s)', 'i');
    if (regex.test(cleaned)) return true;
  }

  // 2. Stem matching for longer words (e.g. tučňák -> tučňáci, karkulka -> karkulku, perník -> perníčky)
  for (const valid of validSet) {
    if (valid.length >= 4) {
      const stem = valid.slice(0, Math.min(valid.length - 1, 6));
      if (cleaned.includes(stem)) return true;
    }
  }

  return false;
}

/**
 * Paní učitelka evaluates the child's answer to her question
 * Strictly verifies correctness: never awards stars or praise for nonsense or wrong answers!
 */
export async function evaluateStudentAnswer(questionInput, playerAnswer, playerName = 'Terezka') {
  let questionText = '';
  let correctAnswers = [];
  let teacherPraise = '';

  if (typeof questionInput === 'object' && questionInput !== null) {
    questionText = questionInput.question || '';
    correctAnswers = questionInput.correctAnswers || [];
    teacherPraise = questionInput.praise || '';
  } else {
    questionText = String(questionInput || '');
    const found = TEACHER_QUESTIONS_BANK.find(q =>
      normalizeText(q.question) === normalizeText(questionText) ||
      (q.question && questionText && q.question.toLowerCase().includes(questionText.toLowerCase().slice(0, 15)))
    );
    if (found) {
      correctAnswers = found.correctAnswers || [];
      teacherPraise = found.praise || '';
    }
  }

  const mainAnswer = (correctAnswers && correctAnswers[0]) || '';
  const isDeterministicCorrect = checkAnswerCorrectness(playerAnswer, correctAnswers);

  const apiKey = getActiveApiKey();
  if (apiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const prompt = `Jsi laskavá a moudrá paní učitelka ve 3. třídě základní školy.
Položila jsi třídě tuto otázku:
"${questionText}"
Správné odpovědi jsou například: ${correctAnswers.join(', ') || 'podle skutečnosti'}

Tvůj žáček, 8letá holčička ${playerName}, ti právě odpověděla:
"${playerAnswer}"

DŮLEŽITÁ PEDAGOGICKÁ PRAVIDLA:
1. Posuď přísně, zda je odpověď fakticky správná.
2. Pokud je odpověď NESMYSLNÁ, ŠPATNÁ, JINÉ ČÍSLO, JINÉ ZVÍŘE nebo dítě řeklo "nevím" (např. na otázku kolik nohou má pavouk řeklo "traktor", "deset" nebo "nevím"):
   - Dítěti NESMÍŠ dát hvězdičku ani jedničku!
   - Nastav isCorrect: false a grade: null.
   - Napiš laskavé, povzbudivé vysvětlení s oslovením "${playerName}", kde jí prozradíš správnou odpověď, např.: "Ale kdepak, ${playerName}! Pavouci mají osm nohou, ne ${playerAnswer}. Nevadí, společně se to naučíme!"
3. Pokud je odpověď SPRÁVNÁ:
   - Nastav isCorrect: true a grade: "star".
   - Napiš nadšenou pochvalu s oslovením "${playerName}".

Odpověz POUZE jako validní JSON:
{
  "evaluationText": "Text hodnocení paní učitelky...",
  "grade": "star" | null,
  "isCorrect": true | false
}`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8500);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 300, responseMimeType: 'application/json' }
          }),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = JSON.parse(raw);
          if (parsed && parsed.evaluationText) {
            // Safety guard: if our deterministic validator says FALSE, but AI mistakenly said TRUE, enforce FALSE!
            if (correctAnswers.length > 0 && !isDeterministicCorrect && parsed.isCorrect) {
              parsed.isCorrect = false;
              parsed.grade = null;
              parsed.evaluationText = `Ale kdepak, ${playerName}! „${playerAnswer}“ to není. Správná odpověď je ${mainAnswer}. Nevadí, příště to zkusíme znovu!`;
            }
            return parsed;
          }
        }
      } catch {
        // try next
      }
    }
  }

  // Deterministic offline evaluation
  const cleaned = stripAnswerFillers(playerAnswer);
  const isDontKnow = !cleaned || cleaned === 'nevim' || cleaned === 'netusim';

  if (isDeterministicCorrect) {
    const praiseText = teacherPraise
      ? `Výborně, ${playerName}! ${teacherPraise}`
      : `Skvěle, ${playerName}! To je přesně správná odpověď, mám z tebe velkou radost!`;

    return {
      evaluationText: praiseText,
      grade: 'star',
      isCorrect: true
    };
  }

  // Incorrect or nonsense answer
  if (isDontKnow) {
    return {
      evaluationText: `Nevadí, ${playerName}, to se stane každému! Správná odpověď je ${mainAnswer || 'trochu jiná'}. Příště to určitě budeš vědět!`,
      grade: null,
      isCorrect: false
    };
  }

  return {
    evaluationText: `Ale kdepak, ${playerName}! „${playerAnswer.trim()}“ to není. Správná odpověď je ${mainAnswer || 'jiná'}. Nevadí, společně se to naučíme!`,
    grade: null,
    isCorrect: false
  };
}

