# docusaurus-lunr-search
Offline Search for Docusaurus V2

[Demo Website](https://lelouch77.github.io/docusaurus-lunr-search-multilang/)

 [![MIT Licence](https://img.shields.io/github/license/lelouch77/docusaurus-lunr-search)](#)

[![npm version](https://badge.fury.io/js/docusaurus-lunr-search.svg)](https://www.npmjs.com/package/docusaurus-lunr-search)

## Prerequisites
`worker_thread` is needed, suggested node version > 12.X
For older version of node use `docusaurus-lunr-search` version `2.1.0`
(`npm i docusaurus-lunr-search@2.1.0`)

## Sample
<p align="center">
  <img width="460" height="300" src="https://raw.githubusercontent.com/lelouch77/docusaurus-lunr-search/master/assets/search-offline.png">
</p>

## How to Use ?
1. Install this package
```
npm i docusaurus-lunr-search  --save
```
2. Then run docusaurus swizzle
```
npm run swizzle docusaurus-lunr-search SearchBar
```
3. Add the docusaurus-lunr-search plugin to your `docusaurus.config.js`
```
module.exports = {
  // ...
    plugins: [require.resolve('docusaurus-lunr-search')],
}
```
4. Then build your Docusaurus project
```
npm run build
```
5. Serve your application
```
npx http-server ./build
```

Note: Docusaurus search information can only be generated from a production build. Local development is currently not supported.

## Language options
```
module.exports = {
  // ...
    plugins: [[ require.resolve('docusaurus-lunr-search'), {
      languages: ['en', 'de'] // language codes
    }],
}
```
Supports all the language listed here https://github.com/MihaiValentin/lunr-languages

## Other options

### excludeRoutes

You can exclude certain routes from the search by using this option:

```
module.exports = {
  // ...
    plugins: [[ require.resolve('docusaurus-lunr-search'), {
      excludeRoutes: [
        'docs/changelogs/**/*', // exclude changelogs from indexing
      ]
    }],
}
```

Thanks to [`algolia/docsearch.js`](https://github.com/algolia/docsearch), I modified it to create this search component 

And thanks [cmfcmf](https://github.com/cmfcmf), I used the code from his library [docusaurus-search-local](https://github.com/cmfcmf/docusaurus-search-local) for multi-language support.

## Changelog
Checkout the [releases](https://github.com/lelouch77/docusaurus-lunr-search/releases) page for changelog. 
