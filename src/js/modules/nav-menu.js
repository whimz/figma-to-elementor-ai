// Nav Menu widget (theme/widgets/nav-menu.php):
// - compact (burger) mode when the menu does not fit on one line, at any width;
// - "ink drop" reveal of the full-screen menu on phones (styles in src/scss/widgets/_nav-menu.scss);
// - closes on Escape, outside click, link click and when the burger is no longer needed.

const TABLET_QUERY = window.matchMedia('(max-width: 1024px)');
const PHONE_QUERY = window.matchMedia('(max-width: 576px)'); // The ink drop runs on phones only.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const MAX_STAGGER_STEPS = 8;
const INK_EDGE = 48; // Extra radius so the orange leading edge ends up outside the panel.
const INK_CLOSE_MS = 400; // $ink-close in _nav-menu.scss.
const closeTimers = new WeakMap();

function isCompact(nav) {
	return TABLET_QUERY.matches || Boolean(nav.closest('.aiec-site-header.is-compact'));
}

// Panel position (below the sticky header and the admin bar) and the ink origin and radius.
function updateGeometry(nav, toggle, list) {
	const bar = nav.closest('header') || nav.parentElement;
	nav.style.setProperty('--aiec-nav-top', `${Math.round(bar.getBoundingClientRect().bottom)}px`);

	const panel = list.getBoundingClientRect();
	const button = toggle.getBoundingClientRect();
	const x = button.left + button.width / 2 - panel.left;
	const y = button.top + button.height / 2 - panel.top;
	const radius = Math.hypot(Math.max(x, panel.width - x), Math.max(y, panel.height - y)) + INK_EDGE;

	list.style.setProperty('--aiec-ink-x', `${Math.round(x)}px`);
	list.style.setProperty('--aiec-ink-y', `${Math.round(y)}px`);
	list.style.setProperty('--aiec-ink-r', `${Math.ceil(radius)}px`);
}

// The body class removes the header's backdrop-filter. With the blur on, the bar becomes the
// containing block of the fixed full-screen panel, so the class goes on before measuring and,
// on phones, comes off only after the ink has shrunk back (otherwise the closing drop jumps).
function setOpen(nav, toggle, list, open) {
	clearTimeout(closeTimers.get(nav));

	if (open) {
		document.body.classList.add('aiec-nav-open');
		updateGeometry(nav, toggle, list);
	}

	nav.classList.toggle('is-open', open);
	toggle.setAttribute('aria-expanded', String(open));

	if (!open) {
		const unlock = () => document.body.classList.remove('aiec-nav-open');

		if (PHONE_QUERY.matches && !REDUCED_MOTION.matches) {
			closeTimers.set(nav, setTimeout(unlock, INK_CLOSE_MS));
		} else {
			unlock();
		}
	}
}

// Switch to the burger on wide screens too when the items do not fit between the logo and the button.
function watchFit(nav, toggle, list) {
	const wrapper = nav.closest('.aiec-site-header');

	if (!wrapper || typeof ResizeObserver === 'undefined') {
		return;
	}

	const check = () => {
		if (TABLET_QUERY.matches) {
			wrapper.classList.remove('is-compact');
			return;
		}

		// Not while the menu is open: re-measuring would restart the reveal animation.
		if (nav.classList.contains('is-open')) {
			return;
		}

		// Measure the one-line layout; no paint happens between removing and restoring the class.
		wrapper.classList.remove('is-compact');
		wrapper.classList.toggle('is-compact', list.scrollWidth > list.clientWidth + 1);
	};

	new ResizeObserver(check).observe(wrapper);
	document.fonts?.ready.then(check);
	check();
}

function initNav(nav) {
	const toggle = nav.querySelector('.aiec-nav__toggle');
	const list = nav.querySelector('.aiec-nav__list');

	if (!toggle || !list) {
		return;
	}

	list.querySelectorAll(':scope > li').forEach((item, index) => {
		item.style.setProperty('--aiec-i', String(Math.min(index, MAX_STAGGER_STEPS)));
	});

	toggle.addEventListener('click', (event) => {
		const open = !nav.classList.contains('is-open');
		setOpen(nav, toggle, list, open);

		// Keyboard activation (Enter/Space gives detail 0): move focus into the menu.
		// Mouse and touch keep focus on the toggle, so no focus ring flashes on the first item.
		if (open && event.detail === 0) {
			list.querySelector('a')?.focus();
		}
	});

	nav.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && nav.classList.contains('is-open')) {
			setOpen(nav, toggle, list, false);
			toggle.focus();
		}
	});

	list.addEventListener('click', (event) => {
		if (event.target.closest('a')) {
			setOpen(nav, toggle, list, false);
		}
	});

	document.addEventListener('click', (event) => {
		if (nav.classList.contains('is-open') && !nav.contains(event.target)) {
			setOpen(nav, toggle, list, false);
		}
	});

	window.addEventListener('resize', () => {
		if (!nav.classList.contains('is-open')) {
			return;
		}

		if (isCompact(nav)) {
			updateGeometry(nav, toggle, list);
		} else {
			setOpen(nav, toggle, list, false);
		}
	});

	watchFit(nav, toggle, list);
}

export function initNavMenus() {
	document.querySelectorAll('[data-aiec-nav]').forEach(initNav);
}
