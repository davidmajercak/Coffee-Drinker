Player.prototype.calculateSipSize = function() { 
	return roundThreeDecimals(this.sipSizeBase);
};

Player.prototype.takeSip = function() {
	this.coffeeRemaining = roundThreeDecimals(this.coffeeRemaining - this.calculateSipSize());
	this.caffeineLevel = roundThreeDecimals(this.caffeineLevel + this.calculateSipSize() * .1 * this.caffeineTolerance); 

	var numMugs = Math.abs(this.coffeeRemaining);

	if(this.coffeeRemaining <= 0) {
		this.coffeeRemaining = roundThreeDecimals(1 - (numMugs % 1));
		
		this.allTimeCoffee = roundThreeDecimals(this.allTimeCoffee + 1 + Math.floor(numMugs));
		this.emptyMugs = roundThreeDecimals(this.emptyMugs + 1 + Math.floor(numMugs));
	}

	//Short message for new users to continue to click the button
	if(this.allTimeCoffee === 0) {
		if(consoleDisplay.messages[0] === "Maybe Try Drinking Some Coffee")
			consoleDisplay.pushMessage("Take Another Sip!");
		else if(consoleDisplay.messages[0] === "Take Another Sip!")
			consoleDisplay.pushMessage("Almost Finished With Your Coffee...")
	} 
};

Player.prototype.increaseSipSize = function(increaseAmount) {
	this.sipSizeBase = roundThreeDecimals(this.sipSizeBase + increaseAmount);
	consoleDisplay.pushMessage("Your Sip Size Increased By " + increaseAmount + "!");
};

Player.prototype.updateCaffeineLevel = function() {

	if(this.caffeineLevel > this.maxCaffeineLevel)
		this.caffeineLevel = this.maxCaffeineLevel;

	if(this.caffeineLevel < 20)
		player.caffeineTolerance = 1;
	else if(this.caffeineLevel < 40) {
		var message = "You Now Have A Caffeine Level Of 20%, Your Caffeine Tolerance Rises...";
		if(!caffeineToleranceMessages[0]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[0] = true;
		}
		player.caffeineTolerance = .5;
	}
	else if(this.caffeineLevel < 50) {
		var message = "You Now Have A Caffeine Level Of 40%, Your Caffeine Tolerance Rises Again...";
		if(!caffeineToleranceMessages[1]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[1] = true;
		}
		player.caffeineTolerance = .2;
	}
	else if(this.caffeineLevel < 60) {
		var message = "You Now Have A Caffeine Level Of 50%, Your Caffeine Tolerance Rises Yet Again...";
		if(!caffeineToleranceMessages[2]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[2] = true;
		}
		player.caffeineTolerance = .05;
	}
	else if(this.caffeineLevel < 80) {
		var message = "You Now Have A Caffeine Level Of 60%, Your Caffeine Tolerance Rises Even Further...";
		if(!caffeineToleranceMessages[3]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[3] = true;
		}
		player.caffeineTolerance = .005;
	} else if(this.caffeineLevel < 100) { 
		var message = "You Now Have A Caffeine Level Of 80%, Your Caffeine Tolerance Rises Sharply...";
		if(!caffeineToleranceMessages[4]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[4] = true;
		}
		consoleDisplay.pushMessage()
		player.caffeineTolerance = .0002;
	} else if(this.caffeineLevel > 100) { 
		var message = "You Now Have A Caffeine Level Of 100%, Your Caffeine Tolerance Rises Extremely Sharply...";
		if(!caffeineToleranceMessages[5]) {
			consoleDisplay.pushMessage(message);
			caffeineToleranceMessages[5] = true;
		}
		consoleDisplay.pushMessage()
		player.caffeineTolerance = .00001;
	}
 


	if(this.caffeineLevel < 10)
	{
		//This speeds up the game as player's caffeineLevel increases
		tickSpeed = 500 - 10 * this.caffeineLevel;
	} else if (this.caffeineLevel < 50) {
		tickSpeed = 400 - 3 * this.caffeineLevel;
	} else if (this.caffeineLevel < 100) {
		tickSpeed = 280 - 2 * this.caffeineLevel;
	}
	else 
		tickSpeed = 100;

	//Faster Ticks from choosing the god of time
	tickSpeed = tickSpeed / this.timeBonus;

	if(this.caffeineLevel > 0)
		this.caffeineLevel = roundThreeDecimals(this.caffeineLevel - .01);
	if(this.caffeineLevel < 0)
		this.caffeineLevel = 0;


};

