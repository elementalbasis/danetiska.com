#!/bin/bash

#for filename in *.md; do
find . -type f -name "*.md" | while read -r filename; do
	echo $filename
	export CONTENT="$(pandoc $filename)"
	newfilename=$(basename $filename .md).html
	envsubst '${CONTENT}' < template.html > $newfilename
done

rm README.html
