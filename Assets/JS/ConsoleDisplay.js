var consoleDisplay = new ConsoleDisplay();

function ConsoleDisplay(){
	this.display = [
		document.querySelector("#consoleDisplay0"),
		document.querySelector("#consoleDisplay1"),
		document.querySelector("#consoleDisplay2"),
		document.querySelector("#consoleDisplay3"),
		document.querySelector("#consoleDisplay4"),
	];
};

//Displays the message on the bottom row of the console (and moves up the old messages)
ConsoleDisplay.prototype.pushMessage = function(message){	
	//Don't display same message multiple times...
	//TODO - Add a counter (x2... x3 etc) to show how many times message would have been displayed
	if(!(this.display[0].innerText === "> " + message)){
		for(var i = this.display.length - 1; i >= 1; i--){
			this.display[i].innerText = ". " + this.display[i-1].innerText.substring(2);
		}
		this.display[0].innerText = "> " + message;
	}
	
};
