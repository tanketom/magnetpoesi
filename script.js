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
});