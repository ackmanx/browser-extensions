#!/bin/bash

# This is intended to be ran from the src/misc directory.
# It will copy files for distribution, zip and then delete them
#
# Expected file tree for running:
#
#  project-name
#    dist
#    src
#      misc (start here)
#

PROJECT_FOLDER='..'
SRC_FOLDER='../src'
DIST_FOLDER='../dist'
ZIP_NAME='zip_for_chrome_store.zip'

#verify we're running in the correct directory
if [ ! -d $PROJECT_FOLDER/src ]; then
    echo 'Run this script from misc folder'
    exit 1
fi

#clean start in case something was left behind
rm -rf $DIST_FOLDER/*
if [ -f $PROJECT_FOLDER/$ZIP_NAME ]; then
    rm $PROJECT_FOLDER/$ZIP_NAME
fi

#get a ranom number to use as temp file name
tempFile=`echo $RANDOM`

#output list of files to ignore to temp file
echo '.git' >> $tempFile
echo '.gitignore' >> $tempFile #todo this is being ignored and shouldn't be
echo '.DS_Store' >> $tempFile #this is generated automatically by OS X even if I don't copy it
echo 'manifest.json' >> $tempFile #we want manifest-prod.json instead, we isn't excluded. we rename it later to manifest.json
echo 'project.sublime-project' >> $tempFile
echo 'project.sublime-workspace' >> $tempFile
echo 'README.md' >> $tempFile
echo 'misc' >> $tempFile
echo 'test' >> $tempFile
echo 'images/source' >> $tempFile
echo $tempFile >> $tempFile #we don't need to copy the temp file to dist

echo '*****************************************************************************************************************'
echo 'Copy files to temporary folder...'
#rsync archive verbose, show progress, excluding list of files, from src directory, to dist
rsync --archive --quiet --progress --exclude-from $tempFile $SRC_FOLDER/* $DIST_FOLDER

echo 'Renaming manifest-prod.json to manifest.json...'
mv $DIST_FOLDER/manifest-prod.json $DIST_FOLDER/manifest.json

if [ $? -ne 0 ]; then
    echo 'Error encountered! Aborting.'
    rm $tempFile
    rm -rf $DIST_FOLDER
    exit 1
fi

echo 'Zipping up temporary folder...'

#zip command with a target path includes the folder name in the zip
#chrome store requires manifest.json at root level in the zip, so cannot have folder first
#therefore, we cd there and zip everything, then go back
cd $DIST_FOLDER

echo ''

zip -r ../$ZIP_NAME *
cd ../misc

echo 'Removing temporary folder...'

#clean up
rm $tempFile
rm -rf $DIST_FOLDER

echo ''
echo 'Extension is ready to upload to the Chrome Store!'
echo '...but you should probably test it first :)'
echo '*****************************************************************************************************************'