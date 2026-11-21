// Students Database for "Paní učitelka"
// 8 unique characters with varied pools of reactions, voice tunings, and idle lines

export const INITIAL_STUDENTS = [
  {
    id: 'eliska',
    name: 'Eliška',
    nickname: 'Šprtka',
    roleTitle: 'Vzorná žákyně',
    desk: { row: 1, col: 1, seat: 'left' },
    hairColor: '#8D5524',
    hairStyle: 'pigtails',
    clothesColor: '#FF6B8B',
    glasses: true,
    skinTone: '#FFDFC4',
    accessory: 'glasses',
    voice: { pitch: 1.35, rate: 1.15 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Paní učitelko, já mám hotový i bonusový úkol ze včerejška!',
      'Můžu jít prosím smazat a umýt tabuli houbou?',
      'Já se tak strašně těším na novou látku!',
      'Paní učitelko, vypsala se mi modrá propiska, ale mám tři náhradní!',
      'Včera jsem přečetla celou novou knížku o zvířátkách!',
      'Mám sešit srovnaný podle pravítka!',
      'Budeme dneska psát malý opakovací kvíz? Já bych moc chtěla!'
    ],
    gradeReactions: {
      1: [
        'Jupí! Jednička! Hned si ji zapíšu do deníčku!',
        'Hurá! Maminka i tatínek budou mít obrovskou radost!',
        'Děkuji moc, paní učitelko Terezko, celou neděli jsem se poctivě učila!',
        'Jéje, jednička s čistým štítem, to je paráda!'
      ],
      star: [
        'Jéje, paní učitelko Terezko, zlatá hvězdička! Vy jste nejlepší na světě!',
        'Třpytivá hvězdička! To je ten nejkrásnější den v mém životě!',
        'Děkuji za hvězdičku, hned si ji dám na první stranu sešitu!'
      ],
      2: [
        'Dvojka je taky hezká, ale příště to dám na čistou jedničku!',
        'Děkuji! Dvojka je fajn, jenom jsem přehlédla malou chybičku.',
        'Příště zaberu ještě víc, paní učitelko!'
      ],
      3: [
        'Aha, trojka... musím se na to ještě doma pořádně podívat s mamkou.',
        'Dobře, paní učitelko, slibuji, že si to pravidlo zopakuji!',
        'Trojka je sice dobře, ale já chci být výborná!'
      ],
      4: [
        'Jejda, to se mi moc nepovedlo... Budu se víc snažit, slibuju!',
        'Ouvej, to byl těžký chyták... Příště budu dávat větší pozor.'
      ],
      5: [
        'Ouvej, pětka... To mě moc mrzí paní učitelko, hned dnes se to doučím!',
        'Ach jo... Já jsem to popletla. Můžu si to zítra opravit?'
      ]
    },
    stampReactions: {
      plane: [
        'Ale já vlaštovky neházím! To byl určitě Matyáš!',
        'Já jsem tu vlaštovku jen zvedla ze země, abych ji vyhodila do koše!'
      ],
      talk: [
        'Pardon, já jen vysvětlovala Ondrovi ten příklad...',
        'Už mlčím jako ryba, paní učitelko!'
      ],
      sleep: [
        'Já nespala, jen jsem hluboce přemýšlela se zavřenýma očima!',
        'Já jen hledala spadlou gumu pod lavicí!'
      ],
      homework: [
        'Jejda, já si sešit zapomněla na stole v pokojíčku, přísahám!',
        'Já ho měla hotový, mamka vám to klidně dosvědčí!'
      ],
      praise: [
        'Moc děkuji za pochvalu, paní učitelko Terezko! Jste zlatá!',
        'Děkuji! Budu se snažit pomáhat i ostatním dětem!'
      ],
      snack: [
        'Já jen pila čistou vodu z lahve, paní učitelko!',
        'Byl to jen hroznový cukr na posílení paměti!'
      ]
    }
  },
  {
    id: 'matyas',
    name: 'Matyáš',
    nickname: 'Třídní šašek',
    roleTitle: 'Vtipálek a rošťák',
    desk: { row: 1, col: 1, seat: 'right' },
    hairColor: '#E65100',
    hairStyle: 'messy',
    clothesColor: '#FFB300',
    glasses: false,
    skinTone: '#F0D5BE',
    accessory: 'cap_backwards',
    voice: { pitch: 1.15, rate: 1.25 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Paní učitelko, víte, co dělá ryba na suchu? Leká se!',
      'Můžu jít na záchod? Mám tam rozdělanou důležitou tajnou věc!',
      'Můj pes mi dneska sežral úkol, čestné slovo!',
      'Proč se učíme vyjmenovaná slova, když máme klávesnici s našeptávačem?',
      'Paní učitelko Terezko, máte dneska hrozně hezké náušnice, nepíšeme dneska test, že ne?',
      'Udělal jsem pod lavicí kouzlo: zmizela mi guma na mazání!',
      'Kdybych byl ředitel školy, přestávky by trvaly 45 minut a hodiny 5 minut!'
    ],
    gradeReactions: {
      1: [
        'Nááádhera! Já jsem génius! Mamka mi koupí trojitou zmrzlinu!',
        'Vidíte to? I mistr šašek dokáže vykouzlit čistou jedničku!',
        'Jupí! Dneska jsem králem třídy!',
        'Jednička! Hned si ji vyfotím a pošlu babičce!'
      ],
      star: [
        'Hvězdička pro mistra šaška! No to mě podržte, to je pecka!',
        'Zlatá hvězda na čelo! Jsem šoumen a génius v jednom!'
      ],
      2: [
        'Dvojka? Beru všema deseti, to je úplná pohodička!',
        'Dvojka ujde, to je jak stříbrná medaile na olympiádě!',
        'Lepší dvojka v kapse než pětka na střeše!'
      ],
      3: [
        'Trojka je zlatý školní střed, paní učitelko!',
        'Tři body z deseti... počkat, vlastně trojka je dobrá známka, ne?',
        'Trojka neurazí, jdeme dál!'
      ],
      4: [
        'Uf, ještě že ne pětka! To jsem z toho vyvázl o fous!',
        'Čtyřka je jenom takové varovné cinknutí budíku!'
      ],
      5: [
        'Ajajáj, to bude doma tanec... slibuju, že už budu hodnej!',
        'Ouvej, pětka mi spadla přímo na hlavu! Zítra to napravím!'
      ]
    },
    stampReactions: {
      plane: [
        'Ta vlaštovka měla přistávací manévr přímo na tabuli!',
        'Testoval jsem nový proudový motor, pardon paní učitelko!'
      ],
      talk: [
        'Já nevyrušoval, já jen dělal k výkladu zvukový doprovod!',
        'Jenom jsem se ptal Ondry, jestli ještě žije nebo už spí!'
      ],
      sleep: [
        'Já nespal, já měl jen takový rychlý počítačový restart mozku!',
        'Zkoušel jsem, jak je lavice magnetická na moje čelo!'
      ],
      homework: [
        'Domácí úkol mi unesli mimozemšťani, přísahám na svou čepici!',
        'Můj sešit zůstal v tajné schránce pod postelí!'
      ],
      praise: [
        'Hustýýý! I šašek může dostat velkou pochvalu, paráda!',
        'Díky, paní učitelko! Dneska budu hodný aspoň do dvanácti!'
      ],
      snack: [
        'To nebyla svačina, to byla vitamínová první pomoc pro můj mozek!',
        'Ta sušenka mi sama spadla do pusy, vážně!'
      ]
    }
  },
  {
    id: 'ondra',
    name: 'Ondra',
    nickname: 'Spáč',
    roleTitle: 'Tichý snílek',
    desk: { row: 1, col: 2, seat: 'left' },
    hairColor: '#3E2723',
    hairStyle: 'floppy',
    clothesColor: '#5C6BC0',
    glasses: false,
    skinTone: '#F3E5AB',
    accessory: 'pillow_head',
    voice: { pitch: 0.82, rate: 0.78 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Zzz... hm... cože? Už zvoní na konec hodiny?',
      'Paní učitelko, já v noci počítal ovečky a usnul až u té sté...',
      'Můžu si ještě na chvilku položit hlavu na lavici? Je tak chladivá...',
      'Mně se dneska zdálo, že ve škole místo psaní jenom ležíme na gauči...',
      'Zív... kolik ještě zbývá minut do oběda?',
      'Ráno mě maminka budila třikrát a stejně se mi ještě klíží očka...'
    ],
    gradeReactions: {
      1: [
        'Ach jo... Jéje, jednička? Ani nevím jak, ale moc děkuju...',
        'Jéje, to je hezké. To mě skoro probudilo!',
        'Jednička? Tak to se doma vyspím bez řečí, děkuju!'
      ],
      star: [
        'Hvězdička... Tak to se mi snad jenom zdá v tom nejkrásnějším snu...',
        'Zlatá hvězda... svítí jak měsíček na noční obloze...'
      ],
      2: [
        'Dvojka je super, ještě že jste mě neprobudila nadarmo.',
        'Dvojka mi stačí, teď už můžu v klidu dřímat dál.'
      ],
      3: [
        'Trojka ujde... zív... jdu zase spát.',
        'Trojka je fajn odpočinková známka.'
      ],
      4: [
        'Hm, čtyřka... Já byl zrovna myšlenkama v peřinách.',
        'Příště otevřu aspoň jedno oko, slibuju.'
      ],
      5: [
        'Brum... pětka... mamka mě dneska odpoledne nenechá dospat...',
        'Ajaj, to mě doma vzbudí ze spaní...'
      ]
    },
    stampReactions: {
      plane: [
        'Já jsem na házení vlaštovek moc unavený... to byl někdo jiný.',
        'Vlaštovka? Já bych nejradši letěl rovnou do postele.'
      ],
      talk: [
        'Mluvit nahlas vyžaduje hrozně moc energie...',
        'Já nemluvil, já jen ze spaní zívnul!'
      ],
      sleep: [
        'Promiňte paní učitelko... Ta lavice má tak perfektní tvar polštáře... zív.',
        'Já nespal, já jen poslouchal váš hlas se zavřenýma očima...'
      ],
      homework: [
        'Já u toho úkolu včera večer usnul přímo na stole...',
        'Napsal jsem dvě řádky a pak přišel spánkový skřítek...'
      ],
      praise: [
        'Děkuju moc... To mě hned zahřálo u srdíčka!',
        'Děkuju za pochvalu, dneska budu usínat s úsměvem!'
      ],
      snack: [
        'Mňam, kdyby byl polštář z buchty s povidly...',
        'Dojídal jsem kousek rohlíku na energii.'
      ]
    }
  },
  {
    id: 'viktorie',
    name: 'Viktorie',
    nickname: 'Rebelka',
    roleTitle: 'Rychlá a odvážná',
    desk: { row: 1, col: 2, seat: 'right' },
    hairColor: '#1A237E',
    hairStyle: 'punk_braid',
    clothesColor: '#D81B60',
    glasses: false,
    skinTone: '#FFDFC4',
    accessory: 'purple_streak',
    voice: { pitch: 1.05, rate: 1.05 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Paní učitelko, hodina je fajn, ale venku svítí sluníčko a láká na skateboard!',
      'Ta vlaštovka měla perfektní aerodynamiku křídel, viděla jste ten let?',
      'Proč se učíme sedět v lavici, když se dá skákat přes švihadlo?',
      'Mám v kapse novou samolepku s bleskem!',
      'Kdo se bojí, nesmí do lesa ani k tabuli!',
      'Až budu velká, budu jezdit na motorce a řídit vesmírnou loď!'
    ],
    gradeReactions: {
      1: [
        'Jasná věc! Já když chci, tak jsem nejlepší z celé školy!',
        'Bum ho tam! Jednička je doma!',
        'Říkala jsem, že to zvládnu s přehledem!'
      ],
      star: [
        'Hvězdička? No ne, paní učitelko, vy máte vkus! Díky!',
        'Zlatá hvězda pro rebelku! To se bude na skateboardu vyjímat!'
      ],
      2: [
        'Dvojka je v pohodě, žádnej stres, pohoda jazz.',
        'Dvojka stačí na postup do dalšího kola!'
      ],
      3: [
        'Trojka ujde, zítra to napravím rychlým protiútokem!',
        'Trojka je jen taková zahřívací runda.'
      ],
      4: [
        'Čtyřka? To byl jen taktický manévr, abych vás překvapila příště!',
        'Uf, tak to mi trochu ujely brusle...'
      ],
      5: [
        'Uf, tak to jsem přepískla... Promiňte, polepším se, čestné slovo!',
        'Pětka bolí víc než pád na koloběžce. Zítra si to opravím!'
      ]
    },
    stampReactions: {
      plane: [
        'Dobře, uznávám, ta vlaštovka letěla moc nízko. Už ji uklízím do tašky.',
        'Byl to zkušební let! Příště s ní poletím až o přestávce na chodbě.'
      ],
      talk: [
        'Já jen vyjadřovala svůj svobodný názor na přestávku!',
        'Debatovala jsem o taktice na vybíjenou!'
      ],
      sleep: [
        'Spát ve škole? Já nikdy, já mám energie na rozdávání!',
        'Já jsem se jen soustředila na další akci!'
      ],
      homework: [
        'Sešit jsem nechala u skateboardu v předsíni, zítra ho přinesu!',
        'Měla jsem včera trénink, ale úkol dodělám dneska!'
      ],
      praise: [
        'Díky, paní učitelko! Vážím si toho, fakt!',
        'Super, děkuju! Vy jste férová učitelka!'
      ],
      snack: [
        'Žvýkačka pod lavicí? Ta nebyla moje, já žvýkám jen bublinové!',
        'Dávala jsem si jen rychlé sušené ovoce.'
      ]
    }
  },
  {
    id: 'tomas',
    name: 'Tomáš',
    nickname: 'Stydlín',
    roleTitle: 'Citlivý a tichý',
    desk: { row: 2, col: 1, seat: 'left' },
    hairColor: '#5D4037',
    hairStyle: 'curly',
    clothesColor: '#43A047',
    glasses: false,
    skinTone: '#FFE0BD',
    accessory: 'blush',
    voice: { pitch: 1.25, rate: 0.88 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Já... já jsem tady, paní učitelko, dávám pozor.',
      'Můžu vám dojít pro novou křídu do kabinetu?',
      'Děkuji, že na nás nekřičíte, vy jste tak hodná...',
      'Já se bál přihlásit, ale věděl jsem to...',
      'Mám dneska v penále nově ořezané všechny pastelky...',
      'Mám moc rád, když čteme pohádky o zvířátkách.'
    ],
    gradeReactions: {
      1: [
        'Jéje... Děkuji moc, paní učitelko Terezko... Já mám takovou obrovskou radost!',
        'Děkuji... já se tak bál, ale jednička je nádherná...',
        'Maminka bude mít slzy štěstí v očích, děkuji vám!'
      ],
      star: [
        'Zlatá hvězdička pro mě? Já se snad štěstím rozbrečím... Děkuji z celého srdce!',
        'Hvězdička... vy jste na mě tak nesmírně hodná, paní učitelko!'
      ],
      2: [
        'Děkuji moc, dvojka je moc pěkná známka.',
        'Děkuji, budu se ještě víc snažit, aby to příště byla jednička.'
      ],
      3: [
        'Budu se doma ještě učit, aby to příště bylo lepší, slibuji.',
        'Děkuji, zkusím to příště říct hlasitěji a odvážněji.'
      ],
      4: [
        'Omlouvám se, já se v tom trochu ztratil trémou...',
        'Já měl trému... příště to zkusím lépe.'
      ],
      5: [
        'Ach jo... Já se hrozně stydím, paní učitelko... Promiňte...',
        'Omlouvám se... dneska jsem byl moc popletený.'
      ]
    },
    stampReactions: {
      plane: [
        'Já bych se bál hodit vlaštovku, aby někoho netrefila...',
        'Já vlaštovky neskládám, já se bojím, že poletí špatně.'
      ],
      talk: [
        'Já jsem byl tichoučko jako myška v koutku...',
        'Já neříkal nic nahlas, jen jsem se bál nadechnout...'
      ],
      sleep: [
        'Já nespal, jen jsem se bál zvednout oči od sešitu...',
        'Měl jsem jen sklopenou hlavičku.'
      ],
      homework: [
        'Já úkol měl, jen jsem se bál ho nahlas přečíst před třídou...',
        'Mám ho tady napsaný, jen jsem se styděl ho ukázat.'
      ],
      praise: [
        'Moc vám děkuji, paní učitelko Terezko... Vy jste tak strašně hodná...',
        'Pochvala od vás je pro mě ten nejkrásnější dárek!'
      ],
      snack: [
        'Já jím svačinku jenom o přestávce a sedím u toho klidně...',
        'Měl jsem v kapse jen kapesníček, paní učitelko.'
      ]
    }
  },
  {
    id: 'filip',
    name: 'Filip',
    nickname: 'Sportovec',
    roleTitle: 'Běžec a fotbalista',
    desk: { row: 2, col: 1, seat: 'right' },
    hairColor: '#D7CCC8',
    hairStyle: 'short_spiky',
    clothesColor: '#039BE5',
    glasses: false,
    skinTone: '#E0AC69',
    accessory: 'sport_band',
    voice: { pitch: 0.95, rate: 1.22 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Kdy už bude tělocvik? Já chci dát gól do šibenice!',
      'Paní učitelko, udělal jsem pod lavicí dvacet rychlých dřepů!',
      'Můžu vyběhnout do sborovny pro mapu? Budu tam přesně za čtyři vteřiny!',
      'Dneska máme zápas ve fotbale a já budu kapitán!',
      'Včera jsem uběhl kolem hřiště deset koleček bez zadýchání!',
      'Sportovci potřebují hodně vzduchu, nemůžeme otevřít okno?'
    ],
    gradeReactions: {
      1: [
        'GÓÓÓL! Jednička přímo do šibenice! To byl parádní zápas!',
        'První místo na stupních vítězů! Zlatá medaile je doma!',
        'Skóruju jako Ronaldo! Jednička je tam!'
      ],
      star: [
        'Zlatá medaile! Teda hvězdička! Jsem šampion celé školy!',
        'Pohár pro vítěze! Hvězdička svítí jak reflektory na stadionu!'
      ],
      2: [
        'Stříbrná příčka, to beru! Dobrý týmový výkon!',
        'Druhé místo ujde, v odvetě dám jedničku!'
      ],
      3: [
        'Trojka, musím ještě potrénovat kondičku a taktiku!',
        'Trojka je bronz, ale já mířím na zlato!'
      ],
      4: [
        'Žlutá karta... Musím pořádně zabrat ve druhém poločase!',
        'Tohle byl faul na moje známky, musím víc trénovat!'
      ],
      5: [
        'Červená karta a pětka k tomu... Příště dám do toho všechno!',
        'Dneska jsem prohrál zápas, ale zítra vyhraju ligu!'
      ]
    },
    stampReactions: {
      plane: [
        'Trénoval jsem hod oštěpem z papíru, promiňte trenérko... teda paní učitelko!',
        'Zkoušel jsem aerodynamiku pro skoky na lyžích!'
      ],
      talk: [
        'Já jen radil taktiku na velkou přestávku na hřišti!',
        'Probírali jsme rozestavení na odpolední fotbal!'
      ],
      sleep: [
        'Sportovci nespí, sportovci regenerují svaly po tréninku!',
        'Byla to jen minutová pauza mezi poločasy!'
      ],
      homework: [
        'Měl jsem včera těžký trénink, zapomněl jsem sešit ve sportovní tašce!',
        'Zítra ho přinesu hned ráno před rozcvičkou!'
      ],
      praise: [
        'Díky za povzbuzení z trenérské lavičky!',
        'Děkuju, to mě nakopne k novým sportovním rekordům!'
      ],
      snack: [
        'Potřeboval jsem rychlé sacharidy na svaly, promiňte!',
        'Doplňoval jsem elektrolyty z jablíčka!'
      ]
    }
  },
  {
    id: 'sofie',
    name: 'Sofie',
    nickname: 'Umělkyně',
    roleTitle: 'Malířka a tvořilka',
    desk: { row: 2, col: 2, seat: 'left' },
    hairColor: '#F48FB1',
    hairStyle: 'beret_curls',
    clothesColor: '#AB47BC',
    glasses: false,
    skinTone: '#FFDFC4',
    accessory: 'flower_clip',
    voice: { pitch: 1.30, rate: 0.98 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Paní učitelko Terezko, namalovala jsem vám na papírek obrázek se srdíčkem!',
      'Podívejte se, jak se ty barvy v mém sešitě krásně prolínají!',
      'Můžeme dneska v hodině kreslit vodovkami nebo temperami?',
      'Dneska má obloha za oknem takovou něžně tyrkysovou barvu...',
      'Míchala jsem žlutou a modrou a vznikla z toho smaragdová!',
      'Vyrobila jsem záložku do knížky z lisovaných lístků!'
    ],
    gradeReactions: {
      1: [
        'Krása! Ta zelená jednička má tak nádherný elegantní tvar!',
        'Jednička je jako sluneční paprsek na jarní louce, děkuji!',
        'Děkuji! Namaluji k té jedničce malou duhu!'
      ],
      star: [
        'Třpytivá hvězdička! Namaluji ji zlatou barvou do svého skicáku!',
        'Hvězdička! To je to nejkrásnější umělecké dílo, děkuji vám!'
      ],
      2: [
        'Dvojka je jako ladná labuť na modrém jezeře, moc děkuji.',
        'Dvojka má hezkou modrou barvu, líbí se mi!'
      ],
      3: [
        'Trojka je fajn, ale chybí jí trochu víc pestrých barev.',
        'Trojka je taková šedivá, příště ji rozzářím!'
      ],
      4: [
        'Ajej, tohle dílo potřebuje ještě doladit a přemalovat.',
        'Čtyřka má trochu křivé linie, příště to vylepším.'
      ],
      5: [
        'Smutná pětka... Nakreslím k ní kytičku, ať je veselejší, a doučím se to!',
        'Nevadí, i nepovedená skica se dá předělat v mistrovské dílo!'
      ]
    },
    stampReactions: {
      plane: [
        'Byla to origami vlaštovka s květinovým vzorem!',
        'Zkoušela jsem, jak létají geometrické tvary v prostoru!'
      ],
      talk: [
        'Bavila jsem se o míchání tyrkysové a fialové barvy!',
        'Popisovala jsem Kubovi, jakou barvu má západ slunce!'
      ],
      sleep: [
        'Zavřela jsem oči a viděla jsem před sebou kouzelné barevné světy!',
        'Představovala jsem si paletu plnou nových odstínů!'
      ],
      homework: [
        'Úkol jsem celý namalovala, ale tempery ještě nestihly uschnout!',
        'Byl tak krásný, že jsem ho nechala schnout na stole!'
      ],
      praise: [
        'Děkuji! Vy jste pro mě ta největší inspirace na celém světě!',
        'Moc děkuji! Nakreslím vám za to krásný portrét!'
      ],
      snack: [
        'To byla jen jahůdka pro inspiraci sladké chuti!',
        'Obkreslovala jsem tvar jablíčka, než jsem ho snědla!'
      ]
    }
  },
  {
    id: 'kuba',
    name: 'Kuba',
    nickname: 'Hladovec',
    roleTitle: 'Milovník dobrot',
    desk: { row: 2, col: 2, seat: 'right' },
    hairColor: '#795548',
    hairStyle: 'round_mop',
    clothesColor: '#FFA726',
    glasses: false,
    skinTone: '#F5D0A9',
    accessory: 'apple_pocket',
    voice: { pitch: 0.88, rate: 0.95 },
    grades: [],
    stamps: [],
    state: 'normal',
    mischiefType: null,
    idleLines: [
      'Mně už tak hrozně kručí v bříšku, paní učitelko...',
      'Mám dneska ke svačině řízek v housce od babičky, mňam!',
      'Kolik minut ještě zbývá do oběda ve školní jídelně?',
      'Dneska mají v jídelně buchtičky se šodó! Cítím to až sem!',
      'Paní učitelko Terezko, vy taky míváte před dvanáctou chuť na koláč?',
      'Vyměním půlku jablka za čokoládovou sušenku, kdo chce?'
    ],
    gradeReactions: {
      1: [
        'Mňááám! Jednička je sladší než čokoládový muffin s polevou!',
        'Juchů! Za jedničku mi mamka dneska upeče bábovku!',
        'Jednička chutná jako jahodový dortík, moc děkuji!'
      ],
      star: [
        'Zlatá hvězdička? Ta voní jako čerstvý vanilkový rohlíček! Děkuju!',
        'Hvězdička! To je ta nejlahodnější odměna na světě!'
      ],
      2: [
        'Dvojka je jak dva kopečky vanilkové zmrzliny, to beru!',
        'Dvojka ujde, hlavní je, že neztrácím chuť k jídlu!'
      ],
      3: [
        'Trojka ujde, hlavně že mám v tašce ještě banán a perník.',
        'Trojka... na spravení chuti si dám o přestávce svačinu.'
      ],
      4: [
        'Čtyřka... ze smutku budu muset sníst celou tatranku najednou.',
        'Auvajs, čtyřka mi trochu zkazila chuť k jídlu...'
      ],
      5: [
        'Brum, pětka mi pokazila chuť k obědu... slibuju, že se polepším!',
        'Pětka je hořká jak spálená kůrka chleba. Zítra si ji osladím!'
      ]
    },
    stampReactions: {
      plane: [
        'Posílal jsem Matyášovi vlaštovkou kousek rohlíku se sýrem!',
        'Byla to svačinová vlaštovka, paní učitelko!'
      ],
      talk: [
        'Jen jsem se ptal, co mají dneska v jídelně k polévce!',
        'Řešili jsme, jestli je lepší guláš nebo svíčková!'
      ],
      sleep: [
        'Po koblížku se mi vždycky hrozně klíží očka a přepadne mě únava...',
        'Moje bříško potřebovalo klid na trávení, promiňte!'
      ],
      homework: [
        'Zamazal jsem si úkol jahodovou marmeládou, promiňte mi to!',
        'Sešit mi omylem upadl do misky s kakaem...'
      ],
      praise: [
        'Juchů! Za velkou pochvalu si dám slavnostní jablíčko!',
        'Moc děkuji! Pochvala zahřeje bříško i srdíčko!'
      ],
      snack: [
        'Já měl takový hlad, že ten chlebíček v tašce volal: sněz mě hned!',
        'Jen jsem si kousnul, abych neomdlel hladem před obědem!'
      ]
    }
  }
];

