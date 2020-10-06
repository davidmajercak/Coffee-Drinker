Game.prototype.prestige = function() {
	//Clear previous setTimeout
	//clearTimeout(gameLoopTimeout);

	drinkCoffeeButton.innerText = "Sip some Coffee";
	//Reset Text Color
	document.body.style.color = "rgb(255, 255, 255)";
	//Reset Button Color
	document.documentElement.style.setProperty("--button-text-color", "#F5ECE1");		
	document.documentElement.style.setProperty("--button-border-color", "#F5ECE1");
	//Clear Arrays
	workerButtons = [];
	cultistButtons = [];
	//Delete Old Buttons
	while(document.querySelectorAll(".upgradeButton").length > 0)
		document.querySelector(".upgradeButton").remove();

	while(document.querySelectorAll(".researchButton").length > 0)
		document.querySelector(".researchButton").remove();
	//Increment PrestigeCount
	this.prestigeCount++;

	//Re-initialize the Cult Tab
	for (var j = 0; j < godButtons.length; j++) {
		godButtons[j].style.display = "block";
	}

	document.querySelector("#godText").innerText = "Which Coffee God Will Your Cult Dedicate Itself to?";
	clearTimeout(autoSipper);
	drinkCoffeeButton.disabled = false;
	player.prestige();
	//Call Init Again
	this.init();
}

Game.prototype.initEventListeners = function () {
	if(!addedEventListeners) {
		for (var i = 0; i < workerButtons.length; i++) {
			workerButtons[i].addEventListener("click", function() {
				workers[this.value].purchase();

				if(workers[this.value].hired > 0)
				{
					game.updateWorkerButton(this.value);
				}
			});
		}

		for (var i = 0; i < cultistButtons.length; i++) {
			cultistButtons[i].addEventListener("click", function() {
				cultists[this.value].purchase();

				if(cultists[this.value].hired > 0)
				{
					game.updateCultistButton(this.value);
				}
			});
		}

		for (var i = 0; i < godButtons.length; i++) {
			godButtons[i].addEventListener("click", function() {
				player.chosenGod = this.value;
				document.querySelector("#godText").innerText = this.value + " is Pleased With Your Choice";

				for (var j = 0; j < godButtons.length; j++) {
					godButtons[j].style.display = "none";
				}

				if(player.chosenGod === "God of Better Coffee") {
					player.workerProductionBonus += 1;
					for(var i = 0; i < workers.length; i++) {
						game.updateWorkerButton(i);
					}
				} else if(player.chosenGod === "God of Time") {
					player.timeBonus += .2;
				} else if(player.chosenGod === "God of Knowledge") {
					player.researchBonus += .2;
				} else if(player.chosenGod === "God of Cults") {
					player.cultProductionBonus += 1;
					for(var i = 0; i < cultists.length; i++) {
						game.updateCultistButton(i);
					}
				}
				research.push(new Research("Ascend Into A Coffee God (Resets Game With Bonus)", "",						   0, 95, 0, 10000));	
			});
		}

		//If Player loads from save and has already chosen a god
		if(player.chosenGod != null) {
			//Update Cult Tab to Reflect the Chosen God
			for(var i = 0; i < godButtons.length; i++) {
				if(player.chosenGod == godButtons[i].value)
					godButtons[i].click();
			}
		}

		document.querySelector("#displayConsoleTop").addEventListener("click", consoleDisplay.moveUp);
		document.querySelector("#displayConsoleBottom").addEventListener("click", consoleDisplay.moveDown);

		drinkCoffeeButton.addEventListener("click", drinkCoffeeClick);

		//Add Event Listener to the Whole Row instead of just the button (larger clickable area)
		document.querySelector("#buyMultipleRow").addEventListener("click", buyMultiple)

		addedEventListeners = true;
	}
}


