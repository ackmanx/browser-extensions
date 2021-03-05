# Verify we're running in the correct directory
if [ ! -d 'src' ]; then
    echo 'Run this prep script from project root'
    exit 1
fi

# Create a production bundle
yarn build

# Delete dev-related files
rm build/manifest.json
mv build/manifest-prod.json build/manifest.json
rm build/images/*-dev.png

# Remove old package
rm zip-for-chrome-store.zip

cd build

# Create zip to upload to Chrome Store
zip -r ../zip-for-chrome-store.zip *

cd ..

# Delete the build directory created so I don't get confused between it and the store version I have installed
rm -rf build