// Helper to occasionally address teacher affectionately as "paní učitelko Terezko" (~28% of the time)
export function maybePersonalizeTeacherName(text, chance = 0.28) {
  if (!text || typeof text !== 'string') return text;
  // If already contains Terezko or Terezka, leave as is
  if (/terezk/i.test(text)) return text;
  
  // Only change with specified probability (default ~28% so it's occasional and natural)
  if (Math.random() >= chance) return text;
  
  if (/Paní učitelko/g.test(text)) {
    return text.replace(/Paní učitelko/g, 'Paní učitelko Terezko');
  }
  if (/paní učitelko/g.test(text)) {
    return text.replace(/paní učitelko/g, 'paní učitelko Terezko');
  }
  return text;
}

// Helper functions to get random varied reactions so answers NEVER repeat!
export function getRandomGradeReaction(student, gradeValue) {
  const pool = student.gradeReactions[gradeValue];
  let res = 'Děkuji paní učitelko!';
  if (Array.isArray(pool) && pool.length > 0) {
    res = pool[Math.floor(Math.random() * pool.length)];
  } else if (typeof pool === 'string') {
    res = pool;
  }
  return maybePersonalizeTeacherName(res);
}

export function getRandomStampReaction(student, stampId) {
  const pool = student.stampReactions[stampId];
  let res = 'Promiňte paní učitelko, polepším se!';
  if (Array.isArray(pool) && pool.length > 0) {
    res = pool[Math.floor(Math.random() * pool.length)];
  } else if (typeof pool === 'string') {
    res = pool;
  }
  return maybePersonalizeTeacherName(res);
}

