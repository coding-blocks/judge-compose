import * as request from 'request'
import {expect} from 'chai'

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
        let stdin = `World`;

        request.post(`http://${process.env.JUDGEAPI_HOST}:${process.env.JUDGEAPI_PORT}/api/runs`,
            {
                json: {
                    source: (new Buffer(source).toString('base64')),
                    lang: 'cpp',
                    stdin: (new Buffer(stdin).toString('base64'))
                }
            },
            (err, resp, body) => {
                expect(body.stderr).to.eq('')
                let stdout = (new Buffer(body.stdout, 'base64')).toString()
                expect(stdout).to.eq('Hello World')
                done()
            })
    })
})