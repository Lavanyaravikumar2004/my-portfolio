let subjectCount = 3;

function createSubjectInput(mark = "", index = null) {
  const subjectDiv = document.createElement("div");
  subjectDiv.className = "subject";

  const input = document.createElement("input");
  input.type = "number";
  input.value = mark;
  input.readOnly = true;
  input.placeholder = index !== null ? `Subject ${index + 1} Marks` : `Subject Marks`;

  input.onclick = () => input.readOnly = false;
  input.onblur = () => input.readOnly = true;

  const delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";
  delBtn.onclick = function () {
    deleteSubject(delBtn);
  };

  subjectDiv.appendChild(input);
  subjectDiv.appendChild(delBtn);
  return subjectDiv;
}

function addSubject() {
  subjectCount++;
  const inputsDiv = document.getElementById("inputs");
  const subjectInput = createSubjectInput();
  inputsDiv.appendChild(subjectInput);
}

function deleteSubject(button) {
  const subjectDiv = button.parentElement;
  subjectDiv.remove();
}

function calculateGrade() {
  const inputs = document.querySelectorAll('#inputs input');
  let total = 0;
  let marks = [];

  for (let input of inputs) {
    let val = Number(input.value);
    if (isNaN(val) || val < 0 || val > 100) {
      document.getElementById("result").innerText = "❌ Invalid Marks!";
      return;
    }
    marks.push(val);
    total += val;
  }

  let percent = total / marks.length;
  let grade = percent >= 90 ? "A+" :
              percent >= 75 ? "A" :
              percent >= 60 ? "B" :
              percent >= 40 ? "C" : "Fail";

  let remark = grade === "Fail" ? "❗Needs Improvement" :
               grade === "C" ? "Keep trying!" :
               grade === "B" ? "Good!" :
               grade === "A" ? "Well done!" : "Excellent!";

  const resultText = `Total: ${total}, Percentage: ${percent.toFixed(2)}%, Grade: ${grade}\n${remark}`;
  document.getElementById("result").innerText = resultText;

  localStorage.setItem("lastMarks", JSON.stringify(marks));
  speechSynthesis.speak(new SpeechSynthesisUtterance(`Your grade is ${grade}. ${remark}`));
}

function downloadResult() {
  const result = document.getElementById("result").innerText;
  const blob = new Blob([result], { type: 'text/plain' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "result.txt";
  link.click();
}

function toggleDark() {
  document.body.classList.toggle("dark-mode");
}

function sortSubjects() {
  const container = document.getElementById("inputs");
  const subjects = Array.from(container.getElementsByClassName("subject"));

  subjects.sort((a, b) => {
    const valA = Number(a.querySelector("input").value || 0);
    const valB = Number(b.querySelector("input").value || 0);
    return valA - valB;
  });

  container.innerHTML = "";
  subjects.forEach(sub => container.appendChild(sub));
}

function changeTheme() {
  const theme = document.getElementById("themeSelector").value;
  document.body.className = '';
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("selectedTheme", theme);
}

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("lastMarks"));
  const savedTheme = localStorage.getItem("selectedTheme") || "default";
  document.getElementById("themeSelector").value = savedTheme;
  changeTheme();

  if (saved) {
    const container = document.getElementById("inputs");
    container.innerHTML = "";
    saved.forEach((mark, index) => {
      const subjectInput = createSubjectInput(mark, index);
      container.appendChild(subjectInput);
    });
    subjectCount = saved.length;
  }

  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') console.log('👍 App Installed');
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    });
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ Service Worker Registered:', reg.scope))
      .catch(err => console.error('❌ SW registration failed:', err));
  }
};