Game.prototype.init = function() {

	if(!game.justPrestiged)
		player = new Player();

	this.initCultists();
	this.initResearch();
	this.initUpgrades();
	this.initWorkers();

	var savegame = JSON.parse(localStorage.getItem("save"));
	
	if(typeof savegame != "undefined" && savegame != null && !loadedGame && !game.justPrestiged) {
		load();
	}



	for (var i = 0; i < workers.length; i++)
	{
		workerButtons.push(document.querySelector("#workerButton" + (i + 1)));
		workerButtons[i].innerHTML = workers[i].name + "<div> Mug Cost: " + displayNumber(workers[i].emptyMugCost) + " Empty Mugs</div>";
		workerButtons[i].value = i;

		//If Player loads a save an has bought at least one of the workers, update the button
		if(workers[i].hired > 0)
			game.updateWorkerButton(i);
	}

	for (var i = 0; i < cultists.length; i++)
	{
		cultistButtons.push(document.querySelector("#cultistButton" + (i + 1)));
		cultistButtons[i].innerHTML = cultists[i].name + "<div> Cost: " + displayNumber(cultists[i].influenceCost) + " Influence</div>";
		cultistButtons[i].value = i;

		//If Player loads a save an has bought at least one of the workers, update the button
		if(cultists[i].hired > 0)
			game.updateCultistButton(i);
	}

	for (var i = 0; i < document.querySelectorAll(".godButton").length; i++) 
	{
		godButtons.push(document.querySelectorAll(".godButton")[i]);
	}

	this.initEventListeners();
	

	document.querySelector("body").style.transition = "background-color 5s";
	document.querySelector("#drinkCoffeeButton").style.transition = "opacity .9s";

	setTimeout(function() {
		gameInitialized = true;
		if(player.hasAutoSipper) {
			player.hasAutoSipper = true;
			drinkCoffeeClick();
			drinkCoffeeButton.innerText = "I'm Always Sippin'!";
		}
	}, 500);
	


	if(!gameLoopTimeout)
		game.gameLoop();
};

function buyMultiple() {
	if(player.hasUnlockedBuyMultiple) {
		if(buyMultipleButton.value == 1) {
			buyMultipleButton.value = 5;
			buyMultipleButton.innerText = "x5";
		} else if(buyMultipleButton.value == 5) {
			buyMultipleButton.value = 10;
			buyMultipleButton.innerText = "x10";
		} else if(buyMultipleButton.value == 10) {
			buyMultipleButton.value = "Max";
			buyMultipleButton.innerText = "Max";
		} else {
			buyMultipleButton.value = 1;
			buyMultipleButton.innerText = "x1";
		}

		//Update Worker Buttons to reflect new cost
		for (var i = 0; i < workerButtons.length; i++) {
			game.updateWorkerButton(i);
		}
		//Update Cultist Buttons
		for (var i = 0; i < cultistButtons.length; i++) {
			game.updateCultistButton(i);
		}

	}
};

var autoSipper;
function drinkCoffeeClick(){
	player.takeSip();

	//TODO - Create an update display function

	//Disable Drinking coffees for 2 seconds after having a sip
	drinkCoffeeButton.disabled = true;
	autoSipper = setTimeout(function() {
		if(player.hasAutoSipper){
			drinkCoffeeClick();
		} else {
			drinkCoffeeButton.disabled = false;
		}
	}, 4 * tickSpeed);
};


Game.prototype.updateGameState = function() {
	if(gameInitialized) {
		this.unlockElements();

		this.updateUpgrades();
		this.updateCultists();
		this.updateWorkers();

		if(frameCounter % 3 === 0)
			this.updateResearch();


		if(frameCounter % 5 === 0)
		{

			player.updateCaffeineLevel();
		}

		//Update Buttons for purchased Workers every 8 frames when Buy Max is selected
		if(frameCounter % 8 === 0 && buyMultipleButton.value === "Max")
		{
			for (var i = 0; i < workerButtons.length; i++) {
				game.updateWorkerButton(i);
			}
			for (var i = 0; i < cultistButtons.length; i++) {
				game.updateCultistButton(i);
			}
		}



		frameCounter++;

		caffeineColorScheme();
		
		this.updateDisplay();
	}
};

Game.prototype.updateDisplay = function() {
	//Update displays at the end of the game loop to keep display consistent
	emptyMugsDisplay.textContent = displayNumber(player.emptyMugs);
	coffeeRemainingDisplay.textContent = displayNumber(player.coffeeRemaining * 100) + "%";
	sipSizeDisplay.textContent = displayNumber(player.calculateSipSize());
	influenceDisplay.textContent = displayNumber(player.influence);

	//Update Stats in the Stats Tab
	gameTickSpeedDisplay.innerText =  roundThreeDecimals(tickSpeed) + " ms";
	//totalEmptyMugsDisplay.innerText = player.allTimeCoffee;

	//Make sure caffeine level does not exceed current max caffeine level
	if(player.caffeineLevel > player.maxCaffeineLevel)
		player.caffeineLevel = player.maxCaffeineLevel;
	caffeineLevelDisplay.textContent = displayNumber(player.caffeineLevel) + "%";
};

