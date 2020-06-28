Cultist.prototype.getTotalPower = function() { 
	return this.baseInfluence * this.owned;
}

Cultist.prototype.purchase = function() {

	var currentAmountOwned = this.owned;

	if(buyMultipleButton.value != "Max")
		var buyMultipleNumber = Number(buyMultipleButton.value);
	//Buy Multiple Functionality
	//Buy Max
	if(buyMultipleButton.value === "Max" && player.influence >= this.influenceCost) {
		while(player.influence >= this.influenceCost) {
			player.influence = roundThreeDecimals(player.influence - this.influenceCost);
			this.owned += 1;
			this.influenceCost = roundThreeDecimals(this.influenceCost * 1.2);
		}
		//Buy 5 or 10
	} else if(buyMultipleNumber != 1 && player.influence >= geometricSum(this.influenceCost, 1.2, buyMultipleNumber)) {
		player.influence = roundThreeDecimals(player.influence - geometricSum(this.influenceCost, 1.2, buyMultipleNumber))
		this.owned += Number(buyMultipleNumber);
		this.influenceCost = roundThreeDecimals(this.influenceCost * Math.pow(1.2, buyMultipleNumber));
		//Buy 1
	} else if(buyMultipleNumber === 1 && player.influence >= this.influenceCost) {
		player.influence = roundThreeDecimals(player.influence - this.influenceCost);
		this.owned += 1;
		this.influenceCost = roundThreeDecimals(this.influenceCost * 1.2);
		//Can't Afford
	} else {
		if(this.isUnlocked)
			consoleDisplay.pushMessage("You Cannot Afford " + this.name + " Right Now");
	}


	if(currentAmountOwned === 0 && this.owned > 0) {
		if(this.flavorText != "") {
			var tempCultist = this;
			setTimeout(function() {
				consoleDisplay.pushMessage(tempCultist.flavorText);
			}, 400);
		}	
	}
};

Cultist.prototype.generateInfluence = function() {
	player.influence = roundThreeDecimals(player.influence + this.baseInfluence * this.owned);
	return this.baseInfluence * this.owned;
}



function Cultist(name, flavorText, unlockInfluence, baseInfluence, influenceCost){
	this.name = name;
	this.flavorText = flavorText;
	this.unlockInfluence = unlockInfluence;
	this.baseInfluence = baseInfluence;
	this.owned = 0;
	this.influenceCost = influenceCost;
	this.isUnlocked = false;
};

var cultists = [];
