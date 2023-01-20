This directory contains the source code of Croquet Metaverse Web Showcase.

`croquet-metaverse-web-showcase.php` is the main file that has the registration of plugin/script and the php side callback.

The directory structure was created by the "gutenpride" command.

The `src` directory contains JS code and the block specifications. `npm build` or `npm start` compiles the files into the `dist` directory`.

The `languages` contains the pot file. That was created by running:

    wp i18n make-pot . languages/croquet-metaverse-web-showcase.pot

The file is used here:

https://translate.wordpress.org/projects/wp-plugins/croquet-metaverse-web-showcase/stable/

to provide translation online.

To make a zip file, run `npm run build` and then run `npm run plugin-zip`.

To copy contains to SVN, copy those directories, `build`, `src`, `languages`, `package.json`, `croquet-metaverse-web-showcase.php`, `readme.txt`, `readme.md` and `Development.md` to the `trunk` directory.

Then, based on the version number, run:

   svn cp trunk tags/1.x.y

and

   svn ci -m 'version 1.x.y'
