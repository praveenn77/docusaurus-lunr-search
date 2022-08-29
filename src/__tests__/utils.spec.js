const assert = require('assert')
const utils = require('../utils')

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

    const [files, meta] = utils.getFilePaths(routesPaths, '/out', baseUrl, {
      excludeRoutes: ['docs/changelogs/**/*']
    })

    assert.deepEqual(files.map(f => f.url), [
      `docs/tutorial/overview`,
      `docs/tutorial/get-started`,
      `docs/how-to/add-plugin`,
      `docs/how-to/extract-value`,
      `docs/explanation/solar-system`,
    ])

    assert.equal(meta.excludedCount, 2)
  })
})
