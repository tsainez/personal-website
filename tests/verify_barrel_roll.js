const fs = require('fs');
const assert = require('assert');

const barrelRollJs = fs.readFileSync('assets/js/barrel-roll.js', 'utf8');
const mainScss = fs.readFileSync('assets/main.scss', 'utf8');

assert(barrelRollJs.includes('do a barrel roll'), 'JS does not contain trigger phrase');
assert(mainScss.includes('.barrel-roll-active'), 'SCSS does not contain barrel-roll class');
assert(mainScss.includes('transform: rotate(360deg)'), 'SCSS does not have rotate transform');

console.log('Passed simple checks for barrel roll.');
