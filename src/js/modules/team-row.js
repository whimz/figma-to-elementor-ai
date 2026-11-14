// Team cards (About Us): Elementor class "team-row" on the row, "team-card" on each card. On phones the
// row becomes a swipe slider with dots, like the Insights cards; wider screens keep the Elementor layout.
// Styles in src/scss/base/_team-row.scss, all behind .is-ready (the Elementor editor shows plain cards).
import { createSliderDots } from './slider-dots.js';
import { t } from './i18n.js';

const PHONE = window.matchMedia('(max-width: 576px)');

function initRow(row) {
	const cards = [...row.children].filter((el) => el.classList.contains('team-card'));
	if (cards.length < 2) {
		return;
	}

	const dots = createSliderDots(row, cards, { label: t.teamMember, className: 'team-row__dots' });
	const update = () => {
		if (PHONE.matches) {
			dots.build();
		}
	};

	PHONE.addEventListener('change', update);
	row.classList.add('is-ready');
	update();
}

export function initTeamRows() {
	if (document.body.classList.contains('elementor-editor-active')) {
		return;
	}
	document.querySelectorAll('.team-row').forEach(initRow);
}
