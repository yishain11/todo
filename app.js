let storedNotes;

window.onload = () => {
    // set noted if there are none
    storedNotes = localStorage.getItem('notes');
    if (!storedNotes) {
        localStorage.setItem('notes', "[]");
        storedNotes = [];
    } else {
        storedNotes = JSON.parse(storedNotes);
    }
    // attach event to buttons
    const clearButton = document.getElementById('clearButton')
    clearButton.addEventListener('click', (event) => {
        event.preventDefault()
        clearForm()
    })
    const submitButton = document.getElementById('subButton')
    submitButton.addEventListener('click', (event) => {
        event.preventDefault()
        const noteTxt = document.getElementById("noteTxt").value;
        const noteDate = document.getElementById("noteTime").value;
        const noteHours = document.getElementById("noteHour").value;
        const timestamp = Date.now();
        // push new note data to the array, to the corrent position based on timestamp
        const newNoteObj = { noteTxt, noteDate, noteHours, timestamp };
        if (storedNotes.length <= 0){
            storedNotes.push(newNoteObj);
        } else {
            for (let index = 0; index < storedNotes.length; index++) {
                const storedNodeObj = storedNotes[index];
                if(storedNodeObj.timestamp < newNoteObj.timestamp){
                    storedNotes.splice(index,0,newNoteObj)
                    break;
                }
                
            }

        }
        // store new array in localstorage
        localStorage.setItem('notes',JSON.stringify(storedNotes));
        // clear current html rendered html notes
        clearHtmlNotes()
        // render notes array to html again
        renderNotesToHtml(storedNotes)
        // clear form
        clearForm()
    })


    // if there are stored notes, render them
    if (storedNotes.length > 0) {
        console.log('storedNotes on init: ', storedNotes)
        // sort notes by timestamp
        storedNotes.sort(compare);
        renderNotesToHtml(storedNotes);
    }

}

function clearHtmlNotes(){
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
}

function clearForm() {
    const form = document.getElementById('form');
    form.reset();
}

function renderSingleNote(newNote) {
    const notes = document.getElementById('notesContainer');
    // add element to container
    notes.appendChild(newNote);
    // clearForm();
    // store new note to localstorage
    // storeNotes(noteData);
}

function createNote(noteData) {
    const note = document.createElement("div");
    note.classList.add('note');
    // note.addEventListener('mouseenter',()=>{
    // })
    const delButton = document.createElement('delButton');
    delButton.innerText = '[X]';
    // add delete functionality
    delButton.addEventListener('click',(event)=>{
        const parentTimeStamp = event.target.parentNode.attributes.getNamedItem('id').nodeValue;
        for (let index = 0; index < storedNotes.length; index++) {
            const noteObj = storedNotes[index];
            if (noteObj.timestamp === parseInt(parentTimeStamp)){
                storedNotes.splice(index,1)
                renderNotesToHtml(storedNotes);
                storeNotes(storedNotes);
                break;
            }
        }
        
    })
    note.appendChild(delButton);
    // note.addEventListener('mouseleave',()=>{
    //     console.log(`leave`);
        
    // })
    const noteTxt = document.createElement("div");
    noteTxt.innerText = noteData.noteTxt;
    noteTxt.classList.add('noteTxt');
    const noteDate = document.createElement("div");
    noteDate.innerText = noteData.noteDate;
    noteDate.classList.add('noteDate');
    let noteHours;
    if (noteData.noteHours !== "") {
        noteHours = document.createElement("div");
        noteHours.innerText = noteData.noteHours;
        noteHours.classList.add('noteHours');

    }
    note.appendChild(noteTxt);
    note.appendChild(noteDate);
    note.setAttribute('id',noteData.timestamp)
    if (noteHours) {
        note.appendChild(noteHours);
    }
    return note;
}

function storeNotes(noteData) {
    // store new note to localstorage
    localStorage.setItem("notes", JSON.stringify(storedNotes));
}

function renderNotesToHtml(storedNotes) {
    clearHtmlNotes();
    const container = document.getElementById('notesContainer')
    container.classList.add('notesContainer');
    // note array should be sorted
    storedNotes.forEach(noteObj => {
        const noteElement = createNote(noteObj)
        renderSingleNote(noteElement)
    });
}

function compare(a, b) {
    const timestampA = a.timestamp;
    const timestampB = b.timestamp;

    let comparison = 0;
    if (timestampA > timestampB) {
        comparison = -1;
    } else if (timestampA < timestampB) {
        comparison = 1;
    }
    return comparison;
}

