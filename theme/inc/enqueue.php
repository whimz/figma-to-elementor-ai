<?php
/**
 * Front-end assets built by Gulp into assets/.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Asset version from the file modification time, so browsers and CDNs pick up every rebuild.
 *
 * @param string $relative_path Path relative to the child theme root.
 * @return string
 */
function aiec_asset_version( $relative_path ) {
	$file = get_stylesheet_directory() . '/' . ltrim( $relative_path, '/' );

	return file_exists( $file ) ? (string) filemtime( $file ) : wp_get_theme()->get( 'Version' );
}

// Priority 20: after Hello Elementor styles (priority 10), so the child theme can override them.
// No hard dependency on Hello handles — they can be disabled in Hello settings.
add_action( 'wp_enqueue_scripts', 'aiec_enqueue_assets', 20 );

/**
 * Enqueue the compiled stylesheet and script.
 *
 * @return void
 */
function aiec_enqueue_assets() {
	$css = 'assets/css/main.css';
	$js  = 'assets/js/main.js';

	// Hello's header/footer styles are not needed when Site Parts replace them.
	if ( function_exists( 'aiec_has_site_part' ) && aiec_has_site_part( 'header' ) && aiec_has_site_part( 'footer' ) ) {
		wp_dequeue_style( 'hello-elementor-header-footer' );
	}

	if ( file_exists( get_stylesheet_directory() . '/' . $css ) ) {
		wp_enqueue_style(
			'aiec-main',
			get_stylesheet_directory_uri() . '/' . $css,
			array(),
			aiec_asset_version( $css )
		);
	}

	if ( file_exists( get_stylesheet_directory() . '/' . $js ) ) {
		wp_enqueue_script(
			'aiec-main',
			get_stylesheet_directory_uri() . '/' . $js,
			array(),
			aiec_asset_version( $js ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}
}
