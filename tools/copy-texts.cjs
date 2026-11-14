// Real copy instead of the kit placeholders (lorem, "Name", "Company", "Features N").
// Each row: [element ids, field, EN, DE]. Ids are the same on the EN page and its German copy
// (Home 48 / 227, Services 49 / 230, Contact 50 / 233).
const T = 'title';
const P = 'paragraph';

const home = [
	// H3 — dark card
	[['726f6bae'], P, 'Every swap, stake and NFT sale can be a taxable event. Spread across exchanges, wallets and blockchains, one year of activity becomes thousands of records that rarely add up.', 'Jeder Tausch, jedes Staking und jeder NFT-Verkauf kann steuerpflichtig sein. Verteilt auf Börsen, Wallets und Blockchains wird ein Jahr Handel zu Tausenden Einträgen, die selten zusammenpassen.'],
	[['1befc60a'], P, 'Crypto tax rules keep changing, and most general accountants still treat digital assets as an afterthought.', 'Die Steuerregeln für Krypto ändern sich ständig, und viele Steuerberater behandeln digitale Vermögenswerte nur am Rande.'],
	[['34f5f84'], P, 'We bring every transaction into one ledger, calculate gains and income under the rules of your country and give you a report you can file with confidence or hand straight to your accountant.', 'Wir führen alle Transaktionen in einem Journal zusammen, berechnen Gewinne und Einkünfte nach den Regeln Ihres Landes und liefern einen Bericht, den Sie sicher einreichen oder direkt an Ihren Steuerberater geben können.'],
	// H4 — Innovation cards
	[['634140fd'], T, 'All your exchanges, wallets and blockchains in a single tax ledger.', 'Alle Börsen, Wallets und Blockchains in einem einzigen Steuerjournal.'],
	[['4df8abdf'], P, 'Connect your accounts by API or upload CSV files. We import trades, transfers, staking rewards and fees, match transfers between your own wallets and flag anything missing before it becomes a costly error.', 'Verbinden Sie Ihre Konten per API oder laden Sie CSV-Dateien hoch. Wir importieren Trades, Transfers, Staking-Erträge und Gebühren, gleichen Überweisungen zwischen Ihren eigenen Wallets ab und melden Lücken, bevor sie teuer werden.'],
	[['6efb9e9b'], T, 'AI that classifies thousands of transactions in minutes.', 'KI, die Tausende Transaktionen in wenigen Minuten einordnet.'],
	[['414aa025'], P, 'Our models recognise swaps, airdrops, bridges, DeFi deposits and NFT mints and apply the right tax treatment to each one. Every decision is logged, and our tax specialists review the edge cases before anything reaches your report.', 'Unsere Modelle erkennen Swaps, Airdrops, Bridges, DeFi-Einlagen und NFT-Mints und wenden jeweils die richtige steuerliche Behandlung an. Jede Entscheidung wird protokolliert, und unsere Steuerexperten prüfen Sonderfälle, bevor sie in Ihren Bericht gelangen.'],
	[['5593a275'], T, 'Certified accountants who check every report before you file it.', 'Steuerberater, die jeden Bericht prüfen, bevor Sie ihn einreichen.'],
	[['3da851fd'], P, 'Automation does the heavy lifting, people make the judgement calls. A vetted tax accountant who knows crypto reviews your figures, answers your questions and can file on your behalf in the countries we support.', 'Die Automatisierung erledigt die Fleißarbeit, Menschen treffen die Entscheidungen. Ein geprüfter Steuerberater mit Krypto-Erfahrung kontrolliert Ihre Zahlen, beantwortet Ihre Fragen und reicht in den unterstützten Ländern für Sie ein.'],
	// H8 — Why choose us
	[['766df94a'], P, 'Crypto taxes sit where finance, law and technology meet. We combine all three: software that reads every chain you use, accountants who specialise in digital assets and a clear process that keeps you informed from the first import to the filed return.', 'Krypto-Steuern liegen an der Schnittstelle von Finanzen, Recht und Technologie. Wir verbinden alle drei: Software, die jede von Ihnen genutzte Blockchain liest, Steuerberater mit Schwerpunkt digitale Vermögenswerte und einen klaren Ablauf vom ersten Import bis zur eingereichten Erklärung.'],
	[['52cf1303'], T, 'Import Everything', 'Alles importieren'],
	[['14372ad7'], P, 'Connect exchanges and wallets in a few clicks or upload your files. We pull in your full history, including DeFi, NFTs and staking, and match transfers between your own accounts so nothing is counted twice.', 'Verbinden Sie Börsen und Wallets mit wenigen Klicks oder laden Sie Ihre Dateien hoch. Wir übernehmen Ihre gesamte Historie inklusive DeFi, NFTs und Staking und gleichen Transfers zwischen Ihren Konten ab, damit nichts doppelt zählt.'],
	[['3c721e6e'], T, 'Let AI Sort It', 'Die KI sortiert'],
	[['17ccbcc'], P, 'Our AI engine labels every transaction and applies the tax rules of your country, from swaps and airdrops to lending interest. Our specialists check the unusual cases, so you get speed without guesswork.', 'Unsere KI kennzeichnet jede Transaktion und wendet die Steuerregeln Ihres Landes an – von Swaps und Airdrops bis zu Zinsen aus Krypto-Lending. Unsere Experten prüfen die Sonderfälle: schnell und ohne Rätselraten.'],
	[['633faddb'], T, 'File With Ease', 'Einfach einreichen'],
	[['1add08b7'], P, 'Download a ready-to-file report, share it with your own accountant or let ours submit it for you. Your data stays up to date, so next year starts where this one ends.', 'Laden Sie einen fertigen Bericht herunter, geben Sie ihn Ihrem Steuerberater oder lassen Sie unseren einreichen. Ihre Daten bleiben aktuell – das nächste Jahr beginnt dort, wo dieses endet.'],
	// H9 — three features
	[['27be6e46'], P, 'Spot missing records, unmatched transfers and unrealised losses early. We show how each issue affects your tax bill and fix it long before it turns into a question from the tax office.', 'Erkennen Sie fehlende Belege, offene Transfers und nicht realisierte Verluste frühzeitig. Wir zeigen, wie sich jedes Problem auf Ihre Steuer auswirkt, und lösen es, lange bevor das Finanzamt nachfragt.'],
	[['3de2ee1a'], P, 'Find legal ways to pay less: harvest losses before the year ends, time sales around holding periods and claim every deductible fee you paid on exchanges and networks.', 'Finden Sie legale Wege, weniger zu zahlen: Verluste vor Jahresende realisieren, Verkäufe nach Haltefristen planen und jede absetzbare Gebühr von Börsen und Netzwerken geltend machen.'],
	[['2b36cb4b'], P, 'Watch your estimated tax for the year change as the market moves, plan sales with real numbers in front of you and set aside the right amount for every payment.', 'Verfolgen Sie Ihre voraussichtliche Jahressteuer im Takt des Marktes, planen Sie Verkäufe mit echten Zahlen und legen Sie für jede Zahlung den richtigen Betrag zurück.'],
];

