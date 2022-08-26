import difficulties from './data/difficulties.mjs';
import ancientsData from './data/ancients.mjs';
import { allCards } from './data/mythicCards/index.mjs';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCards(count, source) {
    const res = [];
    for (let i = 1; i <= count; i++) {
        const randomCard = source.splice(
            getRandomIntInclusive(0, source.length - 1),
            1
        )[0];
        res.push(randomCard);
    }
    return res;
}

// Choose Ancient
let chosenAncient;

function chooseAncient(e) {
    e.target.className === 'ancient_card'
        ? ((chosenAncient = ancientsData.find((el) => el.id === e.target.id)),
          highlightChosenAncient(e))
        : false;
}

function highlightChosenAncient(e) {
    [...document.getElementsByClassName('ancient_card')].forEach((el) =>
        el.classList.remove('_active')
    );
    e.target.classList.add('_active');
}

document.querySelector('.ancients_container').onclick = (e) => chooseAncient(e);

// Choose Difficulty
let chosenDifficulty;

function chooseDifficulty(e) {
    e.target.classList.contains('difficulty')
        ? ((chosenDifficulty = e.target.id), highlightChosenDifficulty(e))
        : false;
}

function highlightChosenDifficulty(e) {
    [...document.getElementsByClassName('difficulty')].forEach((el) =>
        el.classList.remove('_active')
    );
    e.target.classList.add('_active');
}

document.querySelector('.difficulty-container').onclick = (e) =>
    chooseDifficulty(e);

// Depending on chosen difficulty
function getSourceCards(difficulty) {
    const totalCardsNeeded = Object.values(chosenAncient).reduce(
        (acc, el) => {
            return {
                blueCards: acc.blueCards + (el.blueCards ? el.blueCards : 0),
                brownCards:
                    acc.brownCards + (el.brownCards ? el.brownCards : 0),
                greenCards:
                    acc.greenCards + (el.greenCards ? el.greenCards : 0),
            };
        },
        {
            blueCards: 0,
            brownCards: 0,
            greenCards: 0,
        }
    );
    const sourceCards = [...allCards];

    switch (difficulty) {
        case 'super_easy':
            const brownEasy = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'hard' && el.color === 'brown'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.brownCards);
            const blueEasy = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'hard' && el.color === 'blue'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.blueCards);
            const greenEasy = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'hard' && el.color === 'green'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.greenCards);
            return [...brownEasy, ...blueEasy, ...greenEasy];
        case 'easy':
            return sourceCards.filter((el) => el.difficulty !== 'hard');
        case 'hard':
            return sourceCards.filter((el) => el.difficulty !== 'easy');
        case 'super_hard':
            const brownHard = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'easy' && el.color === 'brown'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.brownCards);
            const blueHard = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'easy' && el.color === 'blue'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.blueCards);
            const greenHard = shuffle(
                sourceCards.filter(
                    (el) => el.difficulty !== 'easy' && el.color === 'green'
                )
            )
                .sort((a, b) => (a.difficulty > b.difficulty ? 1 : -1))
                .splice(0, totalCardsNeeded.greenCards);
            return [...brownHard, ...blueHard, ...greenHard];
        default:
            return sourceCards;
    }
}

// Create Deck

function createDeck() {
    const allCardsCopy = getSourceCards(chosenDifficulty);

    const totalCardsNeeded = Object.values(chosenAncient).reduce(
        (acc, el) => {
            return {
                blueCards: acc.blueCards + (el.blueCards ? el.blueCards : 0),
                brownCards:
                    acc.brownCards + (el.brownCards ? el.brownCards : 0),
                greenCards:
                    acc.greenCards + (el.greenCards ? el.greenCards : 0),
            };
        },
        {
            blueCards: 0,
            brownCards: 0,
            greenCards: 0,
        }
    );

    const chosenCardsAll = {
        blueCards: getRandomCards(
            totalCardsNeeded.blueCards,
            allCardsCopy.filter((el) => el.color === 'blue')
        ),
        brownCards: getRandomCards(
            totalCardsNeeded.brownCards,
            allCardsCopy.filter((el) => el.color === 'brown')
        ),
        greenCards: getRandomCards(
            totalCardsNeeded.greenCards,
            allCardsCopy.filter((el) => el.color === 'green')
        ),
    };

    const firstStageCards = shuffle([
        ...getRandomCards(
            chosenAncient.firstStage.blueCards,
            chosenCardsAll.blueCards
        ),
        ...getRandomCards(
            chosenAncient.firstStage.brownCards,
            chosenCardsAll.brownCards
        ),
        ...getRandomCards(
            chosenAncient.firstStage.greenCards,
            chosenCardsAll.greenCards
        ),
    ]);
    firstStageCards.forEach((el) => (el.stage = 1));

    const secondStageCards = shuffle([
        ...getRandomCards(
            chosenAncient.secondStage.blueCards,
            chosenCardsAll.blueCards
        ),
        ...getRandomCards(
            chosenAncient.secondStage.brownCards,
            chosenCardsAll.brownCards
        ),
        ...getRandomCards(
            chosenAncient.secondStage.greenCards,
            chosenCardsAll.greenCards
        ),
    ]);
    secondStageCards.forEach((el) => (el.stage = 2));

    const thirdStageCards = shuffle([
        ...getRandomCards(
            chosenAncient.thirdStage.blueCards,
            chosenCardsAll.blueCards
        ),
        ...getRandomCards(
            chosenAncient.thirdStage.brownCards,
            chosenCardsAll.brownCards
        ),
        ...getRandomCards(
            chosenAncient.thirdStage.greenCards,
            chosenCardsAll.greenCards
        ),
    ]);
    thirdStageCards.forEach((el) => (el.stage = 3));

    const finalDeck = [
        ...firstStageCards,
        ...secondStageCards,
        ...thirdStageCards,
    ];

    return finalDeck;
}

