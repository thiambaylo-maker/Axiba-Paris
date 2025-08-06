let toReadBooks = [];
let inProgressBooks = [];
let completedBooks = [];
let pendingIndex = null;

function loadData() {
  toReadBooks = JSON.parse(localStorage.getItem("toReadBooks")) || [];
  inProgressBooks = JSON.parse(localStorage.getItem("inProgressBooks")) || [];
  completedBooks = JSON.parse(localStorage.getItem("completedBooks")) || [];
}

function saveData() {
  localStorage.setItem("toReadBooks", JSON.stringify(toReadBooks));
  localStorage.setItem("inProgressBooks", JSON.stringify(inProgressBooks));
  localStorage.setItem("completedBooks", JSON.stringify(completedBooks));
}

document.getElementById("addBookBtn").addEventListener("click", () => {
  const title = document.getElementById("bookTitle").value.trim();
  if (title) {
    toReadBooks.push(title);
    document.getElementById("bookTitle").value = "";
    saveData();
    renderLists();
  }
});

function renderLists() {
  renderList("toReadList", toReadBooks, ["Prendre pour lecture"], handleToReadAction);
  renderList("inProgressList", inProgressBooks, ["Terminer"], handleInProgressAction);
  renderList("completedList", completedBooks, [], () => {});
}

function renderList(elementId, list, buttons, actionHandler) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = "";
  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    buttons.forEach((btnLabel) => {
      const btn = document.createElement("button");
      btn.textContent = btnLabel;
      btn.addEventListener("click", () => {
        actionHandler(index);
        saveData();
      });
      li.appendChild(btn);
    });

    ul.appendChild(li);
  });
}

// 👉 Clic sur "Prendre pour lecture"
function handleToReadAction(index) {
  pendingIndex = index;
  document.getElementById("readerName").value = "";
  document.getElementById("readingCount").value = "";
  document.getElementById("readingModal").classList.remove("hidden");
}

// 👉 Annuler la modale
document.getElementById("cancelReadingBtn").addEventListener("click", () => {
  document.getElementById("readingModal").classList.add("hidden");
  pendingIndex = null;
});

// 👉 Valider la modale
document.getElementById("confirmReadingBtn").addEventListener("click", () => {
  const name = document.getElementById("readerName").value.trim();
  const count = document.getElementById("readingCount").value.trim();

  if (!name || !count || parseInt(count) < 1) {
    alert("Veuillez renseigner un nom et un nombre de lectures valide.");
    return;
  }

  const title = toReadBooks[pendingIndex];
  const enrichedTitle = `${title} — 📖 par ${name}, ${count} lecture(s)`;
  inProgressBooks.push(enrichedTitle);

  document.getElementById("readingModal").classList.add("hidden");
  pendingIndex = null;
  saveData();
  renderLists();
});

loadData();
renderLists();

// 👉 Terminer un livre
function handleInProgressAction(index) {
  const title = inProgressBooks[index];
  const confirmEnd = confirm(`Souhaitez-vous marquer "${title}" comme terminé ?`);
  if (!confirmEnd) return;

  inProgressBooks.splice(index, 1);
  completedBooks.push(title);
  renderLists();
}

document.getElementById("resetLibraryBtn").addEventListener("click", () => {
  const confirmReset = confirm("Voulez-vous vraiment réinitialiser toute la bibliothèque ?");
  if (!confirmReset) return;

  toReadBooks = [];
  inProgressBooks = [];
  completedBooks = [];
  saveData();
  renderLists();
});
