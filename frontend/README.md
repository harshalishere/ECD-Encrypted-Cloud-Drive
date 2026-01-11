# 🛡️ ECDDrive - Secure Cloud Storage

ECDDrive is a modern, privacy-focused cloud storage solution that prioritizes user security. Unlike traditional storage providers, ECDDrive employs a **Zero-Knowledge** architecture, meaning files are encrypted on your device *before* they ever touch our servers.

## 🚀 Key Features

* **🔒 Zero-Knowledge Encryption:** Files are encrypted using **AES-256-GCM** in the browser. We cannot see your files even if we wanted to.
* **⚡ High-Performance Uploads:** Supports drag-and-drop uploads with real-time encryption streaming.
* **📂 Smart Organization:** Create folders, organize content, and navigate with breadcrumbs.
* **👁️ Secure Previews:** Decrypt and view images/PDFs in memory without downloading them to disk.
* **📊 Storage Analytics:** Visual breakdown of storage usage by file type.
* **🌑 Dark Mode:** Beautiful, system-synced dark mode UI.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Python FastAPI, SQLAlchemy, PyJWT
* **Storage:** AWS S3 (Encrypted Objects)
* **Database:** SQLite (Dev) / PostgreSQL (Prod)
* **Security:** Web Crypto API (Client-Side), OAuth2 (Auth)

## 📦 Installation

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/yourusername/ECD-Secure-Cloud.git](https://github.com/yourusername/ECD-Secure-Cloud.git)
    cd ECD-Secure-Cloud
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
*Built with ❤️ by [Your Name]*