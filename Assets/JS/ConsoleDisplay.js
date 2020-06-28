var consoleDisplay = new ConsoleDisplay();

function ConsoleDisplay(){

	this.messages = ["Maybe Try Drinking Some Coffee", "", "", "", ""];
	this.bottomMessageIndex = 0;
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
	//Don't show the same cannot afford message multiple times in a row
	if(!(message.length > 16 && message.substring(0, 17) === "You Cannot Afford" && consoleDisplay.messages[0] === message)) {
		consoleDisplay.messages.unshift(message);
		consoleDisplay.resetPosition();
	}
};

ConsoleDisplay.prototype.moveUp = function() {
	consoleDisplay.bottomMessageIndex += 4;
	if(consoleDisplay.bottomMessageIndex + 4 > consoleDisplay.messages.length - 1)
	{
		consoleDisplay.bottomMessageIndex = consoleDisplay.messages.length - 5;
	}

	consoleDisplay.updateMessages();
};

ConsoleDisplay.prototype.moveDown = function() {
	consoleDisplay.bottomMessageIndex -= 4;
	if(consoleDisplay.bottomMessageIndex < 0)
		consoleDisplay.bottomMessageIndex = 0;
	consoleDisplay.updateMessages();
};

ConsoleDisplay.prototype.resetPosition = function() {
	consoleDisplay.bottomMessageIndex = 0;
	consoleDisplay.updateMessages();
};

ConsoleDisplay.prototype.updateMessages = function() {
	//Max of 50 Messages saved
	if(consoleDisplay.messages.length > 50)
		consoleDisplay.messages.pop();

	for(var i = consoleDisplay.display.length - 1; i >= 0; i--){
		if(i === 0 && consoleDisplay.bottomMessageIndex === 0) {
			consoleDisplay.display[i].innerText = "> " + consoleDisplay.messages[consoleDisplay.bottomMessageIndex + i];
			consoleDisplay.display[i].classList.add("highlight")
		}
		else {
			consoleDisplay.display[i].innerText = ". " + consoleDisplay.messages[consoleDisplay.bottomMessageIndex + i];

			if(i === 0)
				consoleDisplay.display[i].classList.remove("highlight")
		}
	}
};
