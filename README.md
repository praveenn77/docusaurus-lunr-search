# docusurus-lunr-search
Offline Search for Docusurus V2

## How to Use ?
1. Install this package
```
npm i docusurus-lunr-search --save
```
2. Then run docusurus swizzle
```
npm run swizzle docusurus-lunr-search SearchBar
```
3. Copy the [`build-search-data.js`](./build-search-data.js) to the root folder of your project
4. Then build your Docusurus project
```
npm run build
```
5. Create the search data using by running `build-search-data.js`
```
node build-search-data.js
```
6. You are done!.
\
 Now you can build your project again with new `search-data.js`
```
npm run build
//or 
npm start
```
## Sample
<p align="center">
  <img width="460" height="300" src="https://raw.githubusercontent.com/lelouch77/docusurus-lunr-search/master/assets/search-offline.png">
</p>

Thanks to [`algolia/docsearch.js`](https://github.com/algolia/docsearch), I modified it to create this search component 
