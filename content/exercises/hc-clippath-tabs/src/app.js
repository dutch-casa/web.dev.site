// TODO: Implement the clip-path tab animation
//
// The HTML structure uses the "overlay technique":
// - Bottom layer (.tabs): Shows inactive tab appearance (gray text)
// - Top layer (.tabs-overlay > .tabs-active): Shows active appearance (white on blue)
// - We clip the top layer to only reveal the active tab
//
// Your tasks:
// 1. Get references to the overlay container and all tab buttons
// 2. Create a function that calculates and applies the clip-path
// 3. Add click listeners to update the active tab
//
// The clip-path formula:
//   clipLeft = (activeTab.offsetLeft / containerWidth) * 100
//   clipRight = 100 - ((activeTab.offsetLeft + activeTab.offsetWidth) / containerWidth) * 100
//   clipPath = `inset(0 ${clipRight}% 0 ${clipLeft}% round 17px)`

// Step 1: Get DOM elements
// - The overlay container (.tabs-overlay) - this is what we apply clip-path to
// - All the tab buttons in the BASE layer (not the overlay)
// - The first tab button (to set initial state)

const overlay = // TODO: document.querySelector(...)
const tabButtons = // TODO: document.querySelectorAll(...)


// Step 2: Create function to update the clip-path
// This function should:
// - Take the active button element as a parameter
// - Get the button's offsetLeft and offsetWidth
// - Get the overlay's offsetWidth
// - Calculate clipLeft and clipRight percentages
// - Apply the clip-path to the overlay

function updateClipPath(activeButton) {
  // TODO: Get the overlay width

  // TODO: Get the active button's position and width

  // TODO: Calculate the clip percentages
  // clipLeft = how much to cut from the left (percentage)
  // clipRight = how much to cut from the right (percentage)

  // TODO: Apply the clip-path
  // overlay.style.clipPath = `inset(0 ${clipRight}% 0 ${clipLeft}% round 17px)`;
}


// Step 3: Add click listeners to each tab button
// When clicked:
// - Update aria-selected attributes (false on all, true on clicked)
// - Call updateClipPath with the clicked button

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // TODO: Update aria-selected on all buttons

    // TODO: Call updateClipPath with this button
  });
});


// Step 4: Set initial clip-path on page load
// Call updateClipPath with the first tab button

// TODO: updateClipPath(...)