Game.prototype.unlockElements = function() {
	if(!player.hasUnlockedUpgrades && player.emptyMugs >= 1){
		document.querySelector("#upgrades h2").classList.remove("hide");
		player.hasUnlockedUpgrades = true;
		consoleDisplay.pushMessage("Click On The Upper Half Of This Box To Scroll Up");
		consoleDisplay.pushMessage("Click On The Lower Half Of This Box To Scroll Down");
		for(var i = 0; i < document.querySelectorAll("li").length; i++)
		{
			document.querySelectorAll("li")[i].classList.remove("hide");
		}
	}

	if(!tabsDisplayed && game.prestigeCount > 0) {
		var tabs = document.querySelectorAll(".tab");
	
		for(var i = 0; i < tabs.length; i++) {
			tabs[i].style.maxHeight = "200px";
		}
	}

	//Show the Research Header if unlock first research or user loads a saved game in which this research was already completed
	if(research[0].isUnlocked || research[0].isCompleted){
		document.querySelector("#research h2").classList.remove("hide");
	}

	for(var i = 0; i < workers.length; i++)
	{
		if(!workers[i].isUnlocked && workers[i].unlockMugs <= player.emptyMugs || workers[i].hired > 0)
		{
			if(i === 0)
			{
				document.querySelector("#workers h2").classList.remove("hide");
				if(document.querySelector(".hide3"))
					document.querySelector(".hide3").classList.remove("hide3");
			}

			workerButtons[i].classList.remove("hide");
			workers[i].isUnlocked = true;
		}
	}

	if(!player.unlockedBuyMultiple && (workers[0].hired >= 5 || workers[3].isUnlocked)) {
		player.hasUnlockedBuyMultiple = true;
		document.querySelector("#buyMultipleRow").classList.remove("hide");
	}

};

function caffeineColorScheme(){
	if(player.caffeineLevel < .98)
	 	document.body.style.backgroundColor = "rgb(75, 49, 27)";
	else if(player.caffeineLevel >= 99.98){
		//This off-white background hurts my eyes less
		document.body.style.backgroundColor = "rgb(225, 225, 225)";
		document.body.style.color = "rgb(0, 0, 0)";

		document.documentElement.style.setProperty("--button-text-color", "#000");		
		document.documentElement.style.setProperty("--button-border-color", "#000");
	}
	else if(player.caffeineLevel >= 49.98)
	{
		//Change Text color back to lighter color caffeine falls back below 99.98
		document.body.style.backgroundColor = "rgb(0, 0, 0)";
		document.body.style.color = "rgb(245, 236, 225)";


		document.documentElement.style.setProperty("--button-text-color", "#F5ECE1");		
		document.documentElement.style.setProperty("--button-border-color", "#F5ECE1");
	}
	else if(player.caffeineLevel >= 24.98)
		document.body.style.backgroundColor = "rgb(40, 16, 6)";
	else if(player.caffeineLevel >= 9.98)
		document.body.style.backgroundColor = "rgb(55, 29, 11)";
	else if(player.caffeineLevel >= .98)
		document.body.style.backgroundColor = "rgb(65, 39, 17)";
};


Game.prototype.updateUpgrades = function() {
	
	var currentUpgradeButtons = document.querySelectorAll(".upgradeButton");

	upgrades.forEach(function(upgrade){
		//Highlight affordable upgrades in green
		for(var i = 0; i < currentUpgradeButtons.length; i++) {
			if(player.emptyMugs >= upgrade.emptyMugCost && currentUpgradeButtons[i].value == upgrades.indexOf(upgrade)) {
				currentUpgradeButtons[i].classList.add("canAfford");
				break;
			} else if(player.emptyMugs < upgrade.emptyMugCost && currentUpgradeButtons[i].value == upgrades.indexOf(upgrade)) {
				currentUpgradeButtons[i].classList.remove("canAfford");
				break;
			}
		}
		//Limit of 4 upgrades on display
		if(!upgrade.isUnlocked && document.querySelector("#upgrades").childElementCount <= 4 && upgrade.canUnlock())
		{
			upgrade.addButton();
		}
		
	});
};

Game.prototype.updateResearch = function() {
	//Remove 1 second from each active research while it isStarted

	research.forEach(function(research){
		// TODO - Implement research to change max number of researches Limit of 1 ?  upgrades on display

		if(research.isStarted && !research.isCompleted){
			research.updateDisplay();
		}
		if(document.querySelector("#research").childElementCount > player.numResearches)
			return;	//No more research until current research is completed
		if(!research.isUnlocked && research.canUnlock())
		{
			research.addButton();
		}
	});
};

var gameLoopTimeout = 0;

Game.prototype.gameLoop = function() {
	this.updateGameState();

	gameLoopTimeout = setTimeout(function() {
		game.gameLoop();
	}, tickSpeed);
};

