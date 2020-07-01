Cultist.prototype.getTotalPower = function() { 
	return this.baseInfluence * this.Hired;
}

Cultist.prototype.purchase = function() {
	var currentAmountHired = this.Hired;

	if(buyMultipleButton.value != "Max")
		var buyMultipleNumber = Number(buyMultipleButton.value);
	//Buy Multiple Functionality
	//Buy Max
	if(buyMultipleButton.value === "Max" && player.influence >= this.influenceCost) {
		while(player.influence >= this.influenceCost) {
			player.influence = roundThreeDecimals(player.influence - this.influenceCost);
			this.Hired += 1;
			this.influenceCost = roundThreeDecimals(this.influenceCost * 1.2);
		}
		//Buy 5 or 10
	} else if(buyMultipleNumber != 1 && player.influence >= geometricSum(this.influenceCost, 1.2, buyMultipleNumber)) {
		player.influence = roundThreeDecimals(player.influence - geometricSum(this.influenceCost, 1.2, buyMultipleNumber))
		this.Hired += Number(buyMultipleNumber);
		this.influenceCost = roundThreeDecimals(this.influenceCost * Math.pow(1.2, buyMultipleNumber));
		//Buy 1
	} else if(buyMultipleNumber === 1 && player.influence >= this.influenceCost) {
		player.influence = roundThreeDecimals(player.influence - this.influenceCost);
		this.Hired += 1;
		this.influenceCost = roundThreeDecimals(this.influenceCost * 1.2);
		//Can't Afford
	} else {
		if(this.isUnlocked)
			consoleDisplay.pushMessage("You Cannot Afford " + this.name + " Right Now");
	}

	if(currentAmountHired === 0 && this.Hired > 0) {
		if(this.flavorText != "") {
			var tempCultist = this;
			setTimeout(function() {
				consoleDisplay.pushMessage(tempCultist.flavorText);
			}, 400);
		}	
	}
};

Cultist.prototype.generateInfluence = function() {
	player.influence = roundThreeDecimals(player.influence + this.baseInfluence * this.Hired);
	return this.baseInfluence * this.Hired;
}



function Cultist(name, flavorText, unlockInfluence, baseInfluence, influenceCost){
	this.name = name;
	this.flavorText = flavorText;
	this.unlockInfluence = unlockInfluence;
	this.baseInfluence = baseInfluence;
	this.Hired = 0;
	this.influenceCost = influenceCost;
	this.isUnlocked = false;
};

function loadCultists(savedCultists) {
	if(savedCultists.length === cultists.length) {
		for(var i = 0; i < cultists.length; i++) {
			//cultists[i].name = savedCultists[i].name;
			//cultists[i].flavorText = savedCultists[i].flavorText;
			//cultists[i].unlockInfluence = savedCultists[i].unlockInfluence;
			//cultists[i].baseInfluence = savedCultists[i].baseInfluence;
			cultists[i].influenceCost = savedCultists[i].influenceCost;
			cultists[i].Hired = savedCultists[i].Hired;
			//cultists[i].isUnlocked = savedCultists[i].isUnlocked;
		}
	}
	else {
		consoleDisplay.pushMessage("Sorry, Cultists Have Been Updated And Your Cultist Information Will Be Reset");
	}

}

var cultists = [];
