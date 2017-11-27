import * as request from 'request'
import {expect} from 'chai'

describe('judge-api:/api/langs', () => {
    describe('GET', () => {
        let langs = []
        let lang_slugs = []

        before(done => {
            request.get(`http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/api/langs`,
                (err, resp, bodyStr) => {
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