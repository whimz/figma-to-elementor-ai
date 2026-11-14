<?php
/**
 * Blog: the list of articles (blog home, categories, search results) and the article page are Site Parts
 * built in Elementor — "blog-archive" and "blog-post" — like the header and footer (inc/site-parts.php).
 * The theme renders the part instead of its own template; article data comes from the theme's widgets
 * (theme/widgets/post-grid.php, post-header.php, post-content.php, archive-title.php, blog-sidebar.php),
 * which use the helpers below. Elementor Free has no Theme Builder and no dynamic tags for V4 elements.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Site Part for the current request.
 *
 * @return string 'blog-post', 'blog-archive' or '' (not a blog page).
 */
function aiec_blog_location() {
	if ( is_singular( 'post' ) ) {
		return 'blog-post';
	}

	if ( is_home() || is_category() || is_tag() || is_search() || is_date() || is_author() ) {
		return 'blog-archive';
	}

	return '';
}

add_filter( 'template_include', 'aiec_blog_template', 20 );

/**
 * Blog pages use the theme's blog template when their Site Part exists (otherwise Hello's templates).
 *
 * @param string $template Template file chosen by WordPress.
 * @return string
 */
function aiec_blog_template( $template ) {
	$location = aiec_blog_location();

	if ( $location && aiec_has_site_part( $location ) ) {
		return get_stylesheet_directory() . '/template-parts/blog.php';
	}

	return $template;
}

add_action( 'after_setup_theme', 'aiec_blog_image_sizes' );

/**
 * Image sizes of the blog: cards (3:2, up to ~380 px wide at 2×) and the article header (~851 × 324 at 2×).
 */
function aiec_blog_image_sizes() {
	add_image_size( 'aiec-card', 768, 512, true );
	add_image_size( 'aiec-wide', 1702, 648, true );
}

// No comments on articles: the design has none, and an open form invites spam on a demo site.
add_filter( 'comments_open', 'aiec_blog_close_comments', 10, 2 );
add_filter( 'pings_open', 'aiec_blog_close_comments', 10, 2 );

/**
 * Closes comments and pings on posts.
 *
 * @param bool $open    Whether open.
 * @param int  $post_id Post ID.
 * @return bool
 */
function aiec_blog_close_comments( $open, $post_id ) {
	return 'post' === get_post_type( $post_id ) ? false : $open;
}

add_filter( 'nav_menu_link_attributes', 'aiec_blog_menu_current', 10, 2 );

/**
 * Marks the "Blog" menu item as current on an article or a category: WordPress gives the posts page
 * item only the class current_page_parent there, not aria-current (the menu styles use aria-current).
 *
 * @param array    $atts Link attributes.
 * @param \WP_Post $item Menu item.
 * @return array
 */
function aiec_blog_menu_current( $atts, $item ) {
	if ( empty( $atts['aria-current'] ) && in_array( 'current_page_parent', (array) $item->classes, true ) && aiec_blog_location() ) {
		$atts['aria-current'] = 'true';
	}

	return $atts;
}

/**
 * Whether the widgets show sample data: in the Elementor editor of a blog Site Part and on the part's own
 * preview there is no article or list in the main query.
 *
 * @return bool
 */
function aiec_blog_is_preview() {
	return '' === aiec_blog_location();
}

/**
 * Language of the document being rendered (Polylang), for preview queries in the editor.
 *
 * @return string Language slug or '' (all).
 */
function aiec_blog_preview_language() {
	if ( ! function_exists( 'pll_get_post_language' ) ) {
		return '';
	}

	$lang = get_the_ID() ? pll_get_post_language( get_the_ID() ) : '';

	return $lang ? $lang : (string) pll_current_language();
}

/**
 * The article the single-post widgets show: the current one, or the latest one as a preview.
 *
 * @return \WP_Post|null
 */
function aiec_blog_current_post() {
	if ( is_singular( 'post' ) ) {
		return get_queried_object();
	}

	$posts = get_posts(
		array(
			'numberposts' => 1,
			'post_status' => 'publish',
			'lang'        => aiec_blog_preview_language(),
		)
	);

	return $posts ? $posts[0] : null;
}

/**
 * First category of an article (shown on its card).
 *
 * @param int $post_id Post ID.
 * @return \WP_Term|null
 */
function aiec_post_category( $post_id ) {
	$categories = get_the_category( $post_id );

	return $categories ? $categories[0] : null;
}

/**
 * Article date as in the design ("Wed. Nov 12, 2025"); German order on German pages.
 *
 * @param \WP_Post $post Article.
 * @return string
 */
function aiec_post_date( $post ) {
	$german = function_exists( 'pll_get_post_language' ) && 'de' === pll_get_post_language( $post->ID );

	return get_the_date( $german ? 'D., j. M Y' : 'D. M j, Y', $post );
}