// G6 — Insights (Home, Services): [home id, services id]
const insights = [
	[['4c1bd445', '2619efe9'], T, 'Insights From Our Tax Experts', 'Wissen von unseren Steuerexperten'],
	[['4b181148', '3c11c189'], T, 'Never Miss a Deadline', 'Keine Frist verpassen'],
	[['76d5b927', '56f226cc'], P, 'Filing dates, extensions and estimated payments for crypto investors in one calendar, with reminders well before each deadline arrives.', 'Abgabetermine, Fristverlängerungen und Vorauszahlungen für Krypto-Anleger in einem Kalender – mit Erinnerungen lange vor jeder Frist.'],
	[['14b9fac7', '53df853e'], T, 'Pay Less Tax', 'Weniger Steuern zahlen'],
	[['488a452', '17234e47'], P, 'Tax-loss harvesting and smart timing of sales can legally lower what you owe every year.', 'Verlustverrechnung und gut geplante Verkäufe senken Ihre Steuerlast jedes Jahr – ganz legal.'],
	[['65ad5b12', '54ed5b2e'], T, 'Stay Audit-Ready', 'Immer prüfungsbereit'],
	[['4d66b470', '341666cc'], P, 'Keep a complete record of every transaction, cost basis and report, so you can answer any question from the tax office in minutes.', 'Bewahren Sie jede Transaktion, jeden Anschaffungswert und jeden Bericht lückenlos auf und beantworten Sie Fragen des Finanzamts in Minuten.'],
];

