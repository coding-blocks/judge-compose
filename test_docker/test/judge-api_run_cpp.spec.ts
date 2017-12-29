import * as request from 'request'
import {expect} from 'chai'
import chai = require('chai')
import chaiString = require('chai-string')
import * as debug from 'debug'

const log = debug('test:api:langs')
chai.use(chaiString)

describe('judge-api:/api/runs [Language: C++]', () => {

  it('POST: Correct submission works', (done) => {
    let source = `
#include <iostream>
using namespace std;
int main () {
    char in[10];
    cin>>in;
    cout<<"Hello "<<in;
    return 0;
}
`
    let stdin = 'World'

    request.post(`http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/api/runs`,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'cpp',
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
    let source = 'SOME GARBAGE THAT IS NOT VALID CPP SOURCE'
    let stdin = 'World'

    request.post(`http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/api/runs`,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'cpp',
          stdin: (new Buffer(stdin).toString('base64'))
        }
      },
      (err, resp, body) => {
        log(body)
        expect(body.stdout).to.eq('')
        let stderr = (new Buffer(body.stderr, 'base64')).toString()
        expect(stderr).to.startWith('source.cpp:1:1: error')
        done()
      })
  })
})