Game.prototype.updateWorkers = function() {
	var mugsPerSecond = 0;
	for(var i = 0; i < workers.length; i++)
	{
		if(!workers[i].isUnlocked && workers[i].unlockMugs <= player.emptyMugs){
			workerButtons[i].classList.remove("hide");
		} 

		if(buyMultipleButton.value === "1" || buyMultipleButton.value === "Max") {
			if(player.emptyMugs >= workers[i].emptyMugCost) {
				workerButtons[i].classList.add("canAfford");
			}
			else
			{
				workerButtons[i].classList.remove("canAfford");
			}
		}
		else {
			if(player.emptyMugs >= roundThreeDecimals(geometricSum(workers[i].emptyMugCost, 1.2, buyMultipleButton.value))) {
				workerButtons[i].classList.add("canAfford");
			}
			else
			{
				workerButtons[i].classList.remove("canAfford");
			}
		}

		workers[i].generateProduction()
		mugsPerSecond += workers[i].getTotalPower();
	}

	mugsPerSecondDisplay.innerText = displayNumber(mugsPerSecond);
};

Game.prototype.updateCultists = function() {
	var influencePerSecond = 0;
	for(var i = 0; i < cultists.length; i++) {

		if(!cultists[i].isUnlocked && (cultists[i].unlockInfluence <= player.influence || cultists[i].hired > 0)){	
			//Unhide the associated cultist button and set isUnlocked to true
			cultistButtons[i].classList.remove("hide");
			cultists[i].isUnlocked = true;

			if(i === 0)
			{
				//Add "Cultists" above the column
				document.querySelector("#cultists h2").classList.remove("hide");				
				//Add influence to main stats display
				for(var j = 0; j < document.querySelectorAll("li").length; j++)
				{
					document.querySelectorAll("li")[j].classList.remove("hide2");
				}

			} else if(i === 3 || game.prestigeCount > 0) {

				//Change Name To Coffee Cultist
				mainTitleDisplay.textContent = "Cultist";
				//Show Tab Selection
				var tabs = document.querySelectorAll(".tab");
	
				for(var i = 0; i < tabs.length; i++) {
					tabs[i].style.maxHeight = "200px";
				}

				if(game.prestigeCount === 0)
					consoleDisplay.pushMessage("You Unlocked Tabs!");

				if(player.chosenGod == null)
					consoleDisplay.pushMessage("It is Time to Decide What You Are Working Towards");

			}

		}

		if(buyMultipleButton.value === "1" || buyMultipleButton.value === "Max") {
			if(player.influence >= cultists[i].influenceCost) {
				cultistButtons[i].classList.add("canAfford");
			}
			else
			{
				cultistButtons[i].classList.remove("canAfford");
			}
		}
		else {
			if(player.influence >= roundThreeDecimals(geometricSum(cultists[i].influenceCost, 1.2, buyMultipleButton.value))) {
				cultistButtons[i].classList.add("canAfford");
			}
			else
			{
				cultistButtons[i].classList.remove("canAfford");
			}
		}

		cultists[i].generateInfluence();
		influencePerSecond += cultists[i].getTotalPower();
	}

	influencePerSecondDisplay.innerText = displayNumber(influencePerSecond);
};

Game.prototype.updateWorkerButton = function(index) {

	workerButtons[index].innerHTML = workers[index].name;

	if(buyMultipleButton.value === "Max") {
		var tempCost = workers[index].emptyMugCost;
		var tempCostTotal = 0;
		var tempPlayerMugs = player.emptyMugs;

		while(tempPlayerMugs >= tempCost) {
			tempPlayerMugs = roundThreeDecimals(tempPlayerMugs - tempCost);
			tempCostTotal += tempCost;
			tempCost = roundThreeDecimals(tempCost * 1.2);
		}

		if(tempCostTotal === 0)
			workerButtons[index].innerHTML += "<div>Cost: " + displayNumber(workers[index].emptyMugCost) + " Empty Mugs</div>";
		else 
			workerButtons[index].innerHTML += "<div>Cost: " + displayNumber(tempCostTotal) + " Empty Mugs</div>";
	} else if(buyMultipleButton.value === "1") {
		workerButtons[index].innerHTML += "<div>Cost: " + (displayNumber(workers[index].emptyMugCost)) + " Empty Mugs</div>";
	} else {
		workerButtons[index].innerHTML += "<div>Cost: " + displayNumber(geometricSum(workers[index].emptyMugCost, 1.2, buyMultipleButton.value)) + " Empty Mugs</div>";
	}

	//Only Show Extended Information for Workers that are hired
	if(workers[index].hired > 0)
		workerButtons[index].innerHTML +=
								"<div>Cost Efficiency (Mugs per Second / Cost): " + (displayNumber(workers[index].baseSipSize/workers[index].emptyMugCost*1000)) + "%" +
								"<div>Sip Size(Each): " + displayNumber(workers[index].baseSipSize * player.workerProductionBonus * player.caffeineSacrificeProductionBonus) + " Mugs</div>" +
								"<div>Hired: " + displayNumber(workers[index].hired) + "</div>" +
								"<div>Sip Size(Total): " + displayNumber(workers[index].getTotalPower()) + " Mugs</div>";
	
	
};


