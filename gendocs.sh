#!/bin/sh
DOCDIR="/home/tatsh/dev/flourish-js-doc"
jsdoc -c=./jsdoc.conf
pushd "$DOCDIR"
git add .
git commit -m "Generated documentation"
git push -u origin gh-pages
popd
