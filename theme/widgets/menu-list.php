<?php
/**
 * Menu List widget: a WordPress menu as a plain vertical list of links (footer columns).
 *
 * Unlike the Nav Menu widget it has no mobile toggle. Menu items are edited in Appearance > Menus;
 * styles live in src/scss/widgets/_menu-list.scss.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

/**
 * Menu List widget.
 */
class AIEC_Widget_Menu_List extends \Elementor\Widget_Base {

	/**
	 * Widget slug.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'aiec-menu-list';
	}

	/**
	 * Widget title in the panel.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Menu List', 'ai-elem-child' );
	}

	/**
	 * Panel icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-bullet-list';
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
		return array( 'menu', 'links', 'list', 'footer' );
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
				'options'     => array( '' => esc_html__( '— Select —', 'ai-elem-child' ) ) + aiec_get_menu_options(),
				'default'     => '',
				'description' => esc_html__( 'Edit menu items in Appearance > Menus.', 'ai-elem-child' ),
			)
		);

		$this->add_control(
			'nav_label',
			array(
				'label'   => esc_html__( 'Accessible name', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Footer menu', 'ai-elem-child' ),
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
		$menu_id  = (int) $settings['menu'];
		$editing  = \Elementor\Plugin::$instance->editor->is_edit_mode() || \Elementor\Plugin::$instance->preview->is_preview_mode();

		if ( ! $menu_id ) {
			if ( $editing ) {
				echo '<p class="aiec-menu-list__notice">' . esc_html__( 'Select a menu in the widget settings.', 'ai-elem-child' ) . '</p>';
			}
			return;
		}

		// The same menu may also be in the header: unique list ID and no menu-item-N IDs on items.
		// The header menu's language switcher (Polylang) is not repeated in the footer columns.
		add_filter( 'nav_menu_item_id', '__return_empty_string' );
		add_filter( 'wp_nav_menu_objects', array( $this, 'remove_language_switcher' ), 20 );

		$menu = wp_nav_menu(
			array(
				'menu'        => $menu_id,
				'container'   => false,
				'menu_class'  => 'aiec-menu-list__items',
				'menu_id'     => 'aiec-menu-list-' . $this->get_id(),
				'depth'       => 1,
				'fallback_cb' => false,
				'echo'        => false,
			)
		);

		remove_filter( 'nav_menu_item_id', '__return_empty_string' );
		remove_filter( 'wp_nav_menu_objects', array( $this, 'remove_language_switcher' ), 20 );

		if ( ! $menu ) {
			return;
		}

		// Editor only: sub-items are not displayed (depth 1), say so instead of dropping them silently.
		if ( $editing && aiec_menu_has_sub_items( $menu_id ) ) {
			echo '<p class="aiec-menu-list__notice">' . esc_html__( 'This menu has sub-items. The Menu List widget shows top-level items only.', 'ai-elem-child' ) . '</p>';
		}
		?>
		<nav class="aiec-menu-list" aria-label="<?php echo esc_attr( $settings['nav_label'] ); ?>">
			<?php echo $menu; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_nav_menu() output. ?>
		</nav>
		<?php
	}

	/**
	 * Drop Polylang's language switcher items (class "lang-item") from the list.
	 *
	 * @param WP_Post[] $items Menu items.
	 * @return WP_Post[]
	 */
	public function remove_language_switcher( $items ) {
		return array_values(
			array_filter(
				$items,
				static function ( $item ) {
					return ! array_intersect( array( 'lang-item', 'pll-parent-menu-item' ), (array) $item->classes );
				}
			)
		);
	}
}