Game.prototype.updateCultistButton = function(index) {

	cultistButtons[index].innerHTML = cultists[index].name;

	if(buyMultipleButton.value === "Max") {
		var tempCost = cultists[index].influenceCost;
		var tempCostTotal = 0;
		var tempPlayerInfluence = player.influence;

		while(tempPlayerInfluence >= tempCost) {
			tempPlayerInfluence = roundThreeDecimals(tempPlayerInfluence - tempCost);
			tempCostTotal += tempCost;
			tempCost = roundThreeDecimals(tempCost * 1.2);
		}

		if(tempCostTotal === 0)
			cultistButtons[index].innerHTML += "<div>Cost: " + displayNumber(cultists[index].influenceCost) + " Influence</div>";
		else 
			cultistButtons[index].innerHTML += "<div>Cost: " + displayNumber(tempCostTotal) + " Influence</div>";
	} else if(buyMultipleButton.value === "1") {
		cultistButtons[index].innerHTML += "<div>Cost: " + (displayNumber(cultists[index].influenceCost)) + " Influence</div>";
	} else {
		cultistButtons[index].innerHTML += "<div>Cost: " + displayNumber(geometricSum(cultists[index].influenceCost, 1.2, buyMultipleButton.value)) + " Influence</div>";
	}

	//Only Show Extended Information for cultists that are hired
	if(cultists[index].hired > 0)
		cultistButtons[index].innerHTML +=
								"<div>Cost Efficiency (Influence / Cost): " + (displayNumber(cultists[index].baseInfluence/cultists[index].influenceCost*1000)) + "%" +
								"<div>Influence Production(Each): " + displayNumber(cultists[index].baseInfluence * player.cultProductionBonus) + "</div>" + 
								"<div>Hired: " + displayNumber(cultists[index].hired) + "</div>" + 
								"<div>Influence Production(Total): " + displayNumber(cultists[index].baseInfluence * cultists[index].hired * player.cultProductionBonus)+ "</div>";
}


function Game() {
	this.prestigeCount = 0;
	this.justPrestiged = false;
};

Game.prototype.loadGame = function (savedGame) {
	this.prestigeCount = savedGame.prestigeCount;
	this.justPrestiged = savedGame.justPrestiged;
};

//Should be outside loop
workerButtons = [];
cultistButtons = [];
godButtons = [];

drinkCoffeeButton = document.querySelector("#drinkCoffeeButton");
emptyMugsDisplay = document.querySelector("#emptyMugs");
mugsPerSecondDisplay = document.querySelector("#emptyMugsSec");
influencePerSecondDisplay = document.querySelector("#influencePerSecond")
caffeineLevelDisplay = document.querySelector("#caffeineLevel");
coffeeRemainingDisplay = document.querySelector("#coffeeRemaining");
sipSizeDisplay = document.querySelector("#sipSize");
influenceDisplay = document.querySelector("#influence");
mainTitleDisplay = document.querySelector("#mainTitle");
buyMultipleButton = document.querySelector("#buyMultiple");
version = document.querySelector("#version").innerText;

frameCounter = 0; 	//Keeps track of the number of game update cycles so far
tickSpeed = 500; 	//The time in milliseconds between each game tick 

var game = new Game();

function roundThreeDecimals(num){
	return Math.round((num) * 1000000) / 1000000;
}

function displayNumber(num){
 	if(Math.abs(num) >= 100000 || (Math.abs(num) > 0 && Math.abs(num) < .001))
 		return num.toExponential(3);
 	else
 		return Math.round((num) * 1000) / 1000;
}

Game.prototype.initCultists = function() {
	cultists = [
		new Cultist("Initiate","This Game Is Still About Drinking Coffee, Right?", 1, .25 * player.cultProductionBonus, 1),
		new Cultist("Zelator", "", 50, 1 * player.cultProductionBonus, 50),
		new Cultist("Adept", "", 1000, 5 * player.cultProductionBonus, 1000),
		new Cultist("Master", "", 10000, 10 * player.cultProductionBonus, 10000),
		new Cultist("Ipsissimus", "", 100000, 50 * player.cultProductionBonus, 100000),
	];
};

