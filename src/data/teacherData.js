// Teacher Data and Question Bank for "Jsem žáček" (Student Mode)

export const TEACHER_QUESTIONS_BANK = [
  // Matematika a počty
  {
    id: 'm1',
    category: 'math',
    categoryLabel: '🔢 Počty',
    question: 'Kolik nohou má pavouk?',
    hint: 'Má o dvě nohy víc než hmyz.',
    correctAnswers: ['osm', '8', '8 nohou', 'osm nohou'],
    praise: 'Výborně! Pavouci mají osm nohou, protože patří mezi pavoukovce, zatímco hmyz má jen šest!'
  },
  {
    id: 'm2',
    category: 'math',
    categoryLabel: '🔢 Počty',
    question: 'Kolik je 5 krát 5?',
    hint: 'Zkus spočítat pětky: 5, 10, 15, 20...',
    correctAnswers: ['25', 'dvacet pět', 'dvacetpět'],
    praise: 'Přesně tak, 25! Malou násobilku máš v malíčku!'
  },
  {
    id: 'm3',
    category: 'math',
    categoryLabel: '🔢 Počty',
    question: 'Kolik je 12 plus 15?',
    hint: 'Nejdřív sečti desítky (10 + 10) a pak jednotky (2 + 5).',
    correctAnswers: ['27', 'dvacet sedm', 'dvacetsedm'],
    praise: 'Skvěle spočítáno, je to přesně 27!'
  },
  {
    id: 'm4',
    category: 'math',
    categoryLabel: '🔢 Počty',
    question: 'Kolik minut má jedna celá vyučovací hodina?',
    hint: 'Je to o 15 minut méně než celá hodina na hodinách.',
    correctAnswers: ['45', '45 minut', 'čtyřicet pět', 'ctyricet pet'],
    praise: 'Správně! Školní hodina trvá přesně 45 minut!'
  },
  {
    id: 'm5',
    category: 'math',
    categoryLabel: '🔢 Počty',
    question: 'Kolik stran má trojúhelník?',
    hint: 'Nápověda je už v samotném názvu tvaru!',
    correctAnswers: ['3', 'tři', 'tri', 'tři strany'],
    praise: 'Jasně, trojúhelník má tři strany a tři vrcholy!'
  },

  // Příroda a zvířata
  {
    id: 'n1',
    category: 'nature',
    categoryLabel: '🐾 Příroda',
    question: 'Které zvíře je nejrychlejší běžec na souši?',
    hint: 'Je to kočkovitá šelma se skvrnami na srsti.',
    correctAnswers: ['gepard', 'gepard africký', 'gepardi'],
    praise: 'Úžasné! Gepard dokáže běžet rychlostí přes 100 kilometrů v hodině!'
  },
  {
    id: 'n2',
    category: 'nature',
    categoryLabel: '🐾 Příroda',
    question: 'Co dělají stromy na podzim se svým listím?',
    hint: 'Listí změní barvu a potom...',
    correctAnswers: ['shazují', 'shazují listí', 'opadává', 'opadají', 'opadá', 'spadne'],
    praise: 'Výborně! Listnaté stromy na podzim shazují listí, aby v zimě nezmrzly a ušetřily vodu!'
  },
  {
    id: 'n3',
    category: 'nature',
    categoryLabel: '🐾 Příroda',
    question: 'Který pták neumí létat, ale skvěle plave a žije na sněhu a ledu?',
    hint: 'Nosí černobílý „frak“ a kolébá se při chůzi.',
    correctAnswers: ['tučňák', 'tucnak', 'tučňáci'],
    praise: 'Správně, je to tučňák! Jeho křídla fungují ve vodě jako ploutve!'
  },
  {
    id: 'n4',
    category: 'nature',
    categoryLabel: '🐾 Příroda',
    question: 'Co dělají včelky v úlu a co z toho sladkého vyrábějí?',
    hint: 'Dáváme si to do čaje nebo mažeme na vánočku.',
    correctAnswers: ['med', 'medík', 'vyrábějí med'],
    praise: 'Přesně tak, med! Včelky sbírají nektar z květů a dělají z něj lahodný med.'
  },
  {
    id: 'n5',
    category: 'nature',
    categoryLabel: '🐾 Příroda',
    question: 'Které zvíře má na zádech ostny a když se lekne, svine se do pichlavé kuličky?',
    hint: 'V pohádkách na nich nosí jablíčko.',
    correctAnswers: ['ježek', 'jezek'],
    praise: 'Ano, ježek! Ostny ho spolehlivě chrání před liškou i dravci.'
  },

  // Pohádky a čeština
  {
    id: 'f1',
    category: 'fairy',
    categoryLabel: '📖 Pohádky',
    question: 'Jak se jmenovala holčička, která šla lesem za babičkou a nesla v košíku bábovku?',
    hint: 'Měla na hlavě červený čepeček.',
    correctAnswers: ['karkulka', 'červená karkulka', 'cervena karkulka'],
    praise: 'Správně, Červená Karkulka! A v lese potkala mlsného vlka.'
  },
  {
    id: 'f2',
    category: 'fairy',
    categoryLabel: '📖 Pohádky',
    question: 'Z čeho byla postavená chaloupka, kterou v lese našli Jeníček a Mařenka?',
    hint: 'Byla sladká a drolila se z ní perníková střecha.',
    correctAnswers: ['z perníku', 'perník', 'perníková', 'pernicky', 'perníčků'],
    praise: 'Ano, Perníková chaloupka! A bydlela v ní ježibaba.'
  },
  {
    id: 'f3',
    category: 'fairy',
    categoryLabel: '📖 Pohádky',
    question: 'Která pohádková princezna ztratila na plese křišťálový střevíček?',
    hint: 'Měla zlou macechu a pomohly jí tři kouzelné oříšky.',
    correctAnswers: ['popelka', 'popelka s oříšky'],
    praise: 'Přesně tak, Popelka! A princ ji podle střevíčku našel.'
  },
  {
    id: 'f4',
    category: 'fairy',
    categoryLabel: '📖 Pohádky',
    question: 'Jaké zvířátko nosilo v pohádce modré kalhotky s velkými kapsami?',
    hint: 'Žije pod zemí a dělá hromádky hlíny na zahradě.',
    correctAnswers: ['krtek', 'krteček', 'krtecek'],
    praise: 'Nádhera, Krteček od Zdeňka Milera! Do kapes se mu vešlo všechno na světě.'
  },

  // Všeobecný přehled & Zeměpis
  {
    id: 'g1',
    category: 'world',
    categoryLabel: '🌍 Svět kolem nás',
    question: 'Jak se jmenuje hlavní město České republiky?',
    hint: 'Protéká jím řeka Vltava a stojí tam Karlův most.',
    correctAnswers: ['praha', 'hlavní město praha'],
    praise: 'Výborně! Praha, stověžaté město a srdce naší země!'
  },
  {
    id: 'g2',
    category: 'world',
    categoryLabel: '🌍 Svět kolem nás',
    question: 'Jaké tři barvy má česká státní vlajka?',
    hint: 'Dva pruhy a modrý klín.',
    correctAnswers: ['bílá červená modrá', 'bila cervena modra', 'bílá, červená, modrá', 'modrá bílá červená', 'červená bílá modrá'],
    praise: 'Přesně tak! Nahoře bílá, dole červená a vlevo modrý klín!'
  },
  {
    id: 'g3',
    category: 'world',
    categoryLabel: '🌍 Svět kolem nás',
    question: 'Kolik ročních období máme v průběhu jednoho roku?',
    hint: 'Jaro, léto, podzim a...',
    correctAnswers: ['4', 'čtyři', 'ctyri', 'čtyři roční období'],
    praise: 'Skvěle! Jaro, léto, podzim a zima – celkem čtyři krásná období.'
  },

  // Zábavné hádanky
  {
    id: 'r1',
    category: 'riddle',
    categoryLabel: '💡 Hádanky',
    question: 'Hádanka: Má to zuby, ale nekouše to. Co je to?',
    hint: 'Ráno tím češeme vlasy.',
    correctAnswers: ['hřeben', 'hreben', 'hřebínek', 'pila'],
    praise: 'Bravo! Je to hřeben na vlasy (nebo pila na dřevo)!'
  },
  {
    id: 'r2',
    category: 'riddle',
    categoryLabel: '💡 Hádanky',
    question: 'Hádanka: Co letí, i když to nemá křídla, a nikdy se to nevrátí zpátky?',
    hint: 'Tiká to na stěně a měří se to na hodinkách.',
    correctAnswers: ['čas', 'cas'],
    praise: 'Úžasné, je to čas! Páni, ty jsi ale hlavička!'
  }
];

