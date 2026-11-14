// Smooth in-page scrolling (html.smooth-scroll, src/scss/base/_scroll.scss) starts with the visitor's first
// click, tap or key press. Until then the page scrolls instantly, so a link from another page (/#section)
// jumps straight to its target and the browser keeps it in place while the web font swaps in. Elementor
// turns smooth scrolling on for the whole page, and a smooth jump on load stopped short of the section
// (by up to ~260 px on phones). In-page links still glide: the click itself turns smooth scrolling on.

export function initSmoothScroll() {
	const root = document.documentElement;
	const events = ['pointerdown', 'keydown', 'touchstart'];
	const enable = () => {
		root.classList.add('smooth-scroll');
		events.forEach((type) => window.removeEventListener(type, enable, true));
	};
	events.forEach((type) => window.addEventListener(type, enable, { capture: true, passive: true }));
}
