
Game.prototype.init = function() {
	for (var i = 0; i < workers.length; i++)
	{
		workerButtons.push(document.querySelector("#workerButton" + (i + 1)));
		workerButtons[i].innerHTML = workers[i].name + "<div> Mug Cost: " + (workers[i].emptyMugCost * workers[i].coffeeScaling) + " Empty Mugs</div>";
		workerButtons[i].value = i;
	}

	for (var i = 0; i < cultists.length; i++)
	{
		cultistButtons.push(document.querySelector("#cultistButton" + (i + 1)));
		cultistButtons[i].innerHTML = cultists[i].name + "<div> Cost: " + (cultists[i].influenceCost) + " Influence</div>";
		cultistButtons[i].value = i;
	}

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

	document.querySelector("body").style.transition = "background-color 5s";
	document.querySelector("#drinkCoffeeButton").style.transition = "opacity .9s";

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


	if(!player.hasUnlockedUpgrades && player.emptyMugs >= 1){
		var parent = document.querySelector("#rightColumn");
		var newElement = document.createElement("h2");
		newElement.innerText = "Upgrades";
		parent.prepend(newElement);
		player.hasUnlockedUpgrades = true;
		for(var i = 0; i < document.querySelectorAll("li").length; i++)
		{
			document.querySelectorAll("li")[i].classList.remove("hide");
		}
	}

	if(research[0].isUnlocked){
		document.querySelector("#research h2").classList.remove("hide");
	}
	
	this.updateUpgrades();
	this.updateCultists();


	if(frameCounter % 3 === 0)
		this.updateResearch();


	for(var i = 0; i < workers.length; i++)
	{
		if(!workers[i].isUnlocked && workers[i].unlockMugs <= player.emptyMugs)
		{
			if(i === 0)
			{
				var parent = document.querySelector("#centerLeftColumn");
				var newElement = document.createElement("h2");
				newElement.innerText = "Workers";
				parent.prepend(newElement);
			}

			workerButtons[i].classList.remove("hide");
			workers[i].isUnlocked = true;
		}
	}

	//Decide frequency of adding worker production to amount
	if(frameCounter % 4 === 0)
	{
		this.updateWorkers();
		player.updateCaffeineLevel();
	}

	frameCounter++;

	caffeineColorScheme();
	

	//Update displays at the end of the game loop to keep display consistent
	emptyMugsDisplay.textContent = roundThreeDecimals(player.emptyMugs);
	coffeeRemainingDisplay.textContent = roundThreeDecimals(player.coffeeRemaining * 100) + "%";
	sipSizeDisplay.textContent = player.calculateSipSize();
	influenceDisplay.textContent = player.influence;
	//TODO - Add Mugs per second (total)
	//TODO - Add buy multiple options (1, 5, 10, max?)
}

function caffeineColorScheme(){
	if(player.caffeineLevel <= 1)
	 	document.body.style.backgroundColor = "rgb(75, 49, 27)";
	else if(player.caffeineLevel >= 100){
		document.body.style.backgroundColor = "rgb(255, 255, 255)";
		document.body.style.color = "rgb(0, 0, 0)";

		setTimeout(function() {
			document.documentElement.style.setProperty("--button-text-color", "#000");		
			document.documentElement.style.setProperty("--button-border-color", "#000");
		}, 500);
	}
	else if(player.caffeineLevel >= 50)
		document.body.style.backgroundColor = "rgb(0, 0, 0)";
	else if(player.caffeineLevel >= 25)
		document.body.style.backgroundColor = "rgb(40, 16, 6)";
	else if(player.caffeineLevel >= 10)
		document.body.style.backgroundColor = "rgb(55, 29, 11)";
	else if(player.caffeineLevel >= 1)
		document.body.style.backgroundColor = "rgb(65, 39, 17)";
}


Game.prototype.updateUpgrades = function() {
	
	upgrades.forEach(function(upgrade){
		//Limit of 5 upgrades on display
		if(document.querySelector("#upgrades").childElementCount > 3)
			return;	//No more upgrades until current upgrades are completed
		if(!upgrade.isUnlocked && upgrade.canUnlock())
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



Game.prototype.gameLoop = function() {
	this.updateGameState();

	setTimeout(function() {
		game.gameLoop();
	}, tickSpeed);
};

Game.prototype.updateWorkers = function() {
	for(var i = 0; i < workers.length; i++)
	{
		if(workers[i].unlockMugs <= player.emptyMugs)
		{
			workerButtons[i].classList.remove("hide");
		}

		workers[i].generateProduction()
	}
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
			cultists[i].isUnlocked = true;
		}
		//Only generate influence every 4th frame
		else {
			if(frameCounter % 4 === 0){
				cultists[i].generateInfluence();
			}
		}
	}
};

Game.prototype.updateWorkerButton = function(index) {
	workerButtons[index].innerHTML = workers[index].name + 
								"<div>Cost: " + (roundThreeDecimals(workers[index].emptyMugCost * workers[index].coffeeScaling)) + " Empty Mugs</div>" +
								"<div>Sip Size(Each): " + workers[index].baseSipSize + " cups</div>" +
								"<div>Owned: " + workers[index].owned + "</div>" +
								"<div>Sip Size(Total): " + roundThreeDecimals(workers[index].baseSipSize * workers[index].owned) + " cups</div>";
};

Game.prototype.updateCultistButton = function(index) {
	cultistButtons[index].innerHTML = cultists[index].name +
								"<div> Cost: " + (cultists[index].influenceCost) + " Influence</div>" +
								"<div>Influence Production(Each): " + cultists[index].baseInfluence + "</div>" + 
								"<div>Owned: " + cultists[index].owned + "</div>" + 
								"<div>Influence Production(Total): " + roundThreeDecimals(cultists[index].baseInfluence * cultists[index].owned)+ "</div>";
}


function Game() {
	return;
};

//Should be outside loop
workerButtons = [];
cultistButtons = [];

drinkCoffeeButton = document.querySelector("#drinkCoffeeButton");
emptyMugsDisplay = document.querySelector("#emptyMugs");
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