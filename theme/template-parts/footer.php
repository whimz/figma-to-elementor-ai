<?php
/**
 * Site footer: the "footer" Site Part built in Elementor, or Hello Elementor's footer as a fallback.
 *
 * Overrides hello-elementor/template-parts/footer.php (and dynamic-footer.php, which loads this file).
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

// A Site Part's own page (the Elementor editor preview) shows only the part itself.
if ( is_singular( 'aiec_part' ) ) {
	return;
}

if ( aiec_has_site_part( 'footer' ) ) {
	echo '<div class="aiec-site-footer">';
	aiec_render_site_part( 'footer' );
	echo '</div>';
	return;
}

$aiec_parent_footer = hello_header_footer_experiment_active() ? 'dynamic-footer' : 'footer';
require get_template_directory() . '/template-parts/' . $aiec_parent_footer . '.php';
