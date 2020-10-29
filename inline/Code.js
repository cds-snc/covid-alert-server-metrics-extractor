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
  const provinces = { 
    ONApi : { count : 0 },
    ONPortal : { count : 0 },
    NL : { friendlyName : "NLPortal", count : 0 },
    NB : { friendlyName : "NBApi", count : 0 },
    SK : { friendlyName : "SKApi", count : 0 },
    MBPortal : { count : 0 },
    QCPortal : { count : 0 },
    MBApi : { count : 0 },
    NSPortal : { count : 0 },
    PEPortal : { count : 0 },
  }

  const events = {
    "OTKGenerated": JSON.parse(JSON.stringify(provinces)),
    "OTKClaimed": JSON.parse(JSON.stringify(provinces)),
    "OTKUnclaimed": JSON.parse(JSON.stringify(provinces)),
    "OTKRegenerated": JSON.parse(JSON.stringify(provinces)),
    "OTKExpired": JSON.parse(JSON.stringify(provinces)),
    "OTKExhausted": JSON.parse(JSON.stringify(provinces))
  }

  json.forEach((x) => {
    if (x.source === "TEST" || x.source === "CDS" ) {
      return
    }
    events[x.identifier][x.source].count = x.count;
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

    for (let eventKey of Object.keys(event)) {
      const e = event[eventKey]
      const name = e.friendlyName || eventKey
      sheet.appendRow([yesterday, name, e.count])
    }

  }

}
