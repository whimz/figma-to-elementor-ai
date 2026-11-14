// Dots for a swipe slider (a horizontal scroll-snap row): one button per position the row can
// stop at, in visual order. With two slides per screen the last slide never comes first, so it has
// no dot of its own; the end of the row counts as the last position. The dot nearest to the
// current scroll is marked aria-current. The dots follow the row's width (ResizeObserver).
// Shared by card-stack.js and testimonials.js; dot styles in src/scss/base/_slider-dots.scss,
// when the dots show is up to each component's styles (the extra class).

import { t } from './i18n.js';

let counter = 0;

/**
 * @param {HTMLElement} scroller The scrolling row.
 * @param {HTMLElement[]} slides Its slides.
 * @param {{ label: string, className: string }} options Dot name ("Card" → "Card 1 of 3", the "of" in
 *   the page language)
 *   and the component's class for the dots wrapper.
 * @returns {{ build: () => void }} build() recreates the dots after a layout change.
 */
export function createSliderDots(scroller, slides, { label, className }) {
	const dots = document.createElement('div');
	dots.className = `slider-dots ${className}`;
	scroller.id = scroller.id || `slider-${++counter}`;
	scroller.after(dots);

	let stops = [];

	// Scroll positions of the slides, up to the end of the row.
	const measure = () => {
		const ordered = [...slides].sort((a, b) => a.offsetLeft - b.offsetLeft);
		const start = ordered[0].offsetLeft;
		const max = scroller.scrollWidth - scroller.clientWidth;
		const result = [];
		for (const [index, slide] of ordered.entries()) {
			const left = slide.offsetLeft - start;
			result.push({ index, left: Math.min(left, max) });
			if (left >= max - 2) {
				break;
			}
		}
		return { result, total: ordered.length };
	};

	const update = () => {
		let current = 0;
		stops.forEach((stop, i) => {
			if (Math.abs(stop.left - scroller.scrollLeft) < Math.abs(stops[current].left - scroller.scrollLeft)) {
				current = i;
			}
		});
		[...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', i === current ? 'true' : 'false'));
	};

	const build = () => {
		const { result, total } = measure();
		stops = result;
		dots.replaceChildren();
		stops.forEach((stop) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'slider-dots__dot';
			dot.setAttribute('aria-label', `${label} ${stop.index + 1} ${t.of} ${total}`);
			dot.setAttribute('aria-controls', scroller.id);
			dot.addEventListener('click', () => scroller.scrollTo({ left: stop.left, behavior: 'smooth' }));
			dots.append(dot);
		});
		update();
	};

	let frame = null;
	scroller.addEventListener('scroll', () => {
		if (frame === null) {
			frame = requestAnimationFrame(() => {
				frame = null;
				update();
			});
		}
	});

	// Rebuild only while the dots are shown (display: none → no offsetParent).
	new ResizeObserver(() => {
		if (dots.offsetParent !== null) {
			build();
		}
	}).observe(scroller);

	return { build };
}
