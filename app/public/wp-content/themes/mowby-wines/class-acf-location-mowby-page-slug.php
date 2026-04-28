<?php
/**
 * ACF location: match a page by post_name (slug). Headless-friendly; no PHP page templates required.
 *
 * @package MowbyWines
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ACF_Location_Mowby_Page_Slug' ) ) :

	/**
	 * @package MowbyWines
	 */
	class ACF_Location_Mowby_Page_Slug extends ACF_Location {

		/**
		 * @return void
		 */
		public function initialize() {
			$this->name           = 'mowby_page_slug';
			$this->label          = __( 'Mowby page slug', 'mowby-wines' );
			$this->category       = 'page';
			$this->object_type    = 'post';
			$this->object_subtype = 'page';
		}

		/**
		 * @param array $rule        Rule.
		 * @param array $screen      Screen.
		 * @param array $field_group Field group.
		 * @return bool
		 */
		public function match( $rule, $screen, $field_group ) {
			if ( ! isset( $screen['post_id'] ) ) {
				return false;
			}

			$post = get_post( (int) $screen['post_id'] );
			if ( ! $post || 'page' !== $post->post_type ) {
				return false;
			}

			return $this->compare_to_rule( $post->post_name, $rule );
		}

		/**
		 * @param array $rule Rule.
		 * @return array<string, string>
		 */
		public function get_values( $rule ) {
			return array(
				'about'    => __( 'About (/about)', 'mowby-wines' ),
				'shop'     => __( 'Shop (/shop)', 'mowby-wines' ),
				'blog'     => __( 'Blog (/blog)', 'mowby-wines' ),
				'contact'  => __( 'Contact (/contact)', 'mowby-wines' ),
			);
		}
	}

endif;
