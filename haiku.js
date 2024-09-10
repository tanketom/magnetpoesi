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

    haiku.forEach((line, index) => {
        const words = line.split(' ');
        words.forEach((word, wordIndex) => {
            const wordElement = Array.from(document.querySelectorAll('.word')).find(el => el.textContent === word);
            if (wordElement) {
                wordElement.style.top = `${edgePadding + index * 30}px`;
                wordElement.style.left = `${edgePadding + wordIndex * 60}px`;
                wordElement.style.transform = `rotate(0deg)`;
                poetryBoard.appendChild(wordElement);
            }
        });
    });
}