<?php
/**
 * Plugin Name:       Croquet Metaverse Web Showcase
 * Description:       Croquet Metaverse Web Showcase
 * Version:           2.0.1
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Author:            Croquet Labs, Inc
 * Plugin URI:        https://croquet.io/webshowcase
 * Description:       Croquet Metaverse Web Showcase
 * Author URI:        https://croquet.io/
 * License:           Apache-2.0
 * License URI:       https://www.apache.org/licenses/LICENSE-2.0
 * Text Domain:       croquet-metaverse-web-showcase
 * Domain Path:       /languages

 */

/**
  * Some initialization. The internationalization mechanism is almost put in place but
  * not enabled yet
*/

function croquet_metaverse_web_showcase_dynamic_init() {
  require_once(ABSPATH . 'wp-admin/includes/media.php');
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  require_once(ABSPATH . 'wp-admin/includes/image.php');

   wp_register_script(
    'croquet-metaverse-web-showcase-script',
     __DIR__ . '/build',
     array('wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor')
  );

  register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'croquet_metaverse_web_showcase_dynamic_render_callback'));
}

function croquet_metaverse_web_showcase_load_textdomain() {
  load_plugin_textdomain("croquet-metaverse-web-showcase", false, dirname(plugin_basename(__FILE__)) ."languages");
}

add_action('init', 'croquet_metaverse_web_showcase_dynamic_init');
add_action('init', 'croquet_metaverse_web_showcase_load_textdomain');

/**
  * The entry point of the callback. It generates a simple HTML file by concatenating fragments
  * based on the JSON string that represents the list of "cards".
  * Check if the generated HTML is different so that it has to be update in the media library.
  * Get the accessible URL for the HTML in the Media Library, and returns an HTML fragement
  * that uses the URL as src for an iframe.
*/

function croquet_metaverse_web_showcase_dynamic_render_callback( $block_attributes, $content ) {
  $json = array();
  $json['title'] = $block_attributes['showcaseName'];
  $json['showcase'] = 'gallery'; // $block_attributes['showcase'];
  $json['voiceChat'] = $block_attributes['voiceChat'];

  $decodedCards = json_decode($block_attributes['cardsString'], true);
  $sanitizedName = strtolower(preg_replace("/[^A-Za-z0-9-]+/", "", $block_attributes['showcaseName']));
  $json['cards'] = array();

  foreach($decodedCards as $card) {
    if (array_key_exists('path', $card)) {
      array_push($json['cards'], $card);
    }
  }

  $json['appId'] = 'io.croquet.webshowcase.' . $sanitizedName;
  $json['apiKey'] = $block_attributes['apiKey'];

  $encoded = json_encode($json, JSON_UNESCAPED_SLASHES);

  $contents1 = '
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
';

  // $contents2 = 'import {load} from ' . '"' . plugins_url('includes/v1.js', __FILE__) . '";';
  $contents2 = 'import {load} from "https://croquet.io/dev/webshowcase/v1.js"';

  // do_action("qm/debug", '$contents2: ' . $contents2);

  $contents3 = '
    load(
  ';

  $contents4 = '
      );
    </script>
  </body>
</html>';

  $all_contents = $contents1 . $contents2 . $contents3 . $encoded . $contents4;
  $minHeight = $block_attributes['minHeight'];

  $filename = $sanitizedName . '.html';
  $tmp_filename = get_temp_dir() . 'showcase.html.tmp';
  //do_action("qm/debug", 'temp: ' . $tmp_filename);

  $src = croquet_metaverse_web_showcase_delete_if_exists($all_contents, $filename);

  // do_action("qm/debug", '$src1: ' . $src);

  $html = null;

  if ($src == "not exist") {
    $src = croquet_metaverse_web_showcase_create_src($tmp_filename, $filename, $all_contents);
    if (!$src) {
      // echo "Croquet Web Showcase: Error creating an asset. Try previewing the page.<br>";
      return 'Croquet Web Showcase: Error creating an asset.';
    } else {
      $html = $src;
    }
  } else if ($src == "no permission") {
     return 'Croquet Web Showcase: no asset exists';
  } else {
     $html = $src;
  }

  // do_action("qm/debug", '$src2: ' . strval($html));

  $html = parse_url($html, PHP_URL_PATH);

  // do_action("qm/debug", '$html: ' . strval($html));

  $showcasePrivacy = $block_attributes['showcasePrivacy'];
  
  if ($showcasePrivacy == 'public') {
    $sessionKey = '?q=' . $sanitizedName . '#pw=1';
  } else if ($showcasePrivacy == 'invite') {
    $sessionKey = '';
  } else {
    // Default to `invite`.
    // Perhaps we want to log something here, because we should never hit this codepath.
    $sessionKey = '';
  }

  $result = wp_kses('<div class="showcase-container"><iframe width="100%" height=' . $minHeight . ' class="showcase-iframe" src="' . $html . $sessionKey . '"></iframe></div>',
    array(
      'div' => array('class' => array()),
      'iframe' => array('width' => array(), 'height' => array(), 'src' => array())
    ));

  // do_action("qm/debug", $result);

  return $result;
}

