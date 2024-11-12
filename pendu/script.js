
"use strict";

        const message = document.querySelector('h2');
        const btnRetry = document.querySelector('#retryBtn');
        const wordDisplay = document.querySelector('#word-display');
        const letterButtons = document.querySelector('#letter-buttons');

        let find;
        let compteur = 0;
        let data = [];
        let currentWordState = [];

        const url = "./pendu.json"; 
        const tentatives = 5;
        let alphabet = []; // Déclaration du tableau vide pour l'alphabet

        // Remplissage du tableau alphabet avec une boucle
        for (let i = 65; i <= 90; i++) {
            alphabet.push(String.fromCharCode(i));
        }

        fetch(url).then(handleFetch);

        function handleFetch(response) {
            if(response.ok) {
                response.json()
                    .then(d => {
                        data = d;
                        find = data[Math.floor(Math.random()*data.length)].toUpperCase();
                        console.log(find);
                        createLetterButtons();
                        initializeWordDisplay();
                    })
                    .catch(error => console.error(error));
            } else {
                console.error(response.statusText);
            }
        }

        function createLetterButtons() {
            alphabet.forEach(letter => {
                const button = document.createElement('button');
                button.textContent = letter;
                button.addEventListener('click', () => jouer(letter));
                letterButtons.appendChild(button);
            });
        }

        function initializeWordDisplay() {
            currentWordState = Array(find.length).fill('_');
            updateWordDisplay();
        }

        function updateWordDisplay() {
            wordDisplay.textContent = currentWordState.join(' ');
        }

        function jouer(letter) {
            if (find.includes(letter)) {
                for (let i = 0; i < find.length; i++) {
                    if (find[i] === letter) {
                        currentWordState[i] = letter;
                    }
                }
                updateWordDisplay();
                message.textContent = `La lettre ${letter} est dans le mot !`;
            } else {
                compteur++;
                message.textContent = `La lettre ${letter} n'est pas dans le mot.`;
            }

            if (currentWordState.join('') === find) {
                message.textContent = "Bravo, vous avez réussi !";
                btnRetry.style.display = "";
                disableAllLetterButtons();
                return;
            }

            if (compteur >= tentatives) {
                message.innerHTML = `Vous avez utilisé vos ${tentatives} tentatives. <br> Le mot était "${find}".`;
                btnRetry.style.display = "";
                disableAllLetterButtons();
            }
        }

        function disableAllLetterButtons() {
            const buttons = letterButtons.querySelectorAll('button');
            buttons.forEach(button => button.disabled = true);
        }

        btnRetry.addEventListener('click', e => {
            find = data[Math.floor(Math.random() * data.length)].toUpperCase();
            compteur = 0;
            message.textContent = "";
            initializeWordDisplay();
            const buttons = letterButtons.querySelectorAll('button');
            buttons.forEach(button => button.disabled = false);
            btnRetry.style.display = "none";

        });