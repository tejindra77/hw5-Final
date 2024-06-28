/* 
Author: Tejindra Khatri 
Copyright (C) 2024 
COMP 4610 GUI I 
HW5: Implementing a Bit of Scrabble with Drag-and-Drop 
June 28, 2024
*/

const tileDistribution = {
    "A": { "count": 9, "value": 1 },
    "B": { "count": 2, "value": 3 },
    "C": { "count": 2, "value": 3 },
    "D": { "count": 4, "value": 2 },
    "E": { "count": 12, "value": 1 },
    "F": { "count": 2, "value": 4 },
    "G": { "count": 3, "value": 2 },
    "H": { "count": 2, "value": 4 },
    "I": { "count": 9, "value": 1 },
    "J": { "count": 1, "value": 8 },
    "K": { "count": 1, "value": 5 },
    "L": { "count": 4, "value": 1 },
    "M": { "count": 2, "value": 3 },
    "N": { "count": 6, "value": 1 },
    "O": { "count": 8, "value": 1 },
    "P": { "count": 2, "value": 3 },
    "Q": { "count": 1, "value": 10 },
    "R": { "count": 6, "value": 1 },
    "S": { "count": 4, "value": 1 },
    "T": { "count": 6, "value": 1 },
    "U": { "count": 4, "value": 1 },
    "V": { "count": 2, "value": 4 },
    "W": { "count": 2, "value": 4 },
    "X": { "count": 1, "value": 8 },
    "Y": { "count": 2, "value": 4 },
    "Z": { "count": 1, "value": 10 }
};

let rackTiles = [];
let score = 0;

function getRandomTile() {
    const keys = Object.keys(tileDistribution);
    let tile;
    do {
        tile = keys[Math.floor(Math.random() * keys.length)];
    } while (tileDistribution[tile].count <= 0);
    tileDistribution[tile].count--;
    return tile;
}

function initializeRack() {
    for (let i = 0; i < 7; i++) {
        const tile = getRandomTile();
        rackTiles.push(tile);
        const tileElement = $('#tile-template').clone().removeAttr('id').show();
        tileElement.find('.letter-tile').attr('src', `graphics_data/Scrabble_Tiles/Scrabble_Tile_${tile}.jpg`);
        tileElement.attr('data-letter', tile);
        $('#rack').append(tileElement);
    }
    makeTilesDraggable();
}

function makeTilesDraggable() {
    $('#rack .draggable-tile').draggable({
        revert: 'invalid',
        zIndex: 100,
        start: function(event, ui) {
            $(this).addClass('dragging');
        },
        stop: function(event, ui) {
            $(this).removeClass('dragging');
        }
    });
}

const dictionary = new Set();

// Load the dictionary (you need to serve this from your server or use a local file)
$.get('dictionary.txt', function(data) {
    const words = data.split('\n');
    for (let word of words) {
        dictionary.add(word.trim().toUpperCase());
    }
});

function validateWord(word) {
    return dictionary.has(word);
}

$(document).ready(function() {
    initializeRack();

    // Initialize board squares as droppable targets
    $('.board-square').droppable({
        accept: '.draggable-tile',
        hoverClass: 'hover',
        drop: function(event, ui) {
            const droppedTile = ui.draggable;
            const tileLetter = droppedTile.attr('data-letter');
            $(this).append(droppedTile.find('.letter-tile').clone());
            droppedTile.remove();
            $(this).addClass('occupied').attr('data-letter', tileLetter);
        }
    });

    $('#complete-word').click(function() {
        let word = '';
        $('.board-square').each(function() {
            const letter = $(this).attr('data-letter');
            if (letter) {
                word += letter;
            }
        });
        if (validateWord(word)) {
            calculateScore();
        } else {
            alert('Invalid word');
        }
    });
});

function calculateScore() {
    score = 0;
    $('.board-square').each(function() {
        const letter = $(this).attr('data-letter');
        const bonus = parseInt($(this).attr('data-bonus'), 10);
        if (letter) {
            const value = tileDistribution[letter].value;
            score += value * bonus;
        }
    });
    $('#score').text(`Score: ${score}`);
}
