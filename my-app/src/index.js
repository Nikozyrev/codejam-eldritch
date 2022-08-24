import difficulties from './data/difficulties.mjs';
import ancientsData from './data/ancients.mjs';
import { blueCards, brownCards, greenCards } from './data/mythicCards/index.mjs';

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

// Create Deck

function createDeck() {
    const blueCardsCopy = [...blueCards];
    const brownCardsCopy = [...brownCards];
    const greenCardsCopy = [...greenCards];
    const totalCardsNeeded = {
        blueCards:
            chosenAncient.firstStage.blueCards +
            chosenAncient.secondStage.blueCards +
            chosenAncient.thirdStage.blueCards,
        brownCards:
            chosenAncient.firstStage.brownCards +
            chosenAncient.secondStage.brownCards +
            chosenAncient.thirdStage.brownCards,
        greenCards:
            chosenAncient.firstStage.greenCards +
            chosenAncient.secondStage.greenCards +
            chosenAncient.thirdStage.greenCards, 
    };

    const chosenCardsAll = {
        blueCards: getRandomCards(totalCardsNeeded.blueCards, blueCardsCopy),
        brownCards: getRandomCards(totalCardsNeeded.brownCards, brownCardsCopy),
        greenCards: getRandomCards(totalCardsNeeded.greenCards, greenCardsCopy),
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
};

// UX
const deckDiv = document.querySelector('.deck');

function drawCard(deck) {
    const currentCardDiv = document.querySelector('.current_card');
    const currentCard = deck.shift();
    currentCard
        ? (currentCardDiv.style.backgroundImage = `url(${currentCard.cardFace})`)
        : (deckDiv.style.backgroundImage = 'none');
}

deckDiv.onclick = () => drawCard(deck);
