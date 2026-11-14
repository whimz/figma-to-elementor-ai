<?php
/**
 * Project WP-CLI commands (dev tool). Loaded by docker/wp-cli.yml in the WP-CLI container only.
 *
 * @package AI_Elem_Child
 */

if ( ! defined( 'WP_CLI' ) ) {
	exit;
}

/**
 * Import a design asset from design/assets into the Media Library.
 *
 * WordPress rejects SVG uploads by default. SVGs are sanitized with Elementor's own SVG sanitizer
 * and accepted the same way Elementor accepts uploads from its editor, which requires
 * Elementor > Settings > Advanced > "Enable Unfiltered File Uploads".
 *
 * ## OPTIONS
 *
 * <file>
 * : Path under design/assets, e.g. global/logo-legite.svg
 *
 * [--title=<title>]
 * : Attachment title. Defaults to the file name.
 *
 * [--alt=<alt>]
 * : Alternative text. Leave empty for decorative images.
 *
 * ## EXAMPLES
 *
 *     npm run wp:import -- global/logo-legite.svg --title="Legite logo" --alt="Legite"
 *
 * @param array $args       Positional arguments.
 * @param array $assoc_args Named arguments.
 */
function aiec_cli_import( $args, $assoc_args ) {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$relative = ltrim( $args[0], '/' );
	$file     = '/import/' . $relative;

	if ( ! is_readable( $file ) ) {
		WP_CLI::error( "File not found: {$file}" );
	}

	$title  = $assoc_args['title'] ?? pathinfo( $file, PATHINFO_FILENAME );
	$alt    = $assoc_args['alt'] ?? '';
	$is_svg = 'svg' === strtolower( pathinfo( $file, PATHINFO_EXTENSION ) );
	$tmp    = wp_tempnam( basename( $file ) );

	copy( $file, $tmp );

	if ( $is_svg ) {
		$uploads = \Elementor\Plugin::$instance->uploads_manager;

		if ( ! $uploads::are_unfiltered_uploads_enabled() ) {
			WP_CLI::error( 'Enable Elementor > Settings > Advanced > Unfiltered File Uploads and run with --user=admin.' );
		}

		$sanitizer = new \Elementor\Core\Files\File_Types\Svg();

		if ( ! $sanitizer->sanitize_svg( $tmp ) ) {
			WP_CLI::error( "SVG sanitization failed: {$file}" );
		}

		$uploads->set_elementor_upload_state( true );
	}

	$id = media_handle_sideload(
		array(
			'name'     => basename( $file ),
			'tmp_name' => $tmp,
		),
		0,
		$title
	);

	if ( $is_svg ) {
		$uploads->set_elementor_upload_state( false );
	}

	if ( is_wp_error( $id ) ) {
		wp_delete_file( $tmp );
		WP_CLI::error( $id->get_error_message() );
	}

	if ( '' !== $alt ) {
		update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $alt ) );
	}

	WP_CLI::success( "Imported {$relative} as attachment {$id}: " . wp_get_attachment_url( $id ) );
}

WP_CLI::add_command( 'aiec import', 'aiec_cli_import' );

/**
 * Back up the database and uploads to backups/ (mounted at /backups).
 *
 * Creates <stamp>-db.sql.gz and <stamp>-uploads.tar.gz. The design system (Elementor variables,
 * classes, default styles) and all page layouts live in the database, so back up before risky changes.
 *
 * ## EXAMPLES
 *
 *     npm run wp:backup
 *
 * @param array $args       Positional arguments (unused).
 * @param array $assoc_args Named arguments (unused).
 */
function aiec_cli_backup( $args, $assoc_args ) {
	$dir = '/backups';

	if ( ! is_dir( $dir ) || ! is_writable( $dir ) ) {
		WP_CLI::error( 'Mount ./backups at /backups in docker-compose.yml.' );
	}

	$stamp   = wp_date( 'Ymd-His' );
	$sql     = "{$dir}/{$stamp}-db.sql";
	$uploads = wp_get_upload_dir()['basedir'];

	WP_CLI::runcommand( 'db export ' . escapeshellarg( $sql ) . ' --add-drop-table --quiet' );
	WP_CLI::launch( 'gzip -f ' . escapeshellarg( $sql ) );
	WP_CLI::launch( 'tar -czf ' . escapeshellarg( "{$dir}/{$stamp}-uploads.tar.gz" ) . ' -C ' . escapeshellarg( dirname( $uploads ) ) . ' ' . escapeshellarg( basename( $uploads ) ) );

	foreach ( array( "{$stamp}-db.sql.gz", "{$stamp}-uploads.tar.gz" ) as $file ) {
		WP_CLI::log( sprintf( '%s  %s KB', $file, number_format( filesize( "{$dir}/{$file}" ) / 1024, 1 ) ) );
	}

	WP_CLI::success( "Backup {$stamp} saved to backups/. Restore: npm run wp:restore -- {$stamp}" );
}

