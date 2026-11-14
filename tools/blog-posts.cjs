// Demo articles of the blog (EN + DE): texts, categories, dates and pictures. Build the import file:
//   node tools/blog-posts.cjs   →   design/assets/blog/posts.json (read by the WP-CLI import, not in git)
// Blocks: ['p', text] · ['h2', text] · ['ul', [items]] · ['img', attachmentId] · ['video', attachmentId]
const fs = require('fs');
const path = require('path');

const categories = {
	tax: { en: ['Tax', 'tax', 'Guides to how crypto income, gains and rewards are taxed.'], de: ['Steuern', 'steuern', 'Ratgeber dazu, wie Krypto-Einkünfte, Gewinne und Erträge besteuert werden.'] },
	guides: { en: ['Reports & Guides', 'reports-guides', 'Checklists and step-by-step guides for reporting crypto.'], de: ['Berichte & Leitfäden', 'berichte-leitfaeden', 'Checklisten und Schritt-für-Schritt-Anleitungen für Krypto-Steuerberichte.'] },
	technology: { en: ['Technology', 'technology', 'How our software turns raw blockchain data into tax reports.'], de: ['Technologie', 'technologie', 'Wie unsere Software Blockchain-Rohdaten in Steuerberichte verwandelt.'] },
};

const posts = [
	{
		date: '2026-11-10 09:00:00',
		category: 'guides',
		image: 338,
		en: {
			title: 'Year-End Crypto Tax Checklist',
			slug: 'year-end-crypto-tax-checklist',
			excerpt: 'Five things to sort out before December 31, so filing season is calm, quick and free of surprises.',
			blocks: [
				['p', 'The last weeks of the year are the best time to get your crypto taxes in order. A few hours now can save you days of searching for old transactions in spring — and often some money too.'],
				['h2', '1. Collect every account'],
				['p', 'List each exchange, wallet and app you used this year, including the ones you have closed. Download full transaction histories while you still have access to them.'],
				['h2', '2. Match your own transfers'],
				['p', 'Moving coins between your own wallets is not a sale. Make sure these transfers are matched on both sides, or they may be counted as income or disposals.'],
				['h2', '3. Check what is still missing'],
				['ul', ['Fees paid on trades and withdrawals', 'Staking, lending and airdrop income', 'Purchases made before you started tracking']],
				['h2', '4. Review gains and losses'],
				['p', 'Look at your realised gains so far. If some positions are at a loss, selling them before the year ends can offset those gains — see our guide to tax-loss harvesting.'],
				['h2', '5. Plan your payments'],
				['p', 'Estimate what you will owe and set the money aside, so a good year in the market does not turn into a cash problem at filing time.'],
				['p', 'Prefer to hand it over? Our team can work through the whole checklist for you and deliver a ready-to-file report.'],
			],
		},
		de: {
			title: 'Krypto-Steuer-Checkliste zum Jahresende',
			slug: 'krypto-steuer-checkliste-jahresende',
			excerpt: 'Fünf Dinge, die Sie vor dem 31. Dezember erledigen sollten – damit die Steuererklärung ruhig, schnell und ohne Überraschungen verläuft.',
			blocks: [
				['p', 'Die letzten Wochen des Jahres sind die beste Zeit, um Ihre Krypto-Steuern zu ordnen. Ein paar Stunden jetzt ersparen Ihnen im Frühjahr tagelange Suche nach alten Transaktionen – und oft auch Geld.'],
				['h2', '1. Alle Konten sammeln'],
				['p', 'Listen Sie jede Börse, jedes Wallet und jede App auf, die Sie in diesem Jahr genutzt haben – auch die bereits geschlossenen. Laden Sie die vollständigen Transaktionshistorien herunter, solange Sie noch Zugriff haben.'],
				['h2', '2. Eigene Transfers abgleichen'],
				['p', 'Coins zwischen eigenen Wallets zu verschieben ist kein Verkauf. Sorgen Sie dafür, dass diese Transfers auf beiden Seiten zugeordnet sind, sonst werden sie womöglich als Einkünfte oder Veräußerungen gezählt.'],
				['h2', '3. Prüfen, was noch fehlt'],
				['ul', ['Gebühren für Trades und Auszahlungen', 'Erträge aus Staking, Lending und Airdrops', 'Käufe aus der Zeit, bevor Sie mit der Erfassung begonnen haben']],
				['h2', '4. Gewinne und Verluste prüfen'],
				['p', 'Sehen Sie sich Ihre bisher realisierten Gewinne an. Liegen einige Positionen im Minus, können Verkäufe vor Jahresende diese Gewinne ausgleichen – mehr dazu in unserem Ratgeber zur Verlustverrechnung.'],
				['h2', '5. Zahlungen planen'],
				['p', 'Schätzen Sie, was Sie schulden werden, und legen Sie das Geld zurück – damit ein gutes Börsenjahr bei der Steuererklärung nicht zum Liquiditätsproblem wird.'],
				['p', 'Lieber abgeben? Unser Team arbeitet die ganze Checkliste für Sie ab und liefert einen Bericht, der direkt eingereicht werden kann.'],
			],
		},
	},
	{
		date: '2026-10-28 09:00:00',
		category: 'technology',
		image: 337,
		en: {
			title: 'How AI Sorts Thousands of Crypto Transactions',
			slug: 'how-ai-sorts-crypto-transactions',
			excerpt: 'A look inside the engine that turns raw exchange and wallet data into a clean tax ledger — and where people still make the call.',
			blocks: [
				['p', 'A single active trader can create tens of thousands of records in a year: trades, transfers, fees, rewards and smart-contract calls. Sorting them by hand is slow and error-prone. This is where our AI engine does the heavy lifting.'],
				['h2', 'From raw data to a clean ledger'],
				['p', 'First, we import everything — exchange exports, wallet addresses and API connections. The engine then normalises the data, so a swap on one platform looks the same as a swap on another.'],
				['video', 280],
				['h2', 'Recognising what each transaction is'],
				['p', 'Next, every record gets a label: purchase, sale, swap, transfer between your own wallets, staking reward, airdrop, loan or fee. The models learn from millions of labelled examples and from the patterns of the protocols themselves.'],
				['h2', 'Where people step in'],
				['p', 'Some cases are genuinely ambiguous — a bridge that splits into several steps, or a token with no market price. The engine flags them, and one of our accountants makes the decision. Every decision is logged, so you can see why a transaction was treated the way it was.'],
				['p', 'The result: reports in hours instead of weeks, with a human check where it matters.'],
			],
		},
		de: {
			title: 'Wie KI Tausende Krypto-Transaktionen sortiert',
			slug: 'wie-ki-krypto-transaktionen-sortiert',
			excerpt: 'Ein Blick in die Software, die aus Rohdaten von Börsen und Wallets ein sauberes Steuerjournal macht – und wo weiterhin Menschen entscheiden.',
			blocks: [
				['p', 'Ein einziger aktiver Trader kann in einem Jahr Zehntausende Einträge erzeugen: Trades, Transfers, Gebühren, Erträge und Smart-Contract-Aufrufe. Sie von Hand zu sortieren ist langsam und fehleranfällig. Hier übernimmt unsere KI die Fleißarbeit.'],
				['h2', 'Von Rohdaten zum sauberen Journal'],
				['p', 'Zuerst importieren wir alles – Exporte von Börsen, Wallet-Adressen und API-Verbindungen. Danach vereinheitlicht die Software die Daten, sodass ein Swap auf der einen Plattform genauso aussieht wie auf der anderen.'],
				['video', 280],
				['h2', 'Erkennen, was jede Transaktion ist'],
				['p', 'Anschließend erhält jeder Eintrag eine Kennzeichnung: Kauf, Verkauf, Tausch, Transfer zwischen eigenen Wallets, Staking-Ertrag, Airdrop, Darlehen oder Gebühr. Die Modelle lernen aus Millionen gekennzeichneter Beispiele und aus den Mustern der Protokolle selbst.'],
				['h2', 'Wo Menschen eingreifen'],
				['p', 'Manche Fälle sind wirklich mehrdeutig – eine Bridge, die in mehrere Schritte zerfällt, oder ein Token ohne Marktpreis. Die Software markiert sie, und einer unserer Steuerberater entscheidet. Jede Entscheidung wird protokolliert, sodass Sie nachvollziehen können, warum eine Transaktion so behandelt wurde.'],
				['p', 'Das Ergebnis: Berichte in Stunden statt Wochen – mit menschlicher Prüfung dort, wo es darauf ankommt.'],
			],
		},
	},
	{
		date: '2026-10-14 09:00:00',
		category: 'guides',
		image: 336,
		en: {
			title: 'Tax-Loss Harvesting with Crypto',
			slug: 'crypto-tax-loss-harvesting',
			excerpt: 'How selling assets at a loss can lower your tax bill, when it makes sense and which rules to watch.',
			blocks: [
				['p', 'Markets go down as well as up. When some of your coins are worth less than you paid for them, selling can turn a paper loss into a real one that offsets your taxable gains.'],
				['h2', 'How it works'],
				['p', 'Say you made a gain of 5,000 on one coin and hold another that is 2,000 below its purchase price. Selling the second one before the year ends reduces your net gain to 3,000 — and the tax on it.'],
				['h2', 'What to watch'],
				['ul', ['Holding periods: in some countries, assets held long enough are taxed differently or not at all.', 'Repurchase rules: buying the same asset back right away is not allowed everywhere.', 'Fees: trading costs eat into the benefit on small positions.']],
				['h2', 'Do it with numbers'],
				['p', 'Our live tax estimate shows your realised gains and unrealised losses side by side, so you can see the effect of a sale before you make it.'],
			],
		},
		de: {
			title: 'Verlustverrechnung mit Krypto',
			slug: 'krypto-verlustverrechnung',
			excerpt: 'Wie Verkäufe mit Verlust Ihre Steuer senken können, wann das sinnvoll ist und auf welche Regeln Sie achten sollten.',
			blocks: [
				['p', 'Märkte fallen ebenso, wie sie steigen. Sind einige Ihrer Coins weniger wert, als Sie bezahlt haben, kann ein Verkauf aus einem Buchverlust einen echten Verlust machen, der Ihre steuerpflichtigen Gewinne ausgleicht.'],
				['h2', 'So funktioniert es'],
				['p', 'Angenommen, Sie haben mit einem Coin 5.000 Gewinn gemacht und halten einen anderen, der 2.000 unter dem Kaufpreis liegt. Verkaufen Sie den zweiten vor Jahresende, sinkt Ihr Nettogewinn auf 3.000 – und mit ihm die Steuer.'],
				['h2', 'Worauf Sie achten sollten'],
				['ul', ['Haltefristen: In manchen Ländern werden lange gehaltene Vermögenswerte anders oder gar nicht besteuert.', 'Rückkaufregeln: Denselben Vermögenswert sofort zurückzukaufen ist nicht überall erlaubt.', 'Gebühren: Handelskosten schmälern den Vorteil bei kleinen Positionen.']],
				['h2', 'Mit Zahlen entscheiden'],
				['p', 'Unsere laufende Steuerschätzung zeigt realisierte Gewinne und nicht realisierte Verluste nebeneinander – so sehen Sie die Wirkung eines Verkaufs, bevor Sie ihn tätigen.'],
			],
		},
	},
	{
		date: '2026-09-30 09:00:00',
		category: 'tax',
		image: 334,
		en: {
			title: 'DeFi and Taxes: Lending, Liquidity Pools and Bridges',
			slug: 'defi-taxes-lending-liquidity-pools',
			excerpt: 'Decentralised finance creates tax events that exchanges never show you. Here is how the most common ones are usually treated.',
			blocks: [
				['p', 'DeFi lets you lend, borrow and earn without a middleman — and it creates tax questions without a middleman to answer them. The same action can be taxed differently depending on the country and the protocol.'],
				['h2', 'Lending and borrowing'],
				['p', 'Interest you earn is usually income at the moment you receive it. Depositing coins into a lending protocol may or may not count as a disposal, depending on whether you get a new token in exchange.'],
				['h2', 'Liquidity pools'],
				['p', 'Adding liquidity often means swapping your coins for pool tokens, which can be a taxable exchange. Rewards from the pool are typically treated as income.'],
				['h2', 'Bridges and wrapped tokens'],
				['p', 'Moving coins between blockchains should not create a gain, but the records on each side rarely match. Unmatched bridge transfers are one of the most common errors we fix.'],
				['p', 'Because the rules are still developing, keep complete records and document how you treated each type of activity.'],
			],
		},
		de: {
			title: 'DeFi und Steuern: Lending, Liquiditätspools und Bridges',
			slug: 'defi-steuern-lending-liquiditaetspools',
			excerpt: 'Dezentrale Finanzen erzeugen Steuerereignisse, die Ihnen keine Börse anzeigt. So werden die häufigsten meist behandelt.',
			blocks: [
				['p', 'Mit DeFi können Sie ohne Mittelsmann verleihen, leihen und verdienen – und es entstehen Steuerfragen, die Ihnen auch kein Mittelsmann beantwortet. Dieselbe Aktion kann je nach Land und Protokoll unterschiedlich besteuert werden.'],
				['h2', 'Verleihen und Leihen'],
				['p', 'Zinsen, die Sie erhalten, sind meist im Moment des Zuflusses Einkünfte. Ob die Einzahlung von Coins in ein Lending-Protokoll als Veräußerung gilt, hängt davon ab, ob Sie im Gegenzug einen neuen Token erhalten.'],
				['h2', 'Liquiditätspools'],
				['p', 'Liquidität bereitzustellen bedeutet oft, Coins gegen Pool-Token zu tauschen – das kann ein steuerpflichtiger Tausch sein. Erträge aus dem Pool gelten in der Regel als Einkünfte.'],
				['h2', 'Bridges und Wrapped Tokens'],
				['p', 'Coins zwischen Blockchains zu verschieben sollte keinen Gewinn auslösen, doch die Einträge auf beiden Seiten passen selten zusammen. Nicht zugeordnete Bridge-Transfers gehören zu den häufigsten Fehlern, die wir beheben.'],
				['p', 'Da sich die Regeln noch entwickeln, sollten Sie vollständige Unterlagen führen und dokumentieren, wie Sie jede Art von Aktivität behandelt haben.'],
			],
		},
	},
	{
		date: '2026-09-16 09:00:00',
		category: 'tax',
		image: 333,
		en: {
			title: 'Staking Rewards and Taxes',
			slug: 'staking-rewards-and-taxes',
			excerpt: 'Staking pays you in new coins. Here is when that income is usually taxed and why the value on the day you receive it matters.',
			blocks: [
				['p', 'Staking is one of the simplest ways to earn with crypto: you lock coins to help secure a network and receive rewards in return. For tax purposes, those rewards are usually income.'],
				['h2', 'When the income arises'],
				['p', 'In most countries, rewards are taxed when you receive them, at their market value on that day. A coin that pays small rewards every few days can create hundreds of income entries a year.'],
				['h2', 'What happens when you sell'],
				['p', 'The value you declared as income becomes the cost basis of those coins. When you sell or swap them later, only the difference is a gain or a loss.'],
				['h2', 'Keep it manageable'],
				['ul', ['Export reward histories from each platform regularly.', 'Record the price at the time of each reward, not at the end of the year.', 'Check whether your country has an allowance for small amounts of income.']],
			],
		},
		de: {
			title: 'Staking-Erträge und Steuern',
			slug: 'staking-ertraege-und-steuern',
			excerpt: 'Staking zahlt in neuen Coins. So erfahren Sie, wann diese Einkünfte meist besteuert werden und warum der Wert am Tag des Zuflusses zählt.',
			blocks: [
				['p', 'Staking ist eine der einfachsten Möglichkeiten, mit Krypto zu verdienen: Sie sperren Coins, um ein Netzwerk abzusichern, und erhalten dafür Erträge. Steuerlich sind diese Erträge in der Regel Einkünfte.'],
				['h2', 'Wann die Einkünfte entstehen'],
				['p', 'In den meisten Ländern werden Erträge bei Zufluss besteuert, zum Marktwert an diesem Tag. Ein Coin, der alle paar Tage kleine Erträge zahlt, kann Hunderte Einträge im Jahr erzeugen.'],
				['h2', 'Was beim Verkauf passiert'],
				['p', 'Der als Einkünfte erklärte Wert wird zum Anschaffungswert dieser Coins. Verkaufen oder tauschen Sie sie später, ist nur die Differenz ein Gewinn oder Verlust.'],
				['h2', 'Den Überblick behalten'],
				['ul', ['Exportieren Sie die Ertragshistorien jeder Plattform regelmäßig.', 'Erfassen Sie den Kurs zum Zeitpunkt jedes Ertrags, nicht zum Jahresende.', 'Prüfen Sie, ob Ihr Land eine Freigrenze für kleine Einkünfte vorsieht.']],
			],
		},
	},
	{
		date: '2026-09-02 09:00:00',
		category: 'tax',
		image: 335,
		en: {
			title: 'NFT Taxes for Creators and Collectors',
			slug: 'nft-taxes-creators-collectors',
			excerpt: 'Minting, buying and selling NFTs can all have tax consequences — differently for those who create and those who collect.',
			blocks: [
				['p', 'NFTs are digital assets, and in most respects tax offices treat them like other crypto. What changes is your role: creating and selling your own work is usually business income, while trading NFTs is closer to investing.'],
				['h2', 'For collectors'],
				['p', 'Buying an NFT with crypto is often a disposal of the crypto you paid with. Selling the NFT later creates a gain or a loss against what it cost you, including network fees.'],
				['h2', 'For creators'],
				['p', 'Primary sales and royalties are usually income. Costs such as minting fees and software can often be deducted.'],
				['h2', 'Common pitfalls'],
				['ul', ['Forgetting that paying with crypto is a sale of that crypto', 'Missing royalty payments spread across many small transfers', 'No price data for rare collections']],
			],
		},
		de: {
			title: 'NFT-Steuern für Kreative und Sammler',
			slug: 'nft-steuern-kreative-sammler',
			excerpt: 'Minten, Kaufen und Verkaufen von NFTs kann steuerliche Folgen haben – für Kreative anders als für Sammler.',
			blocks: [
				['p', 'NFTs sind digitale Vermögenswerte, und die Finanzämter behandeln sie in den meisten Punkten wie andere Kryptowerte. Entscheidend ist Ihre Rolle: Wer eigene Werke erstellt und verkauft, erzielt meist gewerbliche Einkünfte, wer mit NFTs handelt, eher Kapitalerträge.'],
				['h2', 'Für Sammler'],
				['p', 'Ein NFT mit Krypto zu kaufen ist oft eine Veräußerung der Kryptowerte, mit denen Sie bezahlt haben. Der spätere Verkauf des NFT ergibt einen Gewinn oder Verlust gegenüber den Anschaffungskosten inklusive Netzwerkgebühren.'],
				['h2', 'Für Kreative'],
				['p', 'Erstverkäufe und Lizenzgebühren sind meist Einkünfte. Kosten wie Mint-Gebühren und Software lassen sich oft absetzen.'],
				['h2', 'Häufige Stolperfallen'],
				['ul', ['Vergessen, dass Bezahlen mit Krypto ein Verkauf dieser Kryptowerte ist', 'Übersehene Lizenzzahlungen, verteilt auf viele kleine Transfers', 'Fehlende Kursdaten für seltene Kollektionen']],
			],
		},
	},
	{
		date: '2026-08-19 09:00:00',
		category: 'guides',
		image: 332,
		en: {
			title: 'Cost Basis Methods Explained: FIFO, LIFO and Specific ID',
			slug: 'cost-basis-methods-explained',
			excerpt: 'Which coins did you sell? The answer decides your gain, and the method used to answer it is called cost basis.',
			blocks: [
				['p', 'If you bought the same coin several times at different prices, a sale raises a simple question with a big effect: which of those coins did you sell? The method used to answer it can change your taxable gain considerably.'],
				['h2', 'The common methods'],
				['ul', ['FIFO (first in, first out): the oldest coins are sold first. Required in many countries.', 'LIFO (last in, first out): the newest coins are sold first.', 'Specific identification: you choose the exact units, if your records allow it.']],
				['img', 339],
				['h2', 'Why it matters'],
				['p', 'In a rising market, FIFO usually means larger gains, because the oldest coins were the cheapest. In a falling market the effect reverses. Not every method is allowed everywhere, so check the local rules before you choose.'],
				['h2', 'Consistency counts'],
				['p', 'Whatever method applies to you, use it consistently across all exchanges and wallets. Our reports calculate the cost basis across your whole portfolio, not account by account.'],
			],
		},
		de: {
			title: 'Anschaffungskosten erklärt: FIFO, LIFO und Einzelzuordnung',
			slug: 'anschaffungskosten-methoden-erklaert',
			excerpt: 'Welche Coins haben Sie verkauft? Die Antwort bestimmt Ihren Gewinn – und die Methode dafür heißt Ermittlung der Anschaffungskosten.',
			blocks: [
				['p', 'Wenn Sie denselben Coin mehrmals zu unterschiedlichen Preisen gekauft haben, wirft ein Verkauf eine einfache Frage mit großer Wirkung auf: Welche dieser Coins haben Sie verkauft? Die Methode, mit der sie beantwortet wird, kann Ihren steuerpflichtigen Gewinn erheblich verändern.'],
				['h2', 'Die gängigen Methoden'],
				['ul', ['FIFO (first in, first out): Die ältesten Coins gelten als zuerst verkauft. In vielen Ländern vorgeschrieben.', 'LIFO (last in, first out): Die neuesten Coins gelten als zuerst verkauft.', 'Einzelzuordnung: Sie bestimmen die genauen Einheiten, sofern Ihre Unterlagen das erlauben.']],
				['img', 339],
				['h2', 'Warum das wichtig ist'],
				['p', 'In einem steigenden Markt bedeutet FIFO meist höhere Gewinne, weil die ältesten Coins am günstigsten waren. In einem fallenden Markt kehrt sich der Effekt um. Nicht jede Methode ist überall zulässig – prüfen Sie die Regeln vor der Wahl.'],
				['h2', 'Einheitlich bleiben'],
				['p', 'Welche Methode auch für Sie gilt: Wenden Sie sie einheitlich über alle Börsen und Wallets an. Unsere Berichte ermitteln die Anschaffungskosten über Ihr gesamtes Portfolio, nicht Konto für Konto.'],
			],
		},
	},
	{
		date: '2026-08-05 09:00:00',
		category: 'tax',
		image: 331,
		en: {
			title: 'What Counts as a Taxable Event in Crypto?',
			slug: 'what-counts-as-a-taxable-crypto-event',
			excerpt: 'Not every crypto transaction is taxed, but more of them are than most people expect. A quick guide to the usual suspects.',
			blocks: [
				['p', 'Many investors believe crypto is only taxed when they cash out to their bank account. In most countries, that is not the case.'],
				['h2', 'Usually taxable'],
				['ul', ['Selling crypto for money', 'Swapping one coin for another', 'Paying for goods or services with crypto', 'Receiving staking, mining or airdrop rewards']],
				['h2', 'Usually not taxable'],
				['ul', ['Buying crypto with money and holding it', 'Moving coins between your own wallets', 'Gifts below local limits (the rules vary)']],
				['h2', 'Why records matter'],
				['p', 'Every taxable event needs a date, an amount and a value in your local currency. Without complete records, it is hard to prove your gains — or your losses.'],
				['p', 'Not sure which of your transactions count? Book a free consultation and we will go through them with you.'],
			],
		},
		de: {
			title: 'Was ist bei Krypto ein Steuerereignis?',
			slug: 'was-ist-ein-krypto-steuerereignis',
			excerpt: 'Nicht jede Krypto-Transaktion wird besteuert, aber mehr, als die meisten erwarten. Ein kurzer Überblick über die üblichen Fälle.',
			blocks: [
				['p', 'Viele Anleger glauben, Krypto werde erst besteuert, wenn sie Geld auf ihr Bankkonto auszahlen. In den meisten Ländern ist das nicht so.'],
				['h2', 'In der Regel steuerpflichtig'],
				['ul', ['Krypto gegen Geld verkaufen', 'Einen Coin gegen einen anderen tauschen', 'Waren oder Dienstleistungen mit Krypto bezahlen', 'Erträge aus Staking, Mining oder Airdrops erhalten']],
				['h2', 'In der Regel nicht steuerpflichtig'],
				['ul', ['Krypto mit Geld kaufen und halten', 'Coins zwischen eigenen Wallets verschieben', 'Schenkungen unterhalb der Freibeträge (die Regeln unterscheiden sich)']],
				['h2', 'Warum Unterlagen zählen'],
				['p', 'Jedes Steuerereignis braucht ein Datum, eine Menge und einen Wert in Ihrer Landeswährung. Ohne vollständige Unterlagen lassen sich Gewinne – oder Verluste – kaum belegen.'],
				['p', 'Unsicher, welche Ihrer Transaktionen zählen? Vereinbaren Sie ein kostenloses Erstgespräch, und wir gehen sie gemeinsam durch.'],
			],
		},
	},
];

