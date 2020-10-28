function fetchMetric(date, url,  creds)
{ 
  const response = UrlFetchApp.fetch(`${url}${date}`, {
    'muteHttpExceptions': false,
    'headers': {
      'Authorization': `Basic ${creds}`
    },});
  return JSON.parse(response.getContentText())
}

function parseJson(json){
  const events = {
    "OTKClaimed": [],
    "OTKUnclaimed": [],
    "OTKRegenerated": [],
    "OTKGenerated": [],
    "OTKExpired": [],
    "OTKExhausted": []
  }
  json.forEach(function(x) {
    events[x.identifier].push({
      source : x.source,
      count : x.count
    })
  })
  return events
}

/*
* @param {string[]} lookupKeys - The list of province identifiers to lookup
* @param {string} url - The metric endpoint
* @param {string} creds - Base64 Encoded string for basic auth format of encoded string is uname:pword
*
*/
function updateSheet(url, creds) {

  const yesterday = Utilities.formatDate(new Date(new Date().getTime() - 86400000),'EST', 'yyyy-MM-dd')
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const json = fetchMetric(yesterday, url, creds)
  const events = parseJson(json)

  for (let key of Object.keys(events)) {
    const sheet = ss.getSheetByName(key)
    const event = events[key]

    event.forEach(e => {
      sheet.appendRow([yesterday, e.source, e.count])
    })
  }

}
