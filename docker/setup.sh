#!/bin/sh
# Site setup inside the WP-CLI container: npm run wp:setup
# Safe to re-run: every step checks or tolerates the current state.
set -e

SITE_URL="http://localhost:8888"

# The wordpress container copies core files into the shared volume on its first start.
if [ ! -f /var/www/html/wp-config.php ]; then
	echo "wp-config.php not found — start the containers first: npm run wp:start" >&2
	exit 1
fi

if ! wp core is-installed 2>/dev/null; then
	wp core install \
		--url="$SITE_URL" \
		--title="AI Elem Practice" \
		--admin_user=admin \
		--admin_password=password \
		--admin_email=admin@example.com \
		--skip-email
fi

# Latest stable releases from WordPress.org.
wp theme install hello-elementor
wp plugin install elementor secure-custom-fields polylang contact-form-7 --activate
wp theme activate ai-elem-child

# Elementor: no default V3 colors/fonts (the design system lives in V4 variables and classes).
wp option update elementor_disable_color_schemes yes
wp option update elementor_disable_typography_schemes yes
# SVG uploads for admins, sanitized by Elementor (also used by npm run wp:import).
wp option update elementor_unfiltered_files_upload 1

# Bundled plugins the site does not use.
wp plugin delete akismet hello 2>/dev/null || true

# .htaccess with the WordPress rewrite rules is created by the wordpress image.
wp rewrite structure '/%postname%/'
wp option update timezone_string 'Europe/Helsinki'

echo
wp core version --extra
wp plugin list --fields=name,status,version
wp theme list --fields=name,status,version | grep -v inactive
