<?php
/**
 * Plugin Name: MLS Services
 * Plugin URI:  https://manhattanlaserspa.com
 * Description: Registers the Services custom post type and categories for Manhattan Laser Spa.
 * Version:     1.0.0
 * Author:      Manhattan Laser Spa
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ─── Register Service Post Type ───────────────────────────────────────────────

function mls_register_service_post_type() {
    register_post_type( 'mls_service', [
        'labels' => [
            'name'               => 'Services',
            'singular_name'      => 'Service',
            'add_new'            => 'Add New Service',
            'add_new_item'       => 'Add New Service',
            'edit_item'          => 'Edit Service',
            'new_item'           => 'New Service',
            'view_item'          => 'View Service',
            'search_items'       => 'Search Services',
            'not_found'          => 'No services found',
            'not_found_in_trash' => 'No services found in trash',
            'menu_name'          => 'Services',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'has_archive'         => false,
        'rewrite'             => [ 'slug' => 'service' ],
        'menu_icon'           => 'dashicons-heart',
        'menu_position'       => 5,
        'supports'            => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions' ],
        'show_in_nav_menus'   => false,
    ]);
}
add_action( 'init', 'mls_register_service_post_type' );


// ─── Register Service Category Taxonomy ──────────────────────────────────────

function mls_register_service_category() {
    register_taxonomy( 'mls_service_cat', 'mls_service', [
        'labels' => [
            'name'              => 'Service Categories',
            'singular_name'     => 'Service Category',
            'search_items'      => 'Search Categories',
            'all_items'         => 'All Categories',
            'edit_item'         => 'Edit Category',
            'update_item'       => 'Update Category',
            'add_new_item'      => 'Add New Category',
            'new_item_name'     => 'New Category Name',
            'menu_name'         => 'Categories',
        ],
        'hierarchical'  => true,
        'show_in_rest'  => true,
        'rewrite'       => [ 'slug' => 'service-category' ],
        'show_ui'       => true,
        'show_in_menu'  => true,
    ]);
}
add_action( 'init', 'mls_register_service_category' );


// ─── Register Custom Meta Fields (exposed to REST API) ────────────────────────

function mls_register_meta_fields() {
    $fields = [
        'mls_price' => [
            'description' => 'Regular price (e.g. 299)',
            'type'        => 'string',
        ],
        'mls_sale_price' => [
            'description' => 'Sale price — leave blank if not on sale',
            'type'        => 'string',
        ],
        'mls_duration' => [
            'description' => 'Duration or sessions (e.g. 60 min, Series of 6)',
            'type'        => 'string',
        ],
        'mls_badge' => [
            'description' => 'Optional badge label (e.g. Most Popular, New, Sale)',
            'type'        => 'string',
        ],
        'mls_is_featured' => [
            'description' => 'Show on homepage featured section',
            'type'        => 'boolean',
        ],
        'mls_stripe_price_id' => [
            'description' => 'Stripe Price ID (from Stripe dashboard)',
            'type'        => 'string',
        ],
    ];

    foreach ( $fields as $key => $args ) {
        register_post_meta( 'mls_service', $key, [
            'single'            => true,
            'type'              => $args['type'],
            'description'       => $args['description'],
            'show_in_rest'      => true,
            'sanitize_callback' => $args['type'] === 'boolean' ? 'rest_sanitize_boolean' : 'sanitize_text_field',
            'auth_callback'     => function() { return current_user_can( 'edit_posts' ); },
        ]);
    }
}
add_action( 'init', 'mls_register_meta_fields' );


// ─── Admin Meta Box ───────────────────────────────────────────────────────────

function mls_add_meta_box() {
    add_meta_box(
        'mls_service_details',
        'Service Details',
        'mls_render_meta_box',
        'mls_service',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'mls_add_meta_box' );

function mls_render_meta_box( $post ) {
    wp_nonce_field( 'mls_save_meta', 'mls_meta_nonce' );

    $price          = get_post_meta( $post->ID, 'mls_price', true );
    $sale_price     = get_post_meta( $post->ID, 'mls_sale_price', true );
    $duration       = get_post_meta( $post->ID, 'mls_duration', true );
    $badge          = get_post_meta( $post->ID, 'mls_badge', true );
    $is_featured    = get_post_meta( $post->ID, 'mls_is_featured', true );
    $stripe_id      = get_post_meta( $post->ID, 'mls_stripe_price_id', true );
    ?>
    <style>
        .mls-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 8px 0; }
        .mls-field { display: flex; flex-direction: column; gap: 4px; }
        .mls-field.full { grid-column: 1 / -1; }
        .mls-field label { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #555; }
        .mls-field input[type="text"] { padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .mls-field input[type="text"]:focus { border-color: #BA7587; outline: none; box-shadow: 0 0 0 2px rgba(186,117,135,0.15); }
        .mls-field .hint { font-size: 11px; color: #999; margin-top: 2px; }
        .mls-featured { display: flex; align-items: center; gap: 8px; padding: 12px 0 4px; grid-column: 1 / -1; }
        .mls-featured label { font-weight: 600; font-size: 13px; margin: 0; text-transform: none; letter-spacing: 0; color: #333; }
    </style>

    <div class="mls-fields">
        <div class="mls-field">
            <label for="mls_price">Regular Price ($)</label>
            <input type="text" id="mls_price" name="mls_price" value="<?php echo esc_attr( $price ); ?>" placeholder="299" />
        </div>

        <div class="mls-field">
            <label for="mls_sale_price">Sale Price ($)</label>
            <input type="text" id="mls_sale_price" name="mls_sale_price" value="<?php echo esc_attr( $sale_price ); ?>" placeholder="Leave blank if not on sale" />
        </div>

        <div class="mls-field">
            <label for="mls_duration">Duration / Sessions</label>
            <input type="text" id="mls_duration" name="mls_duration" value="<?php echo esc_attr( $duration ); ?>" placeholder="e.g. 60 min, Series of 6" />
        </div>

        <div class="mls-field">
            <label for="mls_badge">Badge Label</label>
            <input type="text" id="mls_badge" name="mls_badge" value="<?php echo esc_attr( $badge ); ?>" placeholder="e.g. Most Popular, New" />
            <span class="hint">Optional — shows as a tag on the service card</span>
        </div>

        <div class="mls-field full">
            <label for="mls_stripe_price_id">Stripe Price ID</label>
            <input type="text" id="mls_stripe_price_id" name="mls_stripe_price_id" value="<?php echo esc_attr( $stripe_id ); ?>" placeholder="price_xxxxxxxxxxxxxxxxxxxx" />
            <span class="hint">From your Stripe dashboard → Products → Price ID. Used for checkout.</span>
        </div>

        <div class="mls-featured">
            <input type="checkbox" id="mls_is_featured" name="mls_is_featured" value="1" <?php checked( $is_featured, '1' ); ?> />
            <label for="mls_is_featured">Show on homepage as a featured treatment</label>
        </div>
    </div>
    <?php
}


// ─── Save Meta Box Data ───────────────────────────────────────────────────────

function mls_save_meta( $post_id ) {
    if (
        ! isset( $_POST['mls_meta_nonce'] ) ||
        ! wp_verify_nonce( $_POST['mls_meta_nonce'], 'mls_save_meta' ) ||
        ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ||
        ! current_user_can( 'edit_post', $post_id )
    ) return;

    $text_fields = [ 'mls_price', 'mls_sale_price', 'mls_duration', 'mls_badge', 'mls_stripe_price_id' ];

    foreach ( $text_fields as $field ) {
        if ( isset( $_POST[ $field ] ) ) {
            update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
        }
    }

    update_post_meta( $post_id, 'mls_is_featured', isset( $_POST['mls_is_featured'] ) ? '1' : '0' );
}
add_action( 'save_post_mls_service', 'mls_save_meta' );


// ─── Flush Rewrite Rules on Activation ───────────────────────────────────────

register_activation_hook( __FILE__, function() {
    mls_register_service_post_type();
    mls_register_service_category();
    flush_rewrite_rules();
});
