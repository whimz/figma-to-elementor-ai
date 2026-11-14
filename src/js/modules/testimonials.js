// Testimonials carousel (Elementor class "testimonial-carousel" on the row, "testimonial" on each
// item; styles in src/scss/base/_testimonials.scss):
// - wide screens (>1024): coverflow. The active testimonial sits in the middle, the others follow
//   it in a circle, smaller and dimmed; a click, keyboard focus or the arrow keys bring another
//   one to the middle, and the row glides there (no movement with reduced motion);
// - tablets and phones: a swipe slider with dots, in the order of the page.
// The first testimonial on the page starts in the middle. In the Elementor editor nothing
// happens: the client edits plain cards.

import { createSliderDots } from './slider-dots.js';
import { t } from './i18n.js';

const WIDE = window.matchMedia('(min-width: 1025px)');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const MOVE = { duration: 500, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', id: 'testimonial-move' };

// Place of item i relative to the active one along the circle: 0, 1, 2, …, −2, −1.
const circularOffset = (i, active, count) => {
	const d = (i - active + count) % count;
	return d > count / 2 ? d - count : d;
};

// Horizontal centre on screen; the scale is anchored at the centre, so it does not shift it.
const centerOf = (el) => {
	const rect = el.getBoundingClientRect();
	return rect.left + rect.width / 2;
};

function initCarousel(carousel) {
	const items = [...carousel.children].filter((el) => el.classList.contains('testimonial'));
	const count = items.length;

	if (count < 2) {
		return;
	}

	let active = 0;

	carousel.setAttribute('role', 'region');
	carousel.setAttribute('aria-roledescription', t.carousel);
	carousel.setAttribute('aria-label', t.testimonials);
	items.forEach((item, i) => {
		item.setAttribute('role', 'group');
		item.setAttribute('aria-roledescription', t.slide);
		item.setAttribute('aria-label', `${i + 1} ${t.of} ${count}`);
	});

	// Coverflow places (used by the styles only on wide screens).
	const place = () => {
		items.forEach((item, i) => {
			const offset = circularOffset(i, active, count);
			item.style.setProperty('--testimonial-order', offset);
			item.dataset.distance = String(Math.min(Math.abs(offset), 3));
			// With an even number the circle has one place more on the right: that item leaves
			// the row, so the active one stays in the middle.
			item.toggleAttribute('data-spare', count > 2 && count % 2 === 0 && offset === count / 2);
		});
	};

	const activate = (index) => {
		if (index === active) {
			return;
		}

		const animate = !REDUCED_MOTION.matches;
		const before = items.map(centerOf);
		const turn = circularOffset(index, active, count);
		const oldOffsets = items.map((_, i) => circularOffset(i, active, count));

		items.forEach((item) => item.getAnimations().forEach((a) => a.id === MOVE.id && a.cancel()));
		active = index;
		place();

		if (!animate) {
			return;
		}

		// FLIP: each item starts where it was and glides to its new place. Items that went round
		// the circle come in from the edge instead of flying across the row.
		items.forEach((item, i) => {
			const after = centerOf(item);
			const offset = circularOffset(i, active, count);

			if (offset === oldOffsets[i] - turn) {
				item.animate([{ translate: `${before[i] - after}px 0` }, { translate: '0 0' }], MOVE);
			} else {
				item.animate([{ translate: `${Math.sign(offset) * 160}px 0`, opacity: 0 }, { translate: '0 0' }], MOVE);
			}
		});
	};

	items.forEach((item, i) => {
		item.addEventListener('click', () => {
			if (WIDE.matches) {
				activate(i);
			}
		});
		item.addEventListener('focusin', () => {
			if (WIDE.matches) {
				activate(i);
			}
		});
	});

	carousel.addEventListener('keydown', (event) => {
		if (!WIDE.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
			return;
		}
		event.preventDefault();
		const next = (active + (event.key === 'ArrowRight' ? 1 : -1) + count) % count;
		items[next].focus({ preventScroll: true }); // Focus brings it to the middle.
	});

	const dots = createSliderDots(carousel, items, { label: t.testimonial, className: 'testimonial-carousel__dots' });

	const update = () => {
		carousel.scrollLeft = 0;
		items.forEach((item) => {
			if (WIDE.matches) {
				item.setAttribute('tabindex', '0');
			} else {
				item.removeAttribute('tabindex');
			}
		});
		if (!WIDE.matches) {
			dots.build();
		}
	};

	place();
	WIDE.addEventListener('change', update);
	carousel.classList.add('is-ready');
	update();
}

export function initTestimonials() {
	if (document.body.classList.contains('elementor-editor-active')) {
		return;
	}

	document.querySelectorAll('.testimonial-carousel').forEach(initCarousel);
}
