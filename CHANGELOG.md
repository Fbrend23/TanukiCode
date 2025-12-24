# Changelog

## [0.2.0] - 2025-12-24

### Added

- **Audio Learning**: Integrated native Japanese text-to-speech in Kana Charts, Flashcards, and Quiz views.
- **Legal & Privacy**: Added `LegalView` with Terms of Service and Privacy Policy, GDPR/nLPD compliant.
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
