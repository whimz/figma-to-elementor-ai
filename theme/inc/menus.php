<?php
/**
 * Menus: the Nav Menu widget shows top-level items only, so editors are warned about sub-items.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Whether a menu has sub-items (items nested under another item).
 *
 * @param int|string|WP_Term $menu Menu ID, slug, name or object.
 * @return bool
 */
function aiec_menu_has_sub_items( $menu ) {
	$items = $menu ? wp_get_nav_menu_items( $menu ) : array();

	foreach ( (array) $items as $item ) {
		if ( (int) $item->menu_item_parent > 0 ) {
			return true;
		}
	}

	return false;
}

/**
 * Menus available on the site, for widget select controls.
 *
 * @return array Menu names keyed by term ID.
 */
function aiec_get_menu_options() {
	$options = array();

	foreach ( wp_get_nav_menus() as $menu ) {
		$options[ $menu->term_id ] = $menu->name;
	}

	return $options;
}

/**
 * The menu assigned to Hello Elementor's Header location (menu-1), if any.
 *
 * @return int Menu term ID or 0.
 */
function aiec_get_header_menu_id() {
	$locations = get_nav_menu_locations();

	return isset( $locations['menu-1'] ) ? (int) $locations['menu-1'] : 0;
}

add_action( 'admin_notices', 'aiec_header_menu_sub_items_notice' );

/**
 * Warn on Appearance > Menus when the header menu has sub-items: they are not displayed.
 *
 * @return void
 */
function aiec_header_menu_sub_items_notice() {
	$screen = get_current_screen();

	if ( ! $screen || 'nav-menus' !== $screen->id || ! aiec_menu_has_sub_items( aiec_get_header_menu_id() ) ) {
		return;
	}

	printf(
		'<div class="notice notice-warning"><p>%s</p></div>',
		esc_html__( 'The header menu shows top-level items only: sub-items of the Header menu are not displayed on the site. Move them to the top level or ask your developer to enable dropdowns.', 'ai-elem-child' )
	);
}
