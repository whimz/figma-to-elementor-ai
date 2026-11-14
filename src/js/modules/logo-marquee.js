// Logo strip (Elementor class "logo-marquee" on a wrapper; its first child is the row of logos):
// on phones it becomes an endless ticker (styles in src/scss/base/_logo-marquee.scss).
// A copy of the logos is appended for a seamless loop and hidden from assistive technology.
// Tap pauses and resumes; with prefers-reduced-motion the logos stay a static row.

const SPEED = 30; // px per second
const MIN_DURATION = 8; // s
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

function cloneItem(item) {
	const clone = item.cloneNode(true);

	clone.classList.add('logo-marquee__clone');
	clone.setAttribute('aria-hidden', 'true');
	// Elementor ids must stay unique; the copy is decoration only.
	[clone, ...clone.querySelectorAll('*')].forEach((el) => {
		el.removeAttribute('data-id');
		el.removeAttribute('data-interaction-id');
		if (el.hasAttribute('alt')) {
			el.setAttribute('alt', '');
		}
	});

	return clone;
}

function initMarquee(marquee) {
	const track = marquee.firstElementChild;

	if (!track || marquee.classList.contains('is-ready')) {
		return;
	}

	[...track.children].forEach((item) => track.append(cloneItem(item)));
	marquee.classList.add('is-ready');

	// Half of the track is one full set of logos; keep the speed constant whatever their number.
	const updateDuration = () => {
		const duration = Math.max(track.scrollWidth / 2 / SPEED, MIN_DURATION);
		marquee.style.setProperty('--aiec-marquee-duration', `${duration.toFixed(1)}s`);
	};

	const updateMotion = () => {
		marquee.classList.toggle('is-running', !REDUCED_MOTION.matches);
	};

	marquee.addEventListener('click', () => marquee.classList.toggle('is-paused'));
	REDUCED_MOTION.addEventListener('change', updateMotion);
	new ResizeObserver(updateDuration).observe(track);
	updateMotion();
}

export function initLogoMarquees() {
	// Elementor canvas: keep the editable markup as it is.
	if (document.body.classList.contains('elementor-editor-active')) {
		return;
	}

	document.querySelectorAll('.logo-marquee').forEach(initMarquee);
}
