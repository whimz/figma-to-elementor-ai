<?php
/**
 * Shortcodes for text edited in Elementor. Page content runs them through the_content,
 * Site Parts through aiec_render_site_part(). The editor canvas shows them as typed.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_shortcode( 'aiec_year', 'aiec_year_shortcode' );

/**
 * Current year in the site timezone, e.g. for the footer copyright: "© [aiec_year] Legite."
 *
 * @return string
 */
function aiec_year_shortcode() {
	return esc_html( wp_date( 'Y' ) );
}
