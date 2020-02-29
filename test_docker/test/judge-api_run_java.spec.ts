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

describe('judge-api:/api/runs [Language: Java]', () => {

  it('POST: Correct submission works', (done) => {
    let source = `
import java.lang.*;
import java.util.*;

public class Main{
	public static void main (String[] args) throws java.lang.Exception {
		Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        System.out.println("Hello " + input);
	}
}
`
    let stdin = 'World'

    request.post(`/api/runs`, Object.assign(reqOptions,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'java8',
          stdin: (new Buffer(stdin).toString('base64'))
        }
      }),
      (err, resp, body) => {
        log(body)
        expect(body.stderr).to.eq('')
        let stdout = (new Buffer(body.stdout, 'base64')).toString()
        expect(stdout).to.eq('Hello World')
        done()
      })
  })
  it('POST: Compilation error is in stderr', (done) => {
    let source = 'SOME GARBAGE THAT IS NOT VALID JAVA SOURCE'
    let stdin = 'World'

    request.post(`/api/runs`, Object.assign(reqOptions,
      {
        json: {
          source: (new Buffer(source).toString('base64')),
          lang: 'c',
          stdin: (new Buffer(stdin).toString('base64'))
        }
      }),
      (err, resp, body) => {
        log(body)
        expect(body.stdout).to.eq('')
        let stderr = (new Buffer(body.stderr, 'base64')).toString()
        expect(stderr).to.startWith('Main.java:1: error:')
        done()
      })
  })
})
