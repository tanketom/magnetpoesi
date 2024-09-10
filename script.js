document.addEventListener('DOMContentLoaded', () => {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            const words = [];
            const categories = ['verbs', 'adjectives', 'nouns', 'pronouns', 'conjunctions'];
            categories.forEach(category => {
                for (let i = 0; i < 6; i++) {
                    const randomIndex = Math.floor(Math.random() * data[category].length);
                    words.push(data[category][randomIndex]);
                }
            });
            createWords(words);
        });

    function createWords(words) {
        const poetryBoard = document.getElementById('poetry-board');
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.style.top = `${Math.random() * 450}px`;
            wordElement.style.left = `${Math.random() * 450}px`;
            wordElement.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            poetryBoard.appendChild(wordElement);
            makeDraggable(wordElement);
        });
    }

    function makeDraggable(element) {
        element.onmousedown = function(event) {
            let shiftX = event.clientX - element.getBoundingClientRect().left;
            let shiftY = event.clientY - element.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                element.style.left = pageX - shiftX + 'px';
                element.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            element.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                element.onmouseup = null;
                element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            };
        };

        element.ondragstart = function() {
            return false;
        };
    }

    document.getElementById('download-btn').addEventListener('click', () => {
        html2canvas(document.getElementById('poetry-board')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'poem.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});