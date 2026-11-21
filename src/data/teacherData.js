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
  '{name}, vidím, že se hlásíš! Pověz nám to!',
  'Výborně, {name}, ty to víš? Posloucháme!',
  '{name}, zvedáš ruku jako první, jaká je odpověď?',
  'Pověz nám to, {name}, jsem zvědavá na tvou odpověď!'
];

export const TEACHER_PRAISE_LINES = [
  'Výborně, {name}! To je přesně ono!',
  'Nádhera, {name}! Za takovou krásnou odpověď si zasloužíš hvězdičku!',
  'Skvělá práce, {name}! Jsi moc šikovná!',
  'Přesně tak! Třída tě pozorně poslouchala a všichni ti tleskají!'
];
