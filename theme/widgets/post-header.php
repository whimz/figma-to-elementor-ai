<?php
/**
 * Post Header widget: the top of an article — picture with the purple tint and the category, date,
 * title (h1) and the excerpt as a lead. In the Elementor editor of the "blog-post" Site Part it shows
 * the latest article. Styles: src/scss/widgets/_blog.scss.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Top of an article.
 */
class AIEC_Widget_Post_Header extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-post-header';
	}

	/**
	 * Name in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Post Header', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-post-title';
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
		return array( 'blog', 'post', 'article', 'title', 'featured image' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'content_section', array( 'label' => esc_html__( 'Article', 'ai-elem-child' ) ) );

		$this->add_control(
			'show_image',
			array(
				'label'   => esc_html__( 'Featured image', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::SWITCHER,
				'default' => 'yes',
			)
		);

		$this->add_control(
			'show_excerpt',
			array(
				'label'       => esc_html__( 'Excerpt as lead', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::SWITCHER,
				'default'     => 'yes',
				'description' => esc_html__( 'The article texts are edited in the article itself (Posts).', 'ai-elem-child' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Output.
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$post     = aiec_blog_current_post();

		if ( ! $post ) {
			return;
		}

		$category = aiec_post_category( $post->ID );

		echo '<header class="aiec-post-header">';

		if ( 'yes' === $settings['show_image'] && has_post_thumbnail( $post ) ) {
			echo '<div class="aiec-post-header__media">';
			echo get_the_post_thumbnail( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core markup.
				$post,
				'aiec-wide',
				array(
					'class'         => 'aiec-post-header__image',
					'fetchpriority' => 'high',
					'loading'       => 'eager',
					'sizes'         => '(max-width: 1024px) 100vw, 851px',
				)
			);
			if ( $category ) {
				printf( '<a class="aiec-post-header__category" href="%s">%s</a>', esc_url( get_category_link( $category ) ), esc_html( $category->name ) );
			}
			echo '</div>';
		}

		printf( '<time class="aiec-post-header__date" datetime="%s">%s</time>', esc_attr( get_the_date( 'c', $post ) ), esc_html( aiec_post_date( $post ) ) );
		printf( '<h1 class="aiec-post-header__title">%s</h1>', esc_html( get_the_title( $post ) ) );

		if ( 'yes' === $settings['show_excerpt'] && has_excerpt( $post ) ) {
			printf( '<p class="aiec-post-header__lead">%s</p>', esc_html( get_the_excerpt( $post ) ) );
		}

		echo '</header>';
	}
}
