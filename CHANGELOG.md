# Changelog

## [0.14.0] - 2026-01-07

### Added

- **Content (JLPT N5)**:
  - **Complete N5 Set**: Added the final ~25 missing Kanjis to reach 100% coverage of the N5 curriculum (106 Kanjis total).
  - **New Categories**: Time (Year, Week), Colors (Red, Blue, Black), School, Nature, and Essential Verbs.
- **Features**:
  - **Handwriting Module**: Interactive handwriting for both **Kanjis and Kanas**.
  - **Stroke Animation**: Watch the stroke order animation trait-by-trait (Kanji & Kana).
  - **Practice Mode**: Draw the character yourself with real-time feedback.
  - **XP Bonus**: Earn up to **x2.0 XP** (Tanuki Mode) by activating multiple categories simultaneously (Kana, Kanji, Vocab, Grammar).
  - **Mastery System**:
    - **Unified Design**: The "Mastery Checkmark" is now **Gold** across the entire app (Kana, Kanji, Vocab, Grammar).
    - **Kanji Modal**: Added a mastery toggle button directly in the Kanji details view.
  - **Quiz UX**:
    - **Persistence**: Filters (Categories & Modes) are verified and saved automatically.
    - **Manual Validation**: Added a "Passer" button to bypass writing issues (Pauses streak, 0 XP).
  - **Grammar**:
  - **Grammar**:
  - **Grammar**:
    - **Card Layout**: Improved layout with centered Category label and aligned Level badge.

### Fixed

- **UI/Layout**:
  - **Mobile Kanji**: The drawing canvas now adapts its size to fit smaller screens (responsive).
  - **Kana Overflow**: Fixed font size issues where combined characters (Yoon) would overflow their containers.
  - **Scrollbar**: Fixed layout shifts caused by scrollbar appearance (`scrollbar-gutter`).
  - **Navigation**: Mobile menu now highlights the active page given the current route.
  - **Mascot**: Added custom Tanuki illustrations for Quiz feedback (Success/Skip).

### Testing

- **E2E**: Integrated Playwright for automated UI and smoke testing.
- **Anti-Cheat (Quiz)**: Fixed an exploit where changing filters would reset the current question without penalty. Now, strict validation prevents skipping questions to maintain a streak.

## [0.13.0] - 2026-01-07

### Added

- **Interface**:
  - **Loading Screen**: New full-page loading state across all views (Home, Profile, Study, Quiz, Charts) to prevent content jumping.
  - **Detective Tanuki**: Integrated new "Detective" variant of the Tanuki mascot for the loading spinner.
- **Animations**:
  - **Progress Bars**: Experience (XP) and Mastery bars now animate smoothly from 0% on page load.
- **Profile & Gamification**:
  - **Activity Calendar**: New feature to track your daily learning consistency. Visualize your streaks and history.
  - **Year View**: Toggle between recent weeks and a full-year view of your activity.
  - **Cloud Save**: Your learning history is securely saved and synced across devices.
  - **Style**: Finalized profile layout with standardized spacing and components.
- **Interface**:
  - **Stability**: Implemented `scrollbar-gutter` to prevent the entire page layout from shifting when the scrollbar appears/disappears.

## [0.12.0] - 2026-01-04

### Added

- **Kanji Flashcards**: Explore and review Kanjis with the new "Front/Back" (Meaning/Character) flashcard mode.
- **Interface**:
  - **Major UI Refinement**: Centered headers and standardized layouts across all learning modules.
  - **Advanced Filters**: New "Mobile-First" filter panel for Kanjis (sleek modal).
  - **Unified Search**: Standardized search bars and filters (Vocabulary, Grammar, Kanji) for perfect consistency.
  - **Multi-Select**: Select multiple categories simultaneously across all study modes.
  - **Quiz UI**: Improved layout with centered title and compact toolbar for better focus.
  - **Quiz Filters**: Translated categories and improved configurations (solid Green border).
- **Progress**:
  - **Bug Fix**: Quiz scores and combos are now saved immediately to the cloud and local storage upon answering, preventing refresh-based cheating.
  - **Progress Bar**: Reusable `MasteryBar` component to visualize N5 mastery in Kanji grid and Kana charts.
  - **"Mastered" Filter**: Hide known items (Kanji, Flashcards) with one click to focus on what you need to learn.
- **Style**:
  - **Navbar**: Active tabs now use the hover color (tanuki-brown) for better feedback.
  - **Footer**: Added more breathing room between main content and the bottom of the page.
  - **Tanuki Theme**: Applied "Brown/Green" theme to toggles, examples, and separators across all views.
  - **Utility Classes**: CSS code refactoring for simplified maintenance (`.search-bar`, `.btn-filter`).
  - **Mobile**: Scaled down Flashcard categories for smaller mobile devices.

## [0.11.0] - 2026-01-02

### Added

