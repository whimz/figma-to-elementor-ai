// "How it works" video: Elementor class "video-player" on the box, "video-play" on the round button,
// an e-self-hosted-video inside (preload "none", controls on). The script turns the round button into
// a real button: it starts the clip, the native controls take over while it plays, and when it ends the
// box goes back to the cover. Without the script (or in the Elementor editor) the native controls work.
import { t } from './i18n.js';

function initPlayer(box) {
	const video = box.querySelector('video');
	const play = box.querySelector('.video-play');
	if (!video || !play) {
		return;
	}

	video.controls = false;
	play.setAttribute('role', 'button');
	play.setAttribute('aria-label', t.playVideo);
	play.tabIndex = 0;

	const start = () => {
		box.classList.add('is-playing');
		video.controls = true;
		video.play().catch(() => {});
		video.focus({ preventScroll: true });
	};

	play.addEventListener('click', start);
	play.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			start();
		}
	});

	// Off screen the clip pauses (less than a quarter of the box visible) and goes on when the box is back,
	// but only if it was paused here, not by the viewer. Fullscreen and picture-in-picture are left alone.
	let pausedOffscreen = false;
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!box.classList.contains('is-playing') || document.fullscreenElement || document.pictureInPictureElement === video) {
				return;
			}
			const visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
			if (!visible && !video.paused) {
				pausedOffscreen = true;
				video.pause();
			} else if (visible && pausedOffscreen) {
				pausedOffscreen = false;
				video.play().catch(() => {});
			}
		},
		{ threshold: [0, 0.25] },
	);
	observer.observe(box);
	video.addEventListener('play', () => {
		pausedOffscreen = false;
	});

	video.addEventListener('ended', () => {
		const hadFocus = box.contains(document.activeElement);
		box.classList.remove('is-playing');
		video.controls = false;
		video.load(); // back to the empty cover (no poster, nothing preloaded)
		if (hadFocus) {
			play.focus({ preventScroll: true });
		}
	});

	box.classList.add('is-ready');
}

export function initVideoPlayers() {
	if (document.body.classList.contains('elementor-editor-active')) {
		return;
	}
	document.querySelectorAll('.video-player').forEach(initPlayer);
}