// Blocks → block editor markup (core blocks, as the editor would save them).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function blocksToMarkup(blocks, urls) {
	return blocks
		.map(([type, value]) => {
			switch (type) {
				case 'p':
					return `<!-- wp:paragraph -->\n<p>${esc(value)}</p>\n<!-- /wp:paragraph -->`;
				case 'h2':
					return `<!-- wp:heading -->\n<h2 class="wp-block-heading">${esc(value)}</h2>\n<!-- /wp:heading -->`;
				case 'ul':
					return `<!-- wp:list -->\n<ul class="wp-block-list">${value.map((item) => `<!-- wp:list-item -->\n<li>${esc(item)}</li>\n<!-- /wp:list-item -->`).join('')}</ul>\n<!-- /wp:list -->`;
				case 'img':
					return `<!-- wp:image {"id":${value},"sizeSlug":"large","linkDestination":"none"} -->\n<figure class="wp-block-image size-large"><img src="{{url:${value}:large}}" alt="" class="wp-image-${value}"/></figure>\n<!-- /wp:image -->`;
				case 'video':
					return `<!-- wp:video {"id":${value}} -->\n<figure class="wp-block-video"><video controls preload="metadata" src="{{url:${value}}}"></video></figure>\n<!-- /wp:video -->`;
				default:
					throw new Error('unknown block ' + type);
			}
		})
		.join('\n\n');
}

const out = posts.map((p) => ({
	date: p.date,
	category: p.category,
	image: p.image,
	en: { ...p.en, content: blocksToMarkup(p.en.blocks), blocks: undefined },
	de: { ...p.de, content: blocksToMarkup(p.de.blocks), blocks: undefined },
}));

if (require.main === module) {
	const file = path.join(__dirname, '..', 'design', 'assets', 'blog', 'posts.json');
	fs.writeFileSync(file, JSON.stringify({ categories, posts: out }, null, '\t'));
	const words = (lang) => out.reduce((n, p) => n + p[lang].content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, 0);
	console.log(`${out.length} posts → ${path.relative(process.cwd(), file)}; words EN ${words('en')}, DE ${words('de')}`);
}

module.exports = { categories, posts };
