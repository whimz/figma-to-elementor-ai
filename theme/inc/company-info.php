<?php
/**
 * Company Info: contact details edited in one place (admin page "Company Info", Secure Custom Fields)
 * and shown by the Company Info Elementor widget (widgets/company-info.php) on pages and in the footer.
 *
 * The fields are registered in code, so they are versioned with the theme. Values are stored as
 * options (one set for the site, all languages): phone, email, addresses, social links.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

add_action( 'acf/init', 'aiec_register_company_info' );

/**
 * Register the options page and its fields.
 *
 * @return void
 */
function aiec_register_company_info() {
	if ( ! function_exists( 'acf_add_options_page' ) || ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_options_page(
		array(
			'page_title' => __( 'Company Info', 'ai-elem-child' ),
			'menu_title' => __( 'Company Info', 'ai-elem-child' ),
			'menu_slug'  => 'aiec-company-info',
			'capability' => 'edit_pages',
			'icon_url'   => 'dashicons-building',
			'position'   => 21,
			'redirect'   => false,
		)
	);

	acf_add_local_field_group(
		array(
			'key'      => 'group_aiec_company_info',
			'title'    => __( 'Company Info', 'ai-elem-child' ),
			'location' => array(
				array(
					array(
						'param'    => 'options_page',
						'operator' => '==',
						'value'    => 'aiec-company-info',
					),
				),
			),
			'fields'   => array(
				array(
					'key'          => 'field_aiec_phone',
					'name'         => 'aiec_phone',
					'label'        => __( 'Phone', 'ai-elem-child' ),
					'type'         => 'text',
					'instructions' => __( 'As shown on the site, e.g. (434) 546-4356.', 'ai-elem-child' ),
					'wrapper'      => array( 'width' => '50' ),
				),
				array(
					'key'          => 'field_aiec_phone_link',
					'name'         => 'aiec_phone_link',
					'label'        => __( 'Phone for dialing', 'ai-elem-child' ),
					'type'         => 'text',
					'instructions' => __( 'International format, e.g. +1 434 546 4356. Phones dial this number.', 'ai-elem-child' ),
					'wrapper'      => array( 'width' => '50' ),
				),
				array(
					'key'   => 'field_aiec_email',
					'name'  => 'aiec_email',
					'label' => __( 'Email', 'ai-elem-child' ),
					'type'  => 'email',
				),
				array(
					'key'          => 'field_aiec_addresses',
					'name'         => 'aiec_addresses',
					'label'        => __( 'Addresses', 'ai-elem-child' ),
					'type'         => 'repeater',
					'instructions' => __( 'The footer shows the first address; the Contact page shows all of them.', 'ai-elem-child' ),
					'layout'       => 'block',
					'button_label' => __( 'Add address', 'ai-elem-child' ),
					'sub_fields'   => array(
						array(
							'key'          => 'field_aiec_address_text',
							'name'         => 'text',
							'label'        => __( 'Address', 'ai-elem-child' ),
							'type'         => 'textarea',
							'rows'         => 2,
							'new_lines'    => '',
							'instructions' => __( 'One line per row, as on an envelope.', 'ai-elem-child' ),
							'wrapper'      => array( 'width' => '50' ),
						),
						array(
							'key'          => 'field_aiec_address_text_de',
							'name'         => 'text_de',
							'label'        => __( 'Address (German pages)', 'ai-elem-child' ),
							'type'         => 'textarea',
							'rows'         => 2,
							'new_lines'    => '',
							'instructions' => __( 'Optional: a German spelling, e.g. Deutschland. Empty — the address above is used.', 'ai-elem-child' ),
							'wrapper'      => array( 'width' => '50' ),
						),
					),
				),
				array(
					'key'          => 'field_aiec_socials',
					'name'         => 'aiec_socials',
					'label'        => __( 'Social links', 'ai-elem-child' ),
					'type'         => 'repeater',
					'layout'       => 'table',
					'button_label' => __( 'Add link', 'ai-elem-child' ),
					'sub_fields'   => array(
						array(
							'key'     => 'field_aiec_social_network',
							'name'    => 'network',
							'label'   => __( 'Network', 'ai-elem-child' ),
							'type'    => 'select',
							'choices' => aiec_social_networks(),
						),
						array(
							'key'   => 'field_aiec_social_url',
							'name'  => 'url',
							'label' => __( 'Link', 'ai-elem-child' ),
							'type'  => 'url',
						),
					),
				),
			),
		)
	);
}

/**
 * Social networks with an icon in assets/images/icons/<slug>.svg: slug => name.
 *
 * @return array
 */
function aiec_social_networks() {
	return array(
		'facebook'  => 'Facebook',
		'instagram' => 'Instagram',
		'linkedin'  => 'LinkedIn',
	);
}

/**
 * Company details for the current language, ready to output.
 *
 * @return array{phone: string, phone_link: string, email: string, addresses: string[], socials: array}
 */
function aiec_company_info() {
	if ( ! function_exists( 'get_field' ) ) {
		return array(
			'phone'      => '',
			'phone_link' => '',
			'email'      => '',
			'addresses'  => array(),
			'socials'    => array(),
		);
	}

	$german    = function_exists( 'pll_current_language' ) && 'de' === pll_current_language();
	$addresses = array();
	foreach ( (array) get_field( 'aiec_addresses', 'option' ) as $row ) {
		$text = trim( $german && ! empty( $row['text_de'] ) ? $row['text_de'] : ( $row['text'] ?? '' ) );
		if ( '' !== $text ) {
			$addresses[] = $text;
		}
	}

	$networks = aiec_social_networks();
	$socials  = array();
	foreach ( (array) get_field( 'aiec_socials', 'option' ) as $row ) {
		if ( ! empty( $row['url'] ) && isset( $networks[ $row['network'] ?? '' ] ) ) {
			$socials[] = array(
				'network' => $row['network'],
				'name'    => $networks[ $row['network'] ],
				'url'     => $row['url'],
			);
		}
	}

	$phone      = (string) get_field( 'aiec_phone', 'option' );
	$phone_link = (string) get_field( 'aiec_phone_link', 'option' );

	return array(
		'phone'      => $phone,
		// tel: wants digits and a leading +; fall back to the shown number.
		'phone_link' => preg_replace( '/[^\d+]/', '', '' !== $phone_link ? $phone_link : $phone ),
		'email'      => (string) get_field( 'aiec_email', 'option' ),
		'addresses'  => $addresses,
		'socials'    => $socials,
	);
}

/**
 * Inline SVG icon from assets/images/icons/, hidden from screen readers (the link carries the name).
 *
 * @param string $name Icon file name without .svg.
 * @return string SVG markup or an empty string.
 */
function aiec_icon( $name ) {
	$file = get_stylesheet_directory() . '/assets/images/icons/' . sanitize_file_name( $name ) . '.svg';
	if ( ! is_readable( $file ) ) {
		return '';
	}
	$svg = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	return preg_replace( '/<svg\b/', '<svg aria-hidden="true" focusable="false"', $svg, 1 );
}