// G4 — Testimonials (Home, Services, Contact): lead + four testimonials [name, role, company, quote]
const testimonialLead = [['73b31012', '67016caa', '7e0dabd5'], P, 'Investors, traders and crypto-native businesses across the US and Europe trust Legite with their taxes. Here is what some of them say about working with our team.', 'Anleger, Trader und Krypto-Unternehmen in den USA und Europa vertrauen Legite ihre Steuern an. Das sagen einige von ihnen über die Zusammenarbeit mit unserem Team.'];
const people = [
	['Daniel K', ['CFO', 'Finanzchef'], ['Orrin Vale Capital', 'Orrin Vale Capital'], ['“They reconciled four exchanges and two hardware wallets we had given up on. The final report matched to the cent.”', '„Sie haben vier Börsen und zwei Hardware-Wallets abgeglichen, die wir schon aufgegeben hatten. Der Bericht stimmte auf den Cent.“']],
	['Priya M', ['Software Engineer', 'Softwareentwicklerin'], ['Lumenfold Studio', 'Lumenfold Studio'], ['“I staked, swapped and minted all year without tracking a thing. Legite turned it into a clean return before the deadline.”', '„Ich habe das ganze Jahr gestakt, getauscht und gemintet, ohne etwas zu notieren. Legite hat daraus rechtzeitig eine saubere Erklärung gemacht.“']],
	['Marco R', ['Day Trader', 'Daytrader'], ['Self-employed', 'Selbstständig'], ['“Thousands of trades a month used to mean weeks of spreadsheets. Now I check my tax position every Friday in minutes.”', '„Tausende Trades im Monat bedeuteten früher wochenlange Tabellenarbeit. Heute prüfe ich meine Steuerlage jeden Freitag in wenigen Minuten.“']],
	['Elena V', ['Operations Lead', 'Leiterin Operations'], ['Brightmoor Retail', 'Brightmoor Retail'], ['“We accept crypto from customers in six countries. Legite keeps our books compliant everywhere we sell.”', '„Wir akzeptieren Krypto von Kunden in sechs Ländern. Legite sorgt dafür, dass unsere Buchhaltung überall regelkonform ist.“']],
];
// [name, role, company, quote] element ids per page, in carousel order after Sarah L
const testimonialIds = {
	home: [['2516009a', '6a14b50c', '59f0e7b2', '7c4c9b3'], ['1194b6be', '6880d8b2', '302aa22b', '42122324'], ['267d3740', '5ee4bad5', '979aaa3', '7ff90af0'], ['41b5fa59', '23787649', '4cfdaa2f', '3ebc43fb']],
	services: [['30411310', '29da05d', '5d2a7857', '2331c639'], ['55a2f35d', '617b3e9b', '6753fb43', '1bf59f8'], ['1132fd74', 'dad62ca', '21c18fac', 'cf2344e'], ['34e13084', '435e9bd4', '45e6516d', '71e7631']],
	contact: [['60e5aba4', '5ace39bf', '55a15737', 'cec4812'], ['79f0d821', '618e3e0', '5deb1e98', '4c8e0d25'], ['766b53ff', '760ea3c', '704fe756', '38f2373'], ['2c095ad9', '47431243', '318b2ddf', '2a2507dd']],
};

