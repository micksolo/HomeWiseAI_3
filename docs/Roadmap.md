DOCUMENT 1: PROJECT ROADMAP & REQUIREMENTS (roadmap.txt)\
HomeWise AI - Project Roadmap & Requirements

For more information about the project's goals, please see the [Goals document](Goals.md).\n\nOVERVIEW: HomeWise AI is a privacy-focused, locally-run AI assistant
that helps users:

- Summarize documents

- Perform Q&A on imported texts

- Manage personal notes

- Provide guided workflows for common personal tasks

- Offer optional local and remote network access\
  This roadmap outlines key milestones, features, and priorities to
  guide the development process.\
  HIGH-LEVEL GOALS:

1.  PRIVACY & OFFLINE OPERATION: All computations run locally, no cloud
    dependencies.

2.  EASE OF USE: A simple GUI, straightforward installation, and minimal
    technical configuration.

3.  FLEXIBLE LLM SUPPORT: Multiple model sizes for different hardware
    capabilities.

4.  NETWORK ACCESS (FUTURE ENHANCEMENT): Secure local network and
    optional remote access setup.\
    PHASED MILESTONES:\
    PHASE 1: CORE MVP

- Core Features: Document ingestion, Q&A, basic summarization

- Local Notes & Tagging: Simple note storage and search

- Single LLM Support (7B model) for CPU inference

- Basic UI: Desktop app with minimal settings

- Offline Operation & Privacy: No external calls\
  PHASE 2: ENHANCED FEATURE SET

<!-- -->

- Multiple LLM Options: Allow user to select model size and switch

- Improved Summarization & Q&A Accuracy: Better indexing, embeddings

- Guided Workflows: Templates for letters, event outlines, etc.

- UI Improvements: Onboarding tutorial, help section, tooltips\
  PHASE 3: NETWORK ACCESS

<!-- -->

- LAN Access: Secure local web interface (HTTPS, password)

- Remote Access Wizard: Secure tunneling or guided port forwarding

- Device Discovery: mDNS/Bonjour, QR code scanning\
  PHASE 4: ADVANCED CUSTOMIZATIONS & UPDATES

<!-- -->

- Offline Updates: Easy model and feature upgrades

- Security Enhancements: Optional 2FA, password policies

- Additional File Format Support: Spreadsheets, presentations

- Possible Voice Interaction: Voice input/output\
  REQUIREMENTS SUMMARY: Functional Requirements:

<!-- -->

- Document ingestion and indexing

- Q&A, summarization

- Notes management and search

- Guided workflows

- Model selection and switching

- LAN and optional remote access\
  Non-Functional Requirements:

<!-- -->

- Privacy: 100% local processing, no forced cloud

- Usability: Non-technical friendly UI

- Performance: Under \~10 seconds latency for responses

- Security: TLS encryption for network access, optional password lock\
  Hardware Requirements:

<!-- -->

- Minimum: CPU-only inference with quantized 7B model

- Recommended: More RAM and/or GPU for larger models and faster
  responses
