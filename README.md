
<div align="center">
  <h1>✨ Offline Vault ✨</h1>
  <h2>A Secure, Browser-Based Password Manager</h2>
</div>

<div align="center">
    
  <!-- Dynamic Badges -->
  <a href="https://github.com/sapthesh/offline-vault/stargazers">
    <img src="https://img.shields.io/github/stars/sapthesh/offline-vault?style=for-the-badge&logo=github&color=b491ff&logoColor=white" alt="Stars">
  </a>
  <a href="https://github.com/sapthesh/offline-vault/network/members">
    <img src="https://img.shields.io/github/forks/sapthesh/offline-vault?style=for-the-badge&logo=github&color=89c4f4&logoColor=white" alt="Forks">
  </a>
  <img src="https://img.shields.io/github/repo-size/sapthesh/offline-vault?style=for-the-badge&logo=github&color=ff69b4&logoColor=white" alt="Repo Size">
  <img src="https://img.shields.io/github/last-commit/sapthesh/offline-vault?style=for-the-badge&logo=github&color=f4d03f&logoColor=white" alt="Last Commit">
  <a href="https://hits.sh/github.com/sapthesh/offline-vaulta/"><img alt="Hits" src="https://hits.sh/github.com/sapthesh/offline-vault.svg?style=for-the-badge"/></a>
  <a href="https://hits.sh/github.com/sapthesh/offline-vault/"><img alt="Hits" src="https://hits.sh/github.com/sapthesh/offline-vault.svg?view=today-total&style=for-the-badge&color=fe7d37"/></a>
</div>

**A completely offline, self-hosted password manager that securely stores your sensitive information directly in your browser. All data is encrypted with your master password and never leaves your device.**

---

## ✨ Key Features

-   **100% Offline First**: Your data is stored exclusively in your browser's local database (IndexedDB). It is never sent to any server, ensuring complete privacy.
-   **Strong, Modern Encryption**: Utilizes the robust Web Crypto API with **AES-GCM** for data encryption and **PBKDF2 with 100,000 iterations** for master key derivation, providing top-tier security.
-   **Full-Featured Vault Management**:
    -   Add, edit, and delete password entries with ease.
    -   Store extra information like security questions or recovery codes in a dedicated **Notes** field.
    -   Organize your vault with **customizable categories**.
-   **Powerful Tools & Utilities**:
    -   **Secure Password Generator**: Create strong, random passwords with customizable length and character sets (uppercase, numbers, symbols).
    -   **Password Strength Meter**: Get real-time visual feedback on the strength of your passwords as you type.
-   **Intuitive User Experience**:
    -   Quickly search, sort (by service, username, or date), and filter entries by category.
    -   **Automatic Favicon Fetching** to visually identify your accounts.
-   **Customizable Appearance**:
    -   Choose between **Light and Dark** modes.
    -   Personalize the interface with over a dozen beautiful **color themes**.
-   **Data Portability**: Easily **import and export** your vault data as an (unencrypted) JSON file for backup and migration purposes.
-   **Responsive Design**: A clean, modern UI that works seamlessly across desktops, tablets, and mobile devices.
-   **Zero Dependencies**: Runs directly in any modern web browser without requiring a build step, server, or internet connection.

---

## 🔐 Security Model

Security is the cornerstone of Offline Vault. The entire architecture is designed to be a zero-knowledge system where only you can access your data.

1.  **The Master Password is Key**: Your master password is the *only* key to your vault. It is never stored. When you enter it, it's used to derive an encryption key in memory.
2.  **Key Derivation (PBKDF2)**: We use the industry-standard PBKDF2 algorithm with a unique salt and 100,000 iterations to turn your master password into a powerful 256-bit encryption key. This makes brute-force attacks extremely difficult and time-consuming.
3.  **Data Encryption (AES-GCM)**: All your vault data (entries, categories, notes) is encrypted using AES-GCM, an authenticated encryption mode that provides both confidentiality and integrity, protecting against tampering. A new, cryptographically secure Initialization Vector (IV) is generated for every save operation.
4.  **Local Storage (IndexedDB)**: The final encrypted data blob, along with its salt and IV, is stored in your browser's secure IndexedDB. This is a robust, sandboxed database that is isolated from other websites.
5.  **No Network Communication**: The application code contains no network requests for saving, loading, or processing your vault data. Everything happens locally on your machine.

> **Important**: Because we never store your master password, it is **not recoverable**. If you forget your master password, your data cannot be decrypted. Please store it somewhere safe.

---

## 🚀 Getting Started

Using Offline Vault is simple.

1.  **Open the Application**: Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, Safari, or Edge).
2.  **Create Your Vault**: On your first visit, you'll be prompted to create a strong, memorable master password.
3.  **Add Your First Entry**: Click the "Add Entry" button to save your first password.
4.  **Lock the Vault**: When you're finished, click the "Lock Vault" button to secure your data. The next time you visit, you will only need your master password to unlock it.

---

## 🛠️ Tech Stack

-   **Frontend**: React (with Hooks)
-   **Language**: TypeScript
-   **Cryptography**: Web Crypto API (the browser's native, secure crypto engine)
-   **Storage**: IndexedDB
-   **Styling**: Inline CSS-in-JS using Material Design 3 color variables for a modern, themeable UI.
-   **Build**: No build step required! This project is set up to run directly from the source files using ES Modules and import maps.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
