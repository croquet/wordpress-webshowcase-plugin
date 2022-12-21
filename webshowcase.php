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
    // automatically load dependencies and version
do_action('qm/debug', "that happened");
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');

    register_block_type( __DIR__ . '/build', array(
        'render_callback' => 'webshowcase_dynamic_render_callback'
    ) );
}

add_action( 'init', 'webshowcase_dynamic_init');

function webshowcase_dynamic_render_callback( $block_attributes, $content ) {

do_action('qm/debug', $block_attributes);
	$filename = 'showcase.html';
	$tmp_filename = get_temp_dir() . 'showcase.html.tmp';
	$contents = <<<SHOWCASE
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
      import {load} from "https://croquet.io/test/webshowcase/v1.js";
      load({
        title: "My Web Showcase", 
        showcase: "gallery", 
        cards: [
          // each item in cards array has a 'place' to specify the location in the art gallery
          // 'type' is either "image", "pdf", or "video"
          // 'path' specifies the location of the asset, either as full URL or as path relative to this html file
          {place: 1, type: "image", path: "./parkspda.png"},
          {place: 2, type: "image", path: "./viewpoints.png"},
          {place: 3, type: "image", path: "./wave.png"},
          {place: 4, type: "image", path: "./croquet.png"},
          {place: 5, type: "video", path: "./first-teatime.mov", muted: true,
           videoWidth: 1532, videoHeight: 1080
          },
          {place: 6, type: "pdf", path: "./main.pdf"},
        ],
        voiceChat: true,
        appId: "io.croquet.yoshiki.webshowcase",
        apiKey: "1oC9rKnKr4kkttz5HqJ4mDycjupJA5eiF2CMhdvIf",
      });
    </script>
  </body>
</html>
SHOWCASE;

	$file = fopen($tmp_filename, 'w');

	if (!$file) {
	    echo "Error creating a temporary file";
	    return;
        }
	$count = fwrite($file, $contents);
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

        return '<iframe width=800 height=800 src="' . $src . '" id="showcase"/>';
}