export const TEACHER_CALLOUT_PHRASES = [
  '{name}, vidím tvou zvednutou ručičku! Pověz nám to!',
  'Výborně, {name}, hlásíš se jako blesk! Jaká je odpověď?',
  '{name}, copak tě napadlo? Všichni tě pozorně posloucháme!',
  'Pověz nám to, {name}, jsem moc zvědavá na tvou odpověď!',
  '{name}, ty to víš? Sem s tím, posloucháme!',
  'Tak povídej, {name}, celá třída napjatě čeká!',
  '{name}, zvedáš ruku první, copak to podle tebe je?',
  'Výborně, {name}, slyšíme tě, řekni nám to!',
  '{name}, dneska máš ale skvělý postřeh! Jak to tedy je?',
  'Šup sem s odpovědí, {name}, moc se těším, co nám povíš!',
  '{name}, pověz nám svůj nápad, určitě to víš!',
  'Ano, {name}, copak je správná odpověď?',
  'Terezko, poslouchejme tě, copak si myslíš?',
  '{name}, hlásíš se tak hezky! Pověz to celé třídě!',
  'Skvěle, {name}, máš slovo, posloucháme!'
];

export const TEACHER_NEXT_QUESTION_PHRASES = [
  'Pojďme na další hádanku!',
  'Mám pro vás další zajímavou otázku:',
  'Výborně! Podíváme se na tabuli na další úkol:',
  'A kdopak z vás ví tohle?',
  'Schválně, kdo z vás to uhodne:',
  'Otočíme list v sešitě a zkusíme něco nového:',
  'Jste připraveni na další otázku? Tady je:',
  'Poslouchejte pozorně další hádanku:',
  'Výborně, dáme si další otázku z tabule:',
  'Kdopak ví odpověď na tohle?',
  'Mám tu pro vás další oříšek k rozlousknutí:',
  'Pozor na další zapeklitou otázku:'
];

