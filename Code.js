
function fetchMetric(date, path, auth)
{ 
  var response = UrlFetchApp.fetch(`http://49396139c4bf.ngrok.io/${path}/${date}`, {
    'muteHttpExceptions': true,
    'headers': {
      'Authorization': `Basic ${auth}`
    },});
  return JSON.parse(response.getContentText())
}

function getCount(source, json) { 
  for (var index = 0; index < json.length; index++) {
    var element = json[index];
    if (element.source === source){
      return element.count
    }
  }
  return 0
}

function buildRow(date, json) { 
  return [date, getCount("TestProvince", json), getCount("foobar", json)]
}

function updateSheet(ss, date, sheetName, metricName, auth){

  var sheet = ss.getSheetByName(sheetName)
  var json = fetchMetric(date, metricName, auth )
  sheet.appendRow(buildRow(date,json))
}

function myFunction() {  
  var yesterday = Utilities.formatDate(new Date(new Date().getTime() - 86400000),'EST', 'yyyy-MM-dd')
  // var today = Utilities.formatDate(new Date(),'EST', 'yyyy-MM-dd')
  
  var ss = SpreadsheetApp.getActiveSpreadsheet()

  updateSheet(ss, yesterday, "OTK Generated", 'generated-keys', 'Zm9vOmJhcg==')
  updateSheet(ss, yesterday, "OTK Unclaimed", 'unclaimed-keys', 'Zm9vOmJhcg==')
}