WP_CLI::add_command( 'aiec backup', 'aiec_cli_backup' );

/**
 * Restore the database and uploads from a backup made by `wp aiec backup`.
 *
 * Overwrites the current database and uploads.
 *
 * ## OPTIONS
 *
 * <stamp>
 * : Backup timestamp, e.g. 20261017-210500 (file name prefix in backups/).
 *
 * [--yes]
 * : Skip the confirmation.
 *
 * @param array $args       Positional arguments.
 * @param array $assoc_args Named arguments.
 */
function aiec_cli_restore( $args, $assoc_args ) {
	$dir     = '/backups';
	$stamp   = $args[0];
	$db      = "{$dir}/{$stamp}-db.sql.gz";
	$archive = "{$dir}/{$stamp}-uploads.tar.gz";

	if ( ! is_readable( $db ) ) {
		WP_CLI::error( "Not found: backups/{$stamp}-db.sql.gz" );
	}

	WP_CLI::confirm( "Overwrite the current database and uploads with backup {$stamp}?", $assoc_args );

	$tmp = wp_tempnam( "{$stamp}.sql" );
	WP_CLI::launch( 'gzip -dc ' . escapeshellarg( $db ) . ' > ' . escapeshellarg( $tmp ) );
	WP_CLI::runcommand( 'db import ' . escapeshellarg( $tmp ) );
	wp_delete_file( $tmp );

	if ( is_readable( $archive ) ) {
		$uploads = wp_get_upload_dir()['basedir'];
		WP_CLI::launch( 'tar -xzf ' . escapeshellarg( $archive ) . ' -C ' . escapeshellarg( dirname( $uploads ) ) );
	}

	WP_CLI::runcommand( 'elementor flush-css' );
	WP_CLI::success( "Restored backup {$stamp}." );
}

WP_CLI::add_command( 'aiec restore', 'aiec_cli_restore' );

/**
 * Append a classic Shortcode widget to an atomic (V4) container of an Elementor document.
 *
 * The Elementor MCP edits only atomic elements, and a form plugin's shortcode inside an atomic
 * paragraph renders a <form> inside a <p>. The classic Shortcode widget outputs it as a block
 * (decisions.md D18). Run with --user=admin, otherwise Elementor's save() silently does nothing.
 *
 * ## OPTIONS
 *
 * <post_id>
 * : Document (page) ID.
 *
 * <parent_id>
 * : Element ID of the container to append to.
 *
 * <shortcode>
 * : The shortcode, e.g. '[contact-form-7 id="d55494c" title="Contact"]'.
 *
 * [--css-classes=<classes>]
 * : CSS classes for the widget wrapper.
 *
 * [--replace]
 * : Remove the container's existing Shortcode widgets first.
 *
 * ## EXAMPLES
 *
 *     npm run wp:cli -- aiec shortcode-widget 50 1a2b3c4 '[contact-form-7 id="d55494c" title="Contact"]' --css-classes=aiec-contact-form --replace --user=admin
 *
 * @param array $args       Positional arguments.
 * @param array $assoc_args Named arguments.
 */
