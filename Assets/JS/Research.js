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
	if(this.isCompleted)
		return false;
	//Then check that player has enough knowledge and caffeine level to unlock
	return (player.caffeineLevel >= this.caffeineCost) && (player.caffeineLevel >= this.unlockCaffeineLevel)  && (player.influence >= this.influenceCost);
};

Research.prototype.purchase = function() {
	if((player.caffeineLevel >= research[this.value].caffeineCost) && (player.influence >= research[this.value].influenceCost) && !research[this.value].isStarted) {
		player.caffeineLevel = roundThreeDecimals(player.caffeineLevel - research[this.value].caffeineCost);
		player.influence = roundThreeDecimals(player.influence - research[this.value].influenceCost);
		research[this.value].startResearch();
	}
}

Research.prototype.startResearch = function() {
	this.isStarted = true;

	for(var i = 0; i < document.querySelectorAll(".researchButton").length; i++) {
		if(research[document.querySelectorAll(".researchButton")[i].value].name === this.name) {
	
			document.querySelectorAll(".researchButton")[i].style.color = "rgb(120, 128, 181)";
			document.querySelectorAll(".researchButton")[i].style.borderColor = "rgb(120, 128, 181)";
		}
	}

};

Research.prototype.updateDisplay = function() {
	this.researchTimeRemaining = this.researchTimeRemaining - 1;

	if(this.researchTimeRemaining <= 0){
		this.isCompleted = true;
		this.researchTime = 0;
		player.knowledge += this.knowledgeGain;

		if(this.callback)
			this.callback();
		//TODO - Find a better way to check for this exact research
		if(this.name == "Ascend Into A Coffee God (Resets Game With Bonus)") {
			consoleDisplay.pushMessage("Welp, Back to the Old Grind");
			game.justPrestiged = true;
			game.prestige();
			return;
		}
		var thisButton = document.querySelector("#researchTimerDisplay" + research.indexOf(this)).parentElement;
		thisButton.style.opacity = "0";

		if(research[thisButton.value].flavorText != "")
			setTimeout(function() {
				consoleDisplay.pushMessage(research[thisButton.value].flavorText);
			}, 400);

		setTimeout(function() {
			thisButton.remove();
		}, 1100);
	}
	document.querySelector("#researchTimerDisplay" + research.indexOf(this)).innerText = this.researchTimeRemaining;
}


Research.prototype.addButton = function(){
	var parent = document.querySelector("#research");
	var researchButton = document.createElement("button");
	researchButton.innerHTML = this.name + "<div></div>Research Time: ";
	researchButton.value = research.indexOf(this);
	researchButton.classList.add("hide");

	researchButton.innerHTML +="<span id=\"researchTimerDisplay" + researchButton.value + "\">" + this.researchTimeRemaining + "</span>" + " Seconds";
	if(this.caffeineCost > 0)
		researchButton.innerHTML +="<div>Caffeine Cost: " + this.caffeineCost + " Caffeine Level</div>"
	if(this.influenceCost > 0)
		researchButton.innerHTML +="<div>Infleunce Cost: " + this.influenceCost + " Influence</div>"

	researchButton.addEventListener("click", this.purchase);
	parent.appendChild(researchButton);

	setTimeout(function() {
		researchButton.classList.add("researchButton");
		researchButton.classList.remove("hide");

	}, 20);		//TODO - this setTimeout function should be refactored, decide better upgrade layout
	this.isUnlocked = true;

	setTimeout(function() {
		if(research[researchButton.value].researchTimeRemaining < research[researchButton.value].researchTime)
			researchButton.click();
	}, 20);
	//If Player had saved the game and reloaded the game, click the button to start/continue the research
	
}

function Research(name, flavorText, researchTime, unlockCaffeineLevel, caffeineCost, unlockInfluence, prerequisiteResearch, callback) {
	this.name = name;									//Name of Research
	this.flavorText = flavorText;						
	this.researchTime = Math.floor(researchTime / player.researchBonus);
	this.researchTimeRemaining = this.researchTime;
	this.unlockCaffeineLevel = unlockCaffeineLevel;		//Caffeine Level Required to Unlock
	this.caffeineCost = caffeineCost;				
	this.unlockInfluence = unlockInfluence;				
	this.influenceCost = this.unlockInfluence;
	this.callback = callback;							//Optional callback function for additional effects
	this.prerequisiteResearch = prerequisiteResearch;	//Optional index of prerequisite research required for unlock

	this.isUnlocked = false;
	this.isStarted = false;
	this.isCompleted = false;
}

function loadResearch(savedResearch) {
	if(savedResearch.length >= research.length) {
		for(var i = 0; i < research.length; i++) {
			// research[i].name = savedResearch[i].name;
			// research[i].flavorText = savedResearch[i].flavorText;
			// research[i].researchTime = savedResearch[i].researchTime;
			// research[i].unlockCaffeineLevel = savedResearch[i].unlockCaffeineLevel;
			// research[i].knowledgeGain = savedResearch[i].knowledgeGain;
			// research[i].prerequisiteResearch = savedResearch[i].prerequisiteResearch;
			// research[i].callback = savedResearch[i].callback;

			//research[i].isStarted = savedResearch[i].isStarted;
			research[i].isCompleted = savedResearch[i].isCompleted;
			research[i].researchTimeRemaining = savedResearch[i].researchTimeRemaining;
		}
	}
	else {
		consoleDisplay.pushMessage("Sorry, Research Has Been Updated And Your Research Information Will Be Reset");
	}
}

//Maybe feel ill-effects of high caffeine level first and then start doing research immediately?
var research = [];
