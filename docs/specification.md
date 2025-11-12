That clarifies the scope perfectly! Starting with a hardcoded list allows for faster development, and including both quiz types offers immediate flexibility.

Here is the Software Specification for your Spanish Flashcards Web Application.

---

# 📝 Software Specification: Spanish Flashcards App

## 1. Introduction

This document details the functional and technical specifications for a web-based flashcard application designed to help users learn Spanish vocabulary. The application will focus on core features, including card-flipping, self-assessment, spaced repetition for difficult cards, and a comprehensive quiz mode.

---

## 2. Technical Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React** | Component-based UI development. |
| **Bundler/Toolchain** | **Vite** | Fast development server and optimized build process. |
| **Language** | **TypeScript** | Static typing for improved code quality and maintainability. |
| **State Management** | React built-in tools (e.g., `useState`, `useReducer`, Context) | Managing application state. |

---

## 3. Data Specification

### 3.1. Initial Content

The initial application will be populated with a **hardcoded list of 50 Spanish words** and their corresponding English translations.

* **Data Structure:** Each flashcard object must contain the following fields:
    * `id`: Unique identifier (e.g., a number or UUID).
    * `spanish_word`: The word to be studied (e.g., "mesa").
    * `english_translation`: The meaning (e.g., "table").
    * `is_known`: Boolean state tracking if the user has marked the card as "Right" in a previous session (initially `false`).

### 3.2. Data Persistence

The user's progress (`is_known` status, session statistics) must be persisted using the browser's **Local Storage** so the state remains between sessions.

---

## 4. Functional Requirements (Features)

### 4.1. Flashcard Mode (Study View)

| ID | Feature Name | Description |
| :--- | :--- | :--- |
| **FCM-01** | **Card Display** | Display one flashcard at a time, showing only the **Spanish word** initially. |
| **FCM-02** | **Card Flipping** | A single click/tap on the card will flip it to reveal the **English translation**. |
| **FCM-03** | **Self-Assessment** | After the card is flipped, two buttons must appear below the card: **"I Got It Right"** and **"I Got It Wrong"**. |
| **FCM-04** | **Tracking** | Clicking **"I Got It Wrong"** updates the card's state to be tracked for the "Redo Only" feature. |
| **FCM-05** | **Navigation** | Buttons or gestures to move to the **Next Card** in the deck. |
| **FCM-06** | **Redo Mode Toggle** | A toggle/button to switch the deck source to **"Redo Only Cards I Don’t Know"** (only cards previously marked "Wrong"). |

### 4.2. Quiz/Test Mode

The application must include a dedicated Quiz Mode offering two formats:

| ID | Feature Name | Description |
| :--- | :--- | :--- |
| **QZT-01** | **Multiple Choice** | The user is shown a Spanish word and must select the correct English translation from a list of **4 options** (1 correct, 3 random distractors). |
| **QZT-02** | **Fill-in-the-Blank** | The user is shown a Spanish word and must **type the correct English translation** into an input field. The check should be case-insensitive and ignore leading/trailing whitespace. |
| **QZT-03** | **Feedback** | Immediate feedback (green for correct, red for incorrect) after submitting an answer. |

### 4.3. Statistics Page

A dedicated view must present the user's progress. 

| ID | Feature Name | Description | |
| :--- | :--- | :--- | |
| **STS-01** | **Total Studied** | Count of the total number of unique flashcards viewed at least once. |
| **STS-02** | **Known vs. Unknown** | Display the count of cards marked **"Right"** versus cards marked **"Wrong"** (or never marked "Right"). |
| **STS-03** | **Correct Answer Rate** | Calculate and display the overall percentage of correct answers in Quiz Mode. |

---

## 5. UI/UX Considerations

* The interface should be clean, **mobile-responsive**, and prioritize readability.
* Clear visual separation between the main **Study View**, **Quiz Mode**, and **Statistics Page** (e.g., via a navigation bar).
* The card itself should be the focal point of the Study View.