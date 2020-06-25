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
		player.numResearches += 1;
		consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
	}),
	new Research("Apply to College", "", 				 20,  0, 3, 1),
	new Research("Decide on a College Major", "", 		  5,  0, 4, 1),
	new Research("BS in Chemistry", "", 				 120, 0, 5, 1),
	new Research("MS in Chemistry", "", 				 240, 0, 6, 1),
	new Research("PHD in Chemistry", "", 				 480, 0, 7, 1, 0, function(){
		player.numResearches += 1;
		consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
	}),
	new Research("Someone Calls Out To You (Listen)", "", 15, 1, 0, 0, 0, function(){
		consoleDisplay.pushMessage("You can't Quite Make Out What The Voice is Saying...")
	}),
	new Research("Listen Closely To The Voices", "",	 20,  1.5, 0, 0, 8, function(){
		consoleDisplay.pushMessage("The Voices Told You To Start a Cult");
	}),
	new Research("Start a Cult", "",					 60,  0, 0, 0, 9, function(){
		player.influence += 1;
	}),
	new Research("Auto-Sipper", "", 				 	 60,  0, 3, 0, 0, function(){
		consoleDisplay.pushMessage("You will now automatically sip from the mug when available (no more clicking)!");
		consoleDisplay.pushMessage("That's My Secret, I'm Always Sippin'!");
		player.hasAutoSipper = true;
		drinkCoffeeClick();
		drinkCoffeeButton.innerText = "I'm Always Sippin'!";
	}),
	new Research("Max Caffeine to 40", "",				 60,  25, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 50", "",				 60,  35, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 60", "",				 60,  45, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 70", "",				 60,  55, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 80", "",				 60,  65, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 90", "",				 120,  75, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	}),
	new Research("Max Caffeine to 100", "",				 180,  85, 0, 0, 0, function(){
		player.maxCaffeineLevel += 10;
	})


];