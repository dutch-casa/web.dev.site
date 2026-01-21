// Clip-path tab animation using the overlay technique
//
// Structure:
// - Bottom layer (.tabs): inactive appearance (gray text)
// - Top layer (.tabs-overlay > .tabs-active): active appearance (white on blue)
// - We clip the overlay to only reveal the portion covering the active tab

// Step 1: Get DOM elements
const overlay = document.querySelector('.tabs-overlay');
const tabButtons = document.querySelectorAll('.tabs[role="tablist"] .tab-button');

// Step 2: Function to update the clip-path based on the active tab
function updateClipPath(activeButton) {
  // Get the overlay width (same as the tabs container width)
  const containerWidth = overlay.offsetWidth;

  // Get the active button's position and dimensions
  const tabLeft = activeButton.offsetLeft;
  const tabWidth = activeButton.offsetWidth;
  const tabRight = tabLeft + tabWidth;

  // Calculate clip percentages
  // clipLeft: how much to cut from the left (as percentage)
  // clipRight: how much to cut from the right (as percentage)
  const clipLeft = (tabLeft / containerWidth) * 100;
  const clipRight = 100 - (tabRight / containerWidth) * 100;

  // Apply the clip-path with rounded corners
  // inset(top right bottom left round border-radius)
  overlay.style.clipPath = `inset(0 ${clipRight.toFixed(1)}% 0 ${clipLeft.toFixed(1)}% round 17px)`;
}

// Step 3: Add click listeners to each tab button
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update aria-selected attributes
    tabButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
    button.setAttribute('aria-selected', 'true');

    // Update the clip-path to reveal this tab
    updateClipPath(button);
  });
});

// Step 4: Set initial clip-path on page load
// Find the initially selected tab and set the clip-path
const initialTab = document.querySelector('[aria-selected="true"]');
if (initialTab) {
  updateClipPath(initialTab);
}
