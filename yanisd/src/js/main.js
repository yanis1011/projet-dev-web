var userLang = navigator.language || navigator.userLanguage;

function toClipboard(txt) {
  navigator.clipboard.writeText(txt);
  if (userLang == "en" || userLang == "en-US") {
    alert("Copied the text: " + txt);
  } else if (userLang == "fr") {
    alert("texte copié : " + txt);
  } else {
    alert("Copied the text: " + txt);
  }
}

function openNewTab(url) {
  window.open(url, "_blank");
}

function changeURL(url) {
  location.href = url;
}

var form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("inputEmail4").value;
    var name = document.getElementById("inputName4").value;
    var title = document.getElementById("inputTitle").value;
    var message = document.getElementById("inputMessage").value;
    var lang = document.getElementById("inputState").value;

    if (!isValidEmail(email)) {
      if (lang === 'fr') {
        alert("Entrez une adresse mail valide.");
      } else {
        alert("Please enter a valid email address.");
      }
      return;
    }

    SendContactMail(email, name, title, lang, replaceNewLines(message));
  });
}

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function replaceNewLines(str) {
  return str.replace(/\n/g, '%0D%0A');
}

function SendContactMail(mail, name, title, lang, content) {
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`| user info do not remove : ${lang}, ${name}, ${mail} |\n\n\n${content}`);
  openNewTab(`mailto:yanis.111105@gmail.com?subject=${subject}&body=${body}`);
  return 0;
}

function calcInput(value) {
  const display = document.getElementById('calc-display');
  if (display) display.value += value;
}

function clearDisplay() {
  const display = document.getElementById('calc-display');
  if (display) display.value = '';
}

function calculateResult() {
  const display = document.getElementById('calc-display');
  if (display) {
    try {
      display.value = eval(display.value);
    } catch (e) {
      display.value = 'Erreur';
    }
  }
}

const lang = document.documentElement.lang;

var forms = [
  {
    questionLabel: "De quel couleur était le cheval blanc de Charlemagne ?",
    questionId: 1,
    answers: [
      { answerLabel: "Blanc", answerId: 1 },
      { answerLabel: "Marron", answerId: 2 },
      { answerLabel: "Noire", answerId: 3 },
    ],
  },
  {
    questionLabel: "Quand le Bismarck a-t-il coulé ?",
    questionId: 2,
    answers: [
      { answerLabel: "le 6 Mai 1943", answerId: 1 },
      { answerLabel: "le 1e Avril 1969", answerId: 2 },
      { answerLabel: "le 27 Mai 1941", answerId: 3 },
    ],
  },
];

function displayQuestion(index) {
  const question = forms[index];
  let answersHTML = "";
  question.answers.forEach((answer) => {
    answersHTML += `<button type="button" class="btn btn-primary" onclick="selectAnswer(${question.questionId}, ${answer.answerId})">${answer.answerLabel}</button>`;
  });

  const questionHTML = `
    <div class="question d-flex flex-column align-items-center">
      <p class="text-center">${question.questionLabel}</p>
      <div class="btn-group" role="group" aria-label="Answer buttons">${answersHTML}</div>
    </div>
  `;
  document.getElementById("question-container").innerHTML = questionHTML;
}

let selectedAnswers = [];

function selectAnswer(qId, aId) {
  selectedAnswers.push(`Q${qId}_${aId}`);

  if (selectedAnswers.length === forms.length) {
    const answerString = selectedAnswers.join('...') + '...';
    const fileSuffix = ".fr.html";
    const targetFile = `${answerString}${fileSuffix}`;
    checkFileExists(targetFile).then((exists) => {
      if (exists) {
        window.location.href = targetFile;
      } else {
        alert("Les réponses sont incorrectes. Veuillez réessayer.");
        selectedAnswers = [];
        displayQuestion(0);
      }
    });
  } else {
    displayQuestion(selectedAnswers.length);
  }
}


function generateAllAnswerCombos(forms) {
  let combos = [""];
  forms.forEach((question) => {
    const newCombos = [];
    question.answers.forEach((answer) => {
      combos.forEach((prefix) => {
        newCombos.push(`${prefix}Q${question.questionId}_A${answer.answerId}...`);
      });
    });
    combos = newCombos;
  });
  return combos.map(c => c.endsWith("...") ? c.slice(0, -3) : c);
}

async function brutforce() {
  const combos = generateAllAnswerCombos(forms);

  for (let i = 0; i < combos.length; i++) {
    const steps = combos[i].split('...');
    const answerString = combos[i] + '...';
    const fileSuffix = ".fr.html";
    const targetFile = `${answerString}${fileSuffix}`;
    const exists = await checkFileExists(targetFile);
    if (exists) {
      window.location.href = targetFile;
      return;
    }
  }
  alert("Aucune combinaison correcte trouvée.");
}



function generatePossibleLinks(forms) {
  let possibleLinks = [""];
  forms.forEach((question) => {
    const newLinks = [];
    question.answers.forEach((answer) => {
      possibleLinks.forEach((link) => {
        newLinks.push(link + `Q${question.questionId}_A${answer.answerId}...`);
      });
    });
    possibleLinks = newLinks;
  });
  return possibleLinks;
}

function checkFileExists(url) {
  return fetch(url, { method: "HEAD" })
    .then((response) => response.ok)
    .catch((error) => {
      console.error("Erreur lors de la vérification du fichier :", error);
      return false;
    });
}

displayQuestion(0);
