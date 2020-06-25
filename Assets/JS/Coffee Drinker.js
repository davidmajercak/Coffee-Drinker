
//Add a temperature mechanic?


//need to create sets for locked upgrades, unlocked upgrades, and purchased upgrades
//Bathroom Break Mechanic? Cant sip any coffee yourself debuff. Takes like 20-30 seconds before upgrade
//use flexbox to create the grid system https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01
//Give more functionality to displayConsole
//Make caffeine level speed up game ticks instead of adding to sip size
//Add different brewing methods for coffee
//Brewing a new batch of coffee takes time, upgrades could increase number of cups per brew
//Add a Research Tree
//Research will be tied into prestige
//Research more to reduce toxicity associated with high caffeine level as well as other bonuses

//Create a religion upgrade tree
//Coffee cultists worship you/the coffee God (Whom you later become when you prestige)
//Provide different type of perks and bonuses


//Spend Caffeine level to gain research points

//Need to create Game.js and add functions, especially for prestige

//figure out how to call prototypes in other prototypes
//player - create a coffeeEffect function to call when coffeeAmount < 0

//Make sure page is loaded first - Think this is taken care of

//TODO - Add save game 
//Probably to be implemented in localStorage but do more looking into it?

//Highlight buttons green if can purchase worker or upgrade

//Show Purchased Upgrades in a separate in game "tab"?

//Decide on a number system?
//have empty mugs updated 4 or 8 times more often but 4 or 8 times less amount
//Start with "quantum mug ability", but maybe have to brew coffee to be able to drink it?




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



setTimeout(function() {
	game.init();
}, 300);

