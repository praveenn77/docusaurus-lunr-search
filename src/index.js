const fs = require('fs')
const os = require('os')
const path = require('path')
const lunr = require('lunr')
const { Worker } = require('worker_threads')
const Guage = require('gauge')

// local imports
const utils = require('./utils')

module.exports = function (context, options) {
  options = options || {};
  let languages
  return {
    name: 'docusaurus-lunr-search',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
    configureWebpack(config) {
      const generatedFilesDir = config.resolve.alias['@generated']
      languages = utils.generateLunrClientJS(generatedFilesDir, options.languages);
      // Ensure that algolia docsearch css is its own chunk
      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              algolia: {
                name: 'algolia',
                test: /algolia\.css$/,
                chunks: `all`,
                enforce: true,
                // Set priority higher than docusaurus single-css extraction
                priority: 60,
              },
            },
          },
        },
      };
    },
    async postBuild({ routesPaths = [], outDir, baseUrl, generatedFilesDir }) {
      console.log('docusaurus-lunr-search:: Building search docs and lunr index file')
      console.time('docusaurus-lunr-search:: Indexing time')

      const files = utils.getFilePaths(routesPaths, outDir, baseUrl)
      const searchDocuments = []
      const lunrBuilder = lunr(function (builder) {
        if (languages) {
          this.use(languages)
        } 
        this.ref('id')
        this.field('title', { boost: 200 })
        this.field('content', { boost: 2 })
        this.field('keywords', { boost: 100 })
        this.metadataWhitelist = ['position']

        const { build } = builder
        builder.build = () => {
          builder.build = build
          return builder
        }
      })

      const addToSearchData = (d) => {
        lunrBuilder.add({
          id: searchDocuments.length,
          title: d.title,
          content: d.content,
          keywords: d.keywords
        });
        searchDocuments.push(d);
      }

      await buildSearchData(files, addToSearchData)
      const lunrIndex = lunrBuilder.build()
      console.timeEnd('docusaurus-lunr-search:: Indexing time')
      
      console.log('docusaurus-lunr-search:: writing search-doc.json')
      fs.writeFileSync(
        path.join(outDir, 'search-doc.json'),
        JSON.stringify(searchDocuments)
      )
      console.log('docusaurus-lunr-search:: writing lunr-index.json')
      fs.writeFileSync(
        path.join(outDir, 'lunr-index.json'),
        JSON.stringify(lunrIndex)
      )
      console.log('docusaurus-lunr-search:: End of process')
    },
  };
};

function buildSearchData(files, addToSearchData) {
  if (!files.length) {
    return Promise.resolve()
  }
  let activeWorkersCount = 0
  const workerCount = Math.max(4, os.cpus().length * 2)
  
  console.log(`docusaurus-lunr-search:: Start scanning documents in ${Math.min(workerCount, files.length)} threads`)
  const gauge = new Guage()
  gauge.show('scanning documents...')

  return new Promise((resolve, reject) => {
    let activeIndex = 0

    const handleMessage = (maybeDoc, worker) => {
      gauge.pulse()
      if (maybeDoc) {
        addToSearchData(maybeDoc)
      } else {
        gauge.show(`scanned ${activeIndex} files out of ${files.length}`, activeIndex / files.length)

        if (activeIndex < files.length) {
          worker.postMessage(files[activeIndex])
          activeIndex += 1
        } else {
          worker.postMessage(null)
        }
      }
    }
  
    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(path.join(__dirname, 'html-to-doc.js'))
      worker.on('error', reject)
      worker.on('message', (doc) => {
        handleMessage(doc, worker)
      })
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Scanner stopped with exit code ${code}`));
        } else {
          // Worker #${i} completed their work in worker pool
          activeWorkersCount--
          if (activeWorkersCount <= 0) {
            // No active workers left, we are done
            gauge.hide()
            resolve()
          }
        }
      })
  
      if (activeIndex < files.length) {
        activeWorkersCount++
        worker.postMessage(files[activeIndex++])
        gauge.pulse()
      } else {
        break
      }
    }
  })
}
