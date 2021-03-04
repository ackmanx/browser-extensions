# Create a production bundle
yarn build

# Delete dev-related files
rm build/manifest.json
mv build/manifest-prod.json build/manifest.json
rm build/images/*-dev.png

# Remove old package
rm zip-for-chrome-store.zip

# Create zip to upload to Chrome Store
zip -r zip-for-chrome-store.zip build/*
