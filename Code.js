
function fetchMetric(date)
{ 
  const response = UrlFetchApp.fetch(`https://retrieval.wild-samphire.cdssandbox.xyz/events/${date}`, {
    'muteHttpExceptions': false,
    'headers': {
      'Authorization': `Basic ejhvUDBOUm5iSjhQMWZyUEdRcmQ6MDIwMURIM0c1TWxTbklJSnMwSUI=`
    },});
  return JSON.parse(response.getContentText())
}

function parseJson(json){
  const events = {
    "OTKClaimed": {},
    "OTKUnclaimed": { },
    "OTKRegenerated": { },
    "OTKGenerated": { },
    "OTKExpired": { },
    "OTKExhausted": { }
  }
  json.forEach(function(x) {
    events[x.identifier][x.source] = x.count
  })
  return events
}

function getValue(source, event){
  const val = event[source]
  return val ? val : 0
}

function myFunction() {

  const yesterday = Utilities.formatDate(new Date(new Date().getTime() - 86400000),'EST', 'yyyy-MM-dd')
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const json = fetchMetric(yesterday)
  const events = parseJson(json)

  for (let key of Object.keys(events)) {
    const sheet = ss.getSheetByName(key)
    const event = events[key]
    sheet.appendRow([yesterday, getValue('gen',event), getValue('cdsdemo', event), getValue('ONApi', event)])
  }

}
