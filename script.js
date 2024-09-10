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
        const body = document.body;
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.style.top = `${Math.random() * (body.clientHeight - 50)}px`;
            wordElement.style.left = `${Math.random() * (body.clientWidth - 100)}px`;
            wordElement.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            body.appendChild(wordElement);
            makeDraggable(wordElement);
        });
    }

    function makeDraggable(element) {
        element.addEventListener('mousedown', onMouseDown);

        function onMouseDown(event) {
            event.preventDefault();

            const shiftX = event.clientX - element.getBoundingClientRect().left;
            const shiftY = event.clientY - element.getBoundingClientRect().top;

            element.style.position = 'absolute';
            element.style.zIndex = 1000;
            document.body.append(element);

            moveAt(event.pageX, event.pageY);

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

            document.addEventListener('mouseup', function() {
                document.removeEventListener('mousemove', onMouseMove);
                element.onmouseup = null;
                element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            });

            element.ondragstart = function() {
                return false;
            };
        }
    }

    document.getElementById('download-btn').addEventListener('click', () => {
        const poetryBoard = document.getElementById('poetry-board');
        html2canvas(poetryBoard).then(canvas => {
            const link = document.createElement('a');
            link.download = 'poem.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});