Worker.prototype.getTotalPower = function() { 
	return baseSipSize * owned;
}

Worker.prototype.purchase = function() { 

	if(player.emptyMugs >= this.emptyMugCost * this.coffeeScaling)
	{
		player.emptyMugs = roundTwoDecimals(player.emptyMugs - this.emptyMugCost * this.coffeeScaling)
		this.owned += 1;
		this.emptyMugCost = roundTwoDecimals(this.emptyMugCost * this.coffeeScaling);
		this.coffeeScaling += .2;
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
	coffeeRemainingDisplay.textContent = roundTwoDecimals(player.coffeeRemaining * 100) + "%";
	//player.emptyMugs = roundTwoDecimals(player.emptyMugs + this.baseSipSize * this.owned);
}

Worker.prototype.takeSip = function() {
	player.coffeeRemaining = roundTwoDecimals(player.coffeeRemaining - this.baseSipSize * this.owned);

	if(player.hasBottomLessMug){
		//This allows for higher multipliers in which more than one cup can be consumed in one sip
		while(player.coffeeRemaining <= 0){
			player.allTimeCoffee = roundTwoDecimals(player.allTimeCoffee + 1);
			player.emptyMugs = roundTwoDecimals(player.emptyMugs + 1);
			//TODO - Determine how exactly how workers can influence caffeine level
			//player.caffeineLevel = roundTwoDecimals(player.caffeineLevel + 0.1); //need a function to determine caffeine level soon
			player.coffeeRemaining = roundTwoDecimals(player.coffeeRemaining + 1);
		}
	} else {
		if(player.coffeeRemaining <= 0){
			player.allTimeCoffee = roundTwoDecimals(player.allTimeCoffee + 1);
			player.emptyMugs = roundTwoDecimals(player.emptyMugs + 1);
			//player.caffeineLevel = roundTwoDecimals(player.caffeineLevel + 0.1); //need a function to determine caffeine level soon
			player.coffeeRemaining = 1;
		}
	}
		
	
};

function Worker(name, flavorText, unlockMugs, baseSipSize, emptyMugCost) {
	this.name = name;
	this.flavorText = flavorText;
	this.unlockMugs = unlockMugs;
	this.baseSipSize = baseSipSize;
	this.owned = 0;
	this.emptyMugCost = emptyMugCost;
	this.coffeeScaling = 1;
	this.isUnlocked = false;
}

var workers = [
	new Worker("Hire a Friend to Help You Drink Coffee", "Is it Weird if You Share a Cup?", 1.5, .1, 1),
	new Worker("Hire a Friend with a Better Work Ethic", "When You say \"Drink Coffee\" They Say \"How Much?", 4, .3, 4),
	new Worker("Hire an Old Man That Drinks Black Coffee While Reading The Paper", "You Know the One", 9, .7, 9),
	new Worker("Hook up a Vacuum to Your Coffee Mug", "You Really Should Have Thought of This Earlier", 20, 2, 20),
	new Worker("Neophyte Coffee Cultist", "Kinda Creepy", 50, 5, 50),
	new Worker("Hire a Nurse to Give You Coffee Intravenously", "This feels really hardcore", 100, 10, 100),
	new Worker("Zelator Coffee Cultist", "Kinda Creepy", 200, 20, 200),
	new Worker("Practicus Coffee Cultist", "Kinda Creepy", 400, 40, 400),
	new Worker("Philosophus Coffee Cultist", "Kinda Creepy", 600, 80, 600),
	new Worker("Adeptus Minor Coffee Cultist", "Kinda Creepy", 1000, 160, 1000),
	new Worker("Adeptus Major Coffee Cultist", "Kinda Creepy", 2500, 320, 2500),
	new Worker("Adeptus Exemptus Coffee Cultist", "Kinda Creepy", 5000, 640, 5000),
	new Worker("Magister Templi Coffee Cultist", "Kinda Creepy", 10000, 1280, 10000),
	new Worker("Magus Coffee Cultist", "Kinda Creepy", 25000, 2560, 25000),
	new Worker("Ipsissimus Coffee Cultist", "Kinda Creepy", 50000, 5120, 50000),
	new Worker("Coffeethulu", "Kinda Creepy", 250000, 20480, 250000)
	//names from here? https://en.wikipedia.org/wiki/Adept
];