const services = [
	// S2–S4 — features
	[['254559ea'], T, 'Crypto Tax Reports', 'Krypto-Steuerberichte'],
	[['27a9f3a6'], P, 'A complete tax report for your country: capital gains, income from staking and mining and the forms your tax office expects, ready to file yourself or share with your accountant.', 'Ein vollständiger Steuerbericht für Ihr Land: Kursgewinne, Einkünfte aus Staking und Mining und die Formulare, die Ihr Finanzamt erwartet – bereit zum Einreichen oder für Ihren Steuerberater.'],
	[['1b61ebb'], P, 'Built from your full transaction history across every exchange and wallet you use.', 'Erstellt aus Ihrer gesamten Transaktionshistorie über alle Börsen und Wallets hinweg.'],
	[['1683802d'], T, 'Tax Planning and Advice', 'Steuerplanung und Beratung'],
	[['667b6f29'], P, 'Work with an accountant who specialises in digital assets. Plan your sales, structure your holdings and understand the tax impact before you make a move.', 'Arbeiten Sie mit einem Steuerberater, der auf digitale Vermögenswerte spezialisiert ist. Planen Sie Verkäufe, strukturieren Sie Ihre Bestände und kennen Sie die steuerlichen Folgen, bevor Sie handeln.'],
	[['68cff17e'], P, 'Ideal for active traders, long-term holders and anyone with a growing portfolio.', 'Ideal für aktive Trader, langfristige Anleger und alle mit einem wachsenden Portfolio.'],
	[['17482bf8'], T, 'Filing and Audit Support', 'Abgabe und Prüfungsbegleitung'],
	[['4006f89a'], P, 'We file your return on time and stand by you afterwards. If the tax office sends a letter, we prepare the evidence, explain your figures and reply on your behalf.', 'Wir reichen Ihre Erklärung fristgerecht ein und bleiben auch danach an Ihrer Seite. Schreibt das Finanzamt, bereiten wir die Nachweise vor, erläutern Ihre Zahlen und antworten in Ihrem Namen.'],
	[['7b645379'], P, 'Also available for returns you prepared and filed yourself.', 'Auch für Erklärungen, die Sie selbst erstellt und eingereicht haben.'],
	// S6 — prices: Risk Management ($12)
	[['152be38e'], P, 'Annual tax report', 'Jährlicher Steuerbericht'],
	[['4b182899'], P, 'Up to 500 transactions', 'Bis zu 500 Transaktionen'],
	[['175cc1d5'], P, '3 exchanges or wallets', '3 Börsen oder Wallets'],
	[['4dc124a0'], P, 'Capital gains summary', 'Übersicht der Kursgewinne'],
	[['3f4cb4df'], P, 'Staking income report', 'Bericht zu Staking-Erträgen'],
	[['14d95a84'], P, 'Email support', 'Support per E-Mail'],
	[['8a0e3ac'], P, 'Audit-ready records', 'Prüfungssichere Unterlagen'],
	// Trend Prediction ($25)
	[['31a9b8f3'], P, 'Everything in Risk Management', 'Alles aus Risikomanagement'],
	[['1e5627f8'], P, 'Up to 5,000 transactions', 'Bis zu 5.000 Transaktionen'],
	[['24f8ca2a'], P, 'Unlimited exchanges and wallets', 'Unbegrenzt Börsen und Wallets'],
	[['1868cb0a'], P, 'DeFi, NFT and staking income', 'Erträge aus DeFi, NFTs und Staking'],
	[['19e168b5'], P, 'Tax-loss harvesting alerts', 'Hinweise zur Verlustverrechnung'],
	[['64f431d'], P, 'Live tax estimate', 'Laufende Steuerschätzung'],
	[['17c27dd0'], P, 'Quarterly tax forecast', 'Vierteljährliche Steuerprognose'],
	[['1e122d89'], P, 'Review by a tax accountant', 'Prüfung durch einen Steuerberater'],
	[['656faca7'], P, 'Multi-year history', 'Mehrjährige Historie'],
	[['3a59a1fa'], P, 'Priority support', 'Bevorzugter Support'],
	[['7f8395a3'], P, 'Audit support', 'Hilfe bei Steuerprüfungen'],
	// Customize?
	[['7d09bdd3'], P, 'Trading at scale, running a fund or accepting crypto in your business? We build a plan around your volume, entities and countries, with a dedicated accountant and your own reporting schedule.', 'Sie handeln in großem Umfang, führen einen Fonds oder akzeptieren Krypto im Unternehmen? Wir stellen ein Paket nach Volumen, Gesellschaften und Ländern zusammen – mit festem Steuerberater und eigenem Berichtsplan.'],
];

