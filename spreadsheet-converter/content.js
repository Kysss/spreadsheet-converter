// content.js
// should have limitations. 
// Should not used chrome.*APIs with the exceptions of 
// extension, i18n, runtime, and storage


/* 
** listens for browser action message passed from the background page
** upon receiving the message, get the window url, split it using delimter to get sheet ID
** subtitute it to get JSON URL following the google spreadsheet published json link format
** pass jsonURL back to background.js to pull data
*/ 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
	  //grab the current url
	  var href = window.location.href;
	  //console.log("||||||TESTING|||||||||" + href);
	  var prefix = "https://spreadsheets.google.com/feeds/cells/";
	  var postfix = "/default/public/values?alt=json";
	  var hrefSplit = href.split("/");
	  //the spreadsheetID is guarenteed the 5th element of the url, by '/' delimeter?
	  var spreadSheetID = hrefSplit[5];
	  var jsonURL = prefix + spreadSheetID + postfix;
      // This is to pass the url to the background.js
      chrome.runtime.sendMessage({"message": "send_json_URL", "url": jsonURL});	  
    }
  }
);