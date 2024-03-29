const assert = require('assert')
const path = require('path')
const utils = require('../utils')

const outDir = '/out'
const baseUrl = 'http://example.com/'

describe('utils', () => {
  it('should not include routes matching globs provided in `excludeRoutes` options', () => {
    const routesPaths = [
      `${baseUrl}docs/tutorial/overview`,
      `${baseUrl}docs/tutorial/get-started`,
      `${baseUrl}docs/how-to/add-plugin`,
      `${baseUrl}docs/how-to/extract-value`,
      `${baseUrl}docs/explanation/solar-system`,
      `${baseUrl}docs/changelogs/index`,
      `${baseUrl}docs/changelogs/rovers/lunar`,
    ]

    const [files, meta] = utils.getFilePaths(routesPaths, outDir, baseUrl, {
      excludeRoutes: ['docs/changelogs/**/*']
    })

    assert.deepEqual(files.map(f => f.url), [
      `${baseUrl}docs/tutorial/overview`,
      `${baseUrl}docs/tutorial/get-started`,
      `${baseUrl}docs/how-to/add-plugin`,
      `${baseUrl}docs/how-to/extract-value`,
      `${baseUrl}docs/explanation/solar-system`,
    ])

    assert.equal(meta.excludedCount, 2)
  })

})
