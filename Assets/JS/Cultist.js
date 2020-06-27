
Cultist.prototype.purchase = function() {
	var purchasesRemaining = buyMultipleButton.value;
	if(player.influence >= this.influenceCost){
		player.influence = roundThreeDecimals(player.influence - this.influenceCost);
		this.owned += 1;
		this.influenceCost = roundThreeDecimals(this.influenceCost * 1.2);
	}
	else {
		if(this.isUnlocked)
			consoleDisplay.pushMessage("You cannot afford " + this.name + " right now");
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
