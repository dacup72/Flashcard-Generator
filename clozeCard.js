
var inquirer = require("inquirer");
var cardCreator = require("./basicCard");
var correct = 0;
var incorrect = 0;
var cardType = process.argv[2];
var flashcard = cardCreator.Flashcard;
var questions = cardCreator.questions;


function basic() {
   inquirer.prompt(questions.map(function(question) {
   		return question.basicCard();
    })).then(function (answers) {
   	for (var back in answers) {
   		if (answers[back] === back) {
   			correct++
   		} else {
   			incorrect++
   		}
	}
	console.log("Correct guesses = " + correct);
	console.log("Incorrect guesses = " + incorrect);
	console.log("----------------------------------");
	playBasicAgain();
  });
}

function cloze() {
	inquirer.prompt(questions.map(function(question) {
   		return question.clozeCard();
    })).then(function (answers) {
   	for (var back in answers) {
   		if (answers[back] === back) {
   			correct++
   		} else {
   			incorrect++
   		}
	}
	console.log("Correct guesses = " + correct);
	console.log("Incorrect guesses = " + incorrect);
	console.log("=================================");
	playClozeAgain();
  });
}

function playBasicAgain() {
	inquirer.prompt([
		{
			type: "confirm",
			message: "Play again?",
			name: "replay"
		},

	]).then(function (answer) {
	    if(answer.replay) {
	    	basic();
	    } else {
	    	console.log("YA whatever, see you later I guess....")
	    }
	});
}

function playClozeAgain() {
	inquirer.prompt([
		{
			type: "confirm",
			message: "Play again?",
			name: "replay"
		},
	]).then(function (answer) {
	    if(answer.replay) {
	    	cloze();
	    } else {
	    	console.log("YA whatever, see you later I guess....")
	    }
	});
}

switch(cardType) {
	case "basic":
		console.log("basic card selected");
		basic();
		break;
	case "cloze":
		console.log("cloze card selected");
		cloze();
		break;
	default:
		console.log("You must first choose 'cloze' or 'basic'");
}
