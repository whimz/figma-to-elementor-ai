<?php
/**
 * Post Grid widget: article cards from WordPress — the current list (blog home, category, search
 * results) with pagination, or the latest articles (the "more articles" column next to an article).
 * Card markup and pagination: inc/blog.php; styles: src/scss/widgets/_blog.scss.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Article cards.
 */
class AIEC_Widget_Post_Grid extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-post-grid';
	}

	/**
	 * Name in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Post Grid', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-posts-grid';
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
		return array( 'blog', 'posts', 'articles', 'grid', 'cards' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'content_section', array( 'label' => esc_html__( 'Articles', 'ai-elem-child' ) ) );

		$this->add_control(
			'source',
			array(
				'label'       => esc_html__( 'Show', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::SELECT,
				'options'     => array(
					'current' => esc_html__( 'Current list (blog, category, search)', 'ai-elem-child' ),
					'latest'  => esc_html__( 'Latest articles', 'ai-elem-child' ),
				),
				'default'     => 'current',
				'description' => esc_html__( 'Articles per page of the list: Settings → Reading.', 'ai-elem-child' ),
			)
		);

		$this->add_control(
			'count',
			array(
				'label'     => esc_html__( 'Number of articles', 'ai-elem-child' ),
				'type'      => \Elementor\Controls_Manager::NUMBER,
				'min'       => 1,
				'max'       => 12,
				'default'   => 4,
				'condition' => array( 'source' => 'latest' ),
			)
		);

		$this->add_control(
			'heading_tag',
			array(
				'label'   => esc_html__( 'Card title tag', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => array(
					'h2' => 'H2',
					'h3' => 'H3',
				),
				'default' => 'h2',
			)
		);

		$this->add_control(
			'show_excerpt',
			array(
				'label'   => esc_html__( 'Excerpt', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::SWITCHER,
				'default' => 'yes',
			)
		);

		$this->add_control(
			'show_pagination',
			array(
				'label'     => esc_html__( 'Pagination', 'ai-elem-child' ),
				'type'      => \Elementor\Controls_Manager::SWITCHER,
				'default'   => 'yes',
				'condition' => array( 'source' => 'current' ),
			)
		);

		$this->add_responsive_control(
			'columns',
			array(
				'label'          => esc_html__( 'Columns', 'ai-elem-child' ),
				'type'           => \Elementor\Controls_Manager::NUMBER,
				'min'            => 1,
				'max'            => 4,
				'default'        => 3,
				'tablet_default' => 2,
				'mobile_default' => 1,
				'selectors'      => array( '{{WRAPPER}} .aiec-post-grid__list' => '--aiec-columns: {{VALUE}};' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * The query to show: the main query on blog lists, otherwise a query of its own (also as a preview in
	 * the Elementor editor of the Site Part).
	 *
	 * @param array $settings Widget settings.
	 * @return \WP_Query
	 */
	private function get_query( $settings ) {
		global $wp_query;

		if ( 'current' === $settings['source'] && 'blog-archive' === aiec_blog_location() ) {
			return $wp_query;
		}

		$args = array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
			'posts_per_page'      => 'latest' === $settings['source'] ? min( 12, max( 1, (int) $settings['count'] ) ) : (int) get_option( 'posts_per_page' ), // same 1–12 range as the editor control.
			'lang'                => aiec_blog_is_preview() ? aiec_blog_preview_language() : ( function_exists( 'pll_current_language' ) ? pll_current_language() : '' ),
		);

		if ( is_singular( 'post' ) ) {
			$args['post__not_in'] = array( get_queried_object_id() );
		}

		return new \WP_Query( $args );
	}

	/**
	 * Output.
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$query    = $this->get_query( $settings );

		if ( ! $query->have_posts() ) {
			if ( is_search() ) {
				printf( '<p class="aiec-post-grid__empty">%s</p>', esc_html__( 'No articles match your search. Try other words or browse the categories.', 'ai-elem-child' ) );
			}
			return;
		}

		$cards = '';
		foreach ( $query->posts as $post ) {
			$cards .= '<li>' . aiec_render_post_card( $post, $settings['heading_tag'], 'yes' === $settings['show_excerpt'] ) . '</li>';
		}

		echo '<div class="aiec-post-grid"><ul class="aiec-post-grid__list" role="list">' . $cards . '</ul>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in aiec_render_post_card().

		if ( 'current' === $settings['source'] && 'yes' === $settings['show_pagination'] ) {
			echo aiec_render_pagination( $query ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in aiec_render_pagination().
		}

		echo '</div>';
	}
}
