document.addEventListener('DOMContentLoaded', () => {
    fetch('words.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const words = [];
            const categories = ['verbs', 'adjectives', 'nouns', 'pronouns', 'conjunctions', 'adverbials', 'proper_names', 'ekstranynorsk', 'enkeltbokstavar', 'artikkel'];
            const wordsPerCategory = Math.floor(40 / categories.length);
            const extraWords = 40 % categories.length;

            categories.forEach(category => {
                for (let i = 0; i < wordsPerCategory; i++) {
                    const randomIndex = Math.floor(Math.random() * data[category].length);
                    words.push(data[category][randomIndex]);
                }
            });

            // Add extra words to make up 40
            for (let i = 0; i < extraWords; i++) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const randomIndex = Math.floor(Math.random() * data[randomCategory].length);
                words.push(data[randomCategory][randomIndex]);
            }

            createWords(words);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function createWords(words) {
        const poetryBoard = document.getElementById('poetry-board');
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            setPositionAndRotation(wordElement);
            poetryBoard.appendChild(wordElement);
            makeDraggable(wordElement);
        });
    }

    function setPositionAndRotation(element) {
        const poetryBoard = document.getElementById('poetry-board');
        const boardRect = poetryBoard.getBoundingClientRect();
        element.style.top = `${Math.random() * (boardRect.height - 50)}px`;
        element.style.left = `${Math.random() * (boardRect.width - 100)}px`;
        element.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
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
                setPositionAndRotation(element);
            };

            document.addEventListener('mouseup', function() {
                document.removeEventListener('mousemove', onMouseMove);
                element.onmouseup = null;
                setPositionAndRotation(element);
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

    document.getElementById('haiku-btn').addEventListener('click', () => {
        const words = Array.from(document.querySelectorAll('.word')).map(word => word.textContent);
        const haiku = generateHaiku(words);
        alert(`Your Haiku:\n${haiku.join('\n')}`);
    });

    function generateHaiku(words) {
        const syllableCounts = [5, 7, 5];
        const haiku = [];
        let currentLine = [];
        let currentSyllables = 0;

        words.forEach(word => {
            const syllables = countSyllables(word);
            if (currentSyllables + syllables <= syllableCounts[haiku.length]) {
                currentLine.push(word);
                currentSyllables += syllables;
            } else {
                haiku.push(currentLine.join(' '));
                currentLine = [word];
                currentSyllables = syllables;
                if (haiku.length === 3) return;
            }
        });

        if (currentLine.length > 0 && haiku.length < 3) {
            haiku.push(currentLine.join(' '));
        }

        return haiku;
    }

    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const syllableMatch = word.match(/[aeiouy]{1,2}/g);
        return syllableMatch ? syllableMatch.length : 1;
    }
});