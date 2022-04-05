const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
var jsonata = require("jsonata");
var data = require ("./defense.json");
var request = require('request');
const fsPromises = fs.promises;

app.listen(3001, () => {
  console.log("Application started and Listening on port 3001");
});

// server css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  var subName = req.body.yourname
 // var subEmail = req.body.youremail;
 res.send("DONE!");
// fs.writeFileSync('./test.txt', subName);

var communityDomain = (
  `[
    {
        "resourceType": "Community",
        "identifier": {
             "name": "${subName}"
            }
    },
    {
        "resourceType": "Domain",
        "identifier": {
             "name": "${subName}-Domain",
              "community": {
                  "name": "${subName}"
                }
            },
            "type": {
                "name": "Data Usage Registry"
                }
    }
`
);

var expression = jsonata(`
dataset.{
    "resourceType": "Asset",
    "identifier": {
        "name": title & "---" & identifier,
        "domain": {
            "name": "${subName}-Domain",
            "community": {
                "name": "${subName}"
            }
        }
    },
    "type": {
        "name": "Data Set"
    },
    "attributes": {
    "Description": [{"value": "Description: "&description}],
    "DCAT:title": [{"value":  "Title: "&title}],
    "DCAT:landingPage": [{"value": "Landing Page: "&landingPage}],
    "DCAT:description": [{"value":  "Description: "&description}],
    "DCAT:accessLevel": [{"value":  "Access Level: "&accessLevel}],
    "DCAT:distributionURL": [{"value":  "Distribution URL: "&distribution.downloadURL}],
    "DCAT:contactPointFullName": [{"value":  "Contact: "&contactPoint.fn}],
    "DCAT:contactPointEmail": [{"value":  "Contact Email: "&contactPoint.hasEmail}],
    "DCAT:programCode": [{"value":  "Program Code: "&programCode[0]}],
    "DCAT:bureauCode": [{"value":  "Bureau Code: "&bureauCode[0]}],
    "DCAT:publisher": [{"value":  "Published By: "&publisher.name}]
    }
}
`);



var result = expression.evaluate(data);
//console.log(result);

var stringy = (JSON.stringify(result, null, 2));
//console.log(stringy);

var altogetherNow = (
  `
    ${communityDomain},${stringy}]
  `
);

let finalz = altogetherNow.replace(",{",",");

//fs.writeFileSync('./DEFENSEImport.json', altogetherNow);
async function jerk() {

  fs.writeFileSync('./fixed.json', finalz);

}
jerk();

});


var options = {
  'method': 'POST',
  'url': 'http://localhost:4400/rest/2.0/import/json-job',
  'headers': {
    'Authorization': 'Basic QWRtaW46YWRtaW4=',
    'Cookie': 'JSESSIONID=62be2896-c060-4adc-8b24-f66b1a15c806'
  },
  formData: {
    'file': {
      'value': fs.createReadStream('fixed.json'),
      'options': {
        'filename': '/fixed.json',
        'contentType': null
      }
    }
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});