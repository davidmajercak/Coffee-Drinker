
Cultist.prototype.purchase = function() {
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
cultists = [
	new Cultist("Initiate","", 1, 1, 1),
	new Cultist("Zelator", "", 50, 5, 50),
	new Cultist("Adept", "", 1000, 10, 1000),
	new Cultist("Master", "", 10000, 25, 10000),
	new Cultist("Ipsissimus", "", 100000, 50, 100000),
];