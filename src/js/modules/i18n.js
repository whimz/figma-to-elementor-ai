// Words the scripts add to the page for screen readers (slider dots, carousel roles, video button), in the page's
// language (<html lang>, set by Polylang): English or German, English for anything else.

const STRINGS = {
	en: { card: 'Card', testimonial: 'Testimonial', testimonials: 'Testimonials', carousel: 'carousel', slide: 'slide', of: 'of', playVideo: 'Play video', teamMember: 'Team member' },
	de: { card: 'Karte', testimonial: 'Kundenstimme', testimonials: 'Kundenstimmen', carousel: 'Karussell', slide: 'Folie', of: 'von', playVideo: 'Video abspielen', teamMember: 'Teammitglied' },
};

export const t = STRINGS[document.documentElement.lang.slice(0, 2).toLowerCase()] || STRINGS.en;
