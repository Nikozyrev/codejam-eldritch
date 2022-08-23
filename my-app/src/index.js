import difficulties from './data/difficulties.mjs';
import ancientsData from './data/ancients.mjs';
import { blueCards } from './data/mythicCards/index.mjs';
import { brownCards } from './data/mythicCards/index.mjs';
import { greenCards } from './data/mythicCards/index.mjs';

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
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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

const chosenAncient = ancientsData.find((el) => el.id === 'azathoth');
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
    blueCards: getRandomCards(totalCardsNeeded.blueCards, blueCards),
    brownCards: getRandomCards(totalCardsNeeded.brownCards, brownCards),
    greenCards: getRandomCards(totalCardsNeeded.greenCards, greenCards),
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

const finalDeck = [...firstStageCards, ...secondStageCards, ...thirdStageCards];

console.log(finalDeck);

// Layout
const cthulthu = document.getElementById('Cthulthu');
cthulthu.style.backgroundImage = `url(${ancientsData[0].cardFace})`;

const deckDiv = document.querySelector('.deck');

function drawCard(deck) {
    const currentCardDiv = document.querySelector('.current_card');
    const currentCard = deck.shift();
    currentCard
        ? (currentCardDiv.style.backgroundImage = `url(${currentCard.cardFace})`)
        : (deckDiv.style.backgroundImage = 'none');
}

deckDiv.onclick = () => drawCard(finalDeck);