// G5 — FAQ: [question id, answer id, Q EN, A EN, Q DE, A DE]
const faqServices = [
	['6db2f3c8', '304fdb1f', 'Which exchanges and wallets do you support?', 'All major exchanges and wallets, most blockchains and the popular DeFi protocols. If something is missing, upload a CSV file and our team will map it for you.', 'Welche Börsen und Wallets unterstützen Sie?', 'Alle großen Börsen und Wallets, die meisten Blockchains und gängige DeFi-Protokolle. Fehlt etwas, laden Sie eine CSV-Datei hoch – unser Team ordnet sie für Sie zu.'],
	['51ef3578', '1ca1f6cf', 'Do I have to pay tax on crypto?', 'In most countries, yes. Selling, swapping or spending crypto can create a capital gain, and staking or mining rewards usually count as income. We check the rules for you.', 'Muss ich auf Krypto Steuern zahlen?', 'In den meisten Ländern ja. Verkauf, Tausch oder Bezahlen mit Krypto kann einen Gewinn auslösen, Staking- und Mining-Erträge gelten meist als Einkommen. Wir prüfen die Regeln für Sie.'],
	['1796d039', '656fcc15', 'How long does a tax report take?', 'Most reports are ready within 48 hours of importing your data. Complex DeFi activity or several years of history can take longer — we give you a date before we start.', 'Wie lange dauert ein Steuerbericht?', 'Die meisten Berichte sind 48 Stunden nach dem Import Ihrer Daten fertig. Komplexe DeFi-Aktivitäten oder mehrere Jahre dauern länger – Sie erhalten vorab einen Termin.'],
	['5e19bc60', '389351e', 'Can you handle DeFi and NFTs?', 'Yes. We classify lending, liquidity pools, bridges, airdrops, NFT mints and sales, and explain how each one is taxed in your country.', 'Können Sie DeFi und NFTs abbilden?', 'Ja. Wir ordnen Lending, Liquiditätspools, Bridges, Airdrops sowie NFT-Mints und -Verkäufe ein und erklären, wie sie in Ihrem Land besteuert werden.'],
	['68955ac8', '654237a1', 'I didn’t report crypto in past years. What now?', 'It happens more often than you think. We prepare amended returns for previous years and help you set the record straight before the tax office asks.', 'Ich habe Krypto früher nicht angegeben. Was nun?', 'Das kommt häufiger vor, als man denkt. Wir bereiten berichtigte Erklärungen für frühere Jahre vor und bringen alles in Ordnung, bevor das Finanzamt fragt.'],
	['4aa79d83', '2f3cdd1a', 'Which countries do you cover?', 'We prepare reports for the US, the UK, Germany and most EU countries. For other countries, our partner accountants can step in.', 'Welche Länder decken Sie ab?', 'Wir erstellen Berichte für die USA, Großbritannien, Deutschland und die meisten EU-Länder. Für andere Länder helfen unsere Partnerkanzleien.'],
	['15455865', '6e3f35e4', 'Is my data safe with you?', 'We connect with read-only access, encrypt your data at rest and in transit and never share it with third parties without your consent.', 'Sind meine Daten bei Ihnen sicher?', 'Wir verbinden uns nur mit Lesezugriff, verschlüsseln Ihre Daten bei Speicherung und Übertragung und geben sie ohne Ihre Zustimmung nie an Dritte weiter.'],
	['39374f85', '3656c84a', 'How much do your services cost?', 'Plans start at $12 per month. Complex cases get a fixed quote after a free review, so you know the price before any work begins.', 'Was kosten Ihre Leistungen?', 'Pakete beginnen bei 12 $ pro Monat. Für komplexe Fälle erhalten Sie nach einer kostenlosen Prüfung einen Festpreis – bevor die Arbeit beginnt.'],
];
const faqContact = [
	['6516fc12', '146f5054', 'How quickly will you reply?', 'We answer every message within one business day. During tax season, clients on a paid plan hear back within a few hours.', 'Wie schnell antworten Sie?', 'Wir beantworten jede Nachricht innerhalb eines Werktags. In der Steuersaison erhalten Kunden mit einem Paket innerhalb weniger Stunden eine Antwort.'],
	['41eb12ae', '3773e8de', 'Is the first consultation free?', 'Yes. The first 30-minute call is free: we look at your situation, explain your options and give you a fixed quote with no obligation.', 'Ist das Erstgespräch kostenlos?', 'Ja. Das erste 30-minütige Gespräch ist kostenlos: Wir sehen uns Ihre Situation an, erklären die Möglichkeiten und nennen einen unverbindlichen Festpreis.'],
	['6c5b9267', '4cafc5cd', 'What should I prepare for the call?', 'A list of the exchanges and wallets you use and the tax years in question. You don’t need any reports yet — we will guide you through the rest.', 'Was sollte ich für das Gespräch vorbereiten?', 'Eine Liste Ihrer Börsen und Wallets und die betroffenen Steuerjahre. Berichte brauchen Sie noch nicht – durch den Rest führen wir Sie.'],
	['43dd8400', '7addc90b', 'Can we meet in person?', 'Yes, at our offices in Charlottesville and Leverkusen, by appointment. Most clients prefer a video call, which works just as well.', 'Können wir uns persönlich treffen?', 'Ja, nach Vereinbarung in unseren Büros in Charlottesville und Leverkusen. Die meisten Kunden bevorzugen einen Videoanruf – das funktioniert genauso gut.'],
	['15df3bfa', '745837b7', 'Do you work with clients abroad?', 'We work with clients across the US and Europe. If you owe tax in more than one country, we coordinate the reports for each of them.', 'Arbeiten Sie auch mit Kunden im Ausland?', 'Wir betreuen Kunden in den USA und ganz Europa. Sind Sie in mehreren Ländern steuerpflichtig, stimmen wir die Berichte für jedes Land aufeinander ab.'],
	['5364300b', '22300ee3', 'Do you speak German?', 'Ja! Our Leverkusen team works in German and English, so you can choose the language for calls, documents and reports.', 'Sprechen Sie auch Englisch?', 'Ja. Unser Team in Leverkusen arbeitet auf Deutsch und Englisch – Sie wählen die Sprache für Gespräche, Unterlagen und Berichte.'],
	['17e145f8', '787b95ec', 'Can my accountant work with you?', 'Of course. We can prepare the crypto part of your return and hand it to your accountant, or work with them directly from the start.', 'Kann mein Steuerberater mit Ihnen zusammenarbeiten?', 'Natürlich. Wir bereiten den Krypto-Teil Ihrer Erklärung vor und übergeben ihn Ihrer Kanzlei – oder arbeiten von Anfang an direkt mit ihr zusammen.'],
	['3cdbca03', '7e082854', 'How do I share my data securely?', 'After the first call, you get access to a secure client portal. Connect accounts with read-only keys or upload files there — never by email.', 'Wie teile ich meine Daten sicher?', 'Nach dem Erstgespräch erhalten Sie Zugang zu einem sicheren Kundenportal. Verbinden Sie dort Konten mit Lesezugriff oder laden Sie Dateien hoch – niemals per E-Mail.'],
];

