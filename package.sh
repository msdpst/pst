#!/usr/bin/bash
set -e

cd $(dirname "$0")

outputFile=$(pwd)/ec.zip
if [ -f "$outputFile" ]; then
	echo "Won't overwrite existing file $outputFile!"
	exit 1;
fi

cd web
zip -r "$outputFile" calculator/ engine/ thirdparty/
