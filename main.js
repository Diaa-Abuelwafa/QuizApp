// Select Elements
let mainDiv = document.querySelector(".quiz"); 
let countQuestions = document.querySelector(".quiz .title .num-ques");
let mainQuestions = document.querySelector(".quiz .questions");
let mainSubmit = document.querySelector(".quiz .submit-div");
let mainprogress = document.querySelector(".quiz .progress");
let mainBullets = document.querySelector(".quiz .progress .bullets");
let mainCounter = document.querySelector(".quiz .progress .counter");
let mainResult = document.querySelector(".quiz .result");
let inputSubmit = document.querySelector(".quiz .submit-div input");


// Global Variables
let count = 0;
let arr = [];
let arrBullets = [];
let counterInterval;
let correctCount = 0;
let questionsCount = 0;

// Request
let request = new XMLHttpRequest();
request.open("GET", "html_questions.json");
request.send();

request.onreadystatechange = function ()
{
    if (request.readyState === 4 && request.status === 200)
    {
        let jsonObj = this.responseText;
        let jsObj = JSON.parse(jsonObj);
        arr = jsObj;
        questionsCount = arr.length;
        countQuestions.innerHTML = questionsCount;
        getBullets(jsObj.length);
        getQues(arr, count);
    }
}
// Function To Get The Question
function getQues (questions, num)
{
    mainQuestions.innerHTML = "";
    questionsCount = questions.length;
    let arrInputs = [];
    let arrAnswers = [];

    let questionHeading = document.createElement("h2");
    questionHeading.textContent = questions[num].title;
    
    let answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");
    for (let i = 1; i <= 4; ++i)
    {
        let answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");
        
        let inputRadio = document.createElement("input");
        inputRadio.type = "radio";
        inputRadio.name = "question";
        inputRadio.id = `answer${i}`;
        arrInputs.push(inputRadio);
        if (i === 1)
        {
            inputRadio.checked = true; 
        }
        let label = document.createElement("label");
        label.setAttribute("for",`answer${i}`)
        label.textContent = questions[num][`answer_${i}`];
        arrAnswers.push(label.textContent);
        answerDiv.append(inputRadio);
        answerDiv.append(label);
        
        answersDiv.append(answerDiv);
    }
    
    mainQuestions.append(questionHeading);
    mainQuestions.append(answersDiv);

    let rightAnswer = questions[num].right_answer;

    addBullet(num);

    count++;

    countDown(7);

    inputSubmit.onclick = function ()
    {
        let choose;
        for (let i = 0; i < arrInputs.length; ++i)
        {
            if (arrInputs[i].checked)
            {
                choose = i;
            }
        }

        let right;

        for (let i = 0; i < arrAnswers.length; ++i)
        {
            if (arrAnswers[i] == rightAnswer)
            {
                right = i;
            }
        }

        if (choose === right)
        {
            correctCount++;
        }

        clearInterval(counterInterval);
        if (count < arr.length)
        {
            getQues(arr, count);
        }
        else
        {
            showResult(count, correctCount);
        }
    }

}

function getBullets(nums)
{
    for (let i = 0; i < nums; ++i)
    {
        let span = document.createElement("span");
        span.classList.add("bullet");
        arrBullets.push(span);  
        mainBullets.append(span);
    }
}


function addBullet(num)
{
    arrBullets[num].style.backgroundColor = "#0075ff";
}

function countDown(sec)
{
    counterInterval = setInterval (() => {
        mainCounter.innerHTML = `00:0${sec--}`;
        if (sec === -1)
        {
            clearInterval(counterInterval);
            inputSubmit.click();
        }
    }, 1000)
}

function showResult (nums, correct)
{
    mainQuestions.remove();
    mainSubmit.remove();
    mainprogress.remove();

    mainResult.style.display = "block";

    let paragraph = document.createElement("p");
    let spanFeedback = document.createElement("span");
    spanFeedback.classList.add("feedback");
    if (correct > nums / 2 && correct != nums)
    {
        spanFeedback.textContent = "Good, ";
        spanFeedback.style.color = "green";
    }
    else if (correct == nums)
    {
        spanFeedback.textContent = "Perfect, ";
        spanFeedback.style.color = "#0075ff";
    }
    else
    {
        spanFeedback.textContent = "Bad, ";
        spanFeedback.style.color = "red";
    }
    paragraph.append(spanFeedback);

    mainResult.append(paragraph);

    let result = document.createTextNode(`${correct} From ${nums}`);

    paragraph.append(result);
}
