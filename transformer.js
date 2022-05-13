var jsonata = require("jsonata");
const fs = require("fs");

//**********MUST FILL IN THESE VARIABLES !!!************

                const comName = "COMMUNITY-NAME";
                var data = require ("FILENAME w PATH");

//***********************************************************

var communityDomain = (
    `[
      {
          "resourceType": "Community",
          "identifier": {
               "name": "${comName}"
              }
      },
      {
          "resourceType": "Domain",
          "identifier": {
               "name": "${comName}-Domain",
                "community": {
                    "name": "${comName}"
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
              "name": "${comName}-Domain",
              "community": {
                  "name": "${comName}"
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
  
  //EXECUTE JSONATA MAGIC
  var result = expression.evaluate(data);
        //console.log(result);
  
//CONVERT JSONATA RESULT TO JSON
  var stringy = (JSON.stringify(result, null, 2));
        //console.log(stringy);
  
//STITCH THE TWO OBJECTS TOGETHER 
//(combining community and domain structure with JSONATA results)
  var altogetherNow = (
    `
      ${communityDomain},${stringy}]
    `
  );
   let finalz = altogetherNow.replace(",{",",");
 
 //WRITE THE FINAL PRODUCT TO FILE
 //filename based on comName variable
   fs.writeFileSync(`./${comName}--IMPORT.json`, finalz)