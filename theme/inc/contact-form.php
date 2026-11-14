<?php
/**
 * Contact Form 7 tweaks.
 *
 * The form templates are written with their own markup (.aiec-form__field blocks with a label,
 * a control and a hint), so CF7's automatic paragraphs and line breaks only add empty lines.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_filter( 'wpcf7_autop_or_not', '__return_false' );
