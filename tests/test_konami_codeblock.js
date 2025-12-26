
const fs = require("fs");
const path = require("path");

// Minimal DOM Mock
class Element {
    constructor(tagName) {
        this.tagName = tagName;
        this.classList = {
            _classes: [],
            add: () => {},
            contains: (cls) => this.classList._classes.includes(cls),
        };
        this.children = [];
        this.style = {
            setProperty: () => {},
            transition: "",
            display: ""
        };
        this.parentNode = null;
        this.id = "";
    }

    // Helper for setup
    addClass(cls) {
        this.classList._classes.push(cls);
    }

    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
    }

    // Mock offsetParent to simulate visibility
    get offsetParent() {
        return {}; // Always visible
    }

    closest(selector) {
        if (selector === 'pre' && this.tagName === 'span' && this.parentNode && this.parentNode.parentNode && this.parentNode.parentNode.tagName === 'pre') {
            return this.parentNode.parentNode;
        }
        if (selector === 'code' && this.tagName === 'span' && this.parentNode && this.parentNode.tagName === 'code') {
            return this.parentNode;
        }
        return null;
    }
}

const body = new Element('body');
const pre = new Element('pre');
const code = new Element('code');
pre.appendChild(code);
body.appendChild(pre);

// Create 1000 spans inside code block (simulating syntax highlighting)
for(let i=0; i<1000; i++) {
    const span = new Element('span');
    span.addClass('token');
    code.appendChild(span);
}

// Create some normal content
const p = new Element('p');
body.appendChild(p);


global.document = {
    addEventListener: () => {},
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => ({ appendChild: () => {} }),
    body: body,
    querySelectorAll: (selector) => {
        const results = [];
        const recurse = (node) => {
            if (node.tagName === 'span' || node.tagName === 'p') results.push(node);
            if (node.children) node.children.forEach(recurse);
        };
        recurse(body);
        return results;
    },
};

global.window = {
    innerWidth: 1000,
    innerHeight: 1000
};

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

// Override addEventListener to capture the callback
const listeners = {};
global.document.addEventListener = (event, cb) => {
    listeners[event] = cb;
};

// Run script
eval(konamiScriptContent);

// Trigger DOMContentLoaded
if (listeners['DOMContentLoaded']) {
    listeners['DOMContentLoaded']();
}

const codeSeq = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

// We'll attach a spy to the elements we created
const spans = code.children; // 1000 spans
let spansAnimated = 0;

spans.forEach(span => {
    // Override the style object's setProperty method for counting
    span.style.setProperty = () => {
        spansAnimated++;
    };
});

// Trigger Konami Code
codeSeq.forEach(key => {
    if (listeners['keydown']) {
        listeners['keydown']({ key });
    }
});

console.log(`Total spans in code block: 1000`);
console.log(`Spans animated: ${spansAnimated}`);

if (spansAnimated > 0) {
    console.log("FAIL: Syntax highlighted code tokens are being animated!");
} else {
    console.log("PASS: Code tokens are ignored.");
}
