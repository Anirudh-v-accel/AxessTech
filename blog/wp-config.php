<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'juynyimy_WPNJ1');

/** Database username */
define('DB_USER', 'juynyimy_WPNJ1');

/** Database password */
define('DB_PASSWORD', '^DyI0XDkR)UD)6_[5');

/** Database hostname */
define('DB_HOST', 'localhost');

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'ef46ca8e8e8e90f79bc6688486d4d01e575cee6bd4fa652b5f84aff02fa76ae7');
define('SECURE_AUTH_KEY', '57f8ac9a0c9ea90b06167fae2f8786ced245a96b82ea04c431ee0418a3510fe3');
define('LOGGED_IN_KEY', 'bcfcc02ffd436ab4291ac88eff862830c85b2baefaf54290d2e2736b01f77af2');
define('NONCE_KEY', '82ede111a8d8006c5cf9d2777e90421f39de27905d17b194d7afe9323d2455ba');
define('AUTH_SALT', '2ba551e9a5577cf621de2b40128f2b2cb7b1adfe95580d59ce8112e29be97464');
define('SECURE_AUTH_SALT', 'ef8b42c2ea96e3be94b6d2c2528c5f281025faea5ec5442de591296d73983f10');
define('LOGGED_IN_SALT', 'e739c2d6cefa586bc38ef2d5882d6093a33a01896b3eeee9c370ee95d526bc41');
define('NONCE_SALT', 'e6861ab7cbb9f38a237c5173be6981a03924e000b0758fe5a92be4c43f35806e');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'YCW_';
define('WP_CRON_LOCK_TIMEOUT', 120);
define('AUTOSAVE_INTERVAL', 300);
define('WP_POST_REVISIONS', 20);
define('EMPTY_TRASH_DAYS', 7);
define('WP_AUTO_UPDATE_CORE', true);

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
