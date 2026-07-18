const fs = require("fs");
const path = require("path");

// Mock Element
class Element {
    constructor(tagName) {
        this.tagName = tagName;
        this.id = "";
        this.className = "";
        this.innerText = "";
        this.style = {};
        this.attributes = {};
        this.children = [];
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    get classList() {
        return {
            add: (cls) => this.className += (this.className ? " " : "") + cls,
            contains: (cls) => this.className.includes(cls),
            remove: (cls) => this.className = this.className.replace(cls, "").trim()
        };
    }

    appendChild(child) {
        this.children.push(child);
    }
}

const body = new Element('body');

const timeouts = [];
global.setTimeout = (cb, delay) => {
    timeouts.push(cb);
};

global.document = {
    addEventListener: (event, cb) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(cb);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new Element('fragment'),
    querySelectorAll: () => [],
    body: body
};

global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    location: { reload: () => {} }
};

global.Math.random = () => 0.5;

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

// Run the script
eval(konamiScriptContent);

// Trigger Konami Code
const code = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

code.forEach(key => {
    if (global.listeners['keydown']) {
        global.listeners['keydown'].forEach(cb => cb({ key }));
    }
});

// Verify Rocket
const rocket = body.children.find(child => child.id === "rocket");

if (!rocket) {
    console.error("FAIL: Rocket element was not appended to the body.");
    process.exit(1);
}

// Verify attributes and class
let failed = false;
if (rocket.innerText !== "🚀") {
    console.error(`FAIL: Expected rocket innerText to be "🚀", got "${rocket.innerText}"`);
    failed = true;
}
if (rocket.getAttribute('aria-hidden') !== 'true') {
    console.error(`FAIL: Expected aria-hidden='true', got '${rocket.getAttribute('aria-hidden')}'`);
    failed = true;
}
if (!rocket.className.includes('zero-gravity-rocket')) {
    console.error(`FAIL: Expected class 'zero-gravity-rocket', got '${rocket.className}'`);
    failed = true;
}

if (failed) {
    process.exit(1);
}

console.log("PASS: Rocket element created with correct initial attributes.");

// Execute all timeouts
if (timeouts.length === 0) {
    console.error("FAIL: setTimeout was not called.");
    process.exit(1);
}
timeouts.forEach(cb => cb());

// Verify style changes
if (rocket.style.left !== "120%" || rocket.style.top !== "20%") {
    console.error(`FAIL: Rocket styles not set correctly after timeout. Got left=${rocket.style.left}, top=${rocket.style.top}`);
    process.exit(1);
}

console.log("PASS: Rocket animation styles applied after timeout.");
process.exit(0);