function aiec_cli_shortcode_widget( $args, $assoc_args ) {
	list( $post_id, $parent_id, $shortcode ) = $args;

	$document = \Elementor\Plugin::$instance->documents->get( (int) $post_id );

	if ( ! $document || ! $document->is_built_with_elementor() ) {
		WP_CLI::error( "No Elementor document with ID {$post_id}." );
	}

	$widget = array(
		'id'         => \Elementor\Utils::generate_random_string(),
		'elType'     => 'widget',
		'widgetType' => 'shortcode',
		'settings'   => array(
			'shortcode'    => $shortcode,
			'_css_classes' => $assoc_args['css-classes'] ?? '',
		),
		'elements'   => array(),
	);

	$replace  = ! empty( $assoc_args['replace'] );
	$found    = false;
	$elements = $document->get_elements_data();

	$walk = function ( array &$items ) use ( &$walk, $parent_id, $widget, $replace, &$found ) {
		foreach ( $items as &$item ) {
			if ( ( $item['id'] ?? '' ) === $parent_id ) {
				if ( $replace ) {
					$item['elements'] = array_values(
						array_filter(
							$item['elements'] ?? array(),
							static function ( $child ) {
								return 'shortcode' !== ( $child['widgetType'] ?? '' );
							}
						)
					);
				}
				$item['elements'][] = $widget;
				$found              = true;
				return;
			}
			if ( ! empty( $item['elements'] ) ) {
				$walk( $item['elements'] );
			}
		}
	};
	$walk( $elements );

	if ( ! $found ) {
		WP_CLI::error( "Container {$parent_id} not found in document {$post_id}." );
	}

	$document->save( array( 'elements' => $elements ) );
	WP_CLI::success( "Shortcode widget {$widget['id']} added to {$parent_id}." );
}
WP_CLI::add_command( 'aiec shortcode-widget', 'aiec_cli_shortcode_widget' );

/**
 * Put a classic widget in place of elements of an Elementor document (the Elementor MCP does not
 * create classic widgets). The widget takes the position of the first replaced element; all the
 * replaced elements must share one container. Run with --user=admin.
 *
 * ## OPTIONS
 *
 * <post_id>
 * : Document ID.
 *
 * <widget_type>
 * : Widget name, e.g. aiec-company-info.
 *
 * --replace=<ids>
 * : Comma-separated element IDs to replace, e.g. 12000df6 or 6a28a70,278604a.
 *
 * [--settings=<json>]
 * : Widget settings as JSON, e.g. '{"item":"phone"}'.
 *
 * ## EXAMPLES
 *
 *     npm run wp:cli -- aiec widget 50 aiec-company-info --replace=12000df6 --settings='{"item":"phone"}' --user=admin
 *
 * @param array $args       Positional arguments.
 * @param array $assoc_args Named arguments.
 */
function aiec_cli_widget( $args, $assoc_args ) {
	list( $post_id, $widget_type ) = $args;

	$document = \Elementor\Plugin::$instance->documents->get( (int) $post_id );
	if ( ! $document || ! $document->is_built_with_elementor() ) {
		WP_CLI::error( "No Elementor document with ID {$post_id}." );
	}
	if ( ! \Elementor\Plugin::$instance->widgets_manager->get_widget_types( $widget_type ) ) {
		WP_CLI::error( "Unknown widget type {$widget_type}." );
	}

	$settings = isset( $assoc_args['settings'] ) ? json_decode( $assoc_args['settings'], true ) : array();
	if ( ! is_array( $settings ) ) {
		WP_CLI::error( 'Invalid --settings JSON.' );
	}

	$ids    = array_filter( array_map( 'trim', explode( ',', $assoc_args['replace'] ) ) );
	$widget = array(
		'id'         => \Elementor\Utils::generate_random_string(),
		'elType'     => 'widget',
		'widgetType' => $widget_type,
		'settings'   => $settings,
		'elements'   => array(),
	);

	$done     = false;
	$elements = $document->get_elements_data();
	$walk     = function ( array &$items ) use ( &$walk, $ids, $widget, &$done ) {
		$positions = array_keys( array_filter( $items, static fn( $item ) => in_array( $item['id'] ?? '', $ids, true ) ) );
		if ( $positions ) {
			if ( count( $positions ) !== count( $ids ) ) {
				WP_CLI::error( 'The elements to replace must share one container.' );
			}
			$items = array_values( array_filter( $items, static fn( $item ) => ! in_array( $item['id'] ?? '', $ids, true ) ) );
			array_splice( $items, $positions[0], 0, array( $widget ) );
			$done = true;
			return;
		}
		foreach ( $items as &$item ) {
			if ( ! $done && ! empty( $item['elements'] ) ) {
				$walk( $item['elements'] );
			}
		}
	};
	$walk( $elements );

	if ( ! $done ) {
		WP_CLI::error( 'Elements not found: ' . implode( ', ', $ids ) );
	}

	$document->save( array( 'elements' => $elements ) );
	WP_CLI::success( "Widget {$widget_type} {$widget['id']} put in place of " . implode( ', ', $ids ) . '.' );
}
WP_CLI::add_command( 'aiec widget', 'aiec_cli_widget' );

