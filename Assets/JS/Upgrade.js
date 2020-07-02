Upgrade.prototype.canUnlock = function() {
	if(this.associatedWorkerIndex != -1 && upgradeCutoffs[workers[this.associatedWorkerIndex].numUpgrades] > workers[this.associatedWorkerIndex].hired)
		return false;
	if(this.prerequisiteUpgrade != -1 && !upgrades[this.prerequisiteUpgrade].isPurchased)
		return false;
	if(this.isPurchased)
		return false;
	return (player.emptyMugs >= this.unlockMugs);
};

Upgrade.prototype.purchase = function() {
	//This is referring to the button itself
	//Passing the index of the upgrade as a value for now
	if(upgrades[this.value].canUnlock())
	{
		player.emptyMugs -= upgrades[this.value].emptyMugCost;

		if(upgrades[this.value].updateName)
			game.updateWorkerButtonName(upgrades[this.value].associatedWorkerIndex, upgrades[this.value].name)

		game.updateDisplay();

		if(upgrades[this.value].callback)
			upgrades[this.value].callback();

		upgrades[this.value].isPurchased = true;

		this.style.opacity = "0";
		var thisButton = this;

		//Show flavor text in the console at the top of the screen if this upgrade has flavor text
		if(upgrades[thisButton.value].flavorText != "")
		setTimeout(function() {
			consoleDisplay.pushMessage(upgrades[thisButton.value].flavorText);
		}, 400);


		setTimeout(function() {

			thisButton.remove();
		}, 900);
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



function Upgrade(name, flavorText, unlockMugs, emptyMugCost, prerequisiteUpgrade, associatedWorkerIndex, updateName, callback) {
	this.name = name;									//Name of Upgrade
	this.flavorText = flavorText;						//Flavor Text for Upgrade
	this.unlockMugs = unlockMugs;					//Amount of emptyMugs needed to Unlock
	this.emptyMugCost = emptyMugCost;					//Amount of coffee needed to buy
	this.isUnlocked = false;							//Keeps track of unlocked upgrades
	this.isPurchased = false;
	this.prerequisiteUpgrade = prerequisiteUpgrade;		
	this.associatedWorkerIndex = associatedWorkerIndex;	
	this.updateName = updateName;
	this.callback = callback;							//An optional callback to create more interesting upgrades
};

function loadUpgrades(savedUpgrades) {
	if(savedUpgrades.length >= upgrades.length) {
		for(var i = 0; i < upgrades.length; i++) {
			//Don't Think Any of This Really Needs To Be Here
			// upgrades[i].name = savedUpgrades[i].name;
			// upgrades[i].flavorText = savedUpgrades[i].flavorText;
			// upgrades[i].unlockMugs = savedUpgrades[i].unlockMugs;
			// upgrades[i].emptyMugCost = savedUpgrades[i].emptyMugCost;
			// upgrades[i].prerequisiteUpgrade = savedUpgrades[i].prerequisiteUpgrade;
			// upgrades[i].associatedWorkerIndex = savedUpgrades[i].associatedWorkerIndex;
			// upgrades[i].callback = savedUpgrades[i].callback;
			
			upgrades[i].isPurchased = savedUpgrades[i].isPurchased;
		}
	}
	else {
		consoleDisplay.pushMessage("Sorry, Upgrades Have Been Updated And Your Upgrades Information Will Be Reset");
	}
}

var upgrades = [];

var upgradeCutoffs = [
	5,
	10,
	25,
	50,
	100
]

