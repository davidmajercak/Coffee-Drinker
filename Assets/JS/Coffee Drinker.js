
//Add a temperature mechanic?


//need to create sets for locked upgrades, unlocked upgrades, and purchased upgrades
//Bathroom Break Mechanic? Cant sip any coffee yourself debuff. Takes like 20-30 seconds before upgrade
//use flexbox to create the grid system https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01
//Make caffeine level speed up game ticks instead of adding to sip size
//Add different brewing methods for coffee
//Brewing a new batch of coffee takes time, upgrades could increase number of cups per brew
//Add a Research Tree
//Research will be tied into prestige
//Research more to reduce toxicity associated with high caffeine level as well as other bonuses

//Coffee cultists worship you/the coffee God (Whom you later become when you prestige)
//Provide different type of perks and bonuses


//Make sure page is loaded first - Think this is taken care of

//Show Purchased Upgrades in stats tab

//Decide on a number system?
//have empty mugs updated 4 or 8 times more often but 4 or 8 times less amount
//Start with "quantum mug ability", but maybe have to brew coffee to be able to drink it?

//Save The Game Using localStorage
//https://www.reddit.com/r/incremental_games/comments/ahf6nx/how_to_make_an_incremental_game/


// function docReady(fn) {
//     // see if DOM is already available
//     if (document.readyState === "complete" || document.readyState === "interactive") {
//         // call on next available tick
//         setTimeout(fn, 1);
//     } else {
//         document.addEventListener("DOMContentLoaded", fn);
//     }
// }    
// docReady(initGame);


//TODO
//TODO
//TODO
//Highlight most Cost Efficient Worker in Orange
//More Upgrade Clarity
//Reconsider Upgrade Timers, Multiple Researches At Once?
//triple check worker and cult bonuses, be sure they aren't being added multiple times or not enough
//Make sure that research is not already started when clicking research again
//Use influence and cultists to recruit summons?
//Upon prestige, do favors for an ultimate coffee god?
//Switch to scientific notation or similiar
//Caffeine Siphon too strong.  Needs adjusting for sure
//Allow option to turn off background color change
//Add a change log
//Create a subreddit (limited by new account currently)


function openTab(event, tabName) {
  // Declare all variables
  var i, tabContent, tablinks;

  // Get all elements with class="tabContent" and hide them
  tabContent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tabLinks = document.querySelectorAll(".tabLink");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}



var gameInitialized = false;
var addedEventListeners = false;
var loadedGame = false;
var tabsDisplayed = false;
//"Click" the main tab
document.querySelector(".tabLink").click();
setTimeout(function() {
	game.init()
}, 350);

//Help from Here https://dhmholley.co.uk/incrementals-part-2.html
function save() {

	localStorage.setItem("playerSave",JSON.stringify(player));
	localStorage.setItem("gameSave",JSON.stringify(game));
	localStorage.setItem("cultistsSave",JSON.stringify(cultists));
	localStorage.setItem("workersSave",JSON.stringify(workers));
	localStorage.setItem("researchSave",JSON.stringify(research));
	localStorage.setItem("upgradesSave",JSON.stringify(upgrades));
	localStorage.setItem("consoleDisplaySave",JSON.stringify(consoleDisplay));
	localStorage.setItem("versionSave",JSON.stringify(version));
	localStorage.setItem("caffeineToleranceMessages",JSON.stringify(caffeineToleranceMessages));

	var save = {
		playerSave: player,
		gameSave: game,
		cultistsSave: cultists,
		workersSave: workers,
		researchSave: research,
		upgradesSave: upgrades,
		consoleDisplaySave: consoleDisplay,
		versionSave: version,
		caffeineToleranceMessagesSave: caffeineToleranceMessages
	}
	localStorage.setItem("save",JSON.stringify(save));
}

function load() {
	var save = JSON.parse(localStorage.getItem("save"));

	if(typeof save.versionSave !== undefined)
		versionFromSave = save.versionSave;
	else {
		consoleDisplay.pushMessage("Sorry, Your Save Was Incompatible With The Current Version And Your Progress Has Been Reset")
		setTimeout(function() {
			deleteSave();
		}, 2000);
		return;
	}

	if(isSaveCompatible(versionFromSave)) {
		if(typeof save.gameSave !== undefined)
			game.loadGame(save.gameSave);
		if(typeof save.playerSave !== undefined)
			player.loadPlayer(save.playerSave);
		if(typeof save.cultistSave !== undefined)
			loadCultists(save.cultistsSave);
		if(typeof save.workersSave !== undefined)
			loadWorkers(save.workersSave);
		if(typeof save.researchSave !== undefined)
			loadResearch(save.researchSave);
		if(typeof save.upgradesSave !== undefined)
			loadUpgrades(save.upgradesSave);
		if(typeof save.consoleDisplaySave !== undefined)
			consoleDisplay.loadConsoleDisplay(save.consoleDisplaySave);
		if(typeof save.caffeineToleranceMessagesSetSave !== undefined) {
			caffeineToleranceMessages = save.caffeineToleranceMessagesSave;
		}
	} else {
		setTimeout(function() {
			deleteSave();
		}, 2000);
		consoleDisplay.pushMessage("Sorry, Your Save Was Incompatible With The Current Version And Your Progress Has Been Reset");
		return;
	}

	setTimeout(function() {
		consoleDisplay.pushMessage("Welcome back!")
		consoleDisplay.pushMessage("Check out the change log!")
	}, 1000);

	
	loadedGame = true;
}

function deleteSave() {
	localStorage.removeItem("save");

	//This will refresh the page
	window.location.reload(false);
}

function isSaveCompatible(savedVersion) {
	return savedVersion >= "0.8.3";
}

//Save the Game Every 20 seconds
setInterval(function() {
	save();
}, 20000);

deleteSaveButton = document.querySelector("#deleteSaveButton");

deleteSaveButton.addEventListener("click", function() {
	if(confirm("Are You Sure You Want To Delete Your Save?"))
		if(confirm("Are You REALLY Sure You Want To Delete Your Save?\nThis Can't Be Undone."))
			deleteSave();
});

gameTickSpeedDisplay = document.querySelector("#gameTickSpeed");
//totalEmptyMugsDisplay = document.querySelector("#totalEmptyMugs");

console.log("Your Mom Would Disappointed If She Knew You Cheated At Coffee Drinker (Depending On What Your Mom Is Like)");