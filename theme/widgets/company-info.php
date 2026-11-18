<?php
/**
 * Company Info widget: one item of the company's contact details — phone, email, social links or
 * addresses — from the admin page "Company Info" (inc/company-info.php).
 *
 * Contact details are edited once and change everywhere the widget is used (Contact page, footer).
 * One widget shows one item, so the layout and spacing stay in Elementor containers.
 * Styles live in src/scss/widgets/_company-info.scss; the addresses' type and color are widget controls.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Company Info widget.
 */
class AIEC_Widget_Company_Info extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-company-info';
	}

	/**
	 * Widget title in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Company Info', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-site-identity';
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
		return array( 'contact', 'phone', 'email', 'address', 'social', 'company' );
	}

	/**
	 * Widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'content_section',
			array( 'label' => esc_html__( 'Company Info', 'ai-elem-child' ) )
		);

		$this->add_control(
			'item',
			array(
				'label'       => esc_html__( 'Show', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::SELECT,
				'options'     => array(
					'phone'     => esc_html__( 'Phone', 'ai-elem-child' ),
					'email'     => esc_html__( 'Email', 'ai-elem-child' ),
					'socials'   => esc_html__( 'Social links', 'ai-elem-child' ),
					'addresses' => esc_html__( 'Addresses', 'ai-elem-child' ),
				),
				'default'     => 'phone',
				'description' => esc_html__( 'Edit the details in the admin: Company Info.', 'ai-elem-child' ),
			)
		);

		$this->add_control(
			'addresses',
			array(
				'label'     => esc_html__( 'Addresses', 'ai-elem-child' ),
				'type'      => \Elementor\Controls_Manager::SELECT,
				'options'   => array(
					'all'   => esc_html__( 'All', 'ai-elem-child' ),
					'first' => esc_html__( 'First only', 'ai-elem-child' ),
				),
				'default'   => 'all',
				'condition' => array( 'item' => 'addresses' ),
			)
		);

		$this->add_control(
			'show_icon',
			array(
				'label'     => esc_html__( 'Map pin icon', 'ai-elem-child' ),
				'type'      => \Elementor\Controls_Manager::SWITCHER,
				'default'   => 'yes',
				'condition' => array( 'item' => 'addresses' ),
			)
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'address_style_section',
			array(
				'label'     => esc_html__( 'Addresses', 'ai-elem-child' ),
				'tab'       => \Elementor\Controls_Manager::TAB_STYLE,
				'condition' => array( 'item' => 'addresses' ),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'address_typography',
				'selector' => '{{WRAPPER}} .aiec-company-info__address',
			)
		);

		$this->add_control(
			'address_color',
			array(
				'label'     => esc_html__( 'Color', 'ai-elem-child' ),
				'type'      => \Elementor\Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .aiec-company-info__address' => 'color: {{VALUE}};' ),
			)
		);

		$this->add_responsive_control(
			'address_gap',
			array(
				'label'      => esc_html__( 'Gap between addresses', 'ai-elem-child' ),
				'type'       => \Elementor\Controls_Manager::SLIDER,
				'size_units' => array( 'px' ),
				'range'      => array( 'px' => array( 'max' => 80 ) ),
				'selectors'  => array( '{{WRAPPER}} .aiec-company-info__addresses' => 'gap: {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->add_responsive_control(
			'address_max_width',
			array(
				'label'       => esc_html__( 'Max width of an address', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::SLIDER,
				'size_units'  => array( 'px' ),
				'range'       => array( 'px' => array( 'max' => 800 ) ),
				'description' => esc_html__( 'Equal widths keep the addresses lined up when they are centered.', 'ai-elem-child' ),
				'selectors'   => array( '{{WRAPPER}} .aiec-company-info__address' => 'max-width: {{SIZE}}{{UNIT}};' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Render the item.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$info     = aiec_company_info();

		switch ( $settings['item'] ) {
			case 'phone':
				$html = $info['phone'] ? sprintf( '<p class="aiec-company-info__link"><a href="%s">%s</a></p>', esc_url( 'tel:' . $info['phone_link'] ), esc_html( $info['phone'] ) ) : '';
				break;

			case 'email':
				$html = $info['email'] ? sprintf( '<p class="aiec-company-info__link"><a href="%1$s">%2$s</a></p>', esc_url( 'mailto:' . antispambot( $info['email'] ) ), esc_html( antispambot( $info['email'] ) ) ) : '';
				break;

			case 'socials':
				$html = '';
				foreach ( $info['socials'] as $social ) {
					$html .= sprintf(
						'<li><a href="%s" target="_blank" rel="noopener" aria-label="%s">%s</a></li>',
						esc_url( $social['url'] ),
						esc_attr( $social['name'] ),
						aiec_icon( $social['network'] )
					);
				}
				$html = $html ? '<ul class="aiec-company-info__socials">' . $html . '</ul>' : '';
				break;

			case 'addresses':
				$addresses = 'first' === $settings['addresses'] ? array_slice( $info['addresses'], 0, 1 ) : $info['addresses'];
				$icon      = 'yes' === $settings['show_icon'] ? aiec_icon( 'map-pin' ) : '';
				$html      = '';
				foreach ( $addresses as $address ) {
					$html .= '<address class="aiec-company-info__address">' . $icon . '<span>' . nl2br( esc_html( $address ), false ) . '</span></address>';
				}
				$html = $html ? '<div class="aiec-company-info__addresses">' . $html . '</div>' : '';
				break;

			default:
				$html = '';
		}

		if ( '' === $html ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() || \Elementor\Plugin::$instance->preview->is_preview_mode() ) {
				echo '<p class="aiec-company-info__notice">' . esc_html__( 'Nothing to show: fill in this item in the admin, Company Info.', 'ai-elem-child' ) . '</p>';
			}
			return;
		}

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
	}
}
