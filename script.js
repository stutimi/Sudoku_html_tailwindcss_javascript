let grid = Array(9).fill().map(() => Array(9).fill(0));

// Function to render the Sudoku grid
function renderGrid() {
    const sudokuGrid = document.getElementById('sudoku-grid');
    sudokuGrid.innerHTML = ''; // Clear previous grid

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.className = 'sudoku-cell';
            cell.type = 'text';
            cell.maxLength = 1;
            cell.value = grid[i][j] === 0 ? '' : grid[i][j];
            cell.dataset.highlight = grid[i][j] !== 0;
            cell.oninput = () => validateInput(cell, i, j);
            sudokuGrid.appendChild(cell);
        }
    }
}

// Function to validate Sudoku input (numbers only 1-9)
function validateInput(cell, row, col) {
    const value = cell.value;
    if (value >= 1 && value <= 9) {
        grid[row][col] = parseInt(value);
        validateCell(cell, row, col); // Validate the entered number
    } else {
        cell.value = ''; // Clear invalid input
        grid[row][col] = 0;
        cell.style.backgroundColor = ''; // Reset background color
    }

    if (checkWin()) {
        displayWinMessage();  // Display congratulation message if Sudoku is solved
    }
}

// Function to validate and show feedback (green for correct, red for incorrect)
function validateCell(cell, row, col) {
    if (isValid(row, col)) {
        cell.style.backgroundColor = 'lightgreen'; // Correct input
        showFeedback('Correct', 'green'); // Show green popup
    } else {
        cell.style.backgroundColor = 'lightcoral'; // Incorrect input
        showFeedback('Incorrect', 'red'); // Show red popup
    }
}

// Function to check if a number in the grid is valid (no duplicates in row, column, or 3x3 subgrid)
function isValid(row, col) {
    const value = grid[row][col];
    
    // Check row for duplicates
    for (let j = 0; j < 9; j++) {
        if (j !== col && grid[row][j] === value) {
            return false;
        }
    }

    // Check column for duplicates
    for (let i = 0; i < 9; i++) {
        if (i !== row && grid[i][col] === value) {
            return false;
        }
    }

    // Check 3x3 subgrid for duplicates
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if ((startRow + i !== row || startCol + j !== col) && grid[startRow + i][startCol + j] === value) {
                return false;
            }
        }
    }

    return true;
}

// Function to generate a random Sudoku grid
function generateSudoku() {
    // Reset grid to empty
    grid = Array(9).fill().map(() => Array(9).fill(0));

    // Simple random number filling (you can implement Sudoku puzzle generation logic here)
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() > 0.7) {
                grid[i][j] = Math.floor(Math.random() * 9) + 1;
            }
        }
    }
    renderGrid();
}

// Check if the current Sudoku grid is solved
function checkWin() {
    // Check rows, columns, and 3x3 grids
    for (let i = 0; i < 9; i++) {
        if (!checkRow(i) || !checkCol(i) || !checkSubgrid(i)) {
            return false;
        }
    }
    return true; // If all checks pass, the puzzle is solved
}

// Check if a row contains numbers 1-9 without duplicates
function checkRow(row) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value === 0 || seen.has(value)) {
            return false;
        }
        seen.add(value);
    }
    return true;
}

// Check if a column contains numbers 1-9 without duplicates
function checkCol(col) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
        const value = grid[row][col];
        if (value === 0 || seen.has(value)) {
            return false;
        }
        seen.add(value);
    }
    return true;
}

// Check if a 3x3 subgrid contains numbers 1-9 without duplicates
function checkSubgrid(index) {
    const seen = new Set();
    const startRow = Math.floor(index / 3) * 3;
    const startCol = (index % 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const value = grid[startRow + i][startCol + j];
            if (value === 0 || seen.has(value)) {
                return false;
            }
            seen.add(value);
        }
    }
    return true;
}

// Function to display congratulation message when Sudoku is solved
function displayWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message fixed inset-0 flex items-center justify-center bg-black bg-opacity-50';
    winMessage.innerHTML = `
        <div class="bg-pink-500 text-white p-8 rounded-lg shadow-lg text-center">
            <h2 class="text-4xl font-bold mb-4">Congratulations!</h2>
            <p class="text-lg">You've completed the Sudoku puzzle!</p>
            <button class="mt-6 px-4 py-2 bg-white text-pink-500 font-semibold rounded hover:bg-gray-200"
                onclick="removeWinMessage()">Play Again</button>
        </div>
    `;
    document.body.appendChild(winMessage);
}

// Function to remove the win message and reset the grid
function removeWinMessage() {
    document.querySelector('.win-message').remove();
    generateSudoku(); // Reset the game
}

// Show feedback popup for correct/incorrect input
function showFeedback(message, color) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-popup';
    feedback.innerText = message;
    feedback.style.color = color;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();  // Remove the popup after 1 second
    }, 1000);
}

// On page load, render an empty grid
window.onload = () => {
    generateSudoku();
};



