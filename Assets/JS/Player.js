Player.prototype.calculateSipSize = function() { 
	return roundTwoDecimals(this.sipSizeBase);
};

Player.prototype.takeSip = function() {
	this.coffeeRemaining = roundTwoDecimals(this.coffeeRemaining - this.calculateSipSize());

	if(this.hasBottomLessMug){
		//This allows for higher multipliers in which more than one cup can be consumed in one sip
		while(this.coffeeRemaining <= 0){
			this.allTimeCoffee = roundTwoDecimals(this.allTimeCoffee + 1);
			this.emptyMugs = roundTwoDecimals(this.emptyMugs + 1);
			this.caffeineLevel = roundTwoDecimals(this.caffeineLevel + 0.1); //need a function to determine caffeine level soon
			this.coffeeRemaining = roundTwoDecimals(this.coffeeRemaining + 1);
		}
	} else {
		if(this.coffeeRemaining <= 0){
			this.allTimeCoffee = roundTwoDecimals(this.allTimeCoffee + 1);
			this.emptyMugs = roundTwoDecimals(this.emptyMugs + 1);
			this.caffeineLevel = roundTwoDecimals(this.caffeineLevel + 0.1); //need a function to determine caffeine level soon
			this.coffeeRemaining = 1;
		}
	}
		
	
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
	} else if (this.caffeinLevel < 100) {
		tickSpeed = 280 - 2 * this.caffeineLevel;
	}
	else 
		tickSpeed = 100;

	if(this.caffeineLevel > 0)
		this.caffeineLevel = roundTwoDecimals(this.caffeineLevel - .01);

	caffeineLevelDisplay.textContent = this.caffeineLevel + "%";
};


function Player() {
	this.allTimeCoffee = 0; //All time amount of coffees consumed (lasts through prestiges and resets)
	this.emptyMugs = 0; //Total amount of coffees consumed this prestige
	this.caffeineLevel = 0; //Amount of coffee currency left to spend
	this.maxCaffeineLevel = 30.01; //Highest Caffeine Level Can Reach Currently
	this.sipSizeBase = .1; //Percentage of a coffee that is consumed with each sip - tuned to .1 starting sip size
	this.coffeeRemaining = .3; //Percentage of coffee left in current cup - Start at .3
	this.knowledge = 0;	//Current Amount of knowledge (used to unlock/start researches)
	this.influence = 0; //Current Amount of Influence (used to unlock Cultists)

	this.numResearches = 1; 	//Number of concurrent researches player is allowed
	this.hasBottomLessMug = false;
	this.hasUnlockedUpgrades = false;
	this.hasAutoSipper = false;

	//Dev Testing
	 // this.emptyMugs = 10000;
	 // this.caffeineLevel = 55;
	 // this.sipSizeBase = 10;
	 // this.hasBottomLessMug = true;


};


var player = new Player();
