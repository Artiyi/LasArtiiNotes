let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let current = null;

const list = document.getElementById("notes-list");
const editor = document.getElementById("note-editor");
const title = document.getElementById("note-title");
const body = document.getElementById("note-body");
const rel = document.getElementById("relations");
const status = document.getElementById("save-status");

function renderNotes() {
  list.innerHTML = "";
  notes.forEach((n, i) => {
    const item = document.createElement("div");
    item.textContent = n.title;
    item.onclick = () => loadNote(i);
    list.appendChild(item);
  });
}

function loadNote(i) {
  current = i;
  let n = notes[i];
  title.value = n.title;
  body.value = n.body;
  renderRelations(n.relations || []);
  editor.classList.remove("hidden");
}

function renderRelations(arr) {
  rel.innerHTML = "";
  arr.forEach(t => {
    const tag = document.createElement("span");
    tag.textContent = t;
    rel.appendChild(tag);
  });
}

function saveNote() {
  const note = {
    title: title.value,
    body: body.value,
    relations: [...rel.children].map(t => t.textContent)
  };
  if (current !== null) notes[current] = note;
  else notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  status.classList.remove("hidden");
  setTimeout(() => status.classList.add("hidden"), 1500);
}

function deleteNote() {
  if (current !== null) {
    notes.splice(current, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    editor.classList.add("hidden");
  }
}

function addRelation() {
  const name = prompt("Nombre de relación:");
  if (name) {
    const tag = document.createElement("span");
    tag.textContent = name;
    rel.appendChild(tag);
  }
}

document.getElementById("new-note").onclick = () => {
  current = null;
  title.value = "";
  body.value = "";
  rel.innerHTML = "";
  editor.classList.remove("hidden");
};

document.getElementById("save-note").onclick = saveNote;
document.getElementById("delete-note").onclick = deleteNote;
document.getElementById("add-relation").onclick = addRelation;
document.getElementById("readonly-toggle").onchange = e => {
  const ro = e.target.checked;
  title.disabled = ro;
  body.disabled = ro;
};

renderNotes();