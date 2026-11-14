# Custom Elementor widgets

Every `*.php` file in this folder is loaded and registered automatically by `inc/elementor.php`.

**Naming convention:** `widgets/price-card.php` must declare the class `AIEC_Widget_Price_Card`
(file slug → words in Title_Case → `AIEC_Widget_` prefix). Files whose class does not match are loaded but not registered.

Widgets appear in the **AI Elem Child** category of the Elementor panel. Styles go to `src/scss/widgets/_<slug>.scss`
(forwarded from `src/scss/widgets/_index.scss`).

Widgets:
- **Nav Menu** (`nav-menu.php`) — header menu with the burger and the full-screen phone menu.
- **Menu List** (`menu-list.php`) — a menu as a plain vertical list of links (footer columns).
- **Company Info** (`company-info.php`) — one item of the company details from the admin page Company Info
  (`inc/company-info.php`): phone, email, social links or addresses.

Note: these are classic (V3) widgets based on `\Elementor\Widget_Base`. Clients edit them through the widget controls;
the Elementor MCP builds pages with atomic (V4) elements.

## Template

```php
<?php
/**
 * Price card widget.
 *
 * @package AI_Elem_Child
 */

defined( 'ABSPATH' ) || exit;

class AIEC_Widget_Price_Card extends \Elementor\Widget_Base {

	public function get_name() {
		return 'aiec-price-card';
	}

	public function get_title() {
		return esc_html__( 'Price Card', 'ai-elem-child' );
	}

	public function get_icon() {
		return 'eicon-price-table';
	}

	public function get_categories() {
		return array( 'ai-elem-child' );
	}

	protected function register_controls() {
		$this->start_controls_section(
			'content',
			array( 'label' => esc_html__( 'Content', 'ai-elem-child' ) )
		);

		$this->add_control(
			'title',
			array(
				'label'   => esc_html__( 'Title', 'ai-elem-child' ),
				'type'    => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__( 'Basic', 'ai-elem-child' ),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings_for_display();
		?>
		<div class="aiec-price-card">
			<h3 class="aiec-price-card__title"><?php echo esc_html( $settings['title'] ); ?></h3>
		</div>
		<?php
	}
}
```
