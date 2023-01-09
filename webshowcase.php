<?php
/**
 * Plugin Name:       Croquet Metaverse Web Showcase
 * Description:       Croquet Metaverse Web Showcase
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Author:            The Croquet Corporation
 * Plugin URI:        http://wordpress.org/plugins/croquet-showcase/
 * Description:       Croquet Metaverse Web Showcase
 * Author URI:        https://croquet.io/
 * Text Domain:       croquet-showcase
 * Domain Path:       /languages/
 *
 * @package           croquet-showcase
 */

function webshowcase_dynamic_init() {
  require_once(ABSPATH . 'wp-admin/includes/media.php');
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  require_once(ABSPATH . 'wp-admin/includes/image.php');

/*
   wp_register_script(
    'croquet-showcase',
     __DIR__ . '/build',
     array('wp-i18n')
   );
*/

  register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'webshowcase_dynamic_render_callback'));
}

/*
function showcase_load_plugin_textdomain() {
  load_plugin_textdomain("croquet-showcase", false, "languages");
}
*/

add_action('init', 'webshowcase_dynamic_init');

/*
add_action('plugins_loaded', 'showcase_load_plugin_textdomain');
*/

function get_attachment_by_name($html_name) {
   $args = array(
     'posts_per_page' => 1,
     'post_type'      => 'attachment',
     'name'           => trim( $html_name ));

   $get_attachment = new WP_Query( $args );

   if (! $get_attachment || ! isset( $get_attachment->posts, $get_attachment->posts[0])) {
     return false;
   }

   return $get_attachment->posts[0];
}

function delete_if__exists($contents, $html_name) {
   $prev = get_attachment_by_name($html_name);
   if ($prev) {
     $file = file_get_contents($prev->guid);
     /*
     do_action("qm/debug", $file);
     do_action("qm/debug", $contents);
     do_action("qm/debug", 'equal: ' . ($file == $contents));
     */

     if ($file && $file == $contents) {return $prev->guid;}

     // I want to know how to get the previous content and delete it only if necessary
     $id = $prev->ID;

     wp_delete_attachment($id, true);
   }
   return false;
}

function webshowcase_dynamic_render_callback( $block_attributes, $content ) {
  $contents1 = <<<SHOWCASE
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
      import {load} from "https://croquet.io/test/webshowcase/v1.js";
      load({
        title: "My Web Showcase", 
        showcase: "gallery",
        voiceChat: true,

SHOWCASE;

  $decodedCards = json_decode($block_attributes['cardsString'], true);
  // do_action("qm/debug", $decodedCards);

  $sanitizedCards = "";
  foreach($decodedCards as $card) {
    if ($card['path']) {
      $encoded = json_encode($card, JSON_UNESCAPED_SLASHES);
      if (strlen($sanitizedCards) == 0) {
        $sanitizedCards = $encoded;
      } else {
        $sanitizedCards = $sanitizedCards . ", " . $encoded;
      }
    }
  }

  $contents2 = '        cards: [' . $sanitizedCards . '],' . "\n";

  $sanitizedName = strtolower(preg_replace("/[^A-Za-z0-9-]+/", "", $block_attributes['showcaseName']));

  $contents3 = '        appId: "io.croquet.webshowcase.' . $sanitizedName . '",' . "\n" .
     '        apiKey: "' . $block_attributes['apiKey'] . '",' . "\n";

  $contents4 = <<<SHOWCASE
      });
    </script>
  </body>
</html>

SHOWCASE;

  $all_contents = $contents1 . $contents2 . $contents3 . $contents4;
  $minHeight = $block_attributes['minHeight'];

  $filename = $sanitizedName . '.html';
  $tmp_filename = get_temp_dir() . 'showcase.html.tmp';
  $src = delete_if__exists($all_contents, $filename);

  if (!$src) {
    $file = fopen($tmp_filename, 'w');

    if (!$file) {
      echo "Error creating a temporary file";
      return;
    }
    $count = fwrite($file, $all_contents);
    if (!$count) {
      echo "Error writing into a temporary file";
      return;
    }
    fclose($file);

    $file_array = array();
    $file_array['name'] = $filename;
    $file_array['tmp_name'] = $tmp_filename;

    $post = get_the_ID();

    // do_action("qm/debug", '$post: ' . $post);

    if (!$post) {
      echo "Error getting the current post ID";
      return;
    }
    $id = media_handle_sideload($file_array, 0, $filename);
    $src = wp_get_attachment_url($id);
  }

  do_action("qm/debug", '$src: ' . $src);

  return '<div class="showcase-container"><iframe width="100%" height=' . $minHeight . ' class="showcase-iframe" src="' . $src . '"></iframe></div>';
}
