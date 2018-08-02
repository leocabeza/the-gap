var someNotes = [
	'nota 1', 'nota 2', 'note 3', 'note 4',
  'nota 5', 'nota 6', 'note 7', 'note 8'
];
var notesList = document.querySelector('.notes-list');
var backDropActive = false;
var noteSource;
var expandedElementOriginalPosition;

someNotes.forEach(createNote);

function handleInputKeyUp(event) {
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

function handleElementClick(event) {
	var noteElement = getNoteElement(event);

  if (noteElement) {
  	expandedElementOriginalPosition = noteElement.getBoundingClientRect();
  	backDropActive = true;
    document.body.classList.add('backdrop_active');
    
		noteElement.classList.remove('collapsed');
    noteElement.style.left = expandedElementOriginalPosition.left + 'px';
    noteElement.style.top = expandedElementOriginalPosition.top + 'px';
    
    noteElement.classList.add('expanded');
  }
}

function handleBackDropClick(event) { 
	if (backDropActive && ['notesList', 'app'].indexOf(event.target.id) !== -1) {
    var highlightedElement = document.getElementsByClassName('note-element expanded')[0];
    if (highlightedElement) {
      highlightedElement.style = 'position: relative;';
    	highlightedElement.classList.remove('expanded');
      highlightedElement.classList.add('collapsed');
      document.body.classList.remove('backdrop_active');
    }
  }
}

function addNote(text) {
  createNote(text, document.querySelectorAll('.note-element').length);
}

function createNote(noteText, index) {
  var fragment = document.createDocumentFragment();
  var note = document.createElement('li');
  var frontContent = document.createElement('div');
  var backContent = document.createElement('div');
  
  note.className = 'note-container';
  note.setAttribute('data-note-id', note.id);
  
  note.id = 'note-' + index;
  note.className = 'note-element collapsed';
  note.setAttribute('draggable', 'true');
  note.ondrop = dropped;
  note.ondragover = draggingOver;
  note.ondragstart = dragStarted;
  frontContent.textContent = noteText;
  frontContent.className = 'note-front';
  frontContent.setAttribute('data-note-id', note.id);
  backContent.className = 'note-back';
  
  note.appendChild(frontContent);
  note.appendChild(backContent);
  
  fragment.appendChild(note);
  notesList.appendChild(fragment);
}

function dragStarted(event) {
  noteSource = event.target;
  event.dataTransfer.setData('text/html', event.target.innerHTML);
  event.dropEffect = 'move';
}

function draggingOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function dropped(event) {
  event.preventDefault();
  var noteElement = getNoteElement(event);
  noteSource.innerHTML = noteElement.innerHTML;
  noteElement.innerHTML = event.dataTransfer.getData('text/html');
}

function getNoteElement(event) {
	var noteElement;
  if (event.target.tagName === 'LI') {
		return event.target;
  } else {
    // Look for a data-note-id attribute so we can know the closest li element
    var listElement = document.getElementById(event.target.dataset.noteId);
    if (listElement) {
      return listElement;
    }
    
    return null;
  }
}

document.getElementById('app').addEventListener('click', handleBackDropClick);

document.getElementById('newNoteText').addEventListener('keyup', handleInputKeyUp);

document.getElementById('notesList').addEventListener('click', handleElementClick);

document.getElementById('newNoteButton').addEventListener('click', function() {
	addNote(document.getElementById('newNoteText').value);
});