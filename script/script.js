$(document).ready(function () {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBdjhuTi-2Do8ad2_Yhb5AkkDBqLRjCqIo",
    authDomain: "flash-card-generator.firebaseapp.com",
    databaseURL: "https://flash-card-generator.firebaseio.com",
    projectId: "flash-card-generator",
    storageBucket: "",
    messagingSenderId: "762972856862"
  };
  firebase.initializeApp(config);


  // ==================== GLOBAL VARIABLES ====================


  let userDirectory = null;
  let firebaseSnap;
  let cardCreatedArray = [];
  let currentIndexVal = 1;
  let frontRevealed = false;
  let backRevealed = false;


  // ==================== OBJECTS ====================


  // Constructor for creating new cards
  class Card {
    constructor(front, back, cardType, group) {
      this.front = front;
      this.back = back;
      this.cardType = cardType;
      this.group = group;
    }
  }


  // Firebase object for pushing and removing data to database
  const database = {
    add: function (user, group, data) {
      firebase.database().ref(`/${user}/${group}/`).push(data);
    },
    remove: function (user, group, key) {
      firebase.database().ref(`/${user}/${group}/`).child(key).remove();
    }
  }


  // ==================== CLICK EVENTS ====================


  // Grabs data from forms and constructs a card and pushes to firebase
  $(".createNewCard").click(function () {
    let groupName = "";
    let questionArg = $("#frontCardData").val().trim();
    let answerArg = $("#backCardData").val().trim();
    let dataArg = $(this).attr("data-Choice");
    $("#groupName").val().trim() === "" ? groupName = "standard" : groupName = $("#groupName").val().trim();

    // Checker for correct cloze card input by user
    if ((dataArg === "cloze") && (!(questionArg.includes(answerArg)))) {
      alert("Your card was not formatted properly");
    }

    // Creates a new card and pushes the data up to the Users firebase account
    let newCard = new Card(questionArg, answerArg, dataArg, groupName);
    database.add(userDirectory, groupName, newCard);

    $("input").val("");
    cardCreatedArray = [];
    createSnapShot();
  });


  // initiates new layout of landing page to review your current
  $("#reviewCardSelector").click(function () {
    if (cardCreatedArray.length > 0) {
      currentIndexVal = 1;
      $(`*[data-index=${currentIndexVal}]`).addClass("animated flip cardBorder");
      newPageLayout();
    }
    else {
      alert("No cards to review");
    }
  });


  // Creates group specific snapshot and deletes data from database
  $('body').on('click', '.btn-danger', function () {
    let index = $(this).attr("value");
    let group = this.id;
    let listnerKeys = firebase.database().ref(`/${userDirectory}/${group}/`);

    listnerKeys.on('value', gotData, errData);
    function gotData(data) {
      let dataValue = data.val();
      let snapKeys = Object.keys(dataValue);
      database.remove(userDirectory, group, snapKeys[index]);
    }
    function errData(errData) {
      // console.log(`The read failed: ${errData}`);
    }

    let cardIndex = $(this).attr('data-index') - 10001;
    cardCreatedArray.splice(cardIndex, 1);
    printCards();
  });


  // ==================== FUNCTIONS ====================


  // Determining if we have a logged in user and defining userDirectory. Innitiates createSnapShot
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userDirectory = user.uid;
      createSnapShot(userDirectory);
      $("#topStuff").append(`<p>${user.email}</p><p>You are logged in.</p>`);
      $("#topStuff").append(`<div class="btn btn-warning" id="signOutPeriod">Sign Out</div>`);

      // If a user wants to sign out
      $("#signOutPeriod").click(function () {
        firebase.auth().signOut().then(function () {
          alert("Sign out Successful");
          window.location.href = "index.html";
        }).catch(function (error) {
          console.log("A fatal error occurred.");
        });
      });
    }
    else {
      console.log("No user found");
    }
  });


  // A one time listener that gives us the cards for that user
  function createSnapShot() {
    let listener = firebase.database().ref(`/${userDirectory}`);
    listener.once("value", function (snapshot) {
      firebaseSnap = snapshot.val();
      databasePushCardsToArray();
    }, function (errorObject) {
      console.log(`The read failed: ${errorObject.code}`);
    });
  };


  // Pushes new cards into card array based on firebase snapshot and innitiates printCards
  function databasePushCardsToArray() {
    for (key in firebaseSnap) {
      let firebaseGroupSnap = firebaseSnap[key];
      for (innerKey in firebaseGroupSnap) {
        let currentCard = new Card(firebaseGroupSnap[innerKey].front, firebaseGroupSnap[innerKey].back, firebaseGroupSnap[innerKey].cardType, firebaseGroupSnap[innerKey].group);
        cardCreatedArray.push(currentCard);
      }
    }
    printCards();
  }


  // Controls data used in how cards are displayed in groups in sidebar
  function printCards() {
    let prevGroup = null;
    let groupIndex = 0;

    // Loop through card created array and print out cards to html
    $("#cardStorage").empty();
    for (let i = 0; i < cardCreatedArray.length; i++) {
      if (cardCreatedArray[i].group === prevGroup) {
        $("#cardStorage").append(`
                                <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                                  <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                                    <img data-index=${(i + 1)} id=${groupIndex} class='cardImg showCard' src='./assets/images/indexfront.jpg' alt='Index Card'>
                                    <span class='btn btn-danger' id=${cardCreatedArray[i].group} value=${groupIndex} data-index=${(i + 10001)}>X</span>
                                  </div>
                                </div>
                              `);
        groupIndex++;
      }
      else {
        groupIndex = 0;
        $("#cardStorage").append(`
                              <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                                <p class='cardSidebarGroup'>Group: ${cardCreatedArray[i].group}</p>
                                <p>Click Card To Start!</p>
                                <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                                  <img data-index=${(i + 1)} id=${groupIndex} class='cardImg showCard' src='./assets/images/indexfront.jpg' alt='Index Card'>
                                  <span class='btn btn-danger' id=${cardCreatedArray[i].group} value=${groupIndex} data-index=${(i + 10001)}>X</span>
                                </div>
                              </div>
                            `);
        prevGroup = cardCreatedArray[i].group;
      }
    }

    // Changes current index value to the side bar card data-index and initiates the transition to the new landing page layout
    $(".showCard").click(function () {
      $(".showCard").removeClass("animated flip cardBorder");
      currentIndexVal = $(this).attr("data-index");
      $(this).addClass("animated flip cardBorder");
      newPageLayout();
    });
  };


  // Builds out new display for landing page and houses related functions for the new layout
  function newPageLayout() {
    // Creates new layout for landing page
    $('#body_card-form').empty().append(`
                                        <div id="backToCardCreationButton"><span class="glyphicon glyphicon-menu-left createMore"></span><span>Create More Cards</span></div>
                                        <div id="displayAnsRight"></div>
                                        <div class="row">
                                          <p class="topDisplayText">Group: ${cardCreatedArray[currentIndexVal - 1].group}</p>
                                          <p class="topDisplayTextTwo">Card ${currentIndexVal}</p>
                                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" id="leftSideCards">
                                            <div class="btn btn-success topDisplayButt" id="revealFront">Reveal Front of Card</div>
                                            <div id="displayAnsLeft"></div>
                                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCardsLeft">
                                              <img src="./assets/images/indexfront.jpg" alt="Front of Index Card" class="img-responsive imgBorder" id="cardFrontFlip">
                                            </div>
                                            <div class="btn btn-primary" id="revealPrev">Reveal the Previous card</div>
                                          </div>
                                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" id="rightSideCards">
                                            <div class="btn btn-success topDisplayButtTwo" id="revealBack">Reveal Back of Card</div>
                                            <div id="displayAnsRight"></div>
                                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="displayCardsRight">
                                              <img src="./assets/images/indexback.jpg" alt="Back of Index Card" class="img-responsive imgBorderTwo" id="cardBackFlip">
                                            </div>
                                            <div class="btn btn-primary" id="revealNext">Reveal the Next card</div>
                                          </div>
                                        </div>
                                      `);

    // Back button to return to default landing page
    $("#backToCardCreationButton").click(() => {
      window.location.href = "landing.html";
    });

    // Reveals front of card
    $("#revealFront").click(function () {
      if (!frontRevealed) {
        setTimeout(() => {
          if (cardCreatedArray[currentIndexVal - 1].cardType === "basic") {
            frontRevealed = true;
            $("#displayCardsLeft").prepend(`<div class='cardAnswerBoxLeft'><p class='answerDisplay'>${cardCreatedArray[currentIndexVal - 1].front}</p></div>`);
          } else {
            frontRevealed = true;
            $("#displayCardsLeft").prepend(`<div class='cardAnswerBoxLeft'><p class='answerDisplay'>${(cardCreatedArray[currentIndexVal - 1].front).replace(cardCreatedArray[currentIndexVal - 1].back, "______")}</p></div>`);
          };
        }, 800);
      }
      $("#cardFrontFlip").addClass("animated flip");
      setTimeout(() => { $("#cardFrontFlip").addClass("hide") }, 800);
    });

    // Reveals back of card
    $("#revealBack").click(function () {
      if (!backRevealed) {
        setTimeout(() => {
          if (cardCreatedArray[currentIndexVal - 1].cardType === "basic") {
            backRevealed = true;
            console.log(cardCreatedArray[currentIndexVal - 1]);
            $("#displayCardsRight").prepend(`<div class='cardAnswerBoxRight'><p class='answerDisplay'>${cardCreatedArray[currentIndexVal - 1].back}</p></div>`);
          } else {
            backRevealed = true;
            $("#displayCardsRight").prepend(`<div class='cardAnswerBoxRight'><p class='answerDisplay'>${cardCreatedArray[currentIndexVal - 1].front}</p></div`);
          };
        }, 800);
        $("#cardBackFlip").addClass("animated flip");
        setTimeout(() => { $("#cardBackFlip").addClass("hide") }, 800);
      }
    });

    // Reveals next card on the list
    $("#revealNext").click(function () {

      $(".showCard").removeClass("animated flip cardBorder");
      if (currentIndexVal < cardCreatedArray.length) {
        $("#displayCardsLeft").empty();
        $("#displayCardsRight").empty();
        currentIndexVal++;
        $(`*[data-index=${currentIndexVal}]`).addClass("animated flip cardBorder");
        frontRevealed = false;
        backRevealed = false;
        newPageLayout();
      }
      else {
        alert("No more cards to show currently");
        $(`*[data-index=${currentIndexVal}]`).addClass("cardBorder");
      }
    });

    // Reveals previous card on the list
    $("#revealPrev").click(function () {

      $(".showCard").removeClass("animated flip cardBorder");
      if (currentIndexVal <= 1) {
        alert("You are already at the beginning.");
        $(`*[data-index=${currentIndexVal}]`).addClass("cardBorder");
      }
      else {
        $("#displayCardsLeft").empty();
        $("#displayCardsRight").empty();
        currentIndexVal--;
        $(`*[data-index=${currentIndexVal}]`).addClass("animated flip cardBorder");
        frontRevealed = false;
        backRevealed = false;
        newPageLayout();
      }
    });
  };

});
