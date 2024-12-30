# HomeWise AI — Goals and Overview

## 1. Project Goals

**HomeWise AI** is a local AI assistant designed to:
- **Run locally** on both Mac and Windows, ensuring privacy by never sending data to the cloud.
- Be **easy to set up** for non-technical users.
- Provide **user-friendly** chat-like interactions.
- Answer **general knowledge** questions offline (no cloud inference).
- Interact with **local documents** (PDF, DOCX, XLSX, etc.) and notes.

## 2. Who Are Our Users?

Our target users are:
- **Non-technical**, potentially older individuals who prefer a straightforward interface without complex setup.
- **Privacy-conscious** people who do not want their data to leave their computer.
- Those who **may not have** the latest hardware (limited RAM, no dedicated GPU).
- Individuals who value a **“just works”** experience over detailed configuration.

### Key User Needs
1. **Minimal Installation**  
   - They don’t want to fuss with complex software dependencies or hardware drivers.
2. **Clear, Simple Interface**  
   - Buttons, prompts, and instructions should use plain language.  
   - Minimal technical jargon.
3. **Private & Offline**  
   - No data uploaded to cloud servers.  
   - Clear statements on how data is stored locally.
4. **Resource-Friendly**  
   - The app should adapt to lower-spec systems where possible.  
   - Provide options for different model sizes or configurations.

## 3. Key Objectives

1. **Ease of Setup**  
   - Straightforward installation on Windows (.exe) and Mac (.dmg/.pkg).  
   - Automatic or guided selection of an appropriate local LLM model based on hardware.

2. **User-Friendliness**  
   - Simple chat-based UI.  
   - Clear labeling and minimal configuration overhead.

3. **Privacy-Focused**  
   - All data stays on the user’s device.  
   - Provide transparent documentation and disclaimers regarding data storage.

4. **Local Document Interaction**  
   - Allow users to upload or select documents/folders (PDF, Word, Excel, Apple iWork, etc.).  
   - Answer queries referencing specific document content.

5. **General Knowledge Q&A**  
   - Support offline question-answering for broad topics without internet reliance.

## 4. Project Scope

- Desktop application for Windows and Mac (packaged via Electron or Tauri).
- Local file ingestion and indexing (PDF, DOCX, XLSX, Apple iWork formats, etc.).
- Single interface for both general knowledge and document-specific Q&A.
- No external server reliance (no remote cloud processing).
