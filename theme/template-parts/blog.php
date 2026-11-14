<?php
/**
 * Blog pages — list of articles (blog home, categories, search) and the article itself: the
 * "blog-archive" or "blog-post" Site Part built in Elementor. Loaded by aiec_blog_template() (inc/blog.php).
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="content" class="aiec-blog">
	<?php aiec_render_site_part( aiec_blog_location() ); ?>
</main>
<?php
get_footer();
