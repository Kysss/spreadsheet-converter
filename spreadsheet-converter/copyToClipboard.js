

document.getElementById("copyButton").addEventListener("click",copyToClipboard);

/*function copyToClipboard(){
	console.log("function fired.");
	var copyText = document.getElementById("text").innerHTML;
	console.log(copyText);
	var inputText = document.createElement("input");
	document.body.appendChild(inputText);
	inputText.value = copyText;
	inputText.select();
	document.execCommand("Copy");
	alert("Successfully copied the text to clipboard.");
}*/

// references: https://jsfiddle.net/jdhenckel/km7prgv4/3/

function copyToClipboard(){
	var str = document.getElementById("text").innerHTML;
	function listener(e){
		e.clipboardData.setData("text/html",str); //setData to put two copies into the same clipboard
		e.clipboardData.setData("text/plain",str); // so that users can either use plain or rich text editor
		e.preventDefault();
	}
	document.addEventListener("copy",listener);
	document.execCommand("copy");
	document.removeEventListener("copy",listener);
	alert("Successfully copied the text to clipboard.");
};