Game.prototype.initResearch = function() {
																						//prerequisitieResearch and callback are optional
	//(name, flavorText, researchTime, unlockCaffeineLevel, caffeineCost, unlockInfluence, prerequisiteResearch, callback)
	research[0] = new Research("Think About Why You're Doing This", "The Higher Your Caffeine Level, The Faster Time Will Go", 5, .2, 0, 0);
	research[1] = new Research("Think a Little Harder This Time", "Some Upgrades Only Serve As A Stepping Stone To Others(Just Like In Real Life!)", 10, .3, 0, 0, 0);
	research[2] = new Research("Get your G.E.D.", "", 30, 0, 0, 0, 1, function() {
		player.numResearches += 1;
		consoleDisplay.pushMessage("You Can Now Research " + player.numResearches + " Researches At A Time!");
	});
	research[3] = new Research("Apply To College", "", 20, 0, 0, 0, 2);
	research[4] = new Research("Decide On A College Major", "Coffee Is Not A Major... Horseradish Is Not A Major Either", 5, 0, 0, 0, 3);
	research[5] = new Research("BS In Chemistry", "", 180, 0, 0, 0, 4, function() {
		player.numResearches += 1;
		consoleDisplay.pushMessage("You Can Now Research " + player.numResearches + " Researches At A Time!");
	});
	research[6] = new Research("MS In Chemistry", "What The Heck, This Is Just A Useless Piece Of Paper!", 240, 0, 0, 0, 5);
	research[7] = new Research("PHD In Chemistry", "", 480, 0, 0, 0, 6, function() {
		player.numResearches += 1;
		consoleDisplay.pushMessage("You Can Now Research " + player.numResearches + " Researches At A Time!");
	});
	research[8] = new Research("A Voice Calls Out To You (Listen)", "You Can't Quite Make Out What The Voice is Saying...", 15, 1, 0, 0, 0);
	research[9] = new Research("Listen Closely To The Voice", "The Voice Told You To Start a Cult", 15, 1.5, 0, 0, 8);
	research[10] = new Research("Start A Cult", "Well, That Escalated Quickly", 60, 0, 0, 0, 9, function() {
		cultists[0].hired = 1;
	});
	research[11] = new Research("Auto-Sipper", "That's My Secret, I'm Always Sippin'!", 60, 0, 0, 10, 0, function() {
		consoleDisplay.pushMessage("You will Now Automatically Sip From The Mug When Available (No More Clicking)!");
		player.hasAutoSipper = true;
		drinkCoffeeClick();
		drinkCoffeeButton.innerText = "I'm Always Sippin'!";
	});
	research[12] = new Research("Caffeine Siphon Prototype", "", 120, 0, 0, 1000, 0, function() {
		player.caffeineSiphon += .1;
		consoleDisplay.pushMessage("You Now Siphon " + roundThreeDecimals(player.caffeineSiphon * 100) + "% Caffeine From Workers");
	});
	research[13] = new Research("Caffeine Siphon v1", "", 150, 0, 0, 10000, 12, function() {
		player.caffeineSiphon += .2;
		consoleDisplay.pushMessage("You Now Siphon " + roundThreeDecimals(player.caffeineSiphon * 100) + "% Caffeine From Workers");
	});
	research[14] = new Research("Caffeine Siphon v2", "", 180, 0, 0, 100000, 13, function() {
		player.caffeineSiphon += .2;
		consoleDisplay.pushMessage("You Now Siphon " + roundThreeDecimals(player.caffeineSiphon * 100) + "% Caffeine From Workers");
	});
	research[15] = new Research("Perfect Caffeine Siphon", "", 210, 0, 0, 1000000, 14, function() {
		player.caffeineSiphon = 1;
		consoleDisplay.pushMessage("You Now Siphon " + roundThreeDecimals(player.caffeineSiphon * 100) + "% Caffeine From Workers");
	});
	research[16] = new Research("Caffeine Sacrifice Ritual", "", 180, 50, 40, 10000, 0, function() {
		player.caffeineSacrificeProductionBonus = roundThreeDecimals(player.caffeineSacrificeProductionBonus * 1.5);
		consoleDisplay.pushMessage("Your Workers Now Have 50% Bigger Sip Size");
		for(var i = 0; i < workers.length; i++) {
			workers[i].baseSipSize = roundThreeDecimals(workers[i].baseSipSize * 1.5)
			game.updateWorkerButton(i);
		}
	});
	research[17] = new Research("Caffeine Sacrifice Ritual 2", "", 360, 80, 70, 100000, 16, function() {
		player.caffeineSacrificeProductionBonus = roundThreeDecimals(player.caffeineSacrificeProductionBonus * 1.5);
		consoleDisplay.pushMessage("Your Workers Now Have 50% Bigger Sip Size Again");
		for(var i = 0; i < workers.length; i++) {
			workers[i].baseSipSize = roundThreeDecimals(workers[i].baseSipSize * 1.5)
			game.updateWorkerButton(i);
		}
	});
	research[18] = new Research("Caffeine Sacrifice Ritual 3", "", 720, 90, 80, 1000000, 17, function() {
		player.caffeineSacrificeProductionBonus = roundThreeDecimals(player.caffeineSacrificeProductionBonus * 1.5);
		consoleDisplay.pushMessage("Your Workers Now Have 50% Bigger Sip Size A Third Time");
		for(var i = 0; i < workers.length; i++) {
			workers[i].baseSipSize = roundThreeDecimals(workers[i].baseSipSize * 1.5)
			game.updateWorkerButton(i);
		}
	});
	research[19] = new Research("Max Caffeine To 105", "", 360, 100, 0, 100000, 0, function() {
		player.maxCaffeineLevel = 105;
	});
};

