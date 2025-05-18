const notes = JSON.parse(localStorage.getItem("notes") || "[]");
const templates = JSON.parse(localStorage.getItem("templates") || "[]");

const notesList = document.getElementById("notes-list");
const treeView = document.getElementById("tree-view");
const noteForm = document.getElementById("note-form");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const saveBtn = document.getElementById("save-note-btn");
const deleteBtn = document.getElementById("delete-note-btn");
const templateSelector = document.getElementById("template-selector");
const fieldsContainer = document.getElementById("fields-container");
const relationsContainer = document.getElementById("relations-container");

let currentNote = null;

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.textContent = note.title;
    div.onclick = () => loadNote(index);
    notesList.appendChild(div);
  });
}

function renderTemplateOptions() {
  templateSelector.innerHTML = "<option value=''>Selecciona plantilla</option>";
  templates.forEach((t, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = t.name;
    templateSelector.appendChild(option);
  });
}

function loadNote(index) {
  currentNote = index;
  const note = notes[index];
  noteTitle.value = note.title;
  noteContent.value = note.content;
  fieldsContainer.innerHTML = "";
  relationsContainer.innerHTML = "";

  if (note.fields) {
    note.fields.forEach(f => {
      const input = document.createElement("input");
      input.placeholder = f.name;
      input.value = f.value || "";
      input.dataset.name = f.name;
      fieldsContainer.appendChild(input);
    });
  }

  if (note.relations) {
    note.relations.forEach(r => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = r;
      relationsContainer.appendChild(tag);
    });
  }

  noteForm.classList.remove("hidden");
}

function saveNote() {
  const newNote = {
    title: noteTitle.value,
    content: noteContent.value,
    fields: [...fieldsContainer.querySelectorAll("input")].map(input => ({
      name: input.dataset.name,
      value: input.value
    })),
    relations: [...relationsContainer.querySelectorAll(".tag")].map(tag => tag.textContent)
  };

  if (currentNote !== null) {
    notes[currentNote] = newNote;
  } else {
    notes.push(newNote);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  noteForm.classList.add("hidden");
}

function deleteNote() {
  if (currentNote !== null) {
    notes.splice(currentNote, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    noteForm.classList.add("hidden");
  }
}

document.getElementById("new-note-btn").onclick = () => {
  currentNote = null;
  noteTitle.value = "";
  noteContent.value = "";
  fieldsContainer.innerHTML = "";
  relationsContainer.innerHTML = "";
  noteForm.classList.remove("hidden");
};

document.getElementById("add-relation-btn").onclick = () => {
  const input = prompt("Nombre de la nota relacionada:");
  if (input) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = input;
    relationsContainer.appendChild(tag);
  }
};

saveBtn.onclick = saveNote;
deleteBtn.onclick = deleteNote;

document.getElementById("toggle-tree-btn").onclick = () => {
  treeView.classList.toggle("hidden");
};

renderNotes();
renderTemplateOptions();