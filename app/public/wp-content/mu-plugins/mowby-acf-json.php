<?php
/**
 * Plugin Name: Mowby ACF Local JSON
 * Description: Saves and loads ACF field groups (and related JSON) from wp-content/acf-json for version control and sync.
 * Version: 1.0.0
 *
 * @package MowbyWines
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Single save location for all ACF JSON exports (field groups, CPTs, taxonomies, options pages in ACF 6+).
 */
function mowby_acf_json_directory() {
	return trailingslashit( WP_CONTENT_DIR ) . 'acf-json';
}

/**
 * @param string $path Default save path.
 * @return string
 */
function mowby_acf_json_save_path( $path ) {
	return mowby_acf_json_directory();
}
add_filter( 'acf/settings/save_json', 'mowby_acf_json_save_path', 20 );

/**
 * Add the load path so ACF reads JSON from the same folder (sync + performance).
 *
 * @param array $paths Paths to scan for JSON.
 * @return array
 */
function mowby_acf_json_load_paths( $paths ) {
	$dir = mowby_acf_json_directory();
	$paths = is_array( $paths ) ? $paths : array();
	if ( ! in_array( $dir, $paths, true ) ) {
		array_unshift( $paths, $dir );
	}
	return $paths;
}
add_filter( 'acf/settings/load_json', 'mowby_acf_json_load_paths', 20 );
