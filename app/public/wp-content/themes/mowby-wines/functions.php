<?php
/**
 * Mowby Wines child theme — headless Faust; registers ACF “page slug” location (no PHP page templates).
 *
 * @package MowbyWines
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom ACF location type (requires ACF).
 *
 * @return void
 */
function mowby_wines_register_acf_location_mowby_page_slug() {
	if ( ! function_exists( 'acf_register_location_type' ) || ! class_exists( 'ACF_Location' ) ) {
		return;
	}
	require_once __DIR__ . '/class-acf-location-mowby-page-slug.php';
	acf_register_location_type( 'ACF_Location_Mowby_Page_Slug' );
}
add_action( 'acf/init', 'mowby_wines_register_acf_location_mowby_page_slug' );

/**
 * Map custom ACF location “mowby_page_slug” to the Page GraphQL type (wpgraphql-acf default switch has no case for it).
 *
 * @param string $field_group_name GraphQL field group name.
 * @param string $param            Rule param.
 * @param string $operator         Rule operator.
 * @param string $value            Rule value (slug).
 * @param object $rules            LocationRules instance.
 * @return void
 */
function mowby_wines_wpgraphql_acf_match_mowby_page_slug( $field_group_name, $param, $operator, $value, $rules ) {
	if ( 'mowby_page_slug' !== $param || '==' !== $operator ) {
		return;
	}
	if ( ! is_object( $rules ) || ! method_exists( $rules, 'set_graphql_type' ) ) {
		return;
	}
	$rules->set_graphql_type( $field_group_name, 'Page' );
}
add_action( 'wpgraphql/acf/match_location_rule', 'mowby_wines_wpgraphql_acf_match_mowby_page_slug', 10, 5 );

add_action(
	'after_setup_theme',
	function () {
		// Align with FaustWP default Headless menu labels ("Primary, Footer" → keys primary, footer).
		// Ensures MenuLocationEnum includes PRIMARY + FOOTER for WPGraphQL even before Faust settings are saved.
		register_nav_menus(
			array(
				'primary' => __( 'Primary', 'mowby-wines' ),
				'footer'  => __( 'Footer', 'mowby-wines' ),
			)
		);
	},
	20
);

add_action(
	'after_switch_theme',
	function () {
		wp_clean_themes_cache();
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {
		wp_enqueue_style(
			'mowby-wines-parent',
			get_template_directory_uri() . '/style.css',
			array(),
			wp_get_theme( get_template() )->get( 'Version' )
		);
	}
);
