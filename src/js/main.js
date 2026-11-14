// Entry point for theme/assets/js/main.js (bundled by esbuild). The script is deferred,
// so the DOM is ready when it runs. Put features into ./modules/ and initialise them here.

import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initNavMenus } from './modules/nav-menu.js';
import { initLogoMarquees } from './modules/logo-marquee.js';
import { initCardStacks } from './modules/card-stack.js';
import { initTestimonials } from './modules/testimonials.js';
import { initVideoPlayers } from './modules/video-player.js';
import { initTeamRows } from './modules/team-row.js';

initSmoothScroll();
initNavMenus();
initLogoMarquees();
initCardStacks();
initTestimonials();
initVideoPlayers();
initTeamRows();
