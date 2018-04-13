// background.js

/*
** global variables
*/
var global_data_entries = {};
var max_row = 0;
var max_col = 0;
var arr = [];



/* 
** listens for browser action from the tab 
** and pass a message to content.js 
*/
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
	alert("Please make sure you are on a Google Spreadsheet page and have already published your Spreadsheet, or the converter won't be able to display anything.");
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


/* 
** listener for receiving the json URL from content.js and make a HTTP Request
** NOTE: console will not print but could be viewed through 
** the inspect views from the extension page itself --> inspect views --> background page
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  if( request.message === "send_json_URL" ) {
		  //display JSON url -- disable here
			//chrome.tabs.create({"url": request.url});
			var jsonURL = request.url;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', jsonURL);
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					//max_row = 0; //reinitialize
					//max_col = 0; //reinitialize
					var data = JSON.parse(this.responseText);
					//console.log(data.feed.entry);
					global_data_entries = data.feed.entry;
					updateMax(global_data_entries);
					fill2DEmptyArray();
					loadAllCellsIntoArray();
					//MAYBE? TODO: add user selection here (popup,dialog,etc)
					
					displayByCols();	
					
					setTimeout(function(){ 
					displayByRows();
					}, 1000);
										
				}
			};
			xhr.send();
		}

  });

/*
** function that iterate through the JSON objects (cells on spreadsheet)
** to get max rows and max columns (sometimes the spreadsheet might have missing values)
** for the purpose of displaying content by row or by column
*/
function updateMax(){
	max_row = 0; //reinitialize
	max_col = 0; //reinitialize
	console.log("global data entries length: " + global_data_entries.length);
	for(var i = 0; i < global_data_entries.length; i++){
		var currentCell = global_data_entries[i];
	    //	console.log("Current cell is" + currentCell);
		var currentRow = parseInt(currentCell.gs$cell.row);
		//console.log("current row:" + currentRow);
		var currentCol = parseInt(currentCell.gs$cell.col);
		//console.log("current Col:" + currentCol);
		///console.log("max row" + max_row);
		//console.log("max col" + max_col);
		
		//console.log(currentRow>=max_row);
		if(currentRow >= max_row){
			//console.log("current row is larger than max");
			max_row = currentRow;
		}
		if(currentCol >= max_col){
			//console.log("current column is larger than max");
			max_col = currentCol;
		}
		
	}

}  


/*
** function that fills the global 2D array with empty characters
** for initialization purpose
*/
function fill2DEmptyArray(){
	
	arr =[];
	for(var i = 0; i < max_row; i ++){
		arr.push(['']);
		for(var j = 0; j < max_col; j ++){
			arr[i][j] = '';
		}
	}
	console.log(max_row);
	console.log(max_col);
	console.log(arr.length);
	console.log(arr);
}

/*
** function that load all cells from the JSON object to the array
** in the corresponding order
** e.g.spreadsheet cell at [1,1] will be at position [0][0] in the array
*/
function loadAllCellsIntoArray(){
	for(var i = 0; i < global_data_entries.length; i ++){
		var currentCell = global_data_entries[i];
		var currentRow = currentCell.gs$cell.row;
		var currentCol = currentCell.gs$cell.col;
		arr[currentRow-1][currentCol-1] = currentCell.gs$cell.$t;
	}
}


/*
** function to create a new HTML page in a new tab 
** displaying info by rows (using first row as variables)
*/

function displayByRows(){
	var w = window.open();
	w.document.open("text/html");
	w.document.write("<!DOCTYPE html><html>");
	w.document.write("<head><title>Spreadsheet Display by Rows</title><h3>Spreadsheet Display by Rows</h3></head>");
//	w.document.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
//	w.document.write("<link rel='stylesheet' href='myStyle.css'>");
	w.document.write("<button id='copyButton' class='w3-button w3-white w3-border'> Copy All </button>");
	w.document.write("<hr>");

	w.document.write("<p id = 'text' class = 'fontFamily'>");
	
	for(var i = 1; i < max_row; i ++){   //data starts at second row
		for(var j = 0; j < max_col; j++){
			var label = arr[0][j];
			w.document.write(label.bold() + " : " + "<br />"+ arr[i][j] + "<br />");	
		}
		
		w.document.write("<br /><br />");
		
	}
	w.document.write("</p>");
	w.document.write("<script src='copyToClipboard.js'></script>")
	w.document.write("</html>");
	w.document.close(); //closing write stream
}


/*
** function to create a new HTML page in a new tab 
** displaying info by columns (using first column as variables)
*/
function displayByCols(){
	var w = window.open();
	w.document.open("text/html");
	w.document.write("<!DOCTYPE html><html>");
	w.document.write("<head><title>Spreadsheet Display by Columns</title><h3>Spreadsheet Display by Columns</h3></head>");
//	w.document.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
//	w.document.write("<link rel='stylesheet' href='myStyle.css'>");
	w.document.write("<button id='copyButton' class='w3-button w3-white w3-border'> Copy All </button>");
	w.document.write("<hr>");	
	w.document.write("<p id = 'text' class = 'fontFamily'>");
	for(var i = 1; i < max_col; i ++){        //data starts at second column
		for(var j = 0; j < max_row ; j++){
			var label = arr[j][0];
			w.document.write(label.bold() + " : " + "<br />" + arr[j][i] + "<br />");	
		}
		w.document.write("<br /><br />");
		
	}
	w.document.write("</p>");
	w.document.write("<script src='copyToClipboard.js'></script>")
	
	w.document.write("</html>");
	w.document.close(); //closing write stream
}



  

 


  