=== Croquet Metaverse Web Showcase ===
Contributors:      yoshikiohshima,zfox23
Tags:              metaverse, 3d, multiuser
Tested up to:      6.3
Requires at least: 5.9
Stable tag:        1.1.11
Requires PHP:      7.0
License:           Apache 2.0
License URI:       https://www.apache.org/licenses/LICENSE-2.0

Croquet Metaverse Web Showcase allows you to embed a 3D multiplayer environment into your WordPress page.

== Description ==

Croquet Metaverse Web Showcase is a new WordPress block which allows people to embed a multiuser, collaborative, 3D space into a WordPress site. A WordPress author can drag images, videos, and PDF files into the block to add their content into the virtual 3D space.

See the plugin in action in this video:

https://www.youtube.com/watch?v=q0cFApaNEBI

To install the plugin, search for "Croquet Web Showcase" from your WordPress plugin installation page.

You will need a Croquet API Key to use the plugin. You can create a key for free at [croquet.io/keys](https://croquet.io/keys).
Your API key will look something like this: `15kkttz5HqJ4mDycjupJA5eiF2CMhdvIgexample`

While writing a new Post or Page, you can add a Croquet Metaverse Web Showcase block in the block editor, as shown in the first screenshot.

Open the sidebar settings for the Web Showcase block by clicking on the the gear icon at the top right corner of your editing page and clicking on the block. In the sidebar settings, you can paste your Croquet API Key into the API Key text field.

By default, a new Web Showcase block contains two default assets. If you preview your Post or Page, you can see a 3D art gallery space with those two images.

Once you have verified that this works, you can remove the default contents within the Web Showcase block by pressing the "X" button on each row. You can drag your own image, video, and PDF assets into the block to add them. You can rearrange them in the block editor, and they will change positions in the 3D gallery.

Visit [croquet.io/webshowcase](https://croquet.io/webshowcase) for more information about Web Showcase.

== Installation ==

= Installation from within WordPress =

1. Visit **Plugins > Add New**
2. Search for **Web Showcase**.
3. Install and activate the Croquet Metaverse Web Showcase plugin.

= Manual installation =

1. Download the [plugin ZIP file](https://croquet.io/webshowcase/wordpress-showcase.zip).
2. Visit **Plugins > Add New > Upload Plugin**.
3. Select the downloaded zip file, and activate the installed plugin.

= After activation = 
1. Visit [https://croquet.io/keys](https://croquet.io/keys) and create a production API Key. These API keys are public and **not secret**. Usage of the API key can be restricted to a set of URLs.

== Settings ==

There are some sidebar settings associated with the Metaverwe Web Showcase block. If you don't see a sidebar in your editor, click the gear icon in the top right of the editor to open the sidebar.

= Croquet API Key =

This API key is used to access the Croquet Reflector network. You can generate an API Key at [croquet.io/keys](https://croquet.io/keys). Your API key will look something like this: `15kkttz5HqJ4mDycjupJA5eiF2CMhdvIgexample`

These API keys are public and **not secret**. Usage of the API key can be restricted to a set of URLs.

= Showcase Privacy =

When this setting is set to "Invite Only" (the default), **each visitor to your WordPress page will enter a new, unique Showcase session**. Visitors can invite others into their Showcase session using the QR code or the Invite link in the three-bar application menu.
When this setting is set to "Public", **every visitor to your WordPress page will enter the same session**. Visitors to your Showcase can invite other people via their URL in their browser's address bar. Visitors can also invite others into that Showcase session using the QR code or the Invite link in the three-bar application menu.

= Voice Chat =

When this switch is enabled, and if your WordPress site uses a secure HTTPS connection, visitors to your Showcase can use Dolby.io Spatial Voice Chat to communicate with each other.

= Minimum Height =

This setting specifies the height of the 3D Showcase embedded within the page.

== Frequently Asked Questions ==

= What is Croquet Metaverse Web Showcase? =

[Croquet Metaverse Web Showcase](https://croquet.io/webshowcase) allows people to embed a multiuser, collaborative, 3D space into any website.

= How much does it cost? =

Web Showcase is free. You can obtain a Croquet API Key for free from [https://croquet.io/keys](https://croquet.io/keys) and paste it into the sidebar settings panel after selecting the Web Showcase WordPress block.

= What does the WordPress plugin do? =

The WordPress plugin allows you to interactively specify what assets to use for a Showcase and run a shared environment on your WordPress site.

== Screenshots ==

1. The Block Editor View.

2. The 3D space created on your page.

== Changelog ==

= 1.1.11 =
* Update libraries.

= 1.1.10 =
* Added a smarter content loading ordering logic.

= 1.1.9 =
* display loading spinner. supports High DPI displays.

= 1.1.8 =
* handles an issue on a commercial hosting site.

= 1.1.7 =
* extra logging. support WordPress 6.2.

= 1.1.6 =
* changed the banner image.

= 1.1.5 =
* fixed a typo.

= 1.1.4 =
* change the banner image.

= 1.1.3 =
* make invite only and public labels translatable.

= 1.1.2 =
* migrate the session flag to to invite only and public choices.

= 1.1.1 =
* remove camel-cased apiKey in user interface.

= 1.1.0 =
* fix typo in doc.

= 1.0.9 =
* show warning when API Key is malformed.

= 1.0.8 =

* fix typo.

= 1.0.7 =

* remove showcase name settings as it is now a random name.

= 1.0.6 =

* remove file type drop down.

= 1.0.5 =

* Use relative pathname for contents in the media library.

= 1.0.4 =

* Make sure that latest 6.1.1 is tested.

= 1.0.3 =

* First public version

= 1.0.2 =

* Add more settings. Handle errors better.

= 1.0.1 =

* Code style changes.

= 1.0.0 =

* The initial Release.
