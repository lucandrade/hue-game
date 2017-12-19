import Chroma from 'chroma-js';

import GetRandomNumber from './GetRandomNumber';

function getRandomLuminosity(color) {
    const currentLuminosity = Chroma(color).get('hsl.l')*100;
    const randomLuminosity = GetRandomNumber(5, 25);
    let finalLuminosity = currentLuminosity;

    if (Math.random() >= 0.5) {
        finalLuminosity-= randomLuminosity;
    } else {
        finalLuminosity+= randomLuminosity;
    }

    if (finalLuminosity > 100 || finalLuminosity < 0) {
        return finalLuminosity = currentLuminosity;
    }

    return finalLuminosity/100;
}

function getRandomSaturation(color) {
    return GetRandomNumber(0, 90)/100;
}

function getRandomHue(color, min, max) {
    const number = GetRandomNumber(min, max);
    const currentHue = Chroma(color).get('hsl.h');
    return (number+currentHue) % 360;
}

function getColorFromRangeHue(color, min, max) {
    return Chroma(color)
        .set('hsl.h', getRandomHue(color, min, max))
        .set('hsl.l', getRandomLuminosity(color))
        .set('hsl.s', getRandomSaturation());
}

export default function getRandomColors(rows, columns) {
    const firstColor = Chroma.random().hex();
    const secondColor = getColorFromRangeHue(firstColor, 40, 60);
    const thirdColor = getColorFromRangeHue(secondColor, 110, 130);
    const fourthColor = getColorFromRangeHue(thirdColor, 40, 60);

    return [firstColor, secondColor, thirdColor, fourthColor];
}