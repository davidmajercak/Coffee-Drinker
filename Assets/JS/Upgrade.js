Upgrade.prototype.canUnlock = function() {
	if(this.associatedWorkerIndex != -1 && upgradeCutoffs[workers[this.associatedWorkerIndex].numUpgrades] > workers[this.associatedWorkerIndex].owned)
		return false;
	if(this.prerequisiteUpgrade != -1 && !upgrades[this.prerequisiteUpgrade].isPurchased)
		return false;
	return (player.emptyMugs >= this.unlockMugs) && (player.caffeineLevel >= this.unlockCaffeineLevel);
};

Upgrade.prototype.purchase = function() {
	//This is referring to the button itself
	//Passing the index of the upgrade as a value for now
	if(upgrades[this.value].canUnlock())
	{
		player.emptyMugs -= upgrades[this.value].emptyMugCost;
		player.caffeineLevel -=  upgrades[this.value].caffeineCost;
		player.sipSizeBase +=  roundThreeDecimals(upgrades[this.value].sipSizeIncrease);

		//TODO - Refactor to call the update display function?
		emptyMugsDisplay.textContent = roundThreeDecimals(player.emptyMugs);
		coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
		sipSizeDisplay.textContent = player.calculateSipSize();

		if(upgrades[this.value].callback)
			upgrades[this.value].callback();

		upgrades[this.value].isPurchased = true;

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



function Upgrade(name, flavorText, unlockMugs, unlockCaffeineLevel, emptyMugCost, caffeineCost, sipSizeIncrease, prerequisiteUpgrade, associatedWorkerIndex, callback) {
	this.name = name;									//Name of Upgrade
	this.flavorText = flavorText;						//Flavor Text for Upgrade
	this.unlockMugs = unlockMugs;					//Amount of emptyMugs needed to Unlock
	this.unlockCaffeineLevel = unlockCaffeineLevel;		//Amount of caffeine needed to unlock
	this.emptyMugCost = emptyMugCost;					//Amount of coffee needed to buy
	this.caffeineCost = caffeineCost;					//Amount of caffeine needed to buy
	this.sipSizeIncrease = sipSizeIncrease;				//Amount sipSize increases by after upgrade
	this.isUnlocked = false;							//Keeps track of unlocked upgrades
	this.isPurchased = false;
	this.prerequisiteUpgrade = prerequisiteUpgrade;		
	this.associatedWorkerIndex = associatedWorkerIndex;	
	this.callback = callback;							//An optional callback to create more interesting upgrades
};

//TODO - Only Unlock Worker Upgrades when You Own a Certain Amount of them (10, 25, 50, 100, etc)

var upgrades = [
	new Upgrade("Become Slightly More Thirsty", "", 1, 0, .5, 0, .05, -1, -1),
	new Upgrade("Become Slightly More Thirsty Again", "", 1.5, 0, 1.5, 0, .05, 0, -1),
	new Upgrade("Pretzels That Make You Thirsty", "", 2, 0, 2, 0, .15, 1, -1),
	new Upgrade("Coffee That Doesn't Burn Your Mouth as Much", "", 4, 0, 4, 0, .3, 2, -1),
	new Upgrade("Confidence in Yourself", "Best 16 Empty Mugs You Ever Spent", 16, 0, 8, 0, .5, 3, -1),
	new Upgrade("Wide-Mouth Coffee Mug", "", 32, 0, 16, 0, 1, 4, -1),
	//Create New prototypes to use as the callback functions?
	new Upgrade("Improved Friends", "", 5, 0, 5, 0, 0, -1, 0, function(){
		consoleDisplay.pushMessage("Sip Size of friends increased by 300%");
		workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*3);
		workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*3);

		workers[0].numUpgrades++;

		game.updateWorkerButton(0);
		game.updateWorkerButton(1);
	}),
	new Upgrade("Robo-Friends", "", 20, 0, 10, 0, 0, 6, 0, function(){
		consoleDisplay.pushMessage("Sip Size of friends increased by 300%");
		workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*3);
		workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*3);

		workers[0].numUpgrades++;

		game.updateWorkerButton(0);
		game.updateWorkerButton(1);
	}),
	new Upgrade("Older Men Who Drink Blacker Coffee", "", 50, 0, 50, 0, 0, -1, 2, function(){
		consoleDisplay.pushMessage("Sip Size of Old Men increased by 700%");
		workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

		workers[2].numUpgrades++;

		game.updateWorkerButton(2);
	}),
	new Upgrade("Oldest Men Who Drink Blackest Coffee", "", 150, 0, 150, 0, 0, 8, 2, function(){
		consoleDisplay.pushMessage("Sip Size of Old Men increased by 700%");
		workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

		workers[2].numUpgrades++;

		game.updateWorkerButton(2);
	}),

];

var upgradeCutoffs = [
	5,
	10,
	25,
	50,
	100
]

