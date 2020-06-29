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

				if(workers[this.value].owned > 0)
				{
					game.updateWorkerButton(this.value);
				}
			});
		}

		for (var i = 0; i < cultistButtons.length; i++) {
			cultistButtons[i].addEventListener("click", function() {
				cultists[this.value].purchase();

				if(cultists[this.value].owned > 0)
				{
					game.updateCultistButton(this.value);
				}
			});
		}

		for (var i = 0; i < godButtons.length; i++) {
			godButtons[i].addEventListener("click", function() {
				player.chosenGod = this.value;
				document.querySelector("#godText").innerText = this.value + " is Pleased With Your Choice"
				+ "\nHowever, It Doesn't Look Like They Gave You Their Blessing Just Yet...";

				for (var j = 0; j < godButtons.length; j++) {
					godButtons[j].style.display = "none";
				}
				research.push(new Research("Ascend Into A Coffee God (Resets Game With Bonus)", "",						   5, 100, 0, 0));	
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
		workerButtons[i].innerHTML = workers[i].name + "<div> Mug Cost: " + workers[i].emptyMugCost + " Empty Mugs</div>";
		workerButtons[i].value = i;

		//If Player loads a save an has bought at least one of the workers, update the button
		if(workers[i].owned > 0)
			game.updateWorkerButton(i);
	}

	for (var i = 0; i < cultists.length; i++)
	{
		cultistButtons.push(document.querySelector("#cultistButton" + (i + 1)));
		cultistButtons[i].innerHTML = cultists[i].name + "<div> Cost: " + (cultists[i].influenceCost) + " Influence</div>";
		cultistButtons[i].value = i;

		//If Player loads a save an has bought at least one of the workers, update the button
		if(cultists[i].owned > 0)
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
	emptyMugsDisplay.textContent = roundThreeDecimals(player.emptyMugs);
	coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
	sipSizeDisplay.textContent = player.calculateSipSize();
	influenceDisplay.textContent = player.influence;

	//Update Stats in the Stats Tab
	gameTickSpeedDisplay.innerText =  roundThreeDecimals(tickSpeed) + " ms";
	//totalEmptyMugsDisplay.innerText = player.allTimeCoffee;

	//Make sure caffeine level does not exceed current max caffeine level
	if(player.caffeineLevel > player.maxCaffeineLevel)
		player.caffeineLevel = player.maxCaffeineLevel;
	caffeineLevelDisplay.textContent = player.caffeineLevel + "%";

	this.updateMugsPerSecond();
};

Game.prototype.updateMugsPerSecond = function() {
	for(var i = 0; i < workers.length; i++) {

	}
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
		if(!workers[i].isUnlocked && workers[i].unlockMugs <= player.emptyMugs || workers[i].owned > 0)
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

	if(!player.unlockedBuyMultiple && (workers[0].owned >= 5 || workers[3].isUnlocked)) {
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

	mugsPerSecondDisplay.innerText = roundThreeDecimals(mugsPerSecond);
};

Game.prototype.updateCultists = function() {
	var influencePerSecond = 0;
	for(var i = 0; i < cultists.length; i++) {

		if(!cultists[i].isUnlocked && (cultists[i].unlockInfluence <= player.influence || cultists[i].owned > 0)){	
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

	influencePerSecondDisplay.innerText = roundThreeDecimals(influencePerSecond);
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
			workerButtons[index].innerHTML += "<div>Cost: " + workers[index].emptyMugCost + " Empty Mugs</div>";
		else 
			workerButtons[index].innerHTML += "<div>Cost: " + roundThreeDecimals(tempCostTotal) + " Empty Mugs</div>";
	} else if(buyMultipleButton.value === "1") {
		workerButtons[index].innerHTML += "<div>Cost: " + (roundThreeDecimals(workers[index].emptyMugCost)) + " Empty Mugs</div>";
	} else {
		workerButtons[index].innerHTML += "<div>Cost: " + roundThreeDecimals(geometricSum(workers[index].emptyMugCost, 1.2, buyMultipleButton.value)) + " Empty Mugs</div>";
	}

	//Only Show Extended Information for Workers that are owned
	if(workers[index].owned > 0)
		workerButtons[index].innerHTML +=
								"<div>Cost Efficiency (Mugs per Second / Cost): " + (roundThreeDecimals(workers[index].baseSipSize/workers[index].emptyMugCost*1000)) + "%" +
								"<div>Sip Size(Each): " + workers[index].baseSipSize + " cups</div>" +
								"<div>Owned: " + workers[index].owned + "</div>" +
								"<div>Sip Size(Total): " + roundThreeDecimals(workers[index].baseSipSize * workers[index].owned) + " cups</div>";
	
	
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
			cultistButtons[index].innerHTML += "<div>Cost: " + cultists[index].influenceCost + " Influence</div>";
		else 
			cultistButtons[index].innerHTML += "<div>Cost: " + roundThreeDecimals(tempCostTotal) + " Influence</div>";
	} else if(buyMultipleButton.value === "1") {
		cultistButtons[index].innerHTML += "<div>Cost: " + (roundThreeDecimals(cultists[index].influenceCost)) + " Influence</div>";
	} else {
		cultistButtons[index].innerHTML += "<div>Cost: " + roundThreeDecimals(geometricSum(cultists[index].influenceCost, 1.2, buyMultipleButton.value)) + " Influence</div>";
	}

	//Only Show Extended Information for cultists that are owned
	if(cultists[index].owned > 0)
		cultistButtons[index].innerHTML +=
								"<div>Cost Efficiency (Influence / Cost): " + (roundThreeDecimals(cultists[index].baseInfluence/cultists[index].influenceCost*1000)) + "%" +
								"<div>Influence Production(Each): " + cultists[index].baseInfluence + "</div>" + 
								"<div>Owned: " + cultists[index].owned + "</div>" + 
								"<div>Influence Production(Total): " + roundThreeDecimals(cultists[index].baseInfluence * cultists[index].owned)+ "</div>";




	//TODO - Remove This
	//Old Way Just in Case
	// cultistButtons[index].innerHTML = cultists[index].name +
	// 							"<div>Cost: " + (cultists[index].influenceCost) + " Influence</div>" +
	// 							"<div>Cost Efficiency (Influence / Cost): " + (roundThreeDecimals(cultists[index].baseInfluence/cultists[index].influenceCost*1000)) + "%" +
	// 							"<div>Influence Production(Each): " + cultists[index].baseInfluence + "</div>" + 
	// 							"<div>Owned: " + cultists[index].owned + "</div>" + 
	// 							"<div>Influence Production(Total): " + roundThreeDecimals(cultists[index].baseInfluence * cultists[index].owned)+ "</div>";
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
	return Math.round((num) * 1000) / 1000;
}

Game.prototype.initCultists = function() {
	cultists = [
		new Cultist("Initiate","This Game is Still About Drinking Coffee, Right?", 1, .25 * player.cultProductionBonus, 1),
		new Cultist("Zelator", "", 50, 1 * player.cultProductionBonus, 50),
		new Cultist("Adept", "", 1000, 5 * player.cultProductionBonus, 1000),
		new Cultist("Master", "", 10000, 10 * player.cultProductionBonus, 10000),
		new Cultist("Ipsissimus", "", 100000, 50 * player.cultProductionBonus, 100000),
	];
};

Game.prototype.initResearch = function() {
	research = [
		new Research("Think About Why You're Doing This", "The Higher Your Caffiene Level, The Faster Time Will Go", Math.floor(5 / player.researchBonus), .2, 0, 1),
		new Research("Think a Little Harder This Time", "",	 Math.floor(10 / player.researchBonus),  0 / player.researchBonus, 1, 1), 
		new Research("Get your G.E.D.", "", 				 Math.floor(30 / player.researchBonus),  0, 2, 1, 0, function(){
			player.numResearches += 1;
			consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
		}),
		new Research("Apply to College", "", 				 Math.floor(20 / player.researchBonus),  0, 3, 1),
		new Research("Decide on a College Major", "Coffee is Not a Major... Horseradish is Not a Major Either", 		  Math.floor(5 / player.researchBonus),  0, 4, 1),
		new Research("BS in Chemistry", "", 				 Math.floor(120 / player.researchBonus), 0, 5, 1, 0, function(){
			//player.numResearches += 1;
			//consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
		}),
		new Research("MS in Chemistry", "", 				 Math.floor(240 / player.researchBonus), 0, 6, 1),
		new Research("PHD in Chemistry", "", 				 Math.floor(480 / player.researchBonus), 0, 7, 1, 0, function(){
			player.numResearches += 1;
			consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
		}),
		new Research("Someone Calls Out To You (Listen)", "", Math.floor(15 / player.researchBonus), 1, 0, 0, 0, function(){
			consoleDisplay.pushMessage("You Can't Quite Make Out What The Voice is Saying...")
		}),
		new Research("Listen Closely To The Voices", "",	 Math.floor(20 / player.researchBonus),  1.5, 0, 0, 8, function(){
			consoleDisplay.pushMessage("The Voices Told You To Start a Cult");
		}),
		new Research("Start a Cult", "",					 Math.floor(60 / player.researchBonus),  0, 0, 0, 9, function(){
			player.influence += 1;
		}),
		new Research("Auto-Sipper", "That's My Secret, I'm Always Sippin'!",  Math.floor(60 / player.researchBonus),  0, 3, 0, 0, function(){
			consoleDisplay.pushMessage("You will now automatically sip from the mug when available (no more clicking)!");
			player.hasAutoSipper = true;
			drinkCoffeeClick();
			drinkCoffeeButton.innerText = "I'm Always Sippin'!";
		}),
		new Research("Max Caffeine to 50", "",				 Math.floor(40 / player.researchBonus),  35, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 60", "",				 Math.floor(50 / player.researchBonus),  45, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 70", "",				 Math.floor(60 / player.researchBonus),  55, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 80", "",				 Math.floor(80 / player.researchBonus),  65, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 90", "",				 Math.floor(100 / player.researchBonus),  75, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 100", "",				 Math.floor(180 / player.researchBonus),  85, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		})
	];
};

Game.prototype.initUpgrades = function() {
	//(name, flavorText, unlockMugs, unlockCaffeineLevel, emptyMugCost, caffeineCost, sipSizeIncrease, prerequisiteUpgrade, associatedWorkerIndex, callback) 
	upgrades = [
		new Upgrade("Become Slightly More Thirsty", "Your Sip Size Increased By .05", 1, 0, .5, 0, .05, -1, -1),
		new Upgrade("Become Slightly More Thirsty Again", "Your Sip Size Increased By .05 Again", 1.5, 0, 1.5, 0, .05, 0, -1),
		new Upgrade("Pretzels That Make You Thirsty", "These Pretzels Are Making Me Thirsty!!!", 2, 0, 2, 0, .15, 1, -1, function(){
			consoleDisplay.pushMessage("Your Sip Size Increased By .15");
		}),
		new Upgrade("Coffee That Doesn't Burn Your Mouth As Much", "Coffee That Doesn't Burn At All Is Asking For A Lot", 4, 0, 4, 0, .3, 2, -1),
		new Upgrade("Confidence In Yourself", "Best 8 Empty Mugs You Ever Spent", 16, 0, 8, 0, .5, 3, -1),
		new Upgrade("Wide-Mouth Coffee Mug", "Now If Only Your Mug Would Change Color When Your Coffee Is As Hot As The Rockies", 32, 0, 16, 0, 1, 4, -1),
		//Create New prototypes to use as the callback functions?
		new Upgrade("Improved Friends", "Now Even Friendlier", 5, 0, 5, 0, 0, -1, 0, function(){
			consoleDisplay.pushMessage("Sip Size Of Friends Increased By 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[0].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Robo-Friends", "I Think I Liked Them More Before They Were Robots", 10, 0, 10, 0, 0, 6, 0, function(){
			consoleDisplay.pushMessage("Sip Size Of Friends Increased By 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[0].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Best Friends", "Now You Can Have More Than One Best Friend", 40, 0, 40, 0, 0, -1, 1, function(){
			consoleDisplay.pushMessage("Sip Size Of Friends Increased By 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[1].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Robo-Best Friends", "", 100, 0, 100, 0, 0, 8, 1, function(){
			consoleDisplay.pushMessage("Sip Size Of Friends Increased By 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[1].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Older Men Who Drink Blacker Coffee", "", 50, 0, 50, 0, 0, -1, 2, function(){
			consoleDisplay.pushMessage("Sip Size Of Old Men Increased By 700%");
			workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

			workers[2].numUpgrades++;

			game.updateWorkerButton(2);
		}),
		new Upgrade("Oldest Men Who Drink Blackest Coffee", "", 150, 0, 150, 0, 0, 10, 2, function(){
			consoleDisplay.pushMessage("Sip Size Of Old Men Increased By 700%");
			workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

			workers[2].numUpgrades++;

			game.updateWorkerButton(2);
		}),
		new Upgrade("Improved Vacuums", "", 250, 0, 250, 0, 0, -1, 3, function(){
			consoleDisplay.pushMessage("Sip Size Of Vacuums Increased By 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Vacuums That Suck", "Technically an Improvement", 1000, 0, 1000, 0, 0, 12, 3, function(){
			consoleDisplay.pushMessage("Sip Size Of Vacuums Increased By 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[3].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Vacuums That Suck More", "Technically More Of An Improvement", 2500, 0, 2500, 0, 0, 13, 3, function(){
			consoleDisplay.pushMessage("Sip Size Of Vacuums Increased By 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[3].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Trained Nurses", "Wait... Were They Untrained Before?", 3000, 0, 3000, 0, 0, -1, 4, function(){
			consoleDisplay.pushMessage("Sip Size Of Nurses Increased By 400%");
			workers[4].baseSipSize = roundThreeDecimals(workers[4].baseSipSize*4);

			workers[4].numUpgrades++;
			game.updateWorkerButton(4);
		}),
		new Upgrade("Bigger Needles", "Maybe It Helps", 7000, 0, 7000, 0, 0, 15, 4, function(){
			consoleDisplay.pushMessage("Sip Size Of Nurses Increased By 400%");
			workers[4].baseSipSize = roundThreeDecimals(workers[4].baseSipSize*4);

			workers[4].numUpgrades++;
			game.updateWorkerButton(4);
		}),
		new Upgrade("Coffethulu+", "", 50000, 0, 50000, 0, 0, -1, 5, function(){
			consoleDisplay.pushMessage("Sip Size Of Coffethulu Increased By 500%");
			workers[5].baseSipSize = roundThreeDecimals(workers[5].baseSipSize*5);

			workers[5].numUpgrades++;
			game.updateWorkerButton(5);
		}),
		new Upgrade("Coffethulu++", "", 150000, 0, 150000, 0, 0, 17, 5, function(){
			consoleDisplay.pushMessage("Sip Size Of Coffethulu Increased By 500%");
			workers[5].baseSipSize = roundThreeDecimals(workers[5].baseSipSize*5);

			workers[5].numUpgrades++;
			game.updateWorkerButton(5);
		}),
	];
};

Game.prototype.initWorkers = function() {
	workers = [
		new Worker("Hire A Friend To Help You Drink Coffee", "Is It Weird If You Share A Mug? ... Nah", 1.5, .01 * player.workerProductionBonus, 1),
		new Worker("Hire A Friend with A Better Work Ethic", "When You say \"Drink Coffee\" They Say \"How Much?\"", 4, .02 * player.workerProductionBonus, 4),
		new Worker("Hire An Old Man That Drinks Black Coffee", "You Know The One", 20, .1 * player.workerProductionBonus, 20),
		new Worker("Hook Up a Vacuum To Your Coffee Mug", "You Really Should Have Thought of This Earlier", 100, .5 * player.workerProductionBonus, 100),
		new Worker("Hire A Nurse To Give You Coffee Intravenously", "This Is Getting Pretty Hardcore", 500, 2 * player.workerProductionBonus, 500),
		new Worker("Coffeethulu", "Kinda Creepy", 25000, 100 * player.workerProductionBonus, 25000)
		//Maybe Add 'Monster With A Million Mouths' or something
	];
};
