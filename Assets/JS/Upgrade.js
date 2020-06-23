Upgrade.prototype.canUnlock = function() {
	return (player.emptyMugs >= this.unlockMugs) && (player.caffeineLevel >= this.unlockCaffeineLevel);
};

Upgrade.prototype.purchase = function() {
	//This is referring to the button itself
	//Passing the index of the upgrade as a value for now
	if(upgrades[this.value].canUnlock())
	{
		player.emptyMugs -= upgrades[this.value].emptyMugCost;
		player.caffeineLevel -=  upgrades[this.value].caffeineCost;
		player.sipSizeBase +=  roundTwoDecimals(upgrades[this.value].sipSizeIncrease);

		//TODO - Refactor to call the update display function?
		emptyMugsDisplay.textContent = roundTwoDecimals(player.emptyMugs);
		coffeeRemainingDisplay.textContent = roundTwoDecimals(player.coffeeRemaining * 100) + "%";
		sipSizeDisplay.textContent = player.calculateSipSize();

		if(upgrades[this.value].callback)
			upgrades[this.value].callback();

		this.style.opacity = "0";
		var thisButton = this;
		setTimeout(function() {
			thisButton.remove();
		}, 1100);
	}
	
};


Upgrade.prototype.addButton = function(){
	var parent = document.querySelector("#upgrades");
	var upgradeButton = document.createElement("button");
	upgradeButton.innerHTML = this.name + "<div></div>Cost: ";
	upgradeButton.value = upgrades.indexOf(this);
	upgradeButton.classList.add("hide");

	if(this.emptyMugCost > 0)
	{
		upgradeButton.innerHTML += this.emptyMugCost + " Empty Mugs";
	}
	upgradeButton.addEventListener("click", this.purchase);
	parent.appendChild(upgradeButton);

	setTimeout(function() {
		upgradeButton.classList.add("upgradeButton");
		upgradeButton.classList.remove("hide");

	}, 20);		//TODO - this setTimeout function should be refactored, decide better upgrade layout

	this.isUnlocked = true;
}



function Upgrade(name, flavorText, unlockMugs, unlockCaffeineLevel, emptyMugCost, caffeineCost, sipSizeIncrease, callback) {
	this.name = name;									//Name of Upgrade
	this.flavorText = flavorText;						//Flavor Text for Upgrade
	this.unlockMugs = unlockMugs;					//Amount of emptyMugs needed to Unlock
	this.unlockCaffeineLevel = unlockCaffeineLevel;		//Amount of caffeine needed to unlock
	this.emptyMugCost = emptyMugCost;						//Amount of coffee needed to buy
	this.caffeineCost = caffeineCost;					//Amount of caffeine needed to buy
	this.sipSizeIncrease = sipSizeIncrease;				//Amount sipSize increases by after upgrade
	this.isUnlocked = false;							//Keeps track of unlocked upgrades
	this.callback = callback;							//An optional callback to create more interesting upgrades
};

var upgrades = [
	new Upgrade("Become Slightly More Thirsty", "", 1, 0, .5, 0, .05),
	new Upgrade("Become Slightly More Thirsty Again", "", 1.5, 0, 1.5, 0, .05),
	new Upgrade("Pretzels That Make You Thirsty", "", 2, 0, 2, 0, .15),
	new Upgrade("Coffee That Doesn't Burn Your Mouth as Much", "", 8, 0, 4, 0, .3),
	new Upgrade("Confidence in Yourself", "Best 16 Empty Mugs You Ever Spent", 16, 0, 8, 0, .5),
	new Upgrade("Wide-Mouth Coffee Mug", "", 32, 0, 16, 0, 1),
	new Upgrade("Quantum Coffee Mug", "", 10, 0, 10, 0, 0, function(){
		consoleDisplay.pushMessage("Now you can drink from multiple mugs in a single sip! (no longer stop at 100%)");
		player.hasBottomLessMug = true;
	}),
	//Create New prototypes to use as the callback functions?
	new Upgrade("Improved Friends", "", 6, 0, 5, 0, 0, function(){
		consoleDisplay.pushMessage("Sip Size of friends increased by 300%");
		workers[0].baseSipSize = roundTwoDecimals(workers[0].baseSipSize*3);
		workers[1].baseSipSize = roundTwoDecimals(workers[1].baseSipSize*3);

		game.updateWorkerButton(0);
		game.updateWorkerButton(1);
	}),
	new Upgrade("Robo-Friends", "", 20, 0, 10, 0, 0, function(){
		consoleDisplay.pushMessage("Sip Size of friends increased by 300%");
		workers[0].baseSipSize = roundTwoDecimals(workers[0].baseSipSize*3);
		workers[1].baseSipSize = roundTwoDecimals(workers[1].baseSipSize*3);

		game.updateWorkerButton(0);
		game.updateWorkerButton(1);
	}),
	new Upgrade("Older Men Who Drink Blacker Coffee", "", 50, 0, 50, 0, 0, function(){
		consoleDisplay.pushMessage("Sip Size of Old Men increased by 300%");
		workers[2].baseSipSize = roundTwoDecimals(workers[2].baseSipSize*7);

		game.updateWorkerButton(2);
	}),
	new Upgrade("Oldest Men Who Drink Blackest Coffee", "", 150, 0, 150, 0, 0, function(){
		consoleDisplay.pushMessage("Sip Size of Old Men increased by 300%");
		workers[2].baseSipSize = roundTwoDecimals(workers[2].baseSipSize*7);

		game.updateWorkerButton(2);
	}),

];


