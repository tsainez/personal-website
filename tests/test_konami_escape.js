const fs = require("fs");
const path = require("path");
const assert = require("assert");

// A simple test to verify handleEscapeKey works in konami.js
// We mock the DOM environment and verify window.location.reload is called.

// Mock Element for querySelectorAll and DOM insertion
class Element {
    constructor(tagName, id, className) {
        this.tagName = tagName;
        this.id = id || "";
        this.className = className || "";
        this.children = [];
        this.style = { setProperty: () => {}, animation: "", display: "" };
        this.attributes = {};
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    getAttribute(name) { return this.attributes[name]; }
    get classList() {
        return {
            add: (cls) => this.className += " " + cls,
            contains: (cls) => this.className.includes(cls),
            remove: (cls) => this.className = this.className.replace(cls, "")
        };
    }
    get offsetParent() { return {}; }
    closest(selector) { return null; }
    appendChild(child) { this.children.push(child); }
}

class DocumentFragment {
    constructor() { this.children = []; }
    appendChild(child) { this.children.push(child); }
}

const body = new Element('body');

global.document = {
    addEventListener: (event, cb) => {
        if (!global.listeners) global.listeners = {};
        if (!global.listeners[event]) global.listeners[event] = [];
        global.listeners[event].push(cb);
    },
    createElement: (tagName) => new Element(tagName),
    createDocumentFragment: () => new DocumentFragment(),
    querySelectorAll: (selector) => [], // Return empty array to speed up tests
    body: body
};

global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    location: {
        reloadCalls: 0,
        reload: function() { this.reloadCalls++; }
    }
};

global.Math.random = () => 0.5;
global.setTimeout = (cb, ms) => {};

const konamiScriptPath = path.join(__dirname, "../assets/js/konami.js");
const konamiScriptContent = fs.readFileSync(konamiScriptPath, "utf8");

// Run the script
eval(konamiScriptContent);

console.log("🧪 Testing handleEscapeKey in konami.js");

// 1. Verify no reload initially
assert.strictEqual(global.window.location.reloadCalls, 0, "Reload should not be called initially.");

// 2. Pressing Escape before konami activation should not trigger reload
if (global.listeners['keydown']) {
    global.listeners['keydown'].forEach(cb => cb({ key: 'Escape' }));
}
assert.strictEqual(global.window.location.reloadCalls, 0, "Escape before activation should not reload.");

// 3. Trigger Konami Code
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

// 4. Now press Escape
if (global.listeners['keydown']) {
    global.listeners['keydown'].forEach(cb => cb({ key: 'Escape' }));
}

assert.strictEqual(global.window.location.reloadCalls, 1, "Escape after activation should reload.");

console.log("✅ Passed!");
