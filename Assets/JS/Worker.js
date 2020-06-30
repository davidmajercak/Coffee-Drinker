Worker.prototype.getTotalPower = function() { 
	return this.baseSipSize * this.owned * player.workerProductionBonus;
}

Worker.prototype.increaseSipSize = function(increaseMultiplier) {
	this.baseSipSize = roundThreeDecimals(this.baseSipSize * increaseMultiplier);
	this.numUpgrades++;
	game.updateWorkerButton(workers.indexOf(this));
	consoleDisplay.pushMessage("Sip Size Of " + this.name + " Increased By " + increaseMultiplier * 100 + "%!");
};

Worker.prototype.purchase = function() { 
	var currentAmountOwned = this.owned;

	if(buyMultipleButton.value != "Max")
		var buyMultipleNumber = Number(buyMultipleButton.value);
	//Buy Multiple Functionality
	//Buy Max
	if(buyMultipleButton.value === "Max" && player.emptyMugs >= this.emptyMugCost) {
		while(player.emptyMugs >= this.emptyMugCost) {
			player.emptyMugs = roundThreeDecimals(player.emptyMugs - this.emptyMugCost);
			this.owned += 1;
			this.emptyMugCost = roundThreeDecimals(this.emptyMugCost * 1.2);
		}
		//Buy 5 or 10
	} else if(buyMultipleNumber != 1 && player.emptyMugs >= geometricSum(this.emptyMugCost, 1.2, buyMultipleNumber)) {
		player.emptyMugs = roundThreeDecimals(player.emptyMugs - geometricSum(this.emptyMugCost, 1.2, buyMultipleNumber))
		this.owned += Number(buyMultipleNumber);
		this.emptyMugCost = roundThreeDecimals(this.emptyMugCost * Math.pow(1.2, buyMultipleNumber));
		//Buy 1
	} else if(buyMultipleNumber === 1 && player.emptyMugs >= this.emptyMugCost) {
		player.emptyMugs = roundThreeDecimals(player.emptyMugs - this.emptyMugCost);
		this.owned += 1;
		this.emptyMugCost = roundThreeDecimals(this.emptyMugCost * 1.2);
		//Can't Afford
	} else {
		//Without this if user will get messages for workers not yet unlocked
		if(this.isUnlocked)
			//TODO - Need shorter names for workers
			consoleDisplay.pushMessage("You Cannot Afford " + this.name + " Right Now");
	}

	if(currentAmountOwned === 0 && this.owned > 0) {
		if(this.flavorText != "") {
			var tempWorker = this;
			setTimeout(function() {
				consoleDisplay.pushMessage(tempWorker.flavorText);
			}, 400);
		}	
	}
	
}

function geometricSum(firstTerm, commonRatio, numberOfTerms) {
	return firstTerm * (1 - Math.pow(commonRatio, numberOfTerms))/(1 - commonRatio);
}

Worker.prototype.generateProduction = function() { 

	this.takeSip();
	//Probably will want a separate function for this
	coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
	//player.emptyMugs = roundThreeDecimals(player.emptyMugs + this.baseSipSize * this.owned);
}

Worker.prototype.takeSip = function() {
	player.coffeeRemaining = roundThreeDecimals(player.coffeeRemaining - this.baseSipSize * this.owned * player.caffeineSacrificeProductionBonus);

	if(player.caffeineSiphon > 0 && this.owned > 0) {
		player.caffeineLevel = roundThreeDecimals(player.caffeineLevel + 1 * player.caffeineSiphon * player.caffeineTolerance * player.caffeineSacrificeProductionBonus);
	}

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

function loadWorkers(savedWorkers) {
	if(savedWorkers.length === workers.length) {
		for(var i = 0; i < workers.length; i++) {
			workers[i].name = savedWorkers[i].name;
			// workers[i].flavorText = savedWorkers[i].flavorText;
			// workers[i].unlockMugs = savedWorkers[i].unlockMugs;
			workers[i].baseSipSize = savedWorkers[i].baseSipSize;
			workers[i].emptyMugCost = savedWorkers[i].emptyMugCost;
			workers[i].owned = savedWorkers[i].owned;
			workers[i].numUpgrades = savedWorkers[i].numUpgrades;
		}
	}
	else {
		consoleDisplay.pushMessage("Sorry, Workers Have Been Updated And Your Worker Information Will Be Reset");
	}
}

var workers = [];


