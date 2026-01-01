# Changelog

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
