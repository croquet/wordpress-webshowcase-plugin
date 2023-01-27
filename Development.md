This directory contains the source code of Croquet Metaverse Web Showcase.

`croquet-metaverse-web-showcase.php` is the main file that has the registration of plugin/script and the php side callback.

The directory structure was created by the "gutenpride" command.

The `src` directory contains JS code and the block specifications. `npm build` or `npm start` compiles the files into the `dist` directory`.

The `languages` contains the pot file. That was created by running:

    wp i18n make-pot . languages/croquet-metaverse-web-showcase.pot

(Make sure that you run this after `npm run build` but not `npm start` the latter creates some more files for debugging and make-pot looks at them also.)

The file is used here:

https://translate.wordpress.org/projects/wp-plugins/croquet-metaverse-web-showcase/stable/

to provide translation online.

To make a zip file, run `npm run build` and then run `npm run plugin-zip`.

The copy-to-svn.sh copies files to the specified destination, which is assumed to be a SVN directory for the plugin.  Run

   ./copy-to-svn.sh ~/src/wordpress-showcase # or any directory of SVN

to copy `build`, `src`, `languages`, `package.json`, `croquet-metaverse-web-showcase.php`, `readme.txt`, `readme.md` to the `trunk` directory, create the tagged version specified in croquet-metaverse-web-showcase.php.

Then, check things with

   svn status

and

   svn ci -m 'version 1.x.y'

