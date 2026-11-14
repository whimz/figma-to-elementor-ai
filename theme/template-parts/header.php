<?php
/**
 * Site header: the "header" Site Part built in Elementor, or Hello Elementor's header as a fallback.
 *
 * Overrides hello-elementor/template-parts/header.php (and dynamic-header.php, which loads this file).
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

// A Site Part's own page (the Elementor editor preview) shows only the part itself.
if ( is_singular( 'aiec_part' ) ) {
	return;
}

if ( aiec_has_site_part( 'header' ) ) {
	// The wrapper makes the header sticky (src/scss/widgets/_nav-menu.scss).
	echo '<div class="aiec-site-header">';
	aiec_render_site_part( 'header' );
	echo '</div>';
	return;
}

$aiec_parent_header = hello_header_footer_experiment_active() ? 'dynamic-header' : 'header';
require get_template_directory() . '/template-parts/' . $aiec_parent_header . '.php';
