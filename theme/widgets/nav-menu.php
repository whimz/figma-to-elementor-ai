<?php
/**
 * Nav Menu widget: a WordPress menu with an accessible mobile toggle.
 *
 * Elementor Free has no menu widget. Menu items are edited in Appearance > Menus;
 * styles live in src/scss/widgets/_nav-menu.scss, behaviour in src/js/modules/nav-menu.js.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Nav Menu widget.
 */
class AIEC_Widget_Nav_Menu extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-nav-menu';
	}

	/**
	 * Widget title in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Nav Menu', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-nav-menu';
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
		return array( 'menu', 'nav', 'navigation', 'header' );
	}

	/**
	 * Menus available on the site, for the select control.
	 *
	 * @return array
	 */
	private function get_menu_options() {
		return array( '' => esc_html__( 'Header menu location', 'ai-elem-child' ) ) + aiec_get_menu_options();
	}

	/**
	 * Widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'menu_section',
			array( 'label' => esc_html__( 'Menu', 'ai-elem-child' ) )
		);

		$this->add_control(
			'menu',
			array(
				'label'       => esc_html__( 'Menu', 'ai-elem-child' ),
				'type'        => \Elementor\Controls_Manager::SELECT,
				'options'     => $this->get_menu_options(),
				'default'     => '',
				'description' => esc_html__( 'Edit menu items in Appearance > Menus.', 'ai-elem-child' ),
			)
		);

		$this->add_control(
			'nav_label',
			array(
				'label'   => esc_html__( 'Accessible name', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Main menu', 'ai-elem-child' ),
			)
		);

		$this->add_control(
			'toggle_label',
			array(
				'label'   => esc_html__( 'Mobile toggle label', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Menu', 'ai-elem-child' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Render the menu.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$list_id  = 'aiec-nav-' . $this->get_id();
		$args     = array(
			'container'   => false,
			'menu_class'  => 'aiec-nav__list',
			'menu_id'     => $list_id,
			'depth'       => 1,
			'fallback_cb' => false,
			'echo'        => false,
		);

		if ( ! empty( $settings['menu'] ) ) {
			$args['menu'] = (int) $settings['menu'];
		} else {
			$args['theme_location'] = 'menu-1';
		}

		$menu    = wp_nav_menu( $args );
		$editing = \Elementor\Plugin::$instance->editor->is_edit_mode() || \Elementor\Plugin::$instance->preview->is_preview_mode();

		if ( ! $menu ) {
			if ( $editing ) {
				echo '<p>' . esc_html__( 'Create a menu in Appearance > Menus and assign it to the Header location.', 'ai-elem-child' ) . '</p>';
			}
			return;
		}

		// Editor only: sub-items are not displayed (depth 1), say so instead of dropping them silently.
		$menu_id = ! empty( $settings['menu'] ) ? (int) $settings['menu'] : aiec_get_header_menu_id();

		if ( $editing && aiec_menu_has_sub_items( $menu_id ) ) {
			echo '<p class="aiec-nav__notice">' . esc_html__( 'This menu has sub-items. The Nav Menu widget shows top-level items only.', 'ai-elem-child' ) . '</p>';
		}
		?>
		<nav class="aiec-nav" aria-label="<?php echo esc_attr( $settings['nav_label'] ); ?>" data-aiec-nav>
			<button class="aiec-nav__toggle" type="button" aria-expanded="false" aria-controls="<?php echo esc_attr( $list_id ); ?>">
				<span class="aiec-nav__toggle-icon" aria-hidden="true"></span>
				<span class="aiec-nav__toggle-label"><?php echo esc_html( $settings['toggle_label'] ); ?></span>
			</button>
			<?php echo $menu; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_nav_menu() output. ?>
		</nav>
		<?php
	}
}
