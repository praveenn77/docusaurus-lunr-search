
# docusaurus-lunr-search
Offline Search for Docusaurus V2

[Demo Website](https://lelouch77.github.io/docusaurus-lunr-search-demo/)

 [![MIT Licence](https://img.shields.io/github/license/lelouch77/docusaurus-lunr-search)](#)

[![npm version](https://badge.fury.io/js/docusaurus-lunr-search.svg)](https://www.npmjs.com/package/docusaurus-lunr-search)

## Sample
<p align="center">
<img width="548" alt="image" src="https://user-images.githubusercontent.com/20218070/211132504-07370011-2b3b-434e-8e2d-10159672a4eb.png">
</p>


## Prerequisites
`worker_thread` is needed, suggested node version > 12.X
For older version of node use `docusaurus-lunr-search` version `2.1.0`
(`npm i docusaurus-lunr-search@2.1.0`)

## How to Use ?
1. Install this package
```
npm i docusaurus-lunr-search  --save
```
2. Then run `npm install` to update, build, and link the packages
```
npm install
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
npm run serve 
```
or

```
npx http-server ./build
```

Note: Docusaurus search information can only be generated from a production build. Local development is currently not supported.

## Using an option (eg. `languages`) in the plugin
```
module.exports = {
  // ...
    plugins: [[ require.resolve('docusaurus-lunr-search'), {
      languages: ['en', 'de'] // language codes
    }]],
}
```
Supports all the language listed here https://github.com/MihaiValentin/lunr-languages

## Options available

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `languages` | `Array` | `['en']` | Language codes to use for stemming, Supports all the language listed here https://github.com/MihaiValentin/lunr-languages |
| `indexBaseUrl` | `Boolean` | `false` | Base url will not indexed by default, if you want to index the base url set this option to `true` |
| `excludeRoutes` | `Array` | `[]` | Exclude certain routes from the search |
| `includeRoutes` | `Array` | `[]` | Include only specific routes for search |
| `stopWords` | `Array` | `[]` | Add stop words(words that are exclude from search result) to the search index |
| `excludeTags` | `Array` | `[]` | Exclude certain tags from the search |
| `disableVersioning` | `Boolean` | `false` | Docs versions are displayed by default. If you want to hide it, set this plugin option to `true` |

## Using FrontMatter
By default the library will search for heading only in the children of `.markdown` element. 
If you are using a FrontMatter and you have headings that are encapsulated by other elements, such as divs, then add the attribute `data-search-children` to the elements having headings. 

In this update, we have enhanced the `getSectionHeaders` function to provide better support for nested content structures. This modification allows the function to search for section headers not only in the immediate children of an element but also in its descendants. 

Check this [issue #115](https://github.com/praveenn77/docusaurus-lunr-search/issues/115) for more detail 



Thanks to [`algolia/docsearch.js`](https://github.com/algolia/docsearch), I modified it to create this search component 

And thanks [cmfcmf](https://github.com/cmfcmf), I used the code from his library [docusaurus-search-local](https://github.com/cmfcmf/docusaurus-search-local) for multi-language support.

## Changelog
Checkout the [releases](https://github.com/lelouch77/docusaurus-lunr-search/releases) page for changelog. 