export const TEACHER_PRAISE_LINES = [
  'Výborně, {name}! {praise}',
  'Páni, {name}, ty jsi dneska ale hlavička! {praise}',
  'Nádherná odpověď, {name}! Mám z tebe obrovskou radost!',
  'To je přesně ono, {name}! {praise}',
  'Skvělá práce, {name}! Takhle pohotovou odpověď jsem ani nečekala!',
  'Jednička s hvězdičkou pro {name}! Přesně tak to je!',
  'Bravo, {name}! Celá třída ti tleská!',
  'To je trefa do černého, {name}! {praise}',
  'Úžasné, {name}! Jsi neuvěřitelně šikovná!',
  'Páni, {name}, ty to sypeš z rukávu! {praise}',
  'Správně, {name}! Je vidět, jak krásně dáváš pozor!',
  'Přesně tak, {name}! Za tohle si zasloužíš velkou zlatou hvězdičku!',
  'Klobouk dolů, {name}, odpověděla jsi naprosto bravurně!',
  'Krásná a bystrá odpověď, {name}! Mám z tebe velkou pedagogickou radost!'
];

export const TEACHER_CORRECTION_LINES = [
  'Ale kdepak, {name}! „{answer}“ to není. Správná odpověď je {mainAnswer}. Nevadí, společně se to naučíme!',
  'Jejda, {name}, to ses trošku spletla. Je to {mainAnswer}, ne {answer}. Zkusíme další otázku!',
  'Kdepak, beruško, to není správně. Správně je {mainAnswer}. Příště to určitě trefíš!',
  'Ale copak to slyším, {name}? „{answer}“ nám tady nesedí. Je to přece {mainAnswer}! Nevadí, chybami se člověk učí!',
  'Těsně vedle, {name}! „{answer}“ to sice není, správně je {mainAnswer}, ale cením, že ses nebála zkusit to!',
  'No toto, {name}! Kde se v téhle otázce vzalo „{answer}“? Správně je {mainAnswer}. Dáme si další otázku!',
  'Hmm, to byl zajímavý nápad, {name}, ale ve skutečnosti je to {mainAnswer}. Příště to vyjde!',
  'Kdepak, {name}, tudy cesta nevede. Správně je {mainAnswer}. Zkusíme další hádanku!',
  'Ach kdepak, {name}, to se ti popletlo. Je to přece {mainAnswer}! Zkusíme další úkol!',
  'Neboj se, {name}, žádný učený z nebe nespadl. Správně je {mainAnswer}. Příště se to povede!'
];

