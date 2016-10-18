import { events } from 'components/events/events';

export let model = (function() {

    let dataObj = {},
        elObj = {},
        stateObj = {},
        soundObj = {};

    function returnData(obj, key, value) {
        if (typeof value !== 'undefined') {
            obj[key] = value;
        } else {
            return obj[key];
        }
    }

    function data(key, value) {
        return returnData(dataObj, key, value);
    }

    function el(key, value) {
        return returnData(elObj, key, value);
    }

    function state(key, value) {
        return returnData(stateObj, key, value);
        events.trigger(`change:${key}`, stateObj[key]);
    }

    function sound(key, value) {
        return returnData(soundObj, key, value);
    }

    return {
        data,
        el,
        state,
        sound,
        log
    };
})();
