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

		game.updateDisplay();

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

var upgrades = [];


var upgradeCutoffs = [
	5,
	10,
	25,
	50,
	100
]

