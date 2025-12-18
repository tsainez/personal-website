
const fs = require("fs");
const path = require("path");

// Minimal DOM Mock
class Element {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.style = {
            setProperty: (prop, value) => {
                this.style[prop] = value;
            }
        };
        this.classList = {
            add: () => {},
            contains: () => false
        };
        this.innerText = "";
        this.id = "";
        this.offsetParent = {}; // Mock visibility
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

const head = new Element('head');
const body = new Element('body');

// Create 100 mock elements
const mockElements = [];
for(let i=0; i<100; i++) {
    mockElements.push(new Element('p'));
}

body.querySelectorAll = (selector) => {
    if (selector === '.star') return [];
    // Return 100 elements
    return mockElements;
};
body.appendChild = (child) => {
    // ...
};

head.querySelectorAll = (selector) => {
    if (selector === 'style') {
        return { length: global.styleTagCount || 0 };
    }
    return [];
}
head.appendChild = (child) => {
    if (child.tagName === 'style') {
        global.styleTagCount = (global.styleTagCount || 0) + 1;
        if (child.id === 'zero-gravity-styles') {
            global.stylesCreated = true;
        }
    }
};

global.document = {
    addEventListener: (event, callback) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(callback);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new DocumentFragment(),
    getElementById: (id) => {
        // Assume styles are not yet created on first run
        if (id === 'zero-gravity-styles' && !global.stylesCreated) return null;
        if (id === 'zero-gravity-styles' && global.stylesCreated) return {};
        return null;
    },
    body: body,
    head: head,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
};

global.stylesCreated = false;
global.window = {
    innerWidth: 1024,
    innerHeight: 768
};

global.requestAnimationFrame = (cb) => cb();

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

eval(konamiScriptContent);

if (global.listeners['DOMContentLoaded']) {
    global.listeners['DOMContentLoaded'].forEach(cb => cb());
}

const code = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

console.log("Simulating Konami Code...");
code.forEach(key => {
    if (global.listeners['keydown']) {
        global.listeners['keydown'].forEach(cb => cb({ key }));
    }
});

const styleCount = global.styleTagCount || 0;
console.log(`Style tags created: ${styleCount}`);

if (styleCount > 5) {
    console.error(`FAIL: Too many style tags created (${styleCount}). Expected <= 5.`);
    process.exit(1);
} else {
    console.log(`PASS: Style tags count is efficient (${styleCount}).`);
    process.exit(0);
}
