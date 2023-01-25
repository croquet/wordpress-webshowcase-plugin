#!/bin/sh

DEST=${1} # the SVN plugin directory, the parent of trunk and tags

if [ -z ${DEST} ]
then
    echo "specify the wordpress plugin dir"
    exit 1;
fi

VERSION=`grep "Version" croquet-metaverse-web-showcase.php | sed 's/^.*:[^.0-9]*\([0-9.]*\)/\1/'`

echo $VERSION

npm run build

(cd ${DEST} && svn up)
rm -rf ${DEST}/trunk/*
rm -rf ${DEST}/assets/*
cp assets/* ${DEST}/assets/
cp -r build croquet-metaverse-web-showcase.php languages package.json readme.md readme.txt src ${DEST}/trunk
(cd ${DEST} && svn cp trunk tags/${VERSION})
