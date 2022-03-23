
require('dotenv').config();
const soap = require('soap')
const url = process.env.SOAP_ENDPOINT

var bodyParser = require('body-parser')

const axios = require('axios');

const express = require('express')
const app = express()



app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json())

//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.


const port = 3004
const https = require("https");
  
const args = { name: 'value' }

const fs = require('fs');

const xmls= `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://sb.com.ua/webservices/">
<soapenv:Header/>
<soapenv:Body>
   <web:GetCountries>
      <web:args>
         <web:SystemId>mg</web:SystemId>
         <web:Language>en</web:Language>
         <web:LoginType>1</web:LoginType>
         <web:PointCode>43216288</web:PointCode>
         <web:UserLogin>clerk_TDBM</web:UserLogin>
         <web:UserPassword>123123</web:UserPassword>
      </web:args>
   </web:GetCountries>
</soapenv:Body>
</soapenv:Envelope>`;


var options = {
    url: `https://tmgs.mgprofix.com:443/swws/swws.asmx?wsdl`,
    method: 'POST',
    body: xmls,
    headers: {
      'Content-Type':'text/xml',
      SOAPAction:'http://sb.com.ua/webservices/GetCountries'
    },
    agentOptions: {
        pfx: fs.readFileSync(__dirname + '/certs/test_cert.pfx'),
        passphrase: '123123'
    }
};





let multer = require('multer');
const { json } = require('express/lib/response');
let upload = multer();


app.post('/soap-request',upload.fields([]),async (req,res)=>{

  try{
    const {method,xml} = req.body;
  const agent = new https.Agent({
    rejectUnauthorized: false,
    strictSSL: false,
    pfx: fs.readFileSync(__dirname + "/certs/test_cert.pfx"),
    passphrase: "123123"
    });
    const options={
      url:'https://tmgs.mgprofix.com:443/swws/swws.asmx?wsdl',
      method:'post',
      data:xml,
      httpsAgent: agent,
     headers:
       {
         'Content-Type': 'text/xml',
       SOAPAction:`http://sb.com.ua/webservices/${method}`
      }
     }
     const result = await axios(options);
     var xml2js = require('xml2js');
    var parser = new xml2js.Parser({explicitArray: false, trim: true});
    parser.parseString(result.data,(err,result)=>{
      if(err){
        res.json({
          message:'Error',
          err:err
        })
      }else{
        res.json(result);        
      }
      
    });
   
     

  }catch(err){
    console.log(err);
    res.json({
       message:'Error',
       stack:err.response.data?err.response.data:"Unknown error"
    })
  }
  
             
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