/**
 * Export the Elementor layout and design system to elementor/ (mounted at /elementor) for git.
 *
 * - kit/: Elementor's own Kit export (site settings, pages, Site Parts, menus), unpacked, JSON
 *   pretty-printed, without export timestamps and with the elements as stored (the export gives
 *   every element a new random ID each time), so a diff shows only real changes;
 * - design-system/: what the Kit export leaves out in Elementor 4 — global classes, variables and
 *   Default Styles, read from Elementor's REST API;
 * - templates/: each page and Site Part in the Templates > Import format, to move one page.
 * A full restore (media, IDs, plugins' data) is the database backup: npm run wp:backup / wp:restore.
 * Run with --user=admin: the Kit export and the REST API need an editor.
 *
 * ## EXAMPLES
 *
 *     npm run wp:export
 *
 * @param array $args       Positional arguments (unused).
 * @param array $assoc_args Named arguments (unused).
 */
function aiec_cli_export( $args, $assoc_args ) {
	$root = '/elementor';

	if ( ! is_dir( $root ) || ! is_writable( $root ) ) {
		WP_CLI::error( 'Mount ./elementor at /elementor in docker-compose.yml.' );
	}
	if ( ! current_user_can( 'edit_posts' ) ) {
		WP_CLI::error( 'Run with --user=admin.' );
	}

	// Kit: export to a temporary zip, unpack into a clean kit/ folder.
	$zip_file = wp_tempnam( 'aiec-kit.zip' );
	WP_CLI::runcommand( 'elementor kit export ' . escapeshellarg( $zip_file ) . ' --user=' . get_current_user_id(), array( 'return' => true ) );

	$zip = new ZipArchive();
	if ( true !== $zip->open( $zip_file ) ) {
		WP_CLI::error( 'Kit export failed: no zip.' );
	}
	aiec_cli_clear_dir( "{$root}/kit" );
	$kit_files = 0;
	for ( $i = 0; $i < $zip->numFiles; $i++ ) {
		$name = $zip->getNameIndex( $i );
		if ( '/' === substr( $name, -1 ) ) {
			continue;
		}
		$body = $zip->getFromIndex( $i );
		if ( '.json' === substr( $name, -5 ) ) {
			$data = json_decode( $body, true );
			unset( $data['created'] );
			// The manifest lists posts by last change; sort them by ID so editing a page does not reorder it.
			foreach ( array( 'content', 'wp-content' ) as $section ) {
				foreach ( (array) ( $data[ $section ] ?? array() ) as $type => $posts ) {
					if ( is_array( $posts ) ) {
						ksort( $data[ $section ][ $type ] );
					}
				}
			}
			// taxonomies/*.json: terms come in no fixed order (e.g. one category per language); sort by ID.
			if ( 0 === strpos( $name, 'taxonomies/' ) && is_array( $data ) && array_is_list( $data ) ) {
				usort( $data, static fn( $a, $b ) => ( $a['term_id'] ?? 0 ) <=> ( $b['term_id'] ?? 0 ) );
			}
			// content/<post type>/<post ID>.json: the stored elements instead of re-IDed ones.
			if ( preg_match( '#^content/[^/]+/(\d+)\.json$#', $name, $match ) && isset( $data['content'] ) ) {
				$data['content'] = aiec_cli_stored_elements( (int) $match[1] );
			}
			$body = aiec_cli_json( $data );
		} elseif ( '.xml' === substr( $name, -4 ) ) {
			// WXR files carry the export time; drop it so unchanged content gives no diff.
			$body = preg_replace( array( '/^<!-- generator=.*-->\n/m', '/^\s*<pubDate>.*<\/pubDate>\n/m', '/^\s*<wp:base_site_url>.*\n/m' ), '', $body, 1 );
			// Editor locks change whenever someone opens a page in an editor.
			$body = preg_replace( '#\s*<wp:postmeta>\s*<wp:meta_key><!\[CDATA\[_edit_lock\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[[^\]]*\]\]></wp:meta_value>\s*</wp:postmeta>#', '', $body );
		}
		aiec_cli_write( "{$root}/kit/{$name}", $body );
		++$kit_files;
	}
	$zip->close();
	wp_delete_file( $zip_file );

	// Design system: global classes (in the editor's order), variables, Default Styles.
	$classes = aiec_cli_rest( '/elementor/v1/global-classes' );
	$ids     = wp_list_pluck( $classes['data'], 'id' );
	$styles  = aiec_cli_rest( '/elementor/v1/global-classes/styles', array( 'ids' => implode( ',', $ids ) ) );
	$ordered = array();
	foreach ( $ids as $id ) {
		$ordered[] = $styles['data'][ $id ];
	}
	aiec_cli_clear_dir( "{$root}/design-system" );
	aiec_cli_write( "{$root}/design-system/global-classes.json", aiec_cli_json( $ordered ) );
	aiec_cli_write( "{$root}/design-system/variables.json", aiec_cli_json( aiec_cli_rest( '/elementor/v1/variables/list' )['data']['variables'] ) );
	aiec_cli_write( "{$root}/design-system/default-styles.json", aiec_cli_json( aiec_cli_rest( '/elementor/v1/default-styles' )['data'] ) );

	// Templates: pages and Site Parts as library templates (pages → "page", Site Parts → "section").
	aiec_cli_clear_dir( "{$root}/templates" );
	$posts = get_posts(
		array(
			'post_type'   => array( 'page', 'aiec_part' ),
			'post_status' => 'publish',
			'numberposts' => -1,
			'meta_key'    => '_elementor_edit_mode', // phpcs:ignore WordPress.DB.SlowDBQuery
			'meta_value'  => 'builder', // phpcs:ignore WordPress.DB.SlowDBQuery
			'orderby'     => 'ID',
			'order'       => 'ASC',
		)
	);
	foreach ( $posts as $post ) {
		$document = \Elementor\Plugin::$instance->documents->get( $post->ID );
		$template = array(
			'title'         => $post->post_title,
			'type'          => 'page' === $post->post_type ? 'page' : 'section',
			'version'       => \Elementor\DB::DB_VERSION,
			'page_settings' => $document->get_export_data()['settings'],
			'content'       => aiec_cli_stored_elements( $post->ID ),
		);
		$prefix = 'page' === $post->post_type ? '' : 'part-';
		aiec_cli_write( "{$root}/templates/{$prefix}{$post->post_name}.json", aiec_cli_json( $template ) );
	}

	WP_CLI::success( sprintf( 'Exported to elementor/: kit (%d files), design system (%d classes), %d templates.', $kit_files, count( $ordered ), count( $posts ) ) );
}
WP_CLI::add_command( 'aiec export', 'aiec_cli_export' );

