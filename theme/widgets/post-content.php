<?php
/**
 * Post Content widget: the text of an article as written in the WordPress block editor (paragraphs,
 * subheadings, lists, pictures, video). In the Elementor editor of the "blog-post" Site Part it shows the
 * latest article. Typography: src/scss/widgets/_blog.scss (.aiec-post-content).
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Text of an article.
 */
class AIEC_Widget_Post_Content extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-post-content';
	}

	/**
	 * Name in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Post Content', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-post-content';
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
		return array( 'blog', 'post', 'article', 'content', 'text' );
	}

	/**
	 * Output.
	 */
	protected function render() {
		$post = aiec_blog_current_post();

		if ( ! $post ) {
			return;
		}

		// The article's own blocks, rendered as WordPress renders post content (block markup, embeds,
		// responsive images). Articles are not built with Elementor, so no recursion into this part.
		$content = apply_filters( 'the_content', $post->post_content ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core hook.

		echo '<div class="aiec-post-content">' . $content . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- post content filtered by WordPress.
	}
}
