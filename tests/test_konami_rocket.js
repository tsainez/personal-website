const fs = require("fs");
const path = require("path");

// Mock Element
class Element {
    constructor(tagName, id, className) {
        this.tagName = tagName;
        this.id = id || "";
        this.className = className || "";
        this.children = [];
        this.style = {
            setProperty: () => {},
            animation: "",
            display: "",
            left: "",
            top: ""
        };
        this.attributes = {};
        this.innerText = "";
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
            contains: (cls) => this.className.split(" ").includes(cls),
            remove: (cls) => this.className = this.className.replace(cls, "").trim()
        };
    }

    get offsetParent() {
        return {}; // Mock visibility
    }

    closest(selector) {
        return null;
    }

    appendChild(child) {
        this.children.push(child);
    }
}

// Mock DocumentFragment
class DocumentFragment {
    constructor() {
        this.children = [];
    }
    appendChild(child) {
        this.children.push(child);
    }
}

const body = new Element('body');

const mockElements = [];

global.document = {
    addEventListener: (event, cb) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(cb);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new DocumentFragment(),
    querySelectorAll: (selector) => {
        return mockElements;
    },
    body: body
};

global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    location: { reload: () => {} }
};

global.Math.random = () => 0.5;

// We need a mock for setTimeout to test the animation
const timeouts = [];
global.setTimeout = (cb, delay) => {
    timeouts.push({cb, delay});
};

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

// Run the script
eval(konamiScriptContent);

if (global.listeners['DOMContentLoaded']) {
    global.listeners['DOMContentLoaded'].forEach(cb => cb());
}

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

// Now we need to verify the rocket
const rockets = body.children.filter(el => el.id === 'rocket');

if (rockets.length === 0) {
    console.error("FAIL: Rocket element not found in body.");
    process.exit(1);
}

if (rockets.length > 1) {
    console.error("FAIL: Multiple rocket elements found in body.");
    process.exit(1);
}

const rocket = rockets[0];

let passed = true;

// 1. Check ID
if (rocket.id !== 'rocket') {
    console.error(`FAIL: Expected rocket ID to be 'rocket', got '${rocket.id}'`);
    passed = false;
}

// 2. Check text
if (rocket.innerText !== '🚀') {
    console.error(`FAIL: Expected rocket text to be '🚀', got '${rocket.innerText}'`);
    passed = false;
}

// 3. Check aria-hidden
if (rocket.getAttribute('aria-hidden') !== 'true') {
    console.error(`FAIL: Expected rocket aria-hidden to be 'true', got '${rocket.getAttribute('aria-hidden')}'`);
    passed = false;
}

// 4. Check class
if (!rocket.classList.contains('zero-gravity-rocket')) {
    console.error(`FAIL: Expected rocket to have class 'zero-gravity-rocket', got classes '${rocket.className}'`);
    passed = false;
}

// 5. Run timeouts (for animation)
// The animation timeout is 100ms
const animationTimeout = timeouts.find(t => t.delay === 100);

if (!animationTimeout) {
    console.error("FAIL: Animation timeout not found.");
    passed = false;
} else {
    // Run the timeout
    animationTimeout.cb();

    // Check styles
    if (rocket.style.left !== "120%") {
        console.error(`FAIL: Expected rocket style.left to be '120%', got '${rocket.style.left}'`);
        passed = false;
    }
    if (rocket.style.top !== "20%") {
        console.error(`FAIL: Expected rocket style.top to be '20%', got '${rocket.style.top}'`);
        passed = false;
    }
}

if (passed) {
    console.log("PASS: Rocket element created and animated correctly.");
    process.exit(0);
} else {
    process.exit(1);
}
