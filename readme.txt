=== Croquet Metaverse Web Showcase ===
Contributors:      yoshikiohshima,zfox23
Tags:              metaverse, 3d, multiuser
Tested up to:      6.1.1
Stable tag:        1.0.7
Requires PHP:      7.0
License:           Apache 2.0
License URI:       https://www.apache.org/licenses/LICENSE-2.0

Croquet Metaverse Web Showcase allows you to embed a 3D multiplayer environment into your WordPress page.

== Description ==

Croquet Metaverse Web Showcase is a new WordPress block which allows people to embed a multiuser, collaborative, 3D space into a WordPress site. A WordPress author can drag images, videos, and PDF files into the block to add their content into the virtual 3D space.

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

= Croquet API Key =

The key is used to access the Croquet Reflector network.

= Showcase name =

A name that identifies the Web Showcase instance. Set a unique name for an instance if you would like to have multiple instances of Showcases that uses the same API Key.

= Create a unique session per visit =

When true, a visitor goes into a new Showcase session when they open the WordPress page. When false, they go into the same session. You can still share the session by clicking on the three bar menu within the Shwocase instance and scan the QR code or share the internal link.

= Voice Chat =

When true, and if the WordPress is hosted on a secure HTTP connection, the voice chat can be used.

== Frequently Asked Questions ==

= What is Croquet Metaverse Web Showcase? =

[Croquet Metaverse Web Showcase](https://croquet.io/webshowcase) allows people to embed a multiuser, collaborative, 3D space into any website.

= How much does it cost? =

Web Showcase is free. You can obtain the Croquet API Key for free from [https://croquet.io/keys](https://croquet.io/keys) and paste it into the sidebar settings panel after selecting the Web Showcase WordPress block.

= What does the WordPress plugin do? =

The WordPress plugin allows you to interactively specify what assets to use for a Showcase and run a shared environment on your WordPress site.

== Screenshots ==

1. The Block Editor View .

2. The 3D space created on your page.

== Changelog ==

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
