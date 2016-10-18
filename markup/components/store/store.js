export let store = (function() {

    let dataObj = {},
        elsObj = {},
        statesObj = {},
        soundsObj = {};

    function returnData(obj, key, value) {
        if (value) {
            obj[key] = value;
        } else if (typeof obj[key] !== 'undefined') {
            return obj[key];
        }
    }

    function data(key, value) {
        return returnData(dataObj, key, value);
    }

    function el(key, value) {
        return returnData(elsObj, key, value);
    }

    function state(key, value) {
        return returnData(statesObj, key, value);
    }

    function sound(key, value) {
        return returnData(soundObj, key, value);
    }

    function log() {
        console.log('States:', statesObj);
        console.log('Data:', dataObj);
        console.log('Elements:', elsObj);
        console.log('Sounds:', soundsObj);
    }

    return {
        data,
        el,
        state,
        sound,
        log
    };
})();
