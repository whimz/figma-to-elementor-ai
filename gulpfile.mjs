// Asset pipeline for the ai-elem-child theme: src/ -> theme/assets/.
// Dev (default task): build everything, then watch + browser-sync.
// Production: NODE_ENV=production (set by `npm run build` / `npm run zip`).

import path from 'node:path';
import { Transform } from 'node:stream';
import { src, dest, watch, series, parallel, lastRun } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import browserSync from 'browser-sync';
import gulpZip from 'gulp-zip';
import { deleteAsync } from 'del';
import sharp from 'sharp';
import { optimize } from 'svgo';

const isProd = process.env.NODE_ENV === 'production';
const sass = gulpSass(dartSass);
const server = browserSync.create();

const THEME_SLUG = 'ai-elem-child';

const paths = {
	styles: { entry: 'src/scss/main.scss', watch: 'src/scss/**/*.scss', out: 'theme/assets/css' },
	scripts: { entry: 'src/js/main.js', watch: 'src/js/**/*.js', out: 'theme/assets/js/main.js' },
	images: { src: 'src/images/**/*', out: 'theme/assets/images' },
	php: 'theme/**/*.php',
	assets: 'theme/assets',
	dist: 'dist',
};

const dev = {
	proxy: 'http://localhost:8888', // wp-env
	port: 3100, // 3000 is taken by another project's container
	uiPort: 3101,
};

const WEBP_QUALITY = 80;
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png']);

// Object-mode transform helper for small per-file steps.
function eachFile(fn) {
	return new Transform({
		objectMode: true,
		async transform(file, _encoding, callback) {
			try {
				callback(null, await fn(file));
			} catch (error) {
				callback(error);
			}
		},
	});
}

export function clean() {
	return deleteAsync([paths.assets]);
}

export function styles() {
	return src(paths.styles.entry, { sourcemaps: !isProd })
		.pipe(sass.sync({ style: isProd ? 'compressed' : 'expanded' }).on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(dest(paths.styles.out, { sourcemaps: isProd ? false : '.' }));
}

export async function scripts() {
	await esbuild.build({
		entryPoints: [paths.scripts.entry],
		outfile: paths.scripts.out,
		bundle: true,
		format: 'iife',
		target: ['es2020'],
		minify: isProd,
		sourcemap: !isProd,
		logLevel: 'warning',
	});
}

// Raster images -> WebP; SVG stays vector (optimized with SVGO); everything else is copied as is.
async function processImage(file) {
	if (!file.isBuffer()) {
		return file;
	}

	const ext = path.extname(file.path).toLowerCase();

	if (RASTER_EXT.has(ext)) {
		file.contents = await sharp(file.contents).webp({ quality: WEBP_QUALITY }).toBuffer();
		file.extname = '.webp';
	} else if (ext === '.svg') {
		const { data } = optimize(file.contents.toString(), {
			path: file.path,
			multipass: true,
			plugins: [
				{
					name: 'preset-default',
					// Keep IDs intact: CSS or JS may reference them.
					params: { overrides: { cleanupIds: false } },
				},
			],
		});
		file.contents = Buffer.from(data);
	}

	return file;
}

export function images() {
	// encoding: false — Gulp 5 reads files as UTF-8 text by default, which corrupts binaries.
	return src(paths.images.src, { encoding: false, since: lastRun(images) })
		.pipe(eachFile(processImage))
		.pipe(dest(paths.images.out));
}

export function serve(done) {
	server.init(
		{
			proxy: dev.proxy,
			port: dev.port,
			ui: { port: dev.uiPort },
			open: false,
			notify: false,
			snippetOptions: {
				// Keep the browser-sync client out of wp-admin, login and the Elementor editor preview iframe.
				blacklist: ['/wp-admin/**', '/wp-login.php*', '**/*elementor-preview=*'],
			},
		},
		done,
	);
}

function reload(done) {
	server.reload();
	done();
}

function injectStyles(done) {
	server.reload('*.css');
	done();
}

function watchFiles() {
	watch(paths.styles.watch, series(styles, injectStyles));
	watch(paths.scripts.watch, series(scripts, reload));
	watch(paths.images.src, series(images, reload));
	watch(paths.php, reload);
}

// Put theme files under an "ai-elem-child/" folder inside the archive, as WordPress expects on upload.
function intoThemeFolder(file) {
	file.path = path.join(file.base, THEME_SLUG, file.relative);
	return file;
}

function zipTheme() {
	return src(['theme/**/*', '!theme/**/*.map', '!theme/**/README.md'], { base: 'theme', encoding: false })
		.pipe(eachFile(intoThemeFolder))
		.pipe(gulpZip(`${THEME_SLUG}.zip`))
		.pipe(dest(paths.dist));
}

export const build = series(clean, parallel(styles, scripts, images));

// Always zip a fresh production build.
export const zip = series(build, zipTheme);

export default series(build, parallel(watchFiles, serve));
