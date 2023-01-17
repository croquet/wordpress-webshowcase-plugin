![Banner](./assets/banner-1544x500.png)

# Croquet Metaverse Web Showcase - WordPress Plugin

|                          | Data                                        |
|--------------------------|---------------------------------------------|
| Contributors             | yoshikiohshima,zfox23                       |
| Tags                     | metaverse, 3d, multiuser                    |
| WordPress Version Tested | 6.1.0                                       |
| Stable Tag               | 1.0.3                                       |
| Requires PHP             | 7.0                                         |
| License                  | Apache 2.0                                  |
| License URI              | [https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0) |

## Description

Croquet Metaverse Web Showcase is a new WordPress block which allows people to embed a multiuser, collaborative, 3D space into a WordPress site. A WordPress author can drag images, videos, and PDF files into the block to add their content into the virtual 3D space.

Visit [https://croquet.io/webshowcase](https://croquet.io/webshowcase) for more information about Web Showcase.

### Features

* Low-latency, real-time virtual collaboration embedded within a WordPress post or page.
* The WordPress block offers a list editor to arrange your space's assets.

### Privacy and Security

* To use this plugin, you must obtain an API key from [https://croquet.io/keys](https://croquet.io/keys).
    * These API keys are public and **not secret**. Usage of the API key can be restricted to a set of URLs.
* Croquet's website uses cookies as per our [Privacy Policy](https://croquet.io/privacy.html).
* Croquet Corporation does not track users.
* Croquet Corporation does not store or control the assets used in a Web Showcase.
* Users in the same session can see the avatars controlled by other users.
* Users in the same session may join a spatialized voice chat to talk.

### Usage
1. Visit [https://croquet.io/keys](https://croquet.io/keys) and create a production API Key.
    * These API keys are public and **not secret**. Usage of the API key can be restricted to a set of URLs.
2. Instantiate a Croquet Metaverse Web Showcase block in the WordPress block editor
3. Paste the API key into the sidebar settings.
4. Remove the default Showcase contents provided by the plugin with the X buttons.
5. Add your own image/video/PDF content by specifying the URL of the asset or by dragging and dropping a file into the block.

## Settings

### Croquet API Key

The key is used to access the Croquet Reflector network.

### Showcase name

A name that identifies the Web Showcase instance. Set a unique name for an instance if you would like to have multiple instances of Showcases that uses the same API Key.

### Create a unique session per visit

When true, a visitor goes into a new Showcase session when they open the WordPress page. When false, they go into the same session. You can still share the session by clicking on the three bar menu within the Shwocase instance and scan the QR code or share the internal link.

### Voice Chat

When true, and if the WordPress is hosted on a secure HTTP connection, the voice chat can be used.

## Screenshots

### The Block Editor View

  ![The block editor view](./assets/screenshot-1.png)
  
### Web Showcase Embedded in a Wordpress Page

  ![The 3D space created on your page](./assets/screenshot-2.png)

## Frequently Asked Questions

### What is Croquet Metaverse Web Showcase?

[Croquet Metaverse Web Showcase](https://croquet.io/webshowcase) allows people to embed a multiuser, collaborative, 3D space into any website.

### How much does Web Showcase cost?

Web Showcase is free. You can obtain the Croquet API Key for free from [https://croquet.io/keys](https://croquet.io/keys) and paste it into the sidebar settings panel after selecting the Web Showcase WordPress block.

### What does the WordPress plugin do?

The WordPress plugin allows you to interactively specify what assets to use for a Showcase and run a shared environment on your WordPress site.


## Changelog

### 1.0.3
* First public version

### 1.0.2
* Add more settings. Handle errors better.

### 1.0.1
* Code style changes.

### 1.0.0
* The initial submission 🎉