export const TEACHER_DONTKNOW_LINES = [
  'To vůbec nevadí, {name}, nikdo neví všechno! Správná odpověď je {mainAnswer}. Příště už si to budeš pamatovat!',
  'Nevadí, {name}, to se stane každému! Je to {mainAnswer}. Hlavu vzhůru, jdeme na další otázku!',
  'Žádný strach, {name}! Správná odpověď je {mainAnswer}. Od toho jsme ve škole, abychom se to společně naučili!',
  'Vůbec nic se neděje, {name}. Správně je {mainAnswer}. Podíváme se na další zajímavý úkol!',
  'To je v pořádku, {name}! Dneska ses dozvěděla, že je to {mainAnswer}. A o tom škola je!'
];

// Anti-repetition state trackers
let lastCalloutIdx = -1;
let lastNextQIdx = -1;
let lastPraiseIdx = -1;
let lastCorrectionIdx = -1;
let lastDontKnowIdx = -1;

function pickNonRepeating(arr, lastIdx) {
  if (!arr || arr.length === 0) return { item: '', idx: -1 };
  if (arr.length === 1) return { item: arr[0], idx: 0 };
  let idx = Math.floor(Math.random() * arr.length);
  if (idx === lastIdx) {
    idx = (idx + 1) % arr.length;
  }
  return { item: arr[idx], idx };
}

export function toCzechVocative(name) {
  if (!name) return 'beruško';
  const n = name.trim();
  if (n.toLowerCase().endsWith('ka')) return n.slice(0, -1) + 'o';
  if (n.toLowerCase().endsWith('a')) return n.slice(0, -1) + 'o';
  return n;
}

export function getNonRepeatingCallout(playerName = 'Terezka') {
  const { item, idx } = pickNonRepeating(TEACHER_CALLOUT_PHRASES, lastCalloutIdx);
  lastCalloutIdx = idx;
  const voc = toCzechVocative(playerName);
  return item.replace(/{name}/g, voc);
}

export function getNonRepeatingNextQuestionIntro() {
  const { item, idx } = pickNonRepeating(TEACHER_NEXT_QUESTION_PHRASES, lastNextQIdx);
  lastNextQIdx = idx;
  return item;
}

export function getNonRepeatingPraise(playerName = 'Terezka', specificPraise = '') {
  const { item, idx } = pickNonRepeating(TEACHER_PRAISE_LINES, lastPraiseIdx);
  lastPraiseIdx = idx;
  const voc = toCzechVocative(playerName);
  const praisePart = specificPraise ? specificPraise : 'Mám z tebe velkou radost!';
  return item.replace(/{name}/g, voc).replace(/{praise}/g, praisePart).trim();
}

export function getNonRepeatingCorrection(playerName = 'Terezka', playerAnswer = '', mainAnswer = '') {
  const { item, idx } = pickNonRepeating(TEACHER_CORRECTION_LINES, lastCorrectionIdx);
  lastCorrectionIdx = idx;
  const voc = toCzechVocative(playerName);
  return item
    .replace(/{name}/g, voc)
    .replace(/{answer}/g, playerAnswer.trim() || 'tohle')
    .replace(/{mainAnswer}/g, mainAnswer || 'jinak')
    .trim();
}

export function getNonRepeatingDontKnow(playerName = 'Terezka', mainAnswer = '') {
  const { item, idx } = pickNonRepeating(TEACHER_DONTKNOW_LINES, lastDontKnowIdx);
  lastDontKnowIdx = idx;
  const voc = toCzechVocative(playerName);
  return item
    .replace(/{name}/g, voc)
    .replace(/{mainAnswer}/g, mainAnswer || 'jinak')
    .trim();
}
