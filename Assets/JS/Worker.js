Worker.prototype.getTotalPower = function() { 
	return this.baseSipSize * this.owned;
}

Worker.prototype.purchase = function() { 

	if(player.emptyMugs >= this.emptyMugCost)
	{
		player.emptyMugs = roundThreeDecimals(player.emptyMugs - this.emptyMugCost);
		this.owned += 1;
		this.emptyMugCost = roundThreeDecimals(this.emptyMugCost * 1.2);
	}
	else
	{
		//Without this if user will get messages for workers not yet unlocked
		if(this.isUnlocked)
			//TODO - Need shorter names for workers
			consoleDisplay.pushMessage("You cannot afford " + this.name + " right now");
	}
}

Worker.prototype.generateProduction = function() { 

	this.takeSip();
	//Probably will want a separate function for this
	coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
	//player.emptyMugs = roundThreeDecimals(player.emptyMugs + this.baseSipSize * this.owned);
}

Worker.prototype.takeSip = function() {
	player.coffeeRemaining = roundThreeDecimals(player.coffeeRemaining - this.baseSipSize * this.owned);

	while(player.coffeeRemaining <= 0){
			player.allTimeCoffee = roundThreeDecimals(player.allTimeCoffee + 1);
			player.emptyMugs = roundThreeDecimals(player.emptyMugs + 1);
			//TODO - Determine how exactly how workers can influence caffeine level
			//player.caffeineLevel = roundThreeDecimals(player.caffeineLevel + 0.1); //need a function to determine caffeine level soon
			player.coffeeRemaining = roundThreeDecimals(player.coffeeRemaining + 1);
		}
		
	
};

function Worker(name, flavorText, unlockMugs, baseSipSize, emptyMugCost) {
	this.name = name;
	this.flavorText = flavorText;
	this.unlockMugs = unlockMugs;
	this.baseSipSize = baseSipSize;
	this.owned = 0;
	this.emptyMugCost = emptyMugCost;
	this.isUnlocked = false;
	this.numUpgrades = 0;
};

var workers = [
	new Worker("Hire a Friend to Help You Drink Coffee", "Is it Weird if You Share a Cup?", 1.5, .01, 1),
	new Worker("Hire a Friend with a Better Work Ethic", "When You say \"Drink Coffee\" They Say \"How Much?", 4, .02, 4),
	new Worker("Hire an Old Man That Drinks Black Coffee While Reading The Paper", "You Know the One", 20, .1, 20),
	new Worker("Hook up a Vacuum to Your Coffee Mug", "You Really Should Have Thought of This Earlier", 100, .5, 100),
	new Worker("Hire a Nurse to Give You Coffee Intravenously", "This feels really hardcore", 500, 2, 500),
	new Worker("Coffeethulu", "Kinda Creepy", 25000, 100, 25000)
	//names from here? https://en.wikipedia.org/wiki/Adept
];

