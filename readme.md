# 📘 BRACU Connect Attendance Entry Helper

A lightweight Chrome extension that enhances the BRACU Connect attendance entry page with a keyboard-friendly interface, student cards, and reporting features to streamline the attendance-taking process.

---

## ✨ Features

- 🔍 **Visual Student Cards** — See one student at a time in a clean, distraction-free card layout.
- ⌨️ **Keyboard Shortcuts** — Use `→` (right arrow) to mark **Present**, `←` (left arrow) to mark **Absent**.
- 🧾 **Copy Full Attendance Report** — Export all attendance data in a clean, tab-separated format.
- 🔁 **Reset Button** — Instantly reset attendance for all students.
- 📋 **Absent Report View** — Automatically highlights and lists absent students after the last student is marked.
- 🎯 **Dynamic Re-rendering** — Rebuilds the panel if class or section is changed without refreshing.
- 🚨 **Page Awareness** — Panel appears only on the official attendance entry page and cleans up if you navigate away.
- 👨‍💻 **Created by** Md. Khaliduzzaman Khan Samrat

---

## 📦 Installation Guide

1. **Download the Extension Files**
    - Make sure you have the following files in a folder (e.g., `bracu-attendance-helper`):
        ```
        bracu-attendance-helper/
        ├── manifest.json
        ├── content.js
        └── icon.png (48x48 PNG icon)
        ```

2. **Enable Developer Mode in Chrome**
    - Go to `chrome://extensions/`
    - Toggle **Developer Mode** (top right)

3. **Load the Extension**
    - Click **"Load unpacked"**
    - Select the folder you saved the files in (e.g., `bracu-attendance-helper`)

4. **You're all set!**
    - Now visit: `https://connect.bracu.ac.bd/app/exam-controller/attendance/entry`
    - You’ll see the **BRACU Attendance Helper** panel appear.

---

## 🧠 Usage Guide

### 📌 Step 1: Open Attendance Page
Visit:  
`https://connect.bracu.ac.bd/app/exam-controller/attendance/entry`

### ▶️ Step 2: Click “Start Attendance”
This will extract the student list and show one student per card.

### ⌨️ Step 3: Mark Students with Keyboard
- `→` → Mark Present  
- `←` → Mark Absent  

Or click the respective buttons.

### 📋 Step 4: Export or Reset
- Click **“Copy Full Report”** to copy the report with IDs, names, and statuses.
- Click **“Reset”** to clear all entries and start over.

---

## 🛑 Auto Clean-Up

If you navigate to any page **outside** the attendance entry path, the panel is automatically removed and the layout is restored — no reload needed.

---

## 🔒 Privacy

This extension:
- **Does not collect or store** any personal data.
- **Does not send** any information to external servers.
- Only works on the official BRACU Connect attendance page (`connect.bracu.ac.bd`) and stays entirely **client-side**.

All processing is done in your browser and nothing leaves your machine.

---

Built by  
**Md. Khaliduzzaman Khan Samrat - KKS**
