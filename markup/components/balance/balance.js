// import CreateJS
// import TweenMax
import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

import { parameters } from 'components/balance/parameters';

// /* eslint-disable no-undef */
/* eslint-disable no-use-before-define */

export let balance = (function () {

    let config;
    const defaultConfig = {
        textDelta: 20
    };

    let stage;
    const c = createjs;
    const w = utils.width;
    const h = utils.height;
    const balanceContainer = new c.Container().set({ name: 'balanceContainer' });

    const balanceText = {};
    const balanceData = {};
    let currencySymbol;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function initBalance() {
        stage = storage.read('stage');
        const data = storage.read('initState');
        balanceData.linesLength = storage.read('lines').length;

        balanceData.coinsSteps = data.CoinValue.map((value) => {
            return (value / 100).toFixed(2);
        });
        balanceData.betSteps = data.BetLevel;

        balanceData.coinsValue = balanceData.coinsSteps[0];
        balanceData.coinsSum = data.ScoreCoins;
        balanceData.coinsCash = +(data.ScoreCents / 100).toFixed(2);

        balanceData.betValue = balanceData.betSteps[0];
        balanceData.betSum = +(balanceData.betValue * balanceData.linesLength).toFixed(0);
        balanceData.betCash = +(balanceData.betSum * balanceData.coinsValue).toFixed(2);

        balanceData.winCash = (0).toFixed(2);
        balanceData.currency = data.Currency;

        currencySymbol = checkCurrency(balanceData.currency);

        writeBalance();
    }

    function checkCurrency(currency) {
        if (currency === 'USD') {
            return '$ ';
        } else if (currency === 'EUR') {
            return '€ ';
        } else if (currency === 'UAH') {
            return '₴ ';
        } else if (currency === 'RUB') {
            return '₽ ';
        }
    }

    function makeTextDelta(text1, text2, delta) {
        text1.x = text2.x - text2.getMeasuredWidth() / 2 - delta - text1.getMeasuredWidth();
    }

    function writeBalance() {

        balanceText.coinsSum = new c.Text(balanceData.coinsSum, parameters.font, parameters.orangeColor).set(parameters.coinsSum);
        balanceText.betSum = new c.Text(balanceData.betSum, parameters.font, parameters.orangeColor).set(parameters.betSum);
        balanceText.coinsCash = new c.Text(currencySymbol + balanceData.coinsCash, parameters.font, parameters.color).set(parameters.coinsCash);
        balanceText.betCash = new c.Text(currencySymbol + balanceData.betCash, parameters.font, parameters.color).set(parameters.betCash);
        balanceText.winCash = new c.Text(currencySymbol + balanceData.winCash, parameters.font, parameters.color).set(parameters.winCash);

        balanceText.coinsCashText = new c.Text('Cash:', parameters.font, parameters.greyColor).set(parameters.coinsCashText);
        balanceText.betCashText = new c.Text('Bet:', parameters.font, parameters.greyColor).set(parameters.betCashText);
        balanceText.winCashText = new c.Text('Win:', parameters.font, parameters.greyColor).set(parameters.winCashText);
        balanceText.coinsSumText = new c.Text('Coins:', parameters.bigFont, parameters.color).set(parameters.coinsSumText);
        balanceText.betSumText = new c.Text('Bet:', parameters.bigFont, parameters.color).set(parameters.betSumText);

        makeTextDelta(balanceText.coinsSumText, balanceText.coinsSum, config.textDelta);
        makeTextDelta(balanceText.coinsCashText, balanceText.coinsCash, config.textDelta);

        balanceContainer.addChild(
            balanceText.coinsSum,
            balanceText.coinsSumText,
            balanceText.betSum,
            balanceText.betSumText,
            balanceText.coinsCash,
            balanceText.coinsCashText,
            balanceText.betCash,
            balanceText.betCashText,
            balanceText.winCash,
            balanceText.winCashText
        );

        // Добавим баланс на сцену
        const preloader = stage.getChildByName('preloaderContainer');
        stage.addChildAt(balanceContainer, stage.getChildIndex(preloader) - 1);
        balanceContainer.cache(0, 0, w, h);

        storage.write('currentBalance', balanceData);
        setTimeout(updateBalance, 500); // Для того чтобы подгрузились шрифты и отобразить нужным шрифтом.
    }

    function writeCashBalance(container) {
        const currentBalance = storage.read('currentBalance');

        let coinsCash = new c.Text(currencySymbol + currentBalance.coinsCash, parameters.font, parameters.color).set(parameters.coinsCash);
        let betCash = new c.Text(currencySymbol + currentBalance.betCash, parameters.font, parameters.color).set(parameters.betCash);
        let winCash = new c.Text(currencySymbol + currentBalance.winCash, parameters.font, parameters.color).set(parameters.winCash);
        let coinsCashText = new c.Text('Cash:', parameters.font, parameters.greyColor).set(parameters.coinsCashText);
        let betCashText = new c.Text('Bet:', parameters.font, parameters.greyColor).set(parameters.betCashText);
        let winCashText = new c.Text('Win:', parameters.font, parameters.greyColor).set(parameters.winCashText);

        container.addChild(coinsCashText, betCashText, winCashText, coinsCash, betCash, winCash);

        makeTextDelta(coinsCashText, coinsCash, config.textDelta);
    }

    function updateBalance() {
        if (balanceText.coinsSum.text !== balanceData.coinsSum) {
            balanceText.coinsSum.text = balanceData.coinsSum;
        }
        if (balanceText.betSum.text !== balanceData.betSum) {
            balanceText.betSum.text = balanceData.betSum;
        }
        if (balanceText.coinsCash.text.toString().slice(1) !== balanceData.coinsCash) {
            balanceText.coinsCash.text = currencySymbol + balanceData.coinsCash;
        }
        if (balanceText.betCash.text.toString().slice(1) !== balanceData.betCash) {
            balanceText.betCash.text = currencySymbol + balanceData.betCash;
        }
        if (balanceText.winCash.text.toString().slice(1) !== balanceData.winCash) {
            balanceText.winCash.text = currencySymbol + balanceData.winCash;
        }

        makeTextDelta(balanceText.coinsSumText, balanceText.coinsSum, config.textDelta);
        makeTextDelta(balanceText.coinsCashText, balanceText.coinsCash, config.textDelta);

        balanceContainer.updateCache();
        storage.write('currentBalance', balanceData);
    }

    function changeBet(moreOrLess, maxBetFlag) {
        if (maxBetFlag) {
            balanceData.betValue = balanceData.betSteps[balanceData.betSteps.length - 1];
        } else if (moreOrLess === true && balanceData.betValue !== balanceData.betSteps[balanceData.betSteps.length - 1]) {
            let i = balanceData.betSteps.length;
            while (i >= 0) {
                if (balanceData.betSteps[i] === balanceData.betValue) {
                    balanceData.betValue = balanceData.betSteps[i + 1];
                    i = -1;
                }
                i--;
            }
        } else if (moreOrLess === false && balanceData.betValue !== balanceData.betSteps[0]) {
            let i = balanceData.betSteps.length;
            while (i >= 0) {
                if (balanceData.betSteps[i] === balanceData.betValue) {
                    balanceData.betValue = balanceData.betSteps[i - 1];
                    i = -1;
                }
                i--;
            }
        } else {
            console.warn('Bet change is failed!');
        }
        balanceData.betSum = +(balanceData.betValue * balanceData.linesLength).toFixed(0);
        balanceData.betCash = +(balanceData.betSum * balanceData.coinsValue).toFixed(2);
        updateBalance();
        console.log('Bet is changed:', balanceData.betValue);
        if (balanceData.betValue === balanceData.betSteps[balanceData.betSteps.length - 1]) {
            console.warn('This bet value is maximum!');
        } else if (balanceData.betValue === balanceData.betSteps[0]) {
            console.warn('This bet value is minimum!');
        }
    }

    function changeCoins(moreOrLess, maxBetFlag) {
        if (maxBetFlag) {
            balanceData.coinsValue = balanceData.coinsSteps[balanceData.coinsSteps.length - 1];
        } else if (moreOrLess === true && balanceData.coinsValue !== balanceData.coinsSteps[balanceData.coinsSteps.length - 1]) {
            let i = balanceData.coinsSteps.length;
            while (i >= 0) {
                if (balanceData.coinsSteps[i] === balanceData.coinsValue) {
                    balanceData.coinsValue = balanceData.coinsSteps[i + 1];
                    i = -1;
                }
                i--;
            }
        } else if (moreOrLess === false && balanceData.coinsValue !== balanceData.coinsSteps[0]) {
            let i = balanceData.coinsSteps.length;
            while (i >= 0) {
                if (balanceData.coinsSteps[i] === balanceData.coinsValue) {
                    balanceData.coinsValue = balanceData.coinsSteps[i - 1];
                    i = -1;
                }
                i--;
            }
        } else {
            console.warn('Coins change is failed!');
        }
        balanceData.coinsSum = +Math.floor(balanceData.coinsCash / balanceData.coinsValue).toFixed(0);
        balanceData.betCash = +(balanceData.coinsValue * balanceData.betSum).toFixed(2);
        updateBalance();
        console.log('Coins value is changed:', balanceData.coinsValue);
        if (balanceData.coinsValue === balanceData.coinsSteps[balanceData.coinsSteps.length - 1]) {
            console.warn('This coins value is maximum!');
        } else if (balanceData.coinsValue === balanceData.coinsSteps[0]) {
            console.warn('This coins value is minimum!');
        }
    }

    function maxBet() {
        changeBet(true, true);
    }

    // Изменение баланса при начале крутки
    function startRoll() {
        if (storage.readState('mode') === 'normal') {
            if (balanceData.coinsSum >= balanceData.betSum) {
                balanceData.coinsSum = (balanceData.coinsSum - balanceData.betSum).toFixed(0);
                balanceData.coinsCash = ((balanceData.coinsCash * 100 - balanceData.betCash * 100) / 100).toFixed(2);
                balanceData.winCash = (0).toFixed(2);
                updateBalance();
            } else {
                storage.changeState('lowBalance', true);
                console.warn('Too low cash for spin!');
                utils.showPopup('Low money!');
            }
        }
    }

    // Изменение баланса в конце крутки
    function endRoll() {
        if (storage.readState('mode') === 'normal') {
            const data = storage.read('rollResponse');
            balanceData.winCash = (+data.TotalWinCents / 100).toFixed(2);
            balanceData.coinsCash = (+data.ScoreCents / 100).toFixed(2);
            balanceData.coinsSum = (+data.ScoreCoins).toFixed(0);
            updateBalance();
        }
    }

    function lowBalance() {
        return balanceData.betSum > balanceData.coinsSum;
    }

    return {
        start,
        initBalance,
        writeCashBalance,
        updateBalance,
        lowBalance,
        changeBet,
        changeCoins,
        maxBet,
        startRoll,
        endRoll
    };

})();
