// Overlapping cards (Elementor class "card-stack" on the area, the cards have "card--float";
// styles in src/scss/base/_card-stack.scss):
// - wide screens, where the cards overlap: a click or keyboard focus brings a card to the front;
// - phones (≤576): the cards become a swipe slider with dots.
// In the Elementor editor nothing happens: the client edits plain cards.

import { createSliderDots } from './slider-dots.js';
import { t } from './i18n.js';

const WIDE = window.matchMedia('(min-width: 1201px)');
const PHONE = window.matchMedia('(max-width: 576px)');

function initStack(stack) {
	const cards = [...stack.children].filter((el) => el.classList.contains('card--float'));

	if (cards.length < 2) {
		return;
	}

	// Front card: the middle one, as in the design.
	const main = cards[Math.floor(cards.length / 2)];
	let front = main;
	main.classList.add('card-stack__main', 'is-front');

	const bringToFront = (card) => {
		if (card === front) {
			return;
		}
		front.classList.remove('is-front');
		card.classList.add('is-front');
		front = card;
	};

	cards.forEach((card) => {
		card.addEventListener('click', () => {
			if (WIDE.matches) {
				bringToFront(card);
			}
		});
		card.addEventListener('focusin', () => bringToFront(card));
	});

	// Keyboard: the cards are focusable only while they overlap.
	const updateFocusable = () => {
		cards.forEach((card) => {
			if (WIDE.matches) {
				card.setAttribute('tabindex', '0');
			} else {
				card.removeAttribute('tabindex');
			}
		});
	};

	// Slider dots, in visual order (the main card comes first on narrow screens).
	const dots = createSliderDots(stack, cards, { label: t.card, className: 'card-stack__dots' });

	const update = () => {
		updateFocusable();
		if (PHONE.matches) {
			dots.build();
		}
	};

	WIDE.addEventListener('change', update);
	PHONE.addEventListener('change', update);
	stack.classList.add('is-ready');
	update();
}

export function initCardStacks() {
	if (document.body.classList.contains('elementor-editor-active')) {
		return;
	}

	document.querySelectorAll('.card-stack').forEach(initStack);
}
