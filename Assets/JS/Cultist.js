
Cultist.prototype.purchase = function() {
	if(player.influence >= this.influenceCost){
		player.influnce = roundTwoDecimals(player.influence - this.influenceCost);
		this.owned += 1;
		this.influenceCost = roundTwoDecimals(this.influenceCost * 1.2);
	}
	else {
		if(this.isUnlocked)
			consoleDisplay.pushMessage("You cannot afford " + this.name + " right now");
	}
};

Cultist.prototype.generateInfluence = function() {
	player.influence = roundTwoDecimals(player.influence + this.baseInfluence * this.owned);
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

var cultists = [
	new Cultist("Initiate","", 1, 1, 1),
	new Cultist("Zelator", "", 10, 5, 10),
	new Cultist("Adept", "", 200, 10, 200),
	new Cultist("Master", "", 1000, 25, 1000),
	new Cultist("Ipsissimus", "", 10000, 50, 10000),
];