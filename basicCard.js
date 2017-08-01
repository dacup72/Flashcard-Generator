
function Flashcard(front, back, cloze) {
  this.front = front;
  this.back = back;
  this.cloze = cloze;
  this.printInfo = function() {
    console.log("Front of Card: " + this.front + "Back of Card: " + this.back +
    "Cloze: " + this.cloze);
    console.log("======================================");
  };
  this.basicCard = function() {
    return {
      type: "input",
      message: front,
      name: back
    }
  }
  this.clozeCard = function() {
    return {
      type: "input",
      message: cloze,
      name: back
    }
  }
};

var question1 = new Flashcard(
  "How many main islands are apart of the state of Hawaii?",
  "eight",
  "The state of Hawaii consists of ... main islands"
);
var question2 = new Flashcard(
  "Hawaii supplies More than one-third of the world's commercial supply of what?",
  "pineapples",
  "More than one-third of the world's commercial supply of ... comes from Hawaii."
);
var question3 = new Flashcard(
  "What number was the state of Hawaii to be addmitted to the union on August 20th, 1959?",
  "50th",
  "Hawaii was the ... state admitted to the union on August 20th, 1959."
);
var question4 = new Flashcard(
  "Waht is the largest mammal?",
  "blue whale",
  "The ... is the largest mammal on Earth"
);
var question5 = new Flashcard(
  "The island of Kauai is known as the 'what' island?",
  "garden",
  "The island of Kauai is known as the ... island."
);
var question6 = new Flashcard(
  "What is the largest ocean on planet Earth?",
  "pacific",
  "The ... is the largest ocean on planet Earth"
);

var questions = [question1, question2, question3, question4, question5, question6];

module.exports = {Flashcard: Flashcard, questions: questions};
