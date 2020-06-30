Player.prototype.calculateSipSize = function() { 
	return roundThreeDecimals(this.sipSizeBase);
};

Player.prototype.takeSip = function() {
	this.coffeeRemaining = roundThreeDecimals(this.coffeeRemaining - this.calculateSipSize());
	this.caffeineLevel = roundThreeDecimals(this.caffeineLevel + this.sipSizeBase * .1); //need a function to determine caffeine level soon

	while(this.coffeeRemaining <= 0){
			this.allTimeCoffee = roundThreeDecimals(this.allTimeCoffee + 1);
			this.emptyMugs = roundThreeDecimals(this.emptyMugs + 1);
			this.coffeeRemaining = roundThreeDecimals(this.coffeeRemaining + 1);
	}
};

Player.prototype.increaseSipSize = function(increaseAmount) {
	this.sipSizeBase = roundThreeDecimals(this.sipSizeBase + increaseAmount);
	consoleDisplay.pushMessage("Your Sip Size Increased By " + increaseAmount + "!");
};

Player.prototype.updateCaffeineLevel = function() {

	//Player needs to complete research to push max caffeine level higher
	if(this.caffeineLevel > this.maxCaffeineLevel)
		this.caffeineLevel = this.maxCaffeineLevel;

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
	this.maxCaffeineLevel = 40; //Highest Caffeine Level Can Reach Currently
	this.coffeeRemaining = .3; //Percentage of coffee left in current cup - Start at .3
	this.knowledge = 0;	//Current Amount of knowledge (used to unlock/start researches)
	this.influence = 0; //Current Amount of Influence (used to unlock Cultists)

	this.sipSizeBase = roundThreeDecimals(.1 + 10 * game.prestigeCount);
	
	if(this.chosenGod != null) {
		if(this.chosenGod === "God of Better Coffee") {
			this.workerProductionBonus += 1;
		} else if(this.chosenGod === "God of Time") {
			this.timeBonus += .2;
		} else if(this.chosenGod === "God of Knowledge") {
			this.researchBonus += .2;
		} else if(this.chosenGod === "God of Cults") {
			this.cultProductionBonus += 1;
		}
	}
	consoleDisplay.pushMessage(this.chosenGod + " Has Given You Their Blessing");
	this.chosenGod = null;
	this.numResearches = 1; 	//Number of concurrent researches player is allowed
	this.hasAutoSipper = false;

};


function Player() {
	this.allTimeCoffee = 0; //All time amount of coffees consumed (lasts through prestiges and resets)
	this.emptyMugs = 0; //Total amount of coffees consumed this prestige
	this.caffeineLevel = 0; //Amount of coffee currency left to spend
	this.maxCaffeineLevel = 40; //Highest Caffeine Level Can Reach Currently
	this.sipSizeBase = .1; //Percentage of a coffee that is consumed with each sip - tuned to .1 starting sip size
	this.coffeeRemaining = .3; //Percentage of coffee left in current cup - Start at .3
	this.knowledge = 0;	//Current Amount of knowledge (used to unlock/start researches)
	this.influence = 0; //Current Amount of Influence (used to unlock Cultists)

	this.chosenGod = null;
	this.workerProductionBonus = 1;
	this.timeBonus = 1;
	this.researchBonus = 1;
	this.cultProductionBonus = 1;

	this.numResearches = 1; 	//Number of concurrent researches player is allowed
	this.hasUnlockedUpgrades = false;
	this.hasUnlockedBuyMultiple = false;
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
	this.maxCaffeineLevel = savedPlayer.maxCaffeineLevel; //Highest Caffeine Level Can Reach Currently
	this.sipSizeBase = savedPlayer.sipSizeBase; //Percentage of a coffee that is consumed with each sip - tuned to .1 starting sip size
	this.coffeeRemaining = savedPlayer.coffeeRemaining; //Percentage of coffee left in current cup - Start at .3
	this.knowledge = savedPlayer.knowledge;	//Current Amount of knowledge (used to unlock/start researches)
	this.influence = savedPlayer.influence; //Current Amount of Influence (used to unlock Cultists)

	this.chosenGod = savedPlayer.chosenGod;
	this.workerProductionBonus = savedPlayer.workerProductionBonus;
	this.timeBonus = savedPlayer.timeBonus;
	this.researchBonus = savedPlayer.researchBonus;
	this.cultProductionBonus = savedPlayer.cultProductionBonus;

	this.numResearches = savedPlayer.numResearches; 	//Number of concurrent researches player is allowed
	this.hasAutoSipper = savedPlayer.hasAutoSipper; 	//Number of concurrent researches player is allowed
};


var player; 
