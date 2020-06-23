Research.prototype.canUnlock = function() {
	//First check if the required prerequisite research is complete (if any)
	if(this.prerequisiteResearch)
	{
		//console.log(research[this.prerequisiteResearch].isCompleted)
		if(!research[this.prerequisiteResearch].isCompleted)
		{
			return false;
		}
	}
	//Then check that player has enough knowledge and caffeine level to unlock
	return (player.knowledge >= this.unlockKnowledge) && (player.caffeineLevel >= this.unlockCaffeineLevel);
};

Research.prototype.startResearch = function() {
	research[this.value].isStarted = true;
	//Hex color is 
	this.style.color = "rgb(120, 128, 181)";
	this.style.borderColor = "rgb(120, 128, 181)";
};

Research.prototype.updateDisplay = function() {
	this.researchTime = this.researchTime - 1;

	if(this.researchTime <= 0){
		this.isCompleted = true;
		this.researchTime = 0;
		player.knowledge += this.knowledgeGain;

		if(this.callback)
			this.callback();
		
		var thisButton = document.querySelector("#researchTimerDisplay" + research.indexOf(this)).parentElement;
		thisButton.style.opacity = "0";
		setTimeout(function() {
			thisButton.remove();
		}, 1100);
	}
	document.querySelector("#researchTimerDisplay" + research.indexOf(this)).innerText = this.researchTime;
}


Research.prototype.addButton = function(){
	var parent = document.querySelector("#research");
	var researchButton = document.createElement("button");
	researchButton.innerHTML = this.name + "<div></div>Time: ";
	researchButton.value = research.indexOf(this);
	researchButton.classList.add("hide");

	researchButton.innerHTML +="<span id=\"researchTimerDisplay" + researchButton.value + "\">" + this.researchTime + "</span>" + " Seconds";

	researchButton.addEventListener("click", this.startResearch);
	parent.appendChild(researchButton);

	setTimeout(function() {
		researchButton.classList.add("researchButton");

		researchButton.classList.remove("hide");

	}, 20);		//TODO - this setTimeout function should be refactored, decide better upgrade layout
	this.isUnlocked = true;
}

function Research(name, flavorText, researchTime, unlockCaffeineLevel, unlockKnowledge, knowledgeGain,  prerequisiteResearch, callback) {
	this.name = name;									//Name of Research
	this.flavorText = flavorText;						
	this.researchTime = researchTime;
	this.unlockCaffeineLevel = unlockCaffeineLevel;		//Caffeine Level Required to Unlock
	this.unlockKnowledge = unlockKnowledge;				//Knowledge Required to Unlock
	this.knowledgeGain = knowledgeGain;					//Knowledge gained from research after research finished
	this.callback = callback;							//Optional callback function for additional effects
	this.prerequisiteResearch = prerequisiteResearch;	//Optional index of prerequisite research required for unlock

	this.isUnlocked = false;
	this.isStarted = false;
	this.isCompleted = false;
}

//Maybe feel ill-effects of high caffeine level first and then start doing research immediately?
var research = [
	new Research("Think About Why You're Doing This", "", 5, .2, 0, 1),
	new Research("Think a Little Harder This Time", "",	 10,  0, 1, 1), 
	new Research("Get your G.E.D.", "", 				 30,  0, 2, 1, 0, function(){
		consoleDisplay.pushMessage("You can now research 2 researches at a time!");
		player.numResearches += 1;
	}),
	new Research("Apply to College", "", 				 20,  0, 3, 1),
	new Research("Decide on a Major", "", 				 5,   0, 4, 1),
	new Research("BS in Chemistry", "", 				 120, 0, 5, 1),
	new Research("MS in Chemistry", "", 				 240, 0, 6, 1),
	new Research("PHD in Chemistry", "", 				 480, 0, 7, 1, 0, function(){
		consoleDisplay.pushMessage("You can now research 3 researches at a time!");
		player.numResearches += 1;
	}),
	//Start of 2nd research track
	new Research("Auto-Sipper", "", 				 	 60,  0, 3, 0, 0, function(){
		consoleDisplay.pushMessage("You will now automatically sip from the mug when available (no more clicking)!");
		player.hasAutoSipper = true;
		drinkCoffeeClick();
		//TODO - "That's My Secret, I'm Always Sippin'!" to the console display at the top when this is finished
		drinkCoffeeButton.innerText = "I'm Always Sippin'!";
	}),
	new Research("Max Caffeine to 40", "",				 60,  30, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 50", "",				 60,  40, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 60", "",				 60,  50, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 70", "",				 60,  60, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 80", "",				 60,  70, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 90", "",				 60,  80, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 100", "",				 60,  90, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),

];