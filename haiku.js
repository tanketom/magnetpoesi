document.getElementById('haiku-btn').addEventListener('click', () => {
    const words = Array.from(document.querySelectorAll('.word')).map(word => word.textContent);
    const haiku = generateHaiku(words);
    moveHaikuToBoard(haiku);
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

function moveHaikuToBoard(haiku) {
    const poetryBoard = document.getElementById('poetry-board');
    const boardRect = poetryBoard.getBoundingClientRect();
    const edgePadding = 10; // Padding from the edge

    // Move haiku lines to the center
    haiku.forEach((line, index) => {
        const words = line.split(' ');
        words.forEach((word, wordIndex) => {
            const wordElement = Array.from(document.querySelectorAll('.word')).find(el => el.textContent === word);
            if (wordElement) {
                wordElement.style.top = `${boardRect.height / 2 - 50 + index * 30}px`;
                wordElement.style.left = `${boardRect.width / 2 - 100 + wordIndex * 60}px`;
                wordElement.style.transform = `rotate(0deg)`;
                poetryBoard.appendChild(wordElement);
            }
        });
    });

    // Move unused words to the edges
    const usedWords = haiku.flatMap(line => line.split(' '));
    const unusedWords = Array.from(document.querySelectorAll('.word')).filter(el => !usedWords.includes(el.textContent));

    unusedWords.forEach(wordElement => {
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
    });
}