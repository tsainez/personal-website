import time
from playwright.sync_api import sync_playwright

def test_layout_thrashing_repro():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:4000")

        # Inject 2000 paragraphs to exaggerate the effect
        page.evaluate("""
            const container = document.createElement('div');
            for(let i=0; i<2000; i++) {
                const p = document.createElement('p');
                p.innerText = 'Paragraph ' + i;
                container.appendChild(p);
            }
            document.body.appendChild(container);
        """)

        # Start measuring time
        start_time = time.time()

        # Trigger Konami Code
        keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
        for key in keys:
            page.keyboard.press(key)

        # Wait for "Rocket" to appear as a proxy for activation completion
        page.wait_for_selector("#rocket", timeout=10000)

        end_time = time.time()
        duration = end_time - start_time

        print(f"Time to activate Zero Gravity with 2000 elements: {duration:.4f} seconds")

        browser.close()

if __name__ == "__main__":
    test_layout_thrashing_repro()