export function getRandomIdleLine(student) {
  const pool = student.idleLines;
  let res = `Ahoj paní učitelko, tady je ${student.name}!`;
  if (Array.isArray(pool) && pool.length > 0) {
    res = pool[Math.floor(Math.random() * pool.length)];
  }
  return maybePersonalizeTeacherName(res);
}

// When teacher calls on a student who was NOT raising their hand (real school surprise moment!)
export function getUnpreparedStudentAnswer(student) {
  const unreadyLines = {
    ondra: [
      'Zív... Cože? Paní učitelko Terezko, já zrovna usnul... O čem byla otázka?',
      'Ehm... já jsem zrovna počítal ovečky na stropě... Můžete to zopakovat?',
      'Já se sice nehlásil, ale zkusím to... Tři?'
    ],
    tomas: [
      'Já... já jsem se lekl... Já to asi vím, ale styděl jsem se přihlásit...',
      'Mně buší srdíčko... Já myslím, že to je správně, ale bál jsem se to říct nahlas...',
      'Promiňte, paní učitelko Terezko, já se styděl zvednout ruku...'
    ],
    matyas: [
      'Jejda, vyvolala jste mě bez hlášení! Tak já tipuju... že je to čtyřicet dva!',
      'Já jsem zrovna koumal, jak postavit raketu z pravítka! Ale odpověď je... pět?',
      'Chytila jste mě na švestkách, paní učitelko Terezko! Haha!'
    ],
    kuba: [
      'Jéje, já jsem zrovna koukal do batohu na svačinu... O čem jsme to mluvili?',
      'Mňam... já jsem zrovna přemýšlel, jestli máme v jídelně řízek... Můžete otázku zopakovat?',
      'Já se nehlásil, protože jsem měl plnou pusu hroznového cukru!'
    ],
    filip: [
      'Byl jsem zrovna v běžeckém bloku na startovní čáře! Ale vystřelím odpověď přímo do šibenice!',
      'Vyvolala jste mě v plném sprintu! Já myslím, že odpověď je jasná!',
      'Trenérko... teda paní učitelko Terezko, já to dám i bez rozcvičky!'
    ],
    sofie: [
      'Jéje, já se zrovna zasnila nad barvou sluníčka za oknem... Omlouvám se, paní učitelko Terezko!',
      'Já jsem si zrovna kreslila motýlka na okraj sešitu... Ale hned dávám pozor!',
      'Představovala jsem si to jako obrázek a zapomněla zvednout ruku!'
    ],
    viktorie: [
      'Já se sice nehlásila, ale nebojím se toho! Podle mě je to úplně jasná věc!',
      'Nehlásila jsem se, protože je to moc lehké! Ale klidně vám to řeknu!',
      'Ha, zkoušíte mě! Ale mě jen tak nenachytáte, paní učitelko Terezko!'
    ],
    eliska: [
      'Já to vím! Já to vím celou dobu, jen jsem si zrovna ořezávala pastelku!',
      'Mám to samozřejmě v sešitě podtržené dvakrát zelenou propiskou!',
      'Já vím odpověď i na pět dalších otázek dopředu, paní učitelko Terezko!'
    ]
  };

  const pool = unreadyLines[student?.id] || [
    'Paní učitelko Terezko, já se zrovna nehlásil, ale zkusím to!'
  ];
  return maybePersonalizeTeacherName(pool[Math.floor(Math.random() * pool.length)]);
}

