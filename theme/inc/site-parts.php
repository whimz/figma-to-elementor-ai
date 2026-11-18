<?php
/**
 * Site Parts: header and footer built in Elementor and output by the theme on every page.
 *
 * A lightweight replacement for Elementor Pro's Theme Builder on Elementor Free.
 * Each part is an `aiec_part` post edited with Elementor; the post slug is its location
 * ("header" or "footer"). Do not change these slugs. Polylang translates parts like pages:
 * a translation has its own slug (e.g. header-de) and is found through the original part.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', 'aiec_register_site_parts' );

/**
 * Register the Site Parts post type.
 *
 * It has to be publicly queryable: the Elementor editor previews the post on the front end.
 * Single part pages are kept out of search and marked noindex.
 *
 * @return void
 */
function aiec_register_site_parts() {
	register_post_type(
		'aiec_part',
		array(
			'labels'              => array(
				'name'          => esc_html__( 'Site Parts', 'ai-elem-child' ),
				'singular_name' => esc_html__( 'Site Part', 'ai-elem-child' ),
				'add_new_item'  => esc_html__( 'Add Site Part', 'ai-elem-child' ),
				'edit_item'     => esc_html__( 'Edit Site Part', 'ai-elem-child' ),
			),
			'public'              => true,
			'publicly_queryable'  => true,
			'exclude_from_search' => true,
			'show_in_nav_menus'   => false,
			'show_in_rest'        => true,
			'has_archive'         => false,
			'rewrite'             => false,
			'menu_icon'           => 'dashicons-layout',
			'menu_position'       => 21,
			'supports'            => array( 'title', 'elementor' ),
			// Parts render on every page: only users who can manage pages (Editors and up) may edit them.
			'capability_type'     => 'page',
			'map_meta_cap'        => true,
		)
	);
}

add_filter( 'pll_get_post_types', 'aiec_translate_site_parts', 10, 2 );

/**
 * Polylang: Site Parts are always translatable (not a choice in Languages > Settings).
 *
 * @param string[] $post_types  Translatable post types.
 * @param bool     $is_settings Whether the list is for the settings screen.
 * @return string[]
 */
function aiec_translate_site_parts( $post_types, $is_settings ) {
	if ( $is_settings ) {
		unset( $post_types['aiec_part'] );
	} else {
		$post_types['aiec_part'] = 'aiec_part';
	}

	return $post_types;
}

add_filter( 'wp_robots', 'aiec_site_parts_noindex' );

/**
 * Keep single Site Part pages out of search engines.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function aiec_site_parts_noindex( $robots ) {
	if ( is_singular( 'aiec_part' ) ) {
		$robots['noindex']  = true;
		$robots['nofollow'] = true;
	}

	return $robots;
}

/**
 * Find the part for a location, in the current language when it has a translation. Drafts are
 * used only for users who can edit them, so a part can be reviewed before it goes live.
 *
 * @param string $location Part slug: "header" or "footer".
 * @return int Post ID or 0.
 */
function aiec_get_site_part_id( $location ) {
	$part = get_page_by_path( $location, OBJECT, 'aiec_part' );

	if ( ! $part ) {
		return 0;
	}

	$translation = function_exists( 'pll_get_post' ) ? pll_get_post( $part->ID ) : 0;
	if ( $translation && $translation !== $part->ID ) {
		$part = get_post( $translation );
	}

	if ( 'publish' === $part->post_status || current_user_can( 'edit_post', $part->ID ) ) {
		return (int) $part->ID;
	}

	return 0;
}

/**
 * Whether a location will be rendered from a Site Part.
 *
 * Not on the part's own page: the editor preview shows only the part being edited.
 *
 * @param string $location Part slug.
 * @return bool
 */
function aiec_has_site_part( $location ) {
	if ( ! did_action( 'elementor/loaded' ) || is_singular( 'aiec_part' ) ) {
		return false;
	}

	return aiec_get_site_part_id( $location ) > 0;
}

add_action( 'elementor/frontend/after_enqueue_styles', 'aiec_enqueue_site_part_styles' );

/**
 * Enqueue the parts' styles in <head>, together with the page's own Elementor styles.
 *
 * Parts are rendered later, in <body>. Elementor collects atomic and global class styles
 * only for documents announced via `elementor/post/render` before it enqueues them,
 * so the parts are announced here. On blog pages the blog part too (inc/blog.php).
 *
 * @return void
 */