// Build [page, id, field, en, de] rows.
const rows = [];
const add = (page, id, field, en, de) => rows.push({ page, id, field, en, de });
for (const [ids, f, en, de] of home) ids.forEach((id) => add('home', id, f, en, de));
for (const [ids, f, en, de] of insights) { add('home', ids[0], f, en, de); add('services', ids[1], f, en, de); }
['home', 'services', 'contact'].forEach((p, i) => add(p, testimonialLead[0][i], P, testimonialLead[2], testimonialLead[3]));
for (const [page, list] of Object.entries(testimonialIds)) {
	list.forEach(([nameId, roleId, companyId, quoteId], i) => {
		const [name, role, company, quote] = people[i];
		add(page, nameId, P, name, name);
		add(page, roleId, P, role[0], role[1]);
		add(page, companyId, P, company[0], company[1]);
		add(page, quoteId, P, quote[0], quote[1]);
	});
}
for (const [ids, f, en, de] of services) ids.forEach((id) => add('services', id, f, en, de));
for (const [q, a, qen, aen, qde, ade] of faqServices) { add('services', q, T, qen, qde); add('services', a, P, aen, ade); }
for (const [q, a, qen, aen, qde, ade] of faqContact) { add('contact', q, T, qen, qde); add('contact', a, P, aen, ade); }

module.exports = { rows, pages: { home: [48, 227], services: [49, 230], contact: [50, 233] }, sections: { home, insights, testimonialLead, people, services, faqServices, faqContact } };
