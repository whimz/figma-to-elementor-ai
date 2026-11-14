<?php
/**
 * Elementor integration: widget category and custom widgets from widgets/.
 *
 * These hooks fire only when Elementor is active.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_action( 'elementor/elements/categories_registered', 'aiec_register_widget_category' );

/**
 * Add a widget panel category for the theme's custom widgets.
 *
 * @param \Elementor\Elements_Manager $elements_manager Elementor elements manager.
 * @return void
 */
function aiec_register_widget_category( $elements_manager ) {
	$elements_manager->add_category(
		'ai-elem-child',
		array(
			'title' => esc_html__( 'AI Elem Child', 'ai-elem-child' ),
			'icon'  => 'eicon-plug',
		)
	);
}

add_filter( 'hello_elementor_page_title', 'aiec_hide_title_on_elementor_pages' );

/**
 * Hide Hello's page title on pages built with Elementor: each page has its own hero heading.
 *
 * @param bool $show Whether Hello shows the title.
 * @return bool
 */
function aiec_hide_title_on_elementor_pages( $show ) {
	if ( ! did_action( 'elementor/loaded' ) || ! is_singular() ) {
		return $show;
	}

	$document = \Elementor\Plugin::$instance->documents->get( get_the_ID() );

	return ( $document && $document->is_built_with_elementor() ) ? false : $show;
}

add_filter( 'elementor/frontend/the_content', 'aiec_strip_atomic_image_ids' );

/**
 * Remove the attachment id that Elementor's atomic Image prints as the id attribute
 * (<img id="134">): the same picture used twice on a page gives duplicate ids. Nothing refers
 * to them; an id set in the editor (CSS ID) is kept, as it is not a bare number.
 *
 * @param string $content Rendered Elementor content.
 * @return string
 */
function aiec_strip_atomic_image_ids( $content ) {
	return preg_replace_callback(
		'/<img\b[^>]*\be-image-base\b[^>]*>/',
		static function ( $tag ) {
			return preg_replace( '/\sid="\d+"/', '', $tag[0] );
		},
		$content
	);
}

add_action( 'elementor/widgets/register', 'aiec_register_widgets' );

/**
 * Register every widget in widgets/.
 *
 * Convention: widgets/price-card.php declares the class AIEC_Widget_Price_Card.
 *
 * @param \Elementor\Widgets_Manager $widgets_manager Elementor widgets manager.
 * @return void
 */
function aiec_register_widgets( $widgets_manager ) {
	$files = glob( get_stylesheet_directory() . '/widgets/*.php' );

	foreach ( $files ? $files : array() as $file ) {
		require_once $file;

		$slug  = basename( $file, '.php' );
		$class = 'AIEC_Widget_' . str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $slug ) ) );

		if ( class_exists( $class ) ) {
			$widgets_manager->register( new $class() );
		}
	}
}
