#!/bin/sh

for filename in files-txt/*; do
	basename=$(basename $filename)
	cat $filename | awk '/^[^#%]/{print $0}' > files-tmp/$basename
done
