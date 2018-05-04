window.onload = function () {
  var loginForm = document.getElementById("details");
  var optionSpace = document.getElementById("options");
  var previous = document.getElementById("previousPage");
  var name = "";
  var regNo = "";
  var subjectName = "";
  var x = 0; //A counter to navigate through each question in the json

  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'question.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // .open will NOT return a value but simply returns undefined in async mode so use a callback
        callback(xobj.responseText);
      }
    }
    xobj.send(null);
  }


  //Storing login details in local storage and clearing contents of the page on button click

  document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    if (document.forms["login"]["fname"].value != "") {
      name = document.getElementById("userName").value;
      regNo = document.getElementById("regNo").value;
      subjectName = document.getElementById("subject").value;
      sessionStorage.setItem("StudentName", name);
      sessionStorage.setItem("Subject", subjectName);
      sessionStorage.setItem("RegNo", regNo);
      loginForm.innerHTML = "";
      loginForm.style.display = "none";
      document.getElementById("main").classList.add("quiz")
      document.getElementById("nextPage").style.display = "block";
      document.getElementById("title").innerHTML = "How well do you know Basic Science?";
      administerTest(subjectName);
    } else {
      alert("Name must be filled")
    }
  });

  function administerTest(subjectName) {
    loadJSON(function (response) {
      data = JSON.parse(response)
      test = data.quiz[subjectName];
      allQuestion = test.length;
      console.log(allQuestion);
      var fullOptions = test[x].options.length;
      //Creating the radio buttons for each question dynamically
      for (var i = 0; i < fullOptions; i++) {
        var list = document.createElement("li");
        list.setAttribute("class", ".choice")
        var input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "options" + x)
        var radioOptions = document.createTextNode(test[x].options[i]);

        optionSpace.appendChild(list);
        list.appendChild(input);
        list.appendChild(radioOptions);
      }
      //appending first question to the html doc
      document.getElementById("question").innerHTML = test[x].question;
    })
  }

  //Checks if selected answer is correct and stores appropriate mark to sessionStorage
  function validateAnswer() {
    selected = false;
    var radioGroup = document.getElementsByName("options" + x);
    //checking and summing up correct answers
    for (var j = 0; j < radioGroup.length; j++) {
      if (radioGroup[j].checked) {
        selected = true;
        radioGroup[j].checked = true;
        if (j === test[x].answer) {
          sessionStorage.setItem("answer" + x, "1")
        } else {
          sessionStorage.setItem("answer" + x, "0")

        }

      }
    }

    if (!selected) {
      sessionStorage.setItem("answer" + x, "0")
      // document.getElementById("notification").textContent = "You have not selected an answer"
    }
  }

  //When the next button is clicked...
  document.getElementById("nextPage").addEventListener("click", function () {
    validateAnswer();
    while (optionSpace.firstChild) {
      optionSpace.removeChild(optionSpace.firstChild)  //remove the current set of options...
    }
    //increment x and call the physics function again to display the next question and options until the last question
    x++
    if (x < allQuestion) {
      administerTest(subjectName);
      previous.style.display = "block";
    }
    else {
      previous.style.display = "none";

      var candidate = sessionStorage.getItem("StudentName");
      console.log(candidate)
      var category = sessionStorage.getItem("Subject");
      calculateTotal();
      document.getElementById("question").innerHTML = candidate + ", your total score is: " + totalScore + " / " + allQuestion + " in " + category;
      this.style.display = "none"

    }

  })

  document.getElementById("previousPage").addEventListener("click", function () {
    while (optionSpace.firstChild) {
      optionSpace.removeChild(optionSpace.firstChild)
    }
    //increment x and call the physics function again to display the next question and options until the last question
    if (x > 0) {
      x--;
    }
    administerTest(subjectName);
  })

  function calculateTotal(y) {
    y = 0;
    item = 5;
    totalScore = 0;
    for (var i = 0; i < item; i++) {
      var score = parseInt(sessionStorage.getItem("answer" + y))
      totalScore += score;
      y++
    }
    return totalScore;
  }
}















