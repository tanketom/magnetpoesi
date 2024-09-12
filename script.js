document.addEventListener('DOMContentLoaded', () => {
    function fetchAndDisplayWords() {
        fetch('words.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const words = [];
                const categories = ['verbs', 'adjectives', 'nouns', 'pronouns', 'conjunctions', 'adverbials', 'proper_names', 'expletive', 'ekstranynorsk', 'enkeltbokstavar', 'artikkel', 'prepositions'];
                
                // Define the number of words you want from each category
                const wordsCount = {
                    verbs: 4,
                    adjectives: 3,
                    nouns: 10,
                    pronouns: 3,
                    conjunctions: 3,
                    adverbials: 3,
                    proper_names: 2, 
                    expletive: 3,
                    ekstranynorsk: 3,
                    enkeltbokstavar: 5,
                    artikkel: 3,
                    prepositions: 3
                };

                categories.forEach(category => {
                    for (let i = 0; i < wordsCount[category]; i++) {
                        const randomIndex = Math.floor(Math.random() * data[category].length);
                        words.push(data[category][randomIndex]);
                    }
                });

                createWords(words);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function createWords(words) {
        const poetryBoard = document.getElementById('poetry-board');
        poetryBoard.innerHTML = ''; // Clear existing words
        const boardRect = poetryBoard.getBoundingClientRect();
        const edgePadding = 10; // Padding from the edge

        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;

            // Position words around the edges
            const position = Math.random();
            if (position < 0.25) {
                // Top edge
                wordElement.style.top = `${edgePadding}px`;
                wordElement.style.left = `${Math.random() * (boardRect.width - 100)}px`;
            } else if (position < 0.5) {
                // Bottom edge
                wordElement.style.top = `${boardRect.height - edgePadding - 30}px`;
                wordElement.style.left = `${Math.random() * (boardRect.width - 100)}px`;
            } else if (position < 0.75) {
                // Left edge
                wordElement.style.top = `${Math.random() * (boardRect.height - 50)}px`;
                wordElement.style.left = `${edgePadding}px`;
            } else {
                // Right edge
                wordElement.style.top = `${Math.random() * (boardRect.height - 50)}px`;
                wordElement.style.left = `${boardRect.width - edgePadding - 50}px`;
            }

            wordElement.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            poetryBoard.appendChild(wordElement);
            makeDraggable(wordElement);
        });
    }

    function makeDraggable(element) {
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('touchstart', onTouchStart);
    
        function onMouseDown(event) {
            event.preventDefault();
            startDrag(event.clientX, event.clientY);
        }
    
        function onTouchStart(event) {
            event.preventDefault();
            const touch = event.touches[0];
            startDrag(touch.clientX, touch.clientY);
        }
    
        function startDrag(clientX, clientY) {
            const shiftX = clientX - element.getBoundingClientRect().left;
            const shiftY = clientY - element.getBoundingClientRect().top;
    
            element.style.position = 'absolute';
            element.style.zIndex = 1000;
            document.body.append(element);
    
            moveAt(clientX, clientY);
    
            function moveAt(pageX, pageY) {
                element.style.left = pageX - shiftX + 'px';
                element.style.top = pageY - shiftY + 'px';
            }
    
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }
    
            function onTouchMove(event) {
                const touch = event.touches[0];
                moveAt(touch.pageX, touch.pageY);
            }
    
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onTouchMove);
    
            element.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                element.onmouseup = null;
                element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            };
    
            element.ontouchend = function() {
                document.removeEventListener('touchmove', onTouchMove);
                element.ontouchend = null;
                element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            };
    
            element.ondragstart = function() {
                return false;
            };
        }
    }    

    document.getElementById('download-btn').addEventListener('click', () => {
        const poetryBoard = document.getElementById('poetry-board');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const rect = poetryBoard.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const words = document.querySelectorAll('.word');
        words.forEach(word => {
            const wordRect = word.getBoundingClientRect();
            const x = wordRect.left - rect.left;
            const y = wordRect.top - rect.top;

            ctx.save();
            ctx.translate(x + wordRect.width / 2, y + wordRect.height / 2);
            const rotation = parseFloat(word.style.transform.replace('rotate(', '').replace('deg)', ''));
            ctx.rotate(rotation * Math.PI / 180);
            ctx.translate(-wordRect.width / 2, -wordRect.height / 2);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, wordRect.width, wordRect.height);

            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText(word.textContent, 5, 20);
            ctx.restore();
        });

        const link = document.createElement('a');
        link.download = 'poem.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('new-words-btn').addEventListener('click', fetchAndDisplayWords);

    // Initial load of words
    fetchAndDisplayWords();
});