/**
 * Article card: picture with the purple tint and the category, date, title with an arrow, excerpt.
 * The whole card is clickable through the title link (its ::after covers the card).
 *
 * @param \WP_Post $post         Article.
 * @param string   $heading_tag  h2 or h3.
 * @param bool     $show_excerpt Whether to show the excerpt.
 * @return string HTML.
 */
function aiec_render_post_card( $post, $heading_tag = 'h2', $show_excerpt = true ) {
	$tag      = in_array( $heading_tag, array( 'h2', 'h3', 'h4' ), true ) ? $heading_tag : 'h2';
	$category = aiec_post_category( $post->ID );

	$media = get_the_post_thumbnail(
		$post,
		'aiec-card',
		array(
			'class'   => 'aiec-post-card__image',
			'alt'     => '',
			'loading' => 'lazy',
			'sizes'   => '(max-width: 767px) 100vw, 400px',
		)
	);

	$html  = '<article class="aiec-post-card">';
	$html .= '<div class="aiec-post-card__media">' . $media;
	if ( $category ) {
		$html .= '<span class="aiec-post-card__category">' . esc_html( $category->name ) . '</span>';
	}
	$html .= '</div><div class="aiec-post-card__body">';
	$html .= sprintf( '<time class="aiec-post-card__date" datetime="%s">%s</time>', esc_attr( get_the_date( 'c', $post ) ), esc_html( aiec_post_date( $post ) ) );
	$html .= sprintf(
		'<%1$s class="aiec-post-card__title"><a href="%2$s">%3$s</a>%4$s</%1$s>',
		$tag,
		esc_url( get_permalink( $post ) ),
		esc_html( get_the_title( $post ) ),
		aiec_icon( 'arrow-up-right' )
	);
	if ( $show_excerpt ) {
		$html .= '<p class="aiec-post-card__excerpt">' . esc_html( get_the_excerpt( $post ) ) . '</p>';
	}
	$html .= '</div></article>';

	return $html;
}

/**
 * Pagination of a list of articles as in the design: "1 to 6 of 8", first / previous, "Page 1 of 2",
 * next / last. Unavailable steps are shown greyed out, not as links.
 *
 * @param \WP_Query $query The list.
 * @return string HTML or '' for a single page.
 */
function aiec_render_pagination( $query ) {
	$pages = (int) $query->max_num_pages;
	if ( $pages < 2 ) {
		return '';
	}

	$current  = max( 1, (int) get_query_var( 'paged' ) );
	$per_page = (int) $query->get( 'posts_per_page' );
	$found    = (int) $query->found_posts;
	$from     = ( $current - 1 ) * $per_page + 1;
	$to       = min( $found, $current * $per_page );

	$step = static function ( $page, $icon, $label, $enabled ) {
		if ( ! $enabled ) {
			return sprintf( '<span class="aiec-pagination__step is-disabled" aria-hidden="true">%s</span>', aiec_icon( $icon ) );
		}
		return sprintf( '<a class="aiec-pagination__step" href="%s" aria-label="%s">%s</a>', esc_url( get_pagenum_link( $page ) ), esc_attr( $label ), aiec_icon( $icon ) );
	};

	$html  = '<nav class="aiec-pagination" aria-label="' . esc_attr__( 'Pagination', 'ai-elem-child' ) . '">';
	$html .= '<p class="aiec-pagination__count">' . esc_html(
		sprintf(
			/* translators: 1: first article on the page, 2: last article on the page, 3: number of articles. */
			__( '%1$s to %2$s of %3$s', 'ai-elem-child' ),
			number_format_i18n( $from ),
			number_format_i18n( $to ),
			number_format_i18n( $found )
		)
	) . '</p>';
	$html .= '<div class="aiec-pagination__controls">';
	$html .= $step( 1, 'page-first', __( 'First page', 'ai-elem-child' ), $current > 1 );
	$html .= $step( $current - 1, 'chevron-left', __( 'Previous page', 'ai-elem-child' ), $current > 1 );
	$html .= '<p class="aiec-pagination__page">' . esc_html(
		sprintf(
			/* translators: 1: current page, 2: number of pages. */
			__( 'Page %1$s of %2$s', 'ai-elem-child' ),
			number_format_i18n( $current ),
			number_format_i18n( $pages )
		)
	) . '</p>';
	$html .= $step( $current + 1, 'chevron-right', __( 'Next page', 'ai-elem-child' ), $current < $pages );
	$html .= $step( $pages, 'page-last', __( 'Last page', 'ai-elem-child' ), $current < $pages );
	$html .= '</div></nav>';

	return $html;
}
