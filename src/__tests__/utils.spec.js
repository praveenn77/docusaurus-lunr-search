const assert = require('assert')
const utils = require('../utils')

const baseUrl = 'http://example.com/'
const routesPaths = [
  `${baseUrl}docs/tutorial/overview`,
  `${baseUrl}docs/tutorial/get-started`,
  `${baseUrl}docs/how-to/add-plugin`,
  `${baseUrl}docs/how-to/extract-value`,
  `${baseUrl}docs/explanation/solar-sytem`,
  `${baseUrl}docs/changelogs/index`,
  `${baseUrl}docs/changelogs/rovers/lunar`,
]

describe('utils', () => {
  it('should exlude routes by exludeRoutes globs', () => {
    const [files, meta] = utils.getFilePaths(routesPaths, '/out', baseUrl, {
      excludeRoutes: ['docs/changelogs/**/*']
    })

    assert.deepEqual(files.map(f => f.url), [
      `docs/tutorial/overview`,
      `docs/tutorial/get-started`,
      `docs/how-to/add-plugin`,
      `docs/how-to/extract-value`,
      `docs/explanation/solar-sytem`,
    ])

    assert.equal(meta.excludedCount, 2)
  })
})