let deck;

document.getElementById('create_deck_btn').onclick = () => {
    deck = createDeck();
    console.log(deck);
    updateStatus();
};

// Draw card
const deckDiv = document.querySelector('.deck');
const currentCardDiv = document.querySelector('.current_card');

function drawCard() {    
    const currentCard = deck.shift();
    updateStatus();
    deck.length === 0 ? (deckDiv.style.backgroundImage = 'none') : false;
    currentCard
        ? (currentCardDiv.style.backgroundImage = `url(${currentCard.cardFace})`)
        : false;
}

deckDiv.onclick = drawCard;

// Update status
function updateStatus() {
    const firstStageCount = {
        blueCards: deck.filter((el) => el.color === 'blue' && el.stage === 1)
            .length,
        brownCards: deck.filter((el) => el.color === 'brown' && el.stage === 1)
            .length,
        greenCards: deck.filter((el) => el.color === 'green' && el.stage === 1)
            .length,
    };
    const secondStageCount = {
        blueCards: deck.filter((el) => el.color === 'blue' && el.stage === 2)
            .length,
        brownCards: deck.filter((el) => el.color === 'brown' && el.stage === 2)
            .length,
        greenCards: deck.filter((el) => el.color === 'green' && el.stage === 2)
            .length,
    };
    const thirdStageCount = {
        blueCards: deck.filter((el) => el.color === 'blue' && el.stage === 3)
            .length,
        brownCards: deck.filter((el) => el.color === 'brown' && el.stage === 3)
            .length,
        greenCards: deck.filter((el) => el.color === 'green' && el.stage === 3)
            .length,
    };

    const totalCount = [firstStageCount, secondStageCount, thirdStageCount];

    // const stages = document.getElementsByClassName('dots-container');

    const greenDots = document.getElementsByClassName('green');
    for (let i = 0; i < greenDots.length; i++) {
        greenDots[i].textContent = totalCount[i].greenCards;
    }

    const brownDots = document.getElementsByClassName('brown');
    for (let i = 0; i < brownDots.length; i++) {
        brownDots[i].textContent = totalCount[i].brownCards;
    }

    const blueDots = document.getElementsByClassName('blue');
    for (let i = 0; i < blueDots.length; i++) {
        blueDots[i].textContent = totalCount[i].blueCards;
    }
}

// UX
function showElements(e) {
    if (e.target.classList.contains('ancient_card')) {
        document.querySelector('.ancients_container').classList.add('_active');
        document
            .querySelector('.difficulty-container')
            .classList.add('_active');
        document.getElementById('create_deck_btn').classList.add('_active');
    }
    if (
        document.querySelector('.deck_container').classList.contains('_active') && (
            e.target.classList.contains('ancient_card') ||
                e.target.classList.contains('difficulty')
        )
    ) {
        document.querySelector('.deck_container').classList.remove('_active');
        document.getElementById('create_deck_btn').classList.add('_active');
        deckDiv.style.backgroundImage = 'url(./assets/mythicCardBackground.png)';
        currentCardDiv.style.backgroundImage = `none`;
    }
    if (e.target.classList.contains('create_deck')) {
        document.querySelector('.deck_container').classList.add('_active');
        document.getElementById('create_deck_btn').classList.remove('_active');
    }
}

window.onclick = (e) => showElements(e);
