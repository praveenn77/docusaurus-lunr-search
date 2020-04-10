# docusurus-lunr-search
Offline Search for Docusurus V2 
Demo - https://lelouch77.github.io/docusurus-lunr-search-demo/
## Sample
<p align="center">
  <img width="460" height="300" src="https://raw.githubusercontent.com/lelouch77/docusurus-lunr-search/master/assets/search-offline.png">
</p>

## How to Use ?
1. Install this package
```
npm i docusurus-lunr-search --save
```
2. Then run docusurus swizzle
```
npm run swizzle docusurus-lunr-search SearchBar
```
3. Add the docusurus-lunr-search plugin to your `docusaurus.config.js`
```
module.exports = {
  // ...
  plugins: [
    'docusurus-lunr-search'
  ]
}
```
4. Then build your Docusurus project
```
npm run build
```
5. Serve your application
```
npx http-server ./build
```

Note: Docusaurus search information can only be generated from a production build. Local development is currently not supported.

Thanks to [`algolia/docsearch.js`](https://github.com/algolia/docsearch), I modified it to create this search component 
