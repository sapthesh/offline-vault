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

<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/security-AES--GCM_%26_PBKDF2-brightgreen?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/mode-100%25_Offline-orange?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/platform-Browser-yellow?style=for-the-badge">
</p>
<p align="center">
  <strong>A radically secure, 100% offline, browser-based password manager.</strong>
  <br />
  Your data is your own. Keep it that way.
  <p align="center" style="font-weight:bold"> A completely offline, self-hosted password manager that securely stores your sensitive information directly in your browser. All data is encrypted with your master password and never leaves your device.</p>
</p>

---
In a world where every service lives in the cloud, **Offline Vault** takes a different approach. It's a password manager built on the principle of absolute data sovereignty. Your sensitive information is encrypted with military-grade algorithms and stored *exclusively* in your browser's secure local storage. **No servers, no cloud, no accounts, no tracking. Ever.**

## 💎 Core Philosophy

-   🔐 **Absolute Privacy**: Your data never leaves your device. Period. We have no servers to hack, no logs to leak, and no way to access your information, even if we wanted to.
-   💪 **Unyielding Security**: We leverage the browser's native, battle-tested Web Crypto API for all cryptographic operations. No compromises.
-   🕊️ **Simplicity & Control**: No accounts to create, no subscriptions to manage. You are in complete control of your data, with simple tools to manage and back it up.
-   🌐 **Ultimate Portability**: Runs in any modern web browser. Use it on any OS without installation.

---

## ✨ Features

#### Uncompromising Security & Privacy
-   🔒 **End-to-End Encryption**: Utilizes the browser's native Web Crypto API to perform **AES-GCM 256-bit** encryption. Your data is encrypted at rest and never leaves your device.
-   🔑 **Robust Key Derivation**: Your master password is strengthened using **PBKDF2 with 100,000 iterations** and a unique salt, making brute-force attacks computationally infeasible.
-   ⚠️ **Critical Security Confirmations**: Explicit warnings and confirmations before critical actions like creating a vault or exporting unencrypted data, ensuring you understand the risks.
-   ⏲️ **Configurable Auto-Lock**: Automatically lock your vault after a period of inactivity (from 1 minute to never) to protect against unauthorized physical access.
-   ⚡ **Strong Password Generator**: Create cryptographically secure, random passwords with customizable length and character sets (uppercase, numbers, symbols).
-   📊 **Real-time Strength Meter**: A visual password strength meter provides instant feedback as you type, helping you create stronger passwords.

#### Effortless Organization & Management
-   🗂️ **Full Category Management**: Create, edit, and delete custom, color-coded categories to organize your entries visually.
-   📝 **Detailed Entries**: Store a service name, username, password, and detailed notes. The app automatically fetches the website's **favicon** for quick identification.
-   🔍 **Powerful Filtering & Sorting**: Instantly find entries with live search. Sort by service name, username, or last modified date, and filter by any category.
-   💾 **Flexible Data Management**: Easily import and export your entire vault as a JSON file. Choose to **merge** with your existing data or **replace** it completely.

#### Modern & Dynamic User Experience
-   🎨 **Stunning "Illumina" UI**: A beautiful, modern interface featuring dynamic, animated backgrounds and interactive panels with a subtle glowing border effect on hover.
-   ✨ **Subtle Animations**: List items gracefully fade and slide into view, creating a fluid and responsive feel as you navigate your vault.
-   🌈 **Rich Theming Engine**: Personalize your vault with over a dozen professionally designed themes. **Live-preview** themes by simply hovering over them in the settings.
-   🌗 **Light & Dark Modes**: Seamlessly switch between light and dark modes to suit your preference and environment.
-   📱 **Fully Responsive**: Enjoy a flawless experience on any device, from a large desktop monitor to your mobile phone.
-   🚀 **Zero Installation**: No build steps, no dependencies. Just open `index.html` in your browser to get started instantly.

---

## 🔐 How It Works: The Security Deep Dive

Your security is not just a feature; it's the foundation of Offline Vault. Here’s a step-by-step look at how your data is protected:

1.  **You Enter Your Master Password**: This password is the *only* key to your vault. It is **never** stored or transmitted.
2.  **Derive the Master Key**: Your password is combined with a unique, randomly generated **salt** and fed into the **PBKDF2** algorithm. After 100,000 rounds of hashing, a powerful 256-bit encryption key is derived. This process is slow by design, thwarting brute-force attacks.
3.  **Encrypt the Vault**: All your data—every entry, note, and category—is converted into a single block of text and then encrypted using **AES-GCM** with the derived key. AES-GCM is an industry standard that ensures both confidentiality (it can't be read) and integrity (it can't be tampered with).
4.  **Store Locally**: The final encrypted data blob, along with the public salt and IV (Initialization Vector), is saved securely in your browser's **localStorage**. This database is sandboxed, meaning other websites cannot access it.
5.  **Unlocking**: When you unlock the vault, the process reverses. The same Master Key is derived from your password and the stored salt, which is then used to decrypt the data blob. **If the password is wrong, decryption fails, and your data remains gibberish.**

> ### ⚠️ A Crucial Warning
> Because of this zero-knowledge design, your Master Password is **NOT RECOVERABLE**. We have no way to reset it. If you forget it, you will lose access to your data forever.
>
> **Please write it down and store it in a secure, physical location.**

---

## 🚀 Getting Started

1.  **Clone or Download**: Get the project files onto your local machine.
2.  **Open in Browser**: Open the `index.html` file in a modern web browser (Chrome, Firefox, Safari, Edge, etc.).
3.  **Create Your Vault**: On your first visit, you will be prompted to create a strong, memorable master password. Read our security best practices to help you create a great one.
4.  **Start Adding Entries**: Click "Add Entry" and begin securing your digital life.
5.  **Lock Up**: When you're done, click the "Lock Vault" button. Your data is now encrypted and safe.

## 💾 Data Management: Import & Export

You are in full control of your data.
-   **Export**: Create a backup of your vault at any time from the Settings menu. This will download a JSON file containing all your entries.
-   **Import**: Restore from a backup or migrate from another manager by importing a JSON file. You have the option to **merge** the imported entries with your current vault or to **replace** your entire existing vault.

> **Security Note**: The exported JSON file is **unencrypted**. Please handle it with extreme care and store it in a secure location, like an encrypted USB drive.

---

## 🛠️ Tech Stack

-   **Framework**: React (with Hooks & Context API)
-   **Language**: TypeScript
-   **Cryptography**: Native Web Crypto API
-   **Local Storage**: Browser `localStorage`
-   **Styling**: Advanced CSS with Custom Properties (Variables) for a highly themeable and dynamic UI.

---

## 📄 License

This project is licensed under the MIT License.
