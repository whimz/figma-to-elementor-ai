<?php
/**
 * Archive Title widget: the h1 and the lead of the list of articles. Blog home — the texts set here
 * (highlights with <strong> / <em>, as in other headings); category — its name and description;
 * search results — what was searched for. Styles: src/scss/widgets/_blog.scss.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Heading of a list of articles.
 */
class AIEC_Widget_Archive_Title extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-archive-title';
	}

	/**
	 * Name in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Archive Title', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-archive-title';
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
		return array( 'blog', 'archive', 'title', 'category', 'heading' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'content_section', array( 'label' => esc_html__( 'Blog home', 'ai-elem-child' ) ) );

		$this->add_control(
			'title',
			array(
				'label'       => esc_html__( 'Title', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'default'     => 'Our <strong>Blog</strong> for <em>Cryptocurrency</em>',
				'description' => esc_html__( '<strong> — purple, <em> — orange. Categories and search results use their own title.', 'ai-elem-child' ),
				'label_block' => true,
			)
		);

		$this->add_control(
			'lead',
			array(
				'label'       => esc_html__( 'Lead', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::TEXTAREA,
				'default'     => '',
				'description' => esc_html__( 'On a category page its description is shown instead (Posts → Categories).', 'ai-elem-child' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Output.
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$allowed  = array(
			'strong' => array(),
			'em'     => array(),
			'b'      => array(),
			'br'     => array(),
		);

		if ( is_category() || is_tag() ) {
			$title = esc_html( single_term_title( '', false ) );
			$lead  = term_description() ? wp_strip_all_tags( term_description() ) : $settings['lead'];
		} elseif ( is_search() ) {
			$title = esc_html(
				sprintf(
					/* translators: %s: search words. */
					__( 'Search results for “%s”', 'ai-elem-child' ),
					get_search_query( false )
				)
			);
			$lead  = '';
		} else {
			$title = wp_kses( $settings['title'], $allowed );
			$lead  = $settings['lead'];
		}

		echo '<div class="aiec-archive-title">';
		echo '<h1 class="aiec-archive-title__heading">' . $title . '</h1>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		if ( $lead ) {
			echo '<p class="aiec-archive-title__lead">' . esc_html( $lead ) . '</p>';
		}
		echo '</div>';
	}
}
