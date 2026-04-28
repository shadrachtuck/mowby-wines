<?php
/**
 * Prize Fight Fest - Custom Post Types and ACF Setup
 * 
 * This file can be used to programmatically create the custom post type
 * if you prefer code over the ACF UI. Place this in wp-content/mu-plugins/
 * 
 * Note: You'll still need to create ACF field groups through the ACF UI
 * or export/import them. This file just handles the post type registration.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Artists Custom Post Type
 */
function pff_register_artists_post_type() {
    $labels = array(
        'name'                  => 'Artists',
        'singular_name'         => 'Artist',
        'menu_name'             => 'Artists',
        'add_new'               => 'Add New',
        'add_new_item'          => 'Add New Artist',
        'edit_item'             => 'Edit Artist',
        'new_item'              => 'New Artist',
        'view_item'             => 'View Artist',
        'search_items'          => 'Search Artists',
        'not_found'             => 'No artists found',
        'not_found_in_trash'    => 'No artists found in trash',
    );

    $args = array(
        'labels'                => $labels,
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'query_var'             => true,
        'rewrite'               => array('slug' => 'artists'),
        'capability_type'       => 'post',
        'has_archive'           => true,
        'hierarchical'          => false,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-microphone',
        'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest'          => true,
        'show_in_graphql'       => true,
        'graphql_single_name'   => 'artist',
        'graphql_plural_name'   => 'artists',
    );

    register_post_type('artist', $args);
}
add_action('init', 'pff_register_artists_post_type');

/**
 * Flush rewrite rules on activation (run once)
 * 
 * Note: This should be run once. You can remove this after first run
 * or create a proper activation hook.
 */
function pff_flush_rewrite_rules() {
    pff_register_artists_post_type();
    flush_rewrite_rules();
}
// Uncomment to flush rewrite rules on load (remove after first run):
// add_action('init', 'pff_flush_rewrite_rules', 20);

