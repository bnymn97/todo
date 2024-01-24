document.addEventListener('DOMContentLoaded', (event) => {
    aufgabenLaden();
    let aufgabeInput = document.getElementById('neueAufgabe');
    aufgabeInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            neueAufgabeHinzufuegen();
        }
    });
});


function aufgabenLaden() {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];

    let aufgabenListe = document.getElementById('todoListe');
    aufgabenListe.innerHTML = ''; // Leert die aktuelle Liste, um sie neu zu befüllen

    aufgaben.forEach((aufgabe, index) => {
        let li = document.createElement('li'); // Erstellt ein neues Listenelement
        li.textContent = aufgabe.text; // Setzt den Text der Aufgabe in das Listenelement
        aufgabenListe.appendChild(li); // Fügt das Listenelement zur Liste im HTML hinzu

        // Erstellt einen Löschbutton für jede Aufgabe
        let loeschButton = document.createElement('button');
        loeschButton.textContent = 'Löschen';
        // Fügt einen Event-Listener hinzu, der die Aufgabe löscht, wenn der Button geklickt wird
        loeschButton.onclick = function() {
            aufgabeLoeschen(index);
        };
        li.appendChild(loeschButton); // Fügt den Löschbutton zum Listenelement hinzu
    });
}

function aufgabeLoeschen(index) {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; //Liest vorhandene Aufgabe
    aufgaben.splice(index, 1); // Entfernt die Aufgabe am spezifizierten Index
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); // Speichert das aktualisierte Array
    aufgabenLaden();
}

function neueAufgabeHinzufuegen() {
    let aufgabeInput = document.getElementById('neueAufgabe'); // Greift auf das Eingabefeld zu
    let aufgabeText = aufgabeInput.value; // Holt den eingegebenen Text aus dem Eingabefeld
    if (aufgabeText === '') {
        alert('Bitte eine Aufgabe eingeben!'); // Zeigt eine Warnung, falls das Feld leer ist
        return; // Beendet die Funktion frühzeitig, falls kein Text eingegeben wurde
    }
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; // Liest vorhandene Aufgaben
    aufgaben.push({text: aufgabeText}); // Fügt die neue Aufgabe zum Array hinzu
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); // Speichert das aktualisierte Array
    aufgabeInput.value = ''; // Leert das Eingabefeld
    aufgabenLaden();
}