function aiec_enqueue_site_part_styles() {
	foreach ( array_filter( array( 'header', 'footer', aiec_blog_location() ) ) as $location ) {
		if ( ! aiec_has_site_part( $location ) ) {
			continue;
		}

		$part_id = aiec_get_site_part_id( $location );

		do_action( 'elementor/post/render', $part_id ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- Elementor's own hook.
		\Elementor\Core\Files\CSS\Post::create( $part_id )->enqueue();
	}
}

add_action( 'wp_head', 'aiec_keep_site_part_styles_in_editor', 100 );

/**
 * Elementor editor canvas: keep the header and footer styled.
 *
 * In the canvas Elementor removes every pregenerated atomic stylesheet (link ids
 * "local-<id>-…-css" and "global-<id>-…-css", whatever the document) and re-renders styles only
 * for the document being edited, so the parts would lose theirs. Their CSS is printed inline
 * instead, each selector scoped to the part's wrapper: it cannot leak into the page being edited
 * (the footer's ".container" must not restyle the page's containers), and the extra class beats
 * the base styles the editor injects later. A part's own canvas has no header or footer
 * (aiec_has_site_part() is false there), so live edits are never overridden by this copy.
 *
 * @return void
 */
function aiec_keep_site_part_styles_in_editor() {
	if ( ! did_action( 'elementor/loaded' ) || ! \Elementor\Plugin::$instance->preview->is_preview_mode() ) {
		return;
	}

	$styles  = wp_styles();
	$uploads = wp_get_upload_dir();
	$css     = '';

	foreach ( array( 'header', 'footer' ) as $location ) {
		if ( ! aiec_has_site_part( $location ) ) {
			continue;
		}

		// Same order as on the front end: by breakpoint, global classes before local styles.
		$files   = array();
		$pattern = '/^(global|local)-' . aiec_get_site_part_id( $location ) . '-preview-(.+)$/';

		foreach ( $styles->registered as $handle => $style ) {
			if ( preg_match( $pattern, $handle, $match ) ) {
				$files[ $match[2] ][ $match[1] ] = $style;
			}
		}

		foreach ( $files as $breakpoint_files ) {
			foreach ( array( 'global', 'local' ) as $type ) {
				if ( empty( $breakpoint_files[ $type ] ) ) {
					continue;
				}

				$style = $breakpoint_files[ $type ];
				$file  = str_replace( $uploads['baseurl'], $uploads['basedir'], strtok( $style->src, '?' ) );

				if ( ! is_readable( $file ) ) {
					continue;
				}

				$rules = aiec_scope_css( (string) file_get_contents( $file ), '.aiec-site-' . $location ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file.
				$css  .= ( $style->args && 'all' !== $style->args ) ? "@media {$style->args}{{$rules}}" : $rules;
			}
		}
	}

	if ( $css ) {
		// Elementor-generated CSS, scoped above. "</" is escaped so the CSS can never close the <style> tag.
		echo '<style id="aiec-site-part-styles">' . str_replace( '</', '<\/', $css ) . "</style>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

/**
 * Prefix every selector of flat, generated CSS with a scope, e.g. ".a,.b:hover{…}" →
 * ".s .a,.s .b:hover{…}". Rules inside @media are scoped too; selectors with commas inside
 * :is()/:where() and @keyframes are not supported (Elementor's atomic CSS has neither).
 *
 * @param string $css   CSS.
 * @param string $scope Scope selector.
 * @return string
 */
function aiec_scope_css( $css, $scope ) {
	return (string) preg_replace_callback(
		'/(^|[{}])\s*([^{}@]+)\{/',
		static function ( $match ) use ( $scope ) {
			$selectors = array_map(
				static function ( $selector ) use ( $scope ) {
					return $scope . ' ' . trim( $selector );
				},
				explode( ',', $match[2] )
			);

			return $match[1] . implode( ',', $selectors ) . '{';
		},
		$css
	);
}

/**
 * Output a Site Part built with Elementor. Its styles are enqueued in <head>.
 *
 * @param string $location Part slug.
 * @return void
 */
function aiec_render_site_part( $location ) {
	$part_id = aiec_get_site_part_id( $location );

	if ( ! $part_id ) {
		return;
	}

	// Elementor escapes the rendered document itself.
	$html = \Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $part_id );

	// Shortcodes (e.g. [aiec_year] in the footer) run only in the header and footer. The blog parts
	// print visitor input (the search query) and the article body (already run through the_content),
	// so running shortcodes over them would execute shortcodes typed into the search box.
	if ( in_array( $location, array( 'header', 'footer' ), true ) ) {
		$html = do_shortcode( $html );
	}

	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
