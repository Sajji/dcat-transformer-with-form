var request = require('request');
var fs = require('fs');
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
