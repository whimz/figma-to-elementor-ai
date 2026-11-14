<?php
/**
 * Plugin Name: Local mail to Mailpit
 * Description: Dev only (mounted by docker-compose, not part of the theme). Sends all WordPress mail to the Mailpit container.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'phpmailer_init',
	static function ( $phpmailer ) {
		if ( 'local' !== wp_get_environment_type() ) {
			return;
		}

		$phpmailer->isSMTP();
		$phpmailer->Host     = 'mailpit'; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Port     = 1025; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->SMTPAuth = false; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
	}
);

// WordPress's default sender on localhost is "wordpress@localhost", which PHPMailer rejects (no TLD).
add_filter(
	'wp_mail_from',
	static function ( $from ) {
		return ( 'local' === wp_get_environment_type() && str_ends_with( $from, '@localhost' ) ) ? 'wordpress@localhost.test' : $from;
	}
);
