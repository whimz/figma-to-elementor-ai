<?php
/**
 * Theme setup.
 *
 * Hello Elementor already registers the common theme supports (title-tag, post-thumbnails,
 * custom-logo, html5, responsive-embeds, menus), so the child theme only adds what it needs.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', 'aiec_load_textdomain' );

/**
 * Load child theme translations from /languages.
 *
 * Hooked to init: since WordPress 6.7 loading translations earlier triggers a notice.
 *
 * @return void
 */
function aiec_load_textdomain() {
	load_child_theme_textdomain( 'ai-elem-child', get_stylesheet_directory() . '/languages' );
}