- **Profile**:
  - **Avatars**: Integrated 12 new exclusive Tanuki avatars (Ninja, Samurai, Chef, etc.) and **9 Country Avatars** (France, Switzerland, Japan, USA, Italy, Mexico, UK, Spain, Germany, Korea).
  - **Customization**: Independent selection of avatar image and background color.
- **Interface**:
  - **Mobile**: Optimized profile editor (stacked buttons, adaptive grid).
  - **Tablet**: Improved layout adaption (Profile, Navbar, Notifications) for iPad and tablet devices.
  - **Notifications**: New native "Slide-Down" notification system on mobile.
  - **Navbar**: Now displays the user's custom avatar instead of a generic icon.
- **Security**:
  - **Auth**: Protected `/profile` and `/update-password` routes against guest access with automatic redirection.

## [0.10.0] - 2026-01-02

### Added

- **Home**: Added a dedicated card for "Vocabulaire" linking directly to the dictionary view.
- **Home**: Added a "Login to Save Progress" call-to-action for guest users.
- **Home**: Added unique background watermark characters (あ, 日, 文, 語, 学, 問) to dashboard cards.
- **Access Control**: Restricted progress tracking (badges, checkmarks) to logged-in users only.
- **Vocabulary**: Complete new module with 150+ words, native audio playback, and mastery tracking.
- **Mastery**: Standardized mastery system across all modules (Kanji, Kana, Grammar, Vocabulary) with consistent UI.
- **Kanjis**:
  - **Content**: Added 50 new N5 Kanjis.
  - **Interface**: New tabbed interface to filter Kanjis by category (Numbers, Time, People, etc.).
- **Navigation**:
  - **Separators**: Added visual hierarchy (Home | Encyclopedia | Practice).
  - **Auto-Scroll**: Page now automatically scrolls to top on navigation.

### Changed

- **Home**: Renamed the generic "Étude" card to "Flashcards" to clearly distinguish it from the vocabulary list.
- **Home**: Reorganized the dashboard into a structured 2-column layout (Kanas/Kanjis, Grammar/Vocab, Flashcards/Quiz).
- **UI/UX**:
  - **Mobile Menu**: Fixed overflow issues (scrollable) and improved separator visibility.
  - **Cards**: Optimized Kana card layout (reduced font size, removed scaling) for better mobile experience.
  - **Kanas**: Renamed "Tableaux" to "Kanas" in navigation.
- **Grammar**: Improved category filtering layout on mobile (now wraps to multiple lines).

## [0.9.1] - 2026-01-01

### Fixed

- **Layout**: Fixed Yoon (Combos) table alignment on mobile and desktop.
- **Layout**: Enforced 5-column grid for Basic Kana on mobile to maintain traditional rows.

## [0.9.0] - 2025-12-31

### Added

- **Quiz**: Integrated Kanji and Grammar into the question pool.
- **Quiz**: Category filtering system (Kana, Kanji, Grammar, Vocabulary).
- **Mastery**: Mastery tracking system to monitor progress for individual items.
- **Home**: Progress indicators on home dashboard tiles.
- **Cloud**: Automatic synchronization of mastery data and streaks with Supabase.

## [0.8.0] - 2025-12-30

### Added

- **Grammar**: New N5 Grammar module with searchable lessons and detailed explanations.
- **Audio Migration**: All audio assets (Kanas, Grammar, Kanji) are now hosted on Supabase Storage.
- **Audio Logic**: Hybrid system with Supabase Storage, Cloud TTS fallback, and Native TTS fallback.
- **Tooling**: New `generate-audio.js` script for automated audio generation and Supabase upload.

### Fixed

- **UI Stability**: Stabilized `btn-3d` animations to prevent layout shifts/footer flickering.
- **Mobile**: Adjusted spacing in Study view for better ergonomics on small screens.
- **Kanji**: Fixed Kanji audio naming issues using Hex-encoding.

## [0.7.0] - 2025-12-29

### Added

- **Kana**: Integrated all missing Kana (Dakuten, Handakuten, Yoon).
- **Vocabulary**: Added 30+ words (Nature, Family, Animals, Food).
- **Interface**: Tab system for Kana charts.
- **Flashcards**: "Big Screen" redesign on desktop (wider, larger font).

### Changed

- **Mobile**: Adjusted Kana grid to 4 columns for more accessible buttons.
- **Typography**: General increase in character and Romaji size.

## [0.6.1] - 2025-12-29

### Removed

- **Quiz**: Removed Text-to-Speech (TTS) button to prevent "cheating" and focus on visual recognition.

### Fixed

- **Animation**: Fixed visual glitch where text size transition caused layout shifts in Quiz.
- **Layout**: Enforced max-width and padding on Quiz view to prevent card resizing and edge touching on mobile.
- **Quiz**: Fixed issue where the "Check" (Combo) streak would reset on page reload.

## [0.6.0] - 2025-12-29

### Added

