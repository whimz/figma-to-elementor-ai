<?php
/**
 * Blog Sidebar widget: search in the articles and the categories as chips with counts — the working
 * part of the design's "Filterations" panel (its "Words", "Sources" and checkboxes do nothing, so they
 * are left out). Search stays in the page's language (Polylang). Styles: src/scss/widgets/_blog.scss.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Search and categories of the blog.
 */
class AIEC_Widget_Blog_Sidebar extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-blog-sidebar';
	}

	/**
	 * Name in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Blog Sidebar', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-sidebar';
	}

	/**
	 * Panel category.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'ai-elem-child' );
	}

	/**
	 * Search keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'blog', 'search', 'categories', 'filter', 'sidebar' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'content_section', array( 'label' => esc_html__( 'Sidebar', 'ai-elem-child' ) ) );

		$this->add_control(
			'title',
			array(
				'label'   => esc_html__( 'Title', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => 'Filter',
			)
		);

		$this->add_control(
			'categories_label',
			array(
				'label'   => esc_html__( 'Categories label', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => 'Categories',
			)
		);

		$this->add_control(
			'all_label',
			array(
				'label'   => esc_html__( 'All articles label', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => 'All articles',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Output.
	 */
	protected function render() {
		$settings  = $this->get_settings_for_display();
		$blog_url  = get_option( 'page_for_posts' ) ? get_permalink( get_option( 'page_for_posts' ) ) : home_url( '/' );
		$current   = is_category() ? get_queried_object_id() : 0;
		$on_home   = is_home() && ! is_search();
		$search_id = 'aiec-blog-search-' . $this->get_id();
		$lang      = aiec_blog_is_preview() ? aiec_blog_preview_language() : '';

		$categories = get_categories(
			array(
				'hide_empty' => true,
				'orderby'    => 'name',
				'lang'       => $lang ? $lang : ( function_exists( 'pll_current_language' ) ? pll_current_language() : '' ),
			)
		);

		$chip = static function ( $url, $label, $count, $active ) {
			return sprintf(
				'<li><a class="aiec-blog-sidebar__chip%1$s" href="%2$s"%3$s>%4$s<span>%5$s</span><span class="aiec-blog-sidebar__count">%6$s</span></a></li>',
				$active ? ' is-active' : '',
				esc_url( $url ),
				$active ? ' aria-current="page"' : '',
				$active ? aiec_icon( 'check' ) : '',
				esc_html( $label ),
				esc_html( number_format_i18n( $count ) )
			);
		};

		$total = 0;
		$items = '';
		foreach ( $categories as $category ) {
			$total += (int) $category->count;
			$items .= $chip( get_category_link( $category ), $category->name, (int) $category->count, $current === (int) $category->term_id );
		}
		$items = $chip( $blog_url, $settings['all_label'], $total, $on_home ) . $items;

		?>
		<aside class="aiec-blog-sidebar" aria-label="<?php echo esc_attr( $settings['title'] ); ?>">
			<p class="aiec-blog-sidebar__title"><?php echo esc_html( $settings['title'] ); ?></p>
			<form class="aiec-blog-sidebar__search" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<label class="screen-reader-text" for="<?php echo esc_attr( $search_id ); ?>"><?php esc_html_e( 'Search articles', 'ai-elem-child' ); ?></label>
				<input id="<?php echo esc_attr( $search_id ); ?>" type="search" name="s" value="<?php echo esc_attr( get_search_query( false ) ); ?>" placeholder="<?php esc_attr_e( 'Search articles', 'ai-elem-child' ); ?>">
				<input type="hidden" name="post_type" value="post">
				<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'ai-elem-child' ); ?>"><?php echo aiec_icon( 'search' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- theme SVG. ?></button>
			</form>
			<?php if ( $categories ) : ?>
				<p class="aiec-blog-sidebar__label" id="<?php echo esc_attr( $search_id ); ?>-categories"><?php echo esc_html( $settings['categories_label'] ); ?></p>
				<ul class="aiec-blog-sidebar__chips" role="list" aria-labelledby="<?php echo esc_attr( $search_id ); ?>-categories">
					<?php echo $items; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in $chip. ?>
				</ul>
			<?php endif; ?>
		</aside>
		<?php
	}
}
