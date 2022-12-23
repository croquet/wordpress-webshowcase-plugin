<?php
/**
 * Plugin Name:       Metaverse Web Showcase
 * Description:       Metaverse Web Showcase
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            The Croquet Corporation
 * Text Domain:       croquet
 *
 * @package           webshowcase-block
 */

function webshowcase_dynamic_init() {
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');

    register_block_type( __DIR__ . '/build', array(
        'render_callback' => 'webshowcase_dynamic_render_callback'
    ) );
}

add_action( 'init', 'webshowcase_dynamic_init');

function get_attachment_by_name($html_name) {
   $args = array(
            'posts_per_page' => 1,
            'post_type'      => 'attachment',
            'name'           => trim( $html_name ),
         );

         $get_attachment = new WP_Query( $args );

         if (! $get_attachment || ! isset( $get_attachment->posts, $get_attachment->posts[0])) {
             return false;
         }

         return $get_attachment->posts[0];
}

function delete_if__exists($contents, $html_name) {
   $prev = get_attachment_by_name($html_name);
   if ($prev) {
       // I want to know how to get the previous content and delete it only if necessary
       $id = $prev->ID;
       wp_delete_attachment($id, true);
   }
}

function webshowcase_dynamic_render_callback( $block_attributes, $content ) {
  $filename = 'showcase.html';
  $tmp_filename = get_temp_dir() . 'showcase.html.tmp';
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
  do_action("qm/debug", $decodedCards);

  $sanitizedCards = "";
  foreach($decodedCards as $card) {
      if ($card['place']) {
          $sanitizedCards = $sanitizedCards . json_encode($card, JSON_UNESCAPED_SLASHES);
      }
  }

  $contents2 = '        cards: [' . $sanitizedCards . '],' . "\n";

  $sanitized = strtolower(preg_replace("/[^A-Za-z0-9-]+/", "", $block_attributes['showcaseName']));

  $contents3 = '        appId: "io.croquet.webshowcase.' . $sanitized . '",' . "\n" .
        '        apiKey: "' . $block_attributes['apiKey'] . '",' . "\n";

  $contents4 = <<<SHOWCASE
      });
    </script>
  </body>
</html>

SHOWCASE;

  $minHeight = $block_attributes['minHeight'];

  delete_if__exists(null, $filename);

  $file = fopen($tmp_filename, 'w');

  if (!$file) {
      echo "Error creating a temporary file";
      return;
        }
  $count = fwrite($file, $contents1 . $contents2 . $contents3 . $contents4);
  if (!$count) {
      echo "Error writing into a temporary file";
      return;
        }
  fclose($file);

  $file_array = array();
  $file_array['name'] = 'showcase.html';
  $file_array['tmp_name'] = $tmp_filename;

  $post = get_the_ID();

  if (!$post) {
      echo "Error getting the current post ID";
      return;
  }

  $id = media_handle_sideload( $file_array, 0, "showcase html");

  $src = wp_get_attachment_url($id);

        return '<div class="is-layout-flex showcase-container"><iframe width="100%" height=' . $minHeight . 'class="showcase-iframe" src="' . $src . '"/></div>';
}