- **Mobile UI/UX**: Massive overhaul for better touch experience.
  - **Quiz**:
    - **2x2 Grid**: Answer buttons now use a compact 2x2 grid on mobile for better accessibility.
    - **Stability**: Fixed card height and reserved space for "Next" button to prevent layout shifts.
    - **Readability**: Dynamic font sizing for long questions.
  - **Kanji Grid**:
    - **Responsive Layout**: Cards now expand to fill width (`w-full`) on mobile and align perfectly (`items-stretch`).
    - **Search**: Search bar now features a green border and localized placeholder ("Soleil").
  - **Flashcards**:
    - **Alignment**: Removed vertical centering to align perfectly with other view titles.
  - **Navigation**:
    - **Animation**: Mobile menu now slides down ("curtain" effect) instead of fading in.
  - **Auth**:
    - **Optimization**: Reduced padding and margins for a cleaner mobile login experience.
    - **Branding**: Replaced generic Leaf icon with Tanuki mascot placeholder.
  - **Changelog**:
    - **Implementation**: Added a stylish "What's New" modal to display release history.
    - **Mascot**: Integrated Tanuki mascot as a watermark background.
    - **Readability**: Improved contrast, typography (bold subjects), and mobile spacing for better accessibility.

### Removed

- **Quiz**: Removed Text-to-Speech (TTS) button to prevent "cheating" and focus on visual recognition.

### Fixed

- **Layout**: Fixed various alignment issues across Quiz, Study, and Kanji views (2px shifts, residual padding).

## [0.5.0] - 2025-12-28

### Added

- **Kanjis**: New learning module for N5 Kanjis.
  - **Dashboard**: Searchable grid view for Kanjis.
  - **Details**: Modal view with stroke count, JLPT level, and readings.
  - **Readings**: Visual distinction between Onyomi (Chinese) and Kunyomi (Japanese) readings with tooltips.
  - **Localization**: Full French translation for all Kanji meanings.
- **Navigation**:
  - **Home**: New dashboard layout with quick access to all modules.
  - **Navbar**: Added direct link to Kanji module.

## [0.4.0] - 2025-12-26

### Added

- **Gamification**:
  - **Best Combo**: Now tracking and displaying the all-time best streak on the user profile.
  - **Score Calculation**: Score now accurately reflects `Correct / Total Attempts` (previously ignored wrong answers).
  - **Persistent Session**: Quiz streak ("Combo") is now persisted in memory, surviving navigation between Profile and Quiz.
- **Security**:
  - **Database**: Secured `delete_user` function with explicit `search_path` (fixes Supabase Advisor warning).
- **UI/UX**:
  - **Footer**: Compact design with dynamic version number (`v0.4.0`) linked to GitHub Release + Circular GitHub Icon.
  - **Audio**: Disabled automatic TTS on card flip in Study mode (manual playback only).

### Fixed

- **Navigation**: Fixed issue where quiz combo would reset when visiting the profile.
- **Score**: Fixed logic where total questions counter only incremented on correct answers.

## [0.3.0] - 2025-12-25

### Added

- **UI Unification**: Implemented a complete design system (`.card`, `.btn-3d`) across all views (Home, Auth, Quiz, Study, Charts, Profile).
- **Brand Identity**: Integrated new Tanuki mascot logo and synced favicon.
- **Visuals**: Added "Gold" and "Brown" 3D button variants for better hierarchy.
- **UX**: Enforced global pointer cursors on interactive elements and improved hover effects.
- **Legal & Privacy**: Added `LegalView` with Terms of Service and Privacy Policy, GDPR/nLPD compliant.

### Fixed

- **Design Consistency**: Standardized border colors across all cards.

## [0.2.0] - 2025-12-24

### Added

- **Audio Learning**: Integrated native Japanese text-to-speech in Kana Charts, Flashcards, and Quiz views.
- **Toast Notifications**: Implemented a global custom toast system (`ToastContainer`), replacing native browser alerts.
- **Password Reset**: Added full "Forgot Password" flow with email links and a new `UpdatePasswordView`.
- **Account Deletion**: Added secure account deletion with a confirmation modal (`ConfirmationModal`).
- **Profile Route**: Added `/profile` route and updated navigation integration.

### Changed

- **Authentication UI**: Improved `AuthView` with inline error/success messages instead of alerts.
- **Navbar**: Simplified user navigation (icon only) and added direct Profile link.

## [0.1.1] - 2025-12-22

### Added

- **CI/CD**: Added GitHub Action workflow to automate deployment to Infomaniak via FTP.

## [0.1.0] - 2025-12-22

### Added

- **Vocabulaire**: Added vocabulary data with Japanese words, readings, and French meanings.
- **Internationalisation (i18n)**: Translated the entire application to French (Navigation, Home, Study, Quiz, Charts).

### Changed

- **Mobile Responsiveness**: Improved layout on mobile devices for the Header, Home page, Study flashcards, and Quiz view.
- **Home Layout**: Optimized the Home page to fit within the viewport on most screens without scrolling.

### Fixed

- **TypeScript Error**: Fixed a type error in `StudyView.vue` regarding property access on union types.
