That's an excellent way to organize the development process! Breaking the specification into prioritized phases with clear acceptance criteria will ensure a smooth implementation.

Here is the phased TODO list for implementing the Spanish Flashcards App:

---

# ✅ Phased Implementation TODO List

## Phase 1: Core Study View (Easy/Foundation)

This phase focuses on setting up the project, data, and the basic flashcard interaction.

### 1. Project Setup & Data Model

| Item | Acceptance Criteria |
| :--- | :--- |
| ✅ **Initialize Project** (React/Vite/TS) | The development server runs successfully, displaying a basic "Hello World" component. |
| ✅ **Define Card Data Structure** | A TypeScript interface (`Flashcard`) is defined with `id`, `spanish_word`, `english_translation`, and `is_known` fields. |
| ✅ **Hardcode 50 Cards** | A static array of 50 card objects is implemented and imported into the main application state. |

### 2. Basic Flashcard Functionality

| Item | Acceptance Criteria |
| :--- | :--- |
| ✅ **FCM-01: Card Display** | A single card is rendered, displaying **only** the `spanish_word`. The card is centrally located on the screen. |
| ✅ **FCM-05: Basic Navigation** | A "Next" button is functional, allowing the user to cycle through all 50 cards. |
| ✅ **FCM-02: Card Flipping** | Clicking/tapping the card successfully toggles its state to show the `english_translation` instead of the Spanish word. |
| ✅ **FCM-03: Self-Assessment Buttons** | When the card is flipped (English word visible), the **"I Got It Right"** and **"I Got It Wrong"** buttons appear below it. |

---

## Phase 2: Persistence & Redo Mode (Medium)

This phase introduces state management persistence and the core learning mechanism.

### 3. Data Persistence

| Item | Acceptance Criteria |
| :--- | :--- |
| $\square$ **Local Storage Integration** | The current deck status (which cards are marked `is_known`) is saved to `localStorage` upon any change. |
| $\square$ **Data Loading** | On application load, the deck state is correctly retrieved from `localStorage` before the hardcoded defaults are used. |

### 4. Learning & Redo Mode

| Item | Acceptance Criteria |
| :--- | :--- |
| $\square$ **FCM-04: Tracking "Wrong"** | Clicking **"I Got It Wrong"** correctly sets the card's `is_known` property to `false` in the application state and persistence. |
| $\square$ **FCM-06: Redo Mode Toggle** | A visible toggle/button switches the application's current deck source. |
| $\square$ **Redo Mode Logic** | When Redo Mode is active, the navigation only cycles through cards where `is_known` is explicitly `false`. |
| $\square$ **FCM-04: Tracking "Right"** | Clicking **"I Got It Right"** correctly sets the card's `is_known` property to `true` in the application state and persistence. |

---

## Phase 3: Statistics and Quiz Mode (Hard/Feature-Rich)

This phase builds the secondary views and complex testing logic.

### 5. Statistics Page

| Item | Acceptance Criteria |
| :--- | :--- |
| $\square$ **STS-01: Total Studied** | The Statistics page correctly displays the count of unique cards with `is_known` set to either `true` or `false` (i.e., viewed at least once). |
| $\square$ **STS-02: Known vs. Unknown** | The page accurately displays the count of cards where `is_known` is `true` ("Known") and `false` ("Unknown"). |
| $\square$ **Quiz Answer Tracking** | A new state object tracks the total number of quiz attempts, correct answers, and incorrect answers across all sessions. |
| $\square$ **STS-03: Correct Answer Rate** | The percentage of correct quiz answers is calculated and displayed on the Statistics page. |

### 6. Quiz Mode Implementation

| Item | Acceptance Criteria |
| :--- | :--- |
| $\square$ **QZT-01: Multiple Choice Logic** | A new view is created where a Spanish word is shown, and the user selects from 4 options (1 correct, 3 random incorrect translations from the other 49 cards). |
| $\square$ **QZT-02: Fill-in-the-Blank** | A view is created where a Spanish word is shown with an input field. Submission check is **case-insensitive** and ignores surrounding whitespace. |
| $\square$ **QZT-03: Feedback** | Both Quiz modes provide immediate visual feedback (e.g., green checkmark/red X) after the user submits an answer, and update the global quiz statistics. |

---

## Phase 4: Polish & UX (Final Touches)

| Item | Acceptance Criteria |
| :--- | :--- |
| $\square$ **UI/UX: Navigation** | A persistent navigation bar is implemented to easily switch between **Study View**, **Quiz Mode**, and **Statistics Page**. |
| $\square$ **UI/UX: Mobile Responsiveness** | The application is fully usable and visually appealing on common mobile screen sizes. |
| $\square$ **Code Review/Refactoring** | All major components are cleaned up, typed, and well-commented. |