Player.prototype.prestige = function() {
	this.emptyMugs = 0; //Total amount of coffees consumed this prestige
	this.caffeineLevel = 0; //Amount of coffee currency left to spend
	this.coffeeRemaining = .3; //Percentage of coffee left in current cup - Start at .3
	this.influence = 0; //Current Amount of Influence (used to unlock Cultists)
	this.caffeineSacrificeProductionBonus = 1;
	this.caffeineSiphon = 0;


	this.sipSizeBase = roundThreeDecimals(.1 + 10 * game.prestigeCount);

	consoleDisplay.pushMessage(this.chosenGod + " Has Given A Permanent Blessing");
	this.chosenGod = null;
	this.numResearches = 1; 	//Number of concurrent researches player is allowed
	this.hasAutoSipper = false;

};


function Player() {
	this.allTimeCoffee = 0; //All time amount of coffees consumed (lasts through prestiges and resets)
	this.emptyMugs = 0; //Total amount of coffees consumed this prestige
	this.caffeineLevel = 0; //Amount of coffee currency left to spend
	this.sipSizeBase = .1; //Percentage of a coffee that is consumed with each sip - tuned to .1 starting sip size
	this.coffeeRemaining = .3; //Percentage of coffee left in current cup - Start at .3
	this.influence = 0; //Current Amount of Influence (used to unlock Cultists)
	this.maxCaffeineLevel = 100;

	this.chosenGod = null;
	this.workerProductionBonus = 1;
	this.timeBonus = 1;
	this.researchBonus = 1;
	this.cultProductionBonus = 1;

	this.caffeineSacrificeProductionBonus = 1;

	this.caffeineTolerance = 1; //Tolerance to caffeine, caffeine starts as 100% effective
	this.numResearches = 1; 	//Number of concurrent researches player is allowed
	this.hasUnlockedUpgrades = false;
	this.hasUnlockedBuyMultiple = false;
	this.caffeineSiphon = 0;
	this.hasAutoSipper = false;


	//Dev Testing
	 // this.emptyMugs = 10000;
	 // this.caffeineLevel = 55;
	 // this.sipSizeBase = 10;


};

Player.prototype.loadPlayer = function(savedPlayer) {
	this.allTimeCoffee = savedPlayer.allTimeCoffee; //All time amount of coffees consumed (lasts through prestiges and resets)
	this.emptyMugs = savedPlayer.emptyMugs; //Total amount of coffees consumed this prestige
	this.caffeineLevel = savedPlayer.caffeineLevel; //Amount of coffee currency left to spend
	this.sipSizeBase = savedPlayer.sipSizeBase; //Percentage of a coffee that is consumed with each sip - tuned to .1 starting sip size
	this.coffeeRemaining = savedPlayer.coffeeRemaining; //Percentage of coffee left in current cup - Start at .3
	this.influence = savedPlayer.influence; //Current Amount of Influence (used to unlock Cultists)

	this.chosenGod = savedPlayer.chosenGod;
	this.workerProductionBonus = savedPlayer.workerProductionBonus;
	this.timeBonus = savedPlayer.timeBonus;
	this.researchBonus = savedPlayer.researchBonus;
	this.cultProductionBonus = savedPlayer.cultProductionBonus;

	this.caffeineSiphon = savedPlayer.caffeineSiphon;
	this.caffeineSacrificeProductionBonus = savedPlayer.caffeineSacrificeProductionBonus;

	this.numResearches = savedPlayer.numResearches; 	//Number of concurrent researches player is allowed
	this.hasAutoSipper = savedPlayer.hasAutoSipper; 	//Number of concurrent researches player is allowed
};


var player; 

var caffeineToleranceMessages = [false, false, false, false, false, false];

