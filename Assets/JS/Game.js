Game.prototype.prestige = function() {
	//Reset Button Color
	document.documentElement.style.setProperty("--button-text-color", "#F5ECE1");		
	document.documentElement.style.setProperty("--button-border-color", "#F5ECE1");
	//Clear previous setTimeout
	clearTimeout(gameLoopTimeout);
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
	//Call Init Again
	this.init();
}

Game.prototype.init = function() {
	player = new Player();

	cultists = [
		new Cultist("Initiate","", 1, 1, 1),
		new Cultist("Zelator", "", 50, 5, 50),
		new Cultist("Adept", "", 1000, 10, 1000),
		new Cultist("Master", "", 10000, 25, 10000),
		new Cultist("Ipsissimus", "", 100000, 50, 100000),
	];

	research = [
		new Research("Think About Why You're Doing This", "", 5, .2, 0, 1),
		new Research("Think a Little Harder This Time", "",	 10,  0, 1, 1), 
		new Research("Get your G.E.D.", "", 				 30,  0, 2, 1, 0, function(){
			player.numResearches += 1;
			consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
		}),
		new Research("Apply to College", "", 				 20,  0, 3, 1),
		new Research("Decide on a College Major", "", 		  5,  0, 4, 1),
		new Research("BS in Chemistry", "", 				 120, 0, 5, 1),
		new Research("MS in Chemistry", "", 				 240, 0, 6, 1),
		new Research("PHD in Chemistry", "", 				 480, 0, 7, 1, 0, function(){
			player.numResearches += 1;
			consoleDisplay.pushMessage("You can now research " + player.numResearches + " researches at a time!");
		}),
		new Research("Someone Calls Out To You (Listen)", "", 15, 1, 0, 0, 0, function(){
			consoleDisplay.pushMessage("You Can't Quite Make Out What The Voice is Saying...")
		}),
		new Research("Listen Closely To The Voices", "",	 20,  1.5, 0, 0, 8, function(){
			consoleDisplay.pushMessage("The Voices Told You To Start a Cult");
		}),
		new Research("Start a Cult", "",					 60,  0, 0, 0, 9, function(){
			player.influence += 1;
		}),
		new Research("Auto-Sipper", "", 				 	 60,  0, 3, 0, 0, function(){
			consoleDisplay.pushMessage("You will now automatically sip from the mug when available (no more clicking)!");
			consoleDisplay.pushMessage("That's My Secret, I'm Always Sippin'!");
			player.hasAutoSipper = true;
			drinkCoffeeClick();
			drinkCoffeeButton.innerText = "I'm Always Sippin'!";
		}),
		new Research("Max Caffeine to 40", "",				 60,  25, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 50", "",				 60,  35, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 60", "",				 60,  45, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 70", "",				 60,  55, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 80", "",				 60,  65, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 90", "",				 120,  75, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Max Caffeine to 100", "",				 180,  85, 0, 0, 0, function(){
			player.maxCaffeineLevel += 10;
		}),
		new Research("Prestige", "",						   5, 100, 0, 0)
	];

	upgrades = [
		new Upgrade("Become Slightly More Thirsty", "", 1, 0, .5, 0, .05, -1, -1),
		new Upgrade("Become Slightly More Thirsty Again", "", 1.5, 0, 1.5, 0, .05, 0, -1),
		new Upgrade("Pretzels That Make You Thirsty", "", 2, 0, 2, 0, .15, 1, -1),
		new Upgrade("Coffee That Doesn't Burn Your Mouth as Much", "", 4, 0, 4, 0, .3, 2, -1),
		new Upgrade("Confidence in Yourself", "Best 16 Empty Mugs You Ever Spent", 16, 0, 8, 0, .5, 3, -1),
		new Upgrade("Wide-Mouth Coffee Mug", "", 32, 0, 16, 0, 1, 4, -1),
		//Create New prototypes to use as the callback functions?
		new Upgrade("Improved Friends", "", 5, 0, 5, 0, 0, -1, 0, function(){
			consoleDisplay.pushMessage("Sip Size of friends increased by 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[0].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Robo-Friends", "", 10, 0, 10, 0, 0, 6, 0, function(){
			consoleDisplay.pushMessage("Sip Size of friends increased by 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[0].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Best Friends", "", 40, 0, 40, 0, 0, -1, 1, function(){
			consoleDisplay.pushMessage("Sip Size of friends increased by 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[1].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Robo-Best Friends", "", 100, 0, 100, 0, 0, 8, 1, function(){
			consoleDisplay.pushMessage("Sip Size of friends increased by 200%");
			workers[0].baseSipSize = roundThreeDecimals(workers[0].baseSipSize*2);
			workers[1].baseSipSize = roundThreeDecimals(workers[1].baseSipSize*2);

			workers[1].numUpgrades++;

			game.updateWorkerButton(0);
			game.updateWorkerButton(1);
		}),
		new Upgrade("Older Men Who Drink Blacker Coffee", "", 50, 0, 50, 0, 0, -1, 2, function(){
			consoleDisplay.pushMessage("Sip Size of Old Men increased by 700%");
			workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

			workers[2].numUpgrades++;

			game.updateWorkerButton(2);
		}),
		new Upgrade("Oldest Men Who Drink Blackest Coffee", "", 150, 0, 150, 0, 0, 10, 2, function(){
			consoleDisplay.pushMessage("Sip Size of Old Men increased by 700%");
			workers[2].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*7);

			workers[2].numUpgrades++;

			game.updateWorkerButton(2);
		}),
		new Upgrade("Improved Vacuums", "", 250, 0, 250, 0, 0, -1, 3, function(){
			consoleDisplay.pushMessage("Sip Size of Vacuums increased by 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[2].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Vacuums That Suck", "Technically an Improvement", 1000, 0, 1000, 0, 0, 12, 3, function(){
			consoleDisplay.pushMessage("Sip Size of Vacuums increased by 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[3].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Vacuums That Suck More", "Technically More of an Improvement", 2500, 0, 2500, 0, 0, 13, 3, function(){
			consoleDisplay.pushMessage("Sip Size of Vacuums increased by 300%");
			workers[3].baseSipSize = roundThreeDecimals(workers[3].baseSipSize*3);

			workers[3].numUpgrades++;
			game.updateWorkerButton(3);
		}),
		new Upgrade("Trained Nurses", "Wait... Were They Untrained Before?", 3000, 0, 3000, 0, 0, -1, 4, function(){
			consoleDisplay.pushMessage("Sip Size of Nurses increased by 400%");
			workers[4].baseSipSize = roundThreeDecimals(workers[4].baseSipSize*4);

			workers[4].numUpgrades++;
			game.updateWorkerButton(4);
		}),
		new Upgrade("Bigger Needles", "Maybe It Helps", 7000, 0, 7000, 0, 0, 15, 4, function(){
			consoleDisplay.pushMessage("Sip Size of Nurses increased by 400%");
			workers[4].baseSipSize = roundThreeDecimals(workers[4].baseSipSize*4);

			workers[4].numUpgrades++;
			game.updateWorkerButton(4);
		}),
		new Upgrade("Coffethulu+", "", 50000, 0, 50000, 0, 0, -1, 5, function(){
			consoleDisplay.pushMessage("Sip Size of Coffethulu increased by 500%");
			workers[5].baseSipSize = roundThreeDecimals(workers[5].baseSipSize*5);

			workers[5].numUpgrades++;
			game.updateWorkerButton(5);
		}),
		new Upgrade("Coffethulu++", "", 150000, 0, 150000, 0, 0, 17, 5, function(){
			consoleDisplay.pushMessage("Sip Size of Coffethulu increased by 500%");
			workers[5].baseSipSize = roundThreeDecimals(workers[5].baseSipSize*5);

			workers[5].numUpgrades++;
			game.updateWorkerButton(5);
		}),
	];

	workers = [
		new Worker("Hire a Friend to Help You Drink Coffee", "Is it Weird if You Share a Cup?", 1.5, .01, 1),
		new Worker("Hire a Friend with a Better Work Ethic", "When You say \"Drink Coffee\" They Say \"How Much?", 4, .02, 4),
		new Worker("Hire an Old Man That Drinks Black Coffee While Reading The Paper", "You Know the One", 20, .1, 20),
		new Worker("Hook up a Vacuum to Your Coffee Mug", "You Really Should Have Thought of This Earlier", 100, .5, 100),
		new Worker("Hire a Nurse to Give You Coffee Intravenously", "This feels really hardcore", 500, 2, 500),
		new Worker("Coffeethulu", "Kinda Creepy", 25000, 100, 25000)
	];

	for (var i = 0; i < workers.length; i++)
	{
		workerButtons.push(document.querySelector("#workerButton" + (i + 1)));
		workerButtons[i].innerHTML = workers[i].name + "<div> Mug Cost: " + workers[i].emptyMugCost + " Empty Mugs</div>";
		workerButtons[i].value = i;
	}

	for (var i = 0; i < cultists.length; i++)
	{
		cultistButtons.push(document.querySelector("#cultistButton" + (i + 1)));
		cultistButtons[i].innerHTML = cultists[i].name + "<div> Cost: " + (cultists[i].influenceCost) + " Influence</div>";
		cultistButtons[i].value = i;
	}

	if(game.prestigeCount === 0 || !addedEventListeners) {
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

		drinkCoffeeButton.addEventListener("click", drinkCoffeeClick);

		addedEventListeners = true;
	}
	

	document.querySelector("body").style.transition = "background-color 5s";
	document.querySelector("#drinkCoffeeButton").style.transition = "opacity .9s";

	if(this.prestigeCount > 0) {
		player.sipSizeBase = roundThreeDecimals(player.sipSizeBase + 10 * this.prestigeCount);
	}

	this.gameLoop();
};

function drinkCoffeeClick(){
	player.takeSip();

	//TODO - Create an update display function

	//Disable Drinking coffees for 2 seconds after having a sip
	drinkCoffeeButton.disabled = true;
	setTimeout(function() {
		if(player.hasAutoSipper){
			drinkCoffeeClick();
		} else {
			drinkCoffeeButton.disabled = false;
		}
	}, 4 * tickSpeed);
};

Game.prototype.updateGameState = function() {

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

	frameCounter++;

	caffeineColorScheme();
	
	this.updateDisplay();
	
	//TODO - Add Mugs per second (total)
	//TODO - Add buy multiple options (1, 5, 10, max?)
};

Game.prototype.updateDisplay = function() {
	//Update displays at the end of the game loop to keep display consistent
	emptyMugsDisplay.textContent = roundThreeDecimals(player.emptyMugs);
	coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
	sipSizeDisplay.textContent = player.calculateSipSize();
	influenceDisplay.textContent = player.influence;

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
		for(var i = 0; i < document.querySelectorAll("li").length; i++)
		{
			document.querySelectorAll("li")[i].classList.remove("hide");
		}
	}

	if(research[0].isUnlocked){
		document.querySelector("#research h2").classList.remove("hide");
	}

	for(var i = 0; i < workers.length; i++)
	{
		if(!workers[i].isUnlocked && workers[i].unlockMugs <= player.emptyMugs)
		{
			if(i === 0)
			{
				document.querySelector("#workers h2").classList.remove("hide");
				if(document.querySelector(".hide2"))
					document.querySelector(".hide2").classList.remove("hide2");
			}

			workerButtons[i].classList.remove("hide");
			workers[i].isUnlocked = true;
		}
	}

};

function caffeineColorScheme(){
	if(player.caffeineLevel < .99)
	 	document.body.style.backgroundColor = "rgb(75, 49, 27)";
	else if(player.caffeineLevel >= 99.99){
		document.body.style.backgroundColor = "rgb(255, 255, 255)";
		document.body.style.color = "rgb(0, 0, 0)";

		setTimeout(function() {
			document.documentElement.style.setProperty("--button-text-color", "#000");		
			document.documentElement.style.setProperty("--button-border-color", "#000");
		}, 500);
	}
	else if(player.caffeineLevel >= 49.99)
		document.body.style.backgroundColor = "rgb(0, 0, 0)";
	else if(player.caffeineLevel >= 24.99)
		document.body.style.backgroundColor = "rgb(40, 16, 6)";
	else if(player.caffeineLevel >= 9.99)
		document.body.style.backgroundColor = "rgb(55, 29, 11)";
	else if(player.caffeineLevel >= .99)
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
		if(!upgrade.isUnlocked && document.querySelector("#upgrades").childElementCount <= 3 && upgrade.canUnlock())
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

var gameLoopTimeout;

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
			workerButtons[i].classList.add("canAfford");
		} else if(player.emptyMugs >= workers[i].emptyMugCost) {
			workerButtons[i].classList.add("canAfford");
		}
		else
		{
			workerButtons[i].classList.remove("canAfford");
		}

		workers[i].generateProduction()
		mugsPerSecond += workers[i].getTotalPower();
	}

	mugsPerSecondDisplay.innerText = roundThreeDecimals(mugsPerSecond);
};

Game.prototype.updateCultists = function() {
	for(var i = 0; i < cultists.length; i++) {

		if(!cultists[i].isUnlocked && cultists[i].unlockInfluence <= player.influence){	
			if(i === 0)
			{
				//Add "Cultists" above the column
				var parent = document.querySelector("#centerRightColumn");
				var newElement = document.createElement("h2");
				newElement.innerText = "Cultists";
				parent.prepend(newElement);
				//Add influence to main stats display
				for(var j = 0; j < document.querySelectorAll("li").length; j++)
				{
					document.querySelectorAll("li")[j].classList.remove("hide2");
				}

			} else if(i === 3)
				mainTitleDisplay.textContent = "Cultist"
			//Unhide the associated cultist button and set isUnlocked to true
			cultistButtons[i].classList.remove("hide");
			cultistButtons[i].classList.add("canAfford");
			cultists[i].isUnlocked = true;
		}
		
		if(player.influence >= cultists[i].influenceCost){
			cultistButtons[i].classList.add("canAfford");
		} else {
			cultistButtons[i].classList.remove("canAfford");
		}
		//Only generate influence every 4th frame
		if(frameCounter % 4 === 0){
			cultists[i].generateInfluence();
		}
	}
};

Game.prototype.updateWorkerButton = function(index) {
	workerButtons[index].innerHTML = workers[index].name + 
								"<div>Cost: " + (roundThreeDecimals(workers[index].emptyMugCost)) + " Empty Mugs</div>" +
								"<div>Cost Efficiency (Mugs per Second / Cost): " + (roundThreeDecimals(workers[index].baseSipSize/workers[index].emptyMugCost*100)) + "%" +
								"<div>Sip Size(Each): " + workers[index].baseSipSize + " cups</div>" +
								"<div>Owned: " + workers[index].owned + "</div>" +
								"<div>Sip Size(Total): " + roundThreeDecimals(workers[index].baseSipSize * workers[index].owned) + " cups</div>";
};

Game.prototype.updateCultistButton = function(index) {
	cultistButtons[index].innerHTML = cultists[index].name +
								"<div>Cost: " + (cultists[index].influenceCost) + " Influence</div>" +
								"<div>Cost Efficiency (Influence / Cost): " + (roundThreeDecimals(cultists[index].baseInfluence/cultists[index].influenceCost*100)) + "%" +
								"<div>Influence Production(Each): " + cultists[index].baseInfluence + "</div>" + 
								"<div>Owned: " + cultists[index].owned + "</div>" + 
								"<div>Influence Production(Total): " + roundThreeDecimals(cultists[index].baseInfluence * cultists[index].owned)+ "</div>";
}


function Game() {
	this.prestigeCount = 0;
};

//Should be outside loop
workerButtons = [];
cultistButtons = [];

drinkCoffeeButton = document.querySelector("#drinkCoffeeButton");
emptyMugsDisplay = document.querySelector("#emptyMugs");
mugsPerSecondDisplay = document.querySelector("#emptyMugsSec");
caffeineLevelDisplay = document.querySelector("#caffeineLevel");
coffeeRemainingDisplay = document.querySelector("#coffeeRemaining");
sipSizeDisplay = document.querySelector("#sipSize");
influenceDisplay = document.querySelector("#influence");
mainTitleDisplay = document.querySelector("#mainTitle");

frameCounter = 0; 	//Keeps track of the number of game update cycles so far
tickSpeed = 500; 	//The time in milliseconds between each game tick 

var game = new Game();

function roundThreeDecimals(num){
	return Math.round((num) * 1000) / 1000;
}