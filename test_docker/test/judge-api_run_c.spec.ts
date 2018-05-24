import * as request from 'request'
import {expect} from 'chai'
import chai = require('chai')
import chaiString = require('chai-string')
import * as debug from 'debug'
import {CoreOptions} from 'request'

const log = debug('test:api:langs')
chai.use(chaiString)

const reqOptions: CoreOptions = {
  baseUrl: `http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/`,
  headers: {
    'Authorization': 'Bearer 7718330d2794406c980bdbded6c9dc1d'
  }
}

describe('judge-api:/api/runs [Language: C]', () => {

  it('POST: Correct submission works', (done) => {
    let source = `
#include <stdio.h>
int main () {
    char in[10];
    scanf("%s", in);
    printf("Hello %s", in);
    return 0;
}
`
    let stdin = 'World'

    request.post(`/api/runs`, reqOptions,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'c',
          stdin: (new Buffer(stdin).toString('base64'))
        }
      },
      (err, resp, body) => {
        log(body)
        expect(body.stderr).to.eq('')
        let stdout = (new Buffer(body.stdout, 'base64')).toString()
        expect(stdout).to.eq('Hello World')
        done()
      })
  })
  it('POST: Compilation error is in stderr', (done) => {
    let source = 'SOME GARBAGE THAT IS NOT VALID C SOURCE'
    let stdin = 'World'

    request.post(`/api/runs`, reqOptions,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'c',
          stdin: (new Buffer(stdin).toString('base64'))
        }
      },
      (err, resp, body) => {
        log(body)
        expect(body.stdout).to.eq('')
        let stderr = (new Buffer(body.stderr, 'base64')).toString()
        expect(stderr).to.startWith('source.c:1:1: error:')
        done()
      })
  })
})