function croquet_metaverse_web_showcase_get_attachment_by_name($html_name) {
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

function croquet_metaverse_web_showcase_delete_if_exists($contents, $html_name) {
   $prev = croquet_metaverse_web_showcase_get_attachment_by_name($html_name);
   $file = null;

   if ($prev) {
        //do_action("qm/debug", "prev: " . $prev->guid);
        $file = file_get_contents($prev->guid);
   } else {
     // do_action("qm/debug", "no previous file");
     return "not exist";
   }

   // do_action("qm/debug", "file: " . strval($file));
   // do_action("qm/debug", "function_exists: " . function_exists('current_user_can'));

   $parent_post = croquet_metaverse_web_showcase_get_post();

   // do_action("qm/debug", "id: " . get_the_ID());
   // do_action("qm/debug", "post id: " . $parent_post->ID);
   // do_action("qm/debug", "post parent: " . $post->post_parent);

   if (!$parent_post || !current_user_can('edit_post', $parent_post->ID)) {
      if ($file) {
         return $prev->guid;
      }
      return "no permission";
   }

   // do_action("qm/debug", $file);
   // do_action("qm/debug", $contents);
   // do_action("qm/debug", 'equal: ' . ($file == $contents));
   // echo "$file:" . $file;
   // echo "$contents:" . $contents;

   // do_action("qm/debug", $file . ' ' . $prev->guid);

   if ($file && $file == $contents) {return $prev->guid;}

   // I want to know how to get the previous content and delete it only if necessary
   $id = $prev->ID;

   // do_action("qm/debug", "delete");
   wp_delete_attachment($id, true);
   return "not exist";
}

function croquet_metaverse_web_showcase_get_post() {
   global $post;
   $current = $post;
   while ($current && $current->post_parent) {
      $current = get_post($current->post_parent);
   }
   return $current;
}

function croquet_metaverse_web_showcase_create_src($tmp_filename, $filename, $all_contents) {
  $file = fopen($tmp_filename, 'w');

  if (!$file) {
    echo "Croquet Web Showcase: Error creating a temporary file.<br>";
    return false;
  }

  $count = fwrite($file, $all_contents);
  if (!$count) {
    echo "Croquet Web Showcase: Error writing into a temporary file.<br>";
    return false;
  }
  fclose($file);

  $file_array = array();
  $file_array['name'] = $filename;
  $file_array['tmp_name'] = $tmp_filename;

  $post = get_the_ID();

  // do_action("qm/debug", '$post: ' . $post);

  if (!$post) {
    echo "Croquet Web Showcase: Error getting the current post ID.<br>";
    return false;
  }

  $id = media_handle_sideload($file_array, 0, $filename);

  // do_action("qm/debug", 'is error ' . is_wp_error($id));

  if (is_wp_error($id)) {
    echo "Croquet Web Showcase: Error media_handle_sideload failed.<br>";
    return false;
  }

  return wp_get_attachment_url($id);
}
