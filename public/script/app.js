var app = new Vue({
    el: ".app",
    data: {
        teams: [],
        matches: [],
        locations: [],
        user: null
    },
    created: function () {
        this.fetchData();
    },

    methods: {
        fetchData: function () {
            fetch('https://api.myjson.com/bins/tb7le')
                .then(function (respond) {
                    return respond.json();
                })
                .then(function (myJson) {
                    app.teams = myJson.teams;
                    app.matches = myJson.match;
                    app.locations = myJson.field;

                })
        }

    }
})

//hide and show Divs

var divs = ["Div1", "Div2", "Div3", "Div4", "Div5"];
var visibleDivId = null;

function divVisibility(divId) {
    if (visibleDivId === divId) {
        visibleDivId = null;
    } else {
        visibleDivId = divId;
    }
    hideNonVisibleDivs();
}

function hideNonVisibleDivs() {
    var i, divId, div;
    for (i = 0; i < divs.length; i++) {
        divId = divs[i];
        div = document.getElementById(divId);
        if (visibleDivId === divId) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}

function checkUserSignIn() {
    if (app.user == null) {
        callGoogleSignIn();
    } else {
        divVisibility('Div5');
    }
}

function callGoogleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        app.user = user;
        // ...
        divVisibility('Div5');
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

document.getElementById("create-post").addEventListener("click", writeNewPost);

getmsg();

function writeNewPost() {
    //moving and saving the data from textMessage field to database 
    var text = document.getElementById("textMessage").value;
    firebase.database().ref().push({
        message: text,
        timestamp: new Date().getTime(),
        user: app.user.email,
        username: app.user.displayName

    });
    $("#textMessage").val("");
}


function getmsg() {
    //get the data from database
    firebase.database().ref().on('value', function (data) {

        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = "";

        //get the chat message
        var messages = data.val();

        var template = "";

        for (var key in messages) {

            if (messages[key].username == firebase.auth().currentUser.displayName) {

                template += `
                    <div class="notification is-info">
                    <p class="jsname">${messages[key].username}says:</p>
                    <p id="jsmessage">${messages[key].message} </p>
                    </div> `;
            } else {
                template += `
                        <div class="notification is-primary">
                        <p class="jsname">${messages[key].username}says:</p>
                    <p id="jsmessage">${messages[key].message} </p>
                    </div> `;

            }
        }

        messageArea.innerHTML = template;
        $(".box").animate({
            scrollTop: $(".box").prop("scrollHeight")
        }, 500);


    });
}


function popupfunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

// Set the date we're counting down to
var countDownDate = new Date("Dec 8, 2018 15:37:25").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("border").innerHTML = days + "d " + hours + "h " +
        minutes + "m " + seconds + "s ";

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("border").innerHTML = "EXPIRED";
    }
}, 1000);
