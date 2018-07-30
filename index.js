// https://aerotwist.com/blog/flip-your-animations/
// https://googlearchive.github.io/flipjs/
// https://www.foreach.be/blog/time-flip-high-performance-animations

var notes = ['nota 1', 'nota 2', 'note 3'];
var notesList = document.querySelector('.notes-list');
var noteSource;

createNotes();

function toggleButtonIfNecessary(event) {
  var addNewNoteButton = document.getElementById('newNoteButton');

  event.target.value === '' ?
    addNewNoteButton.setAttribute('disabled', 'disabled') :
    addNewNoteButton.removeAttribute('disabled');

  if (event.target.value !== '' && event.keyCode === 13) {
    addNote(event.target.value);
    document.getElementById('newNoteText').value = '';
    addNewNoteButton.setAttribute('disabled', 'disabled');
  }
}

function addNote(text) {
  createNote(text, document.querySelectorAll('.note-element').length);
}

function createNote(noteText, index) {
  var fragment = document.createDocumentFragment();
  var note = document.createElement('li');
  var flipper = document.createElement('div');
  var frontContent = document.createElement('div');
  var backContent = document.createElement('div');
  
  flipper.className = 'note-container';
  flipper.setAttribute('data-note-id', note.id);
  note.id = 'note-' + index;
  note.className = 'note-element';
  note.setAttribute('draggable', 'true');
  note.ondrop = dropped;
  note.ondragover = draggingOver;
  note.ondragstart = dragStarted;
  frontContent.textContent = noteText;
  frontContent.className = 'note-front';
  frontContent.setAttribute('data-note-id', note.id);
  backContent.className = 'note-back';
  
  flipper.appendChild(frontContent);
  flipper.appendChild(backContent);
  note.appendChild(flipper);
  fragment.appendChild(note);
  notesList.appendChild(fragment);
}

function createNotes() {
  notes.forEach(createNote);
}

function dragStarted(event) {
  noteSource = event.target;
  event.dataTransfer.setData('text/plain', event.target.innerHTML);
  event.dropEffect = 'move';
}

function draggingOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function dropped(event) {
  event.preventDefault();
  noteSource.innerHTML = event.target.innerHTML;
  event.target.innerHTML = event.dataTransfer.getData('text/plain');
}

document.getElementById('notesList').addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    event.target.classList.add('note-element_highlighted');
  } else {
    // Look for a data-note-id attribute so we can know the closest li element
    var listElement = document.getElementById(event.target.dataset.noteId);
    if (listElement) {
      listElement.classList.add('note-element_highlighted');
    }
  }
});
