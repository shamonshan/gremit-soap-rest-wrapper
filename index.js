require('dotenv').config()
var bodyParser = require('body-parser')

const axios = require('axios')

const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.

const port = process.env.PORT || 3004
const https = require('https')

const fs = require('fs')

let multer = require('multer')
let upload = multer()

app.post('/soap-request', upload.fields([]), async (req, res) => {
    try {
        const { method, xml } = req.body
        const agent = new https.Agent({
            rejectUnauthorized: false,
            strictSSL: false,
            pfx: fs.readFileSync(__dirname + '/certs/test_cert.pfx'),
            passphrase: '123123',
        })
        const options = {
            url: process.env.SOAP_ENDPOINT,
            method: 'post',
            data: xml,
            httpsAgent: agent,
            headers: {
                'Content-Type': 'text/xml',
                SOAPAction: `http://sb.com.ua/webservices/${method}`,
            },
        }
        const result = await axios(options)
        var xml2js = require('xml2js')
        var parser = new xml2js.Parser({ explicitArray: false, trim: true })
        parser.parseString(result.data, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: 'Error',
                    err: err,
                })
            } else {
                res.json(result)
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Error',
            stack: err.response.data ? err.response.data : 'Unknown error',
        })
    }
})
app.listen(port, () => {
    console.log(` Soap wrapper listening on port ${port}`)
})
