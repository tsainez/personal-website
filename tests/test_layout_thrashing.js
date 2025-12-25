
const fs = require("fs");
const path = require("path");

// Verification State
let layoutInvalidated = false;
let forcedLayoutCount = 0;
let operationsLog = [];

// Minimal DOM Mock
class Element {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this._style = {};

        // Proxy to trap style writes
        this.style = new Proxy(this._style, {
            set: (target, prop, value) => {
                target[prop] = value;
                if (!layoutInvalidated) {
                    operationsLog.push('WRITE_STYLE');
                    layoutInvalidated = true;
                }
                return true;
            },
            get: (target, prop) => {
                if (prop === 'setProperty') {
                    return (key, val) => {
                        target[key] = val;
                        if (!layoutInvalidated) {
                            operationsLog.push('WRITE_STYLE');
                            layoutInvalidated = true;
                        }
                    };
                }
                return target[prop];
            }
        });

        this.classList = {
            add: () => {},
            contains: () => false
        };
        this.innerText = "";
        this.id = "";
    }

    // Mock offsetParent to trigger layout read
    get offsetParent() {
        operationsLog.push('READ_LAYOUT');
        if (layoutInvalidated) {
            forcedLayoutCount++;
            layoutInvalidated = false; // Layout is now clean (recalculated)
        }
        return {}; // Mock visibility
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
    return mockElements;
};
body.appendChild = (child) => {
    // ...
};

global.document = {
    addEventListener: (event, callback) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(callback);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new DocumentFragment(),
    getElementById: (id) => null,
    body: body,
    head: head,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
};

// Mock window with layout-triggering properties
global.window = {
    get innerWidth() {
        if (layoutInvalidated) {
            forcedLayoutCount++;
            layoutInvalidated = false;
        }
        return 1024;
    },
    get innerHeight() {
        if (layoutInvalidated) {
            forcedLayoutCount++;
            layoutInvalidated = false;
        }
        return 768;
    }
};

// Mock Math.random to be deterministic enough
global.Math.random = () => 0.5;

global.requestAnimationFrame = (cb) => cb();

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

// Run the script
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

console.log(`Forced Layout Count: ${forcedLayoutCount}`);
// In a loop of 100 elements, if we read-write-read-write, we expect close to 100 forced layouts (minus the first one)
if (forcedLayoutCount > 10) {
    console.error(`FAIL: Layout thrashing detected. Forced layouts: ${forcedLayoutCount}`);
    process.exit(1);
} else {
    console.log(`PASS: No significant layout thrashing. Forced layouts: ${forcedLayoutCount}`);
    process.exit(0);
}