export const STAMP_TYPES = [
  {
    id: 'plane',
    icon: '✈️',
    label: 'Hází vlaštovky',
    soundType: 'whoosh',
    speechAnnounce: 'Dostáváš poznámku za házení papírových vlaštovek!',
    color: '#3B82F6'
  },
  {
    id: 'talk',
    icon: '🗣️',
    label: 'Vyrušuje a povídá si',
    soundType: 'pop',
    speechAnnounce: 'Dostáváš poznámku za vyrušování a povídání při hodině!',
    color: '#F59E0B'
  },
  {
    id: 'sleep',
    icon: '😴',
    label: 'Spí při hodině',
    soundType: 'pop',
    speechAnnounce: 'Dostáváš poznámku za spaní a podřimování na lavici!',
    color: '#8B5CF6'
  },
  {
    id: 'homework',
    icon: '🙈',
    label: 'Zapomněl(a) úkol',
    soundType: 'pop',
    speechAnnounce: 'Dostáváš poznámku za zapomenutý domácí úkol!',
    color: '#EF4444'
  },
  {
    id: 'praise',
    icon: '❤️',
    label: 'Vzorně pomáhá a hlásí se',
    soundType: 'cheer',
    speechAnnounce: 'Velká pochvala paní učitelky za vzornou práci a pomoc!',
    color: '#EC4899'
  },
  {
    id: 'snack',
    icon: '🍎',
    label: 'Svačí při vyučování',
    soundType: 'pop',
    speechAnnounce: 'Dostáváš poznámku za tajné pojídání svačinky při výuce!',
    color: '#10B981'
  }
];

export const GRADE_TYPES = [
  { value: 1, label: '1 - Výborně', short: '1', color: '#16A34A', bg: '#DCFCE7', announce: 'Výborně! Dostáváš krásnou jedničku!' },
  { value: 'star', label: '⭐ Velká pochvala s hvězdičkou', short: '⭐', color: '#EAB308', bg: '#FEF9C3', announce: 'Nádherná práce! Dostáváš velkou zlatou hvězdičku s pochvalou!' },
  { value: 2, label: '2 - Chvalitebně', short: '2', color: '#2563EB', bg: '#DBEAFE', announce: 'Pěkně! Dostáváš dvojku, chvalitebně.' },
  { value: 3, label: '3 - Dobře', short: '3', color: '#D97706', bg: '#FEF3C7', announce: 'Dostáváš trojku, dobře.' },
  { value: 4, label: '4 - Dostatečně', short: '4', color: '#EA580C', bg: '#FFEDD5', announce: 'Pozor, dostáváš čtyřku, dostatečně.' },
  { value: 5, label: '5 - Nedostatečně', short: '5', color: '#DC2626', bg: '#FEE2E2', announce: 'Bohužel, dnes je to pětka, nedostatečně. Musíš se víc snažit!' },
];
