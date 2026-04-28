<?php
/**
 * Plugin Name: Mowby ACF Options Page
 * Description: Registers the "Mowby Site" options screen for global header/footer ACF fields (WPGraphQL + Faust).
 * Version: 1.0.0
 *
 * @package MowbyWines
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register a top-level ACF Options Page for site-wide fields (footer, header copy, etc.).
 */
function mowby_register_acf_options_page() {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	acf_add_options_page(
		array(
			'page_title' => 'Mowby Site',
			'menu_title' => 'Mowby Site',
			'menu_slug'  => 'mowby-site',
			'capability' => 'edit_posts',
			'redirect'   => false,
		)
	);
}
add_action( 'acf/init', 'mowby_register_acf_options_page' );