Game.prototype.initUpgrades = function() {
	//(name, flavorText, unlockMugs, emptyMugCost, prerequisiteUpgrade, associatedWorkerIndex, updateName, callback) {

	upgrades[0] = new Upgrade("Become Slightly More Thirsty", "", 1, .5, -1, -1, false, function(){
		player.increaseSipSize(.05);
	});
	upgrades[1] = new Upgrade("Become Slightly More Thirsty Again", "", 1.5, 1.5, 0, -1, false, function(){
		player.increaseSipSize(.05);
	});
	upgrades[2] = new Upgrade("Pretzels That Make You Thirsty", "These Pretzels Are Making Me Thirsty!!!", 2, 2, 1, -1, false, function(){
		player.increaseSipSize(.15);
	});
	upgrades[3] = new Upgrade("Coffee That Doesn't Burn Your Mouth As Much", "Coffee That Doesn't Burn At All Is Asking For A Lot", 4, 4, 2, -1, false, function(){
		player.increaseSipSize(.3);
	});
	upgrades[4] = new Upgrade("Confidence In Yourself", "Best 8 Empty Mugs You Ever Spent", 8, 8, 3, -1, false, function(){
		player.increaseSipSize(.5);
	});
	upgrades[5] = new Upgrade("Wide-Mouth Coffee Mug", "If Only Your Mug Would Change Color When Your Coffee Is As Hot As The Rockies", 32, 32, 4, -1, false, function(){
		player.increaseSipSize(1);
	});
	upgrades[6] = new Upgrade("Aerodynamic Mug", "", 1000, 100, 5, -1, false, function(){
		player.increaseSipSize(5);
	});
	upgrades[7] = new Upgrade("Extreme Thirst", "This Is An Extreme Thirst", 10000, 10000, 6, -1, false, function(){
		player.increaseSipSize(10);
	});
	upgrades[8] = new Upgrade("Extreme Thirst 2", "This Is An Extreme Thirst 2", 100000, 100000, 7, -1, false, function(){
		player.increaseSipSize(25);
	});
	upgrades[9] = new Upgrade("Sentient Mug", "Personally, I Feel That A Sentient Mug Would Slow Me Down...", 1000000, 1000000, 8, -1, false, function(){
		player.increaseSipSize(50);
	});
	upgrades[10] = new Upgrade("Improved Friends", "Friendlier Friends!", 5, 5, -1, 0, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(2);
	});
	upgrades[11] = new Upgrade("Robo-Friends", "I Think I Liked Them More Before They Were Robots...", 10, 10, 10, 0, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(2);
	});
	upgrades[12] = new Upgrade("Best Friends", "Now You Have More Than One Best Friend!", 50, 50, 11, 0, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(2);
	});
	upgrades[13] = new Upgrade("Robo-Best Friends", "Hey There Have You Heard About My Robot Friend?", 150, 150, 12, 0, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(2);
	});
	upgrades[14] = new Upgrade("Super Friends", "Meanwhile, At The Hall Of Coffee Drinking", 1000, 1000, 13, 0, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(2);
	});
	upgrades[15] = new Upgrade("Make The Horse Drink", "The Horse Drinks, Therefore It Is", 20, 20, -1, 1, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[16] = new Upgrade("Make The Horse Drink More", "Man, That Proverb Was Way Off", 130, 130, 15, 1, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[17] = new Upgrade("Put The Horse Before The Mug", "", 400, 400, 16, 1, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[18] = new Upgrade("Horses That Aren't Annoyed By Puns Or Proverbs", "Want To Hear Another Pun? \"Neigh.\"", 2500, 2500, 17, 1, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[19] = new Upgrade("Teach An Old Horse New Tricks", "", 15000, 15000, 18, 1, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[20] = new Upgrade("Older Men Who Drink Blacker Coffee", "", 100, 100, -1, 2, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[21] = new Upgrade("Oldest Men Who Drink Blackest Coffee", "", 500, 500, 20, 2, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[22] = new Upgrade("Less Grumpy Old Men", "", 2500, 2500, 21, 2, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[23] = new Upgrade("Move The Old Men To Sumter County, Florida", "This Is Exactly The County For Old Men", 10000, 10000, 22, 2, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[24] = new Upgrade("Free Newspapers For Old Men", "", 100000, 100000, 23, 2, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[25] = new Upgrade("Improved Vacuums", "", 300, 300, -1, 3, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[26] = new Upgrade("Vacuums That Suck", "Technically An Improvement", 1500, 1500, 25, 3, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[27] = new Upgrade("Vacuums That Suck More", "Technically More Of An Improvement", 5000, 5000, 26, 3, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[28] = new Upgrade("Wet/Dry Vac", "", 25000, 25000, 27, 3, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[29] = new Upgrade("iCoffee Brand Vacuum", "State Of The Art", 125000, 125000, 28, 3, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(3);
	});
	upgrades[30] = new Upgrade("Trained Nurses", "Wait... Were They Untrained Before?", 5000, 5000, -1, 4, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(4);
	});
	upgrades[31] = new Upgrade("Bigger Needles", "Maybe Bigger Needles Help", 35000, 35000, 30, 4, false, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(4);
	});
	upgrades[32] = new Upgrade("Nurses That Drink Coffee", "", 135000, 135000, 31, 4, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(4);
	});
	upgrades[33] = new Upgrade("Super Nurses", "", 335000, 335000, 32, 4, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(4);
	});
	upgrades[34] = new Upgrade("Super Robo Nurses That Drink Coffee", "", 935000, 935000, 33, 4, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(4);
	});
	upgrades[35] = new Upgrade("Espressothulu", "", 100000, 100000, -1, 5, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(5);
	});
	upgrades[36] = new Upgrade("Coldbrewthulu", "", 300000, 300000, 35, 5, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(5);
	});
	upgrades[37] = new Upgrade("Cappucinothulu", "", 900000, 900000, 36, 5, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(5);
	});
	upgrades[38] = new Upgrade("Mochathulu", "", 2500000, 2500000, 37, 5, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(5);
	});
	upgrades[39] = new Upgrade("Frenchpressthulu", "", 5000000, 5000000, 38, 5, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(5);
	});
	upgrades[40] = new Upgrade("Monster With One Billion Mouths", "", 1000000, 1000000, -1, 6, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[41] = new Upgrade("Monster With One Trillion Mouths", "", 5000000, 5000000, 40, 6, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[42] = new Upgrade("More Motivated Mouth Monster", "", 25000000, 25000000, 41, 6, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[43] = new Upgrade("Master Motivated Mouth Monster", "", 85000000, 85000000, 42, 6, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
	upgrades[44] = new Upgrade("Machiavellian Master Motivated Mouth Monster", "", 285000000, 285000000, 43, 6, true, function(){
		workers[this.associatedWorkerIndex].increaseSipSize(6);
	});
};

Game.prototype.initWorkers = function() {
	workers = [
		new Worker("Hire A Friend To Help You Drink Coffee", "Is It Weird If You Share A Mug? ... Nah", 1.5, .01, 1),
		new Worker("Hire A Trained Horse", "You Can Lead A Horse To Coffee...", 4, .03, 4),
		new Worker("Hire An Old Man That Drinks Black Coffee", "You Know The One", 20, .1, 20),
		new Worker("Hook Up A Vacuum To Your Coffee Mug", "You Really Should Have Thought of This Earlier", 100, .5, 100),
		new Worker("Hire A Nurse To Give You Coffee Intravenously", "This Is Getting Pretty Hardcore", 500, 2, 500),
		new Worker("Coffeethulu", "Kinda Creepy", 25000, 10, 25000),
		new Worker("Monster With One Million Mouths", "All The Better To Drink Coffee With", 250000, 100, 250000)
	];
};

Game.prototype.updateWorkerButtonName = function(index, newName) {
	setTimeout(function(){
		workers[index].name = newName;
		game.updateWorkerButton(index);
	}, 50)
};
