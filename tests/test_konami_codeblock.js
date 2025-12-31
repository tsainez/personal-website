
const fs = require("fs");
const path = require("path");

// Mock Element to test class/id checks
class Element {
    constructor(tagName, id, className) {
        this.tagName = tagName;
        this.id = id || "";
        this.className = className || "";
        this.children = [];
        this.style = {
            setProperty: () => {},
            animation: "",
            display: ""
        };
        this.attributes = {};
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    get classList() {
        return {
            add: (cls) => this.className += " " + cls,
            contains: (cls) => this.className.includes(cls),
            remove: (cls) => this.className = this.className.replace(cls, "")
        };
    }

    get offsetParent() {
        return {}; // Mock visibility
    }

    closest(selector) {
        // Mock simple closest logic
        if (selector === 'pre' && this.className.includes('in-pre')) return true;
        if (selector === 'code' && this.className.includes('in-code')) return true;
        return null;
    }

    appendChild(child) {
        this.children.push(child);
    }
}

// Mock document.createDocumentFragment
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
// Create 1000 spans that act as code tokens (inside pre/code)
for (let i = 0; i < 1000; i++) {
    const span = new Element('span', '', 'in-pre in-code');
    mockElements.push(span);
}
// Create 10 normal elements
for (let i = 0; i < 10; i++) {
    mockElements.push(new Element('p'));
}

global.document = {
    addEventListener: (event, cb) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(cb);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new DocumentFragment(),
    querySelectorAll: (selector) => {
        // Mock querySelectorAll behavior for :not(code) > span
        if (selector.includes(':not(code) > span')) {
            // Filter out elements that are "in-code" (mocked via class)
            // In a real browser this is done by CSS engine. Here we simulate it.
            return mockElements.filter(el => !el.className.includes('in-code'));
        }
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

// Verify that none of the 1000 code spans have animations
let spansAnimated = 0;
mockElements.forEach(el => {
    if (el.className.includes('in-pre') && el.style.animation) {
        spansAnimated++;
    }
});

console.log(`Total spans in code block: 1000`);
console.log(`Spans animated: ${spansAnimated}`);

if (spansAnimated > 0) {
    console.log("FAIL: Syntax highlighted code tokens are being animated!");
    process.exit(1);
} else {
    console.log("PASS: Code tokens are ignored.");
    process.exit(0);
}
