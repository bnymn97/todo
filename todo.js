document.addEventListener('DOMContentLoaded', (event) => {
    aufgabenLaden(); 


function aufgabenLaden() {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];

    let aufgabenListe = document.getElementById('todoListe');
    aufgabenListe.innerHTML = ''; 

    aufgaben.forEach((aufgabe, index) => {
        let li = document.createElement('li'); 
        li.textContent = aufgabe.text; 
        aufgabenListe.appendChild(li); 

        
        let loeschButton = document.createElement('button');
        loeschButton.textContent = 'Löschen';
       
        loeschButton.onclick = function() {
            aufgabeLoeschen(index);
        };
        li.appendChild(loeschButton); 
        aufgabenListe.appendChild(document.createElement('br'));
    });
}


function aufgabeLoeschen(index) {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; 
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); 
}

function neueAufgabeHinzufuegen() {
    let aufgabeInput = document.getElementById('neueAufgabe'); 
    let aufgabeText = aufgabeInput.value; 
    if (aufgabeText === '') {
        alert('Bitte eine Aufgabe eingeben!'); 
        return; 
    }
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; 
    aufgaben.push({text: aufgabeText}); 
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); 
    aufgabeInput.value = ''; 
    aufgabenLaden();
}

document.getElementById('neueAufgabe').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        neueAufgabeHinzufuegen();
    }
});

