#!/usr/bin/bash
set -e

type=$1
[[ $type != sre && $type != prod && $type != fit ]] && { echo "Usage: $0 sre (for SRE) | prod | fit (for UAT/FIT/Production)"; exit 1; }

cd $(dirname "$0")

outputFile=$(pwd)/ec-$type.zip
if [ -f "$outputFile" ]; then
	echo "Won't overwrite existing file $outputFile!"
	exit 1;
fi

cd web

if [[ $type == sre ]]; then
    zip -r "$outputFile" .
else
    zip -r "$outputFile" content/ec webadmin/css/ec webadmin/images/ec webadmin/includes/ec webadmin/scripts/ec
fi