/**
 * GET an internal REST route as the current user; stops on an error.
 *
 * @param string $route  Route, e.g. /elementor/v1/default-styles.
 * @param array  $params Query parameters.
 * @return array Response data.
 */
function aiec_cli_rest( $route, $params = array() ) {
	$request = new WP_REST_Request( 'GET', $route );
	foreach ( $params as $key => $value ) {
		$request->set_param( $key, $value );
	}
	$response = rest_do_request( $request );
	if ( $response->is_error() ) {
		WP_CLI::error( "{$route}: " . $response->as_error()->get_error_message() );
	}
	// Routes mix arrays and objects; a JSON round trip gives plain arrays, as the editor receives them.
	return json_decode( wp_json_encode( $response->get_data() ), true );
}

/**
 * A document's elements as stored. Elementor's export differs from them only by new random IDs
 * and empty flags it adds; an import generates new IDs anyway.
 *
 * @param int $post_id Document ID.
 * @return array
 */
function aiec_cli_stored_elements( $post_id ) {
	$document = \Elementor\Plugin::$instance->documents->get( $post_id );
	return $document ? $document->get_elements_data() : array();
}

/**
 * Encode JSON for git: pretty-printed, readable slashes and Unicode, trailing newline.
 *
 * @param mixed $data Data.
 * @return string
 */
function aiec_cli_json( $data ) {
	return wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "\n";
}

/**
 * Write a file, creating its folders.
 *
 * @param string $file Path.
 * @param string $body Contents.
 */
function aiec_cli_write( $file, $body ) {
	wp_mkdir_p( dirname( $file ) );
	file_put_contents( $file, $body ); // phpcs:ignore WordPress.WP.AlternativeFunctions
}

/**
 * Empty a folder (recursively) so files of deleted pages do not linger, or create it.
 *
 * @param string $dir Folder.
 */
function aiec_cli_clear_dir( $dir ) {
	if ( is_dir( $dir ) ) {
		$items = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ), RecursiveIteratorIterator::CHILD_FIRST );
		foreach ( $items as $item ) {
			$item->isDir() ? rmdir( $item->getPathname() ) : unlink( $item->getPathname() ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		}
	}
	wp_mkdir_p( $dir );
}
