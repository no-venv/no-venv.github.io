cd scripts;
npx tsc;
esbuild js/index.js --bundle --minify --outfile=../index.js --allow-overwrite;
rm -r js
cd ..;
