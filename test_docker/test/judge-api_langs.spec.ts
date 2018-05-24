import * as request from 'request'
import {expect} from 'chai'
import * as debug from 'debug'
import {CoreOptions} from 'request'

const log = debug('test:api:langs')
const reqOptions: CoreOptions = {
  baseUrl: `http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/`,
  headers: {
    'Authorization': 'Bearer 7718330d2794406c980bdbded6c9dc1d'
  }
}

describe('judge-api:/api/langs', () => {
  describe('GET', () => {
    let langs = []
    let lang_slugs = []

    before(done => {
      request.get('/api/langs', reqOptions,
        (err, resp, bodyStr) => {
          if (err) throw err

          log(bodyStr)

          langs = JSON.parse(bodyStr)
          lang_slugs = langs.map(lang => lang.lang_slug)
          done()
        })
    })

    it('we support C', () => {
      expect(lang_slugs.indexOf('c')).to.be.greaterThan(-1)

    })

    it('we do not support C#', () => {
      expect(lang_slugs.indexOf('csharp')).to.be.eq(-1)
    })
  })

})
