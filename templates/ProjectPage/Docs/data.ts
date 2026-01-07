import { Document, DocumentTemplate } from "./types";

export const documentTemplates: DocumentTemplate[] = [
    {
        type: "architecture",
        title: "Architecture",
        icon: "cube",
        description: "Document your system architecture and components",
        defaultContent: `# Architecture Overview

## System Components

### Frontend
- 

### Backend
- 

### Database
- 

## Key Decisions

### Decision 1
**Context:** 
**Decision:** 
**Rationale:** 
`,
    },
    {
        type: "getting-started",
        title: "Getting Started",
        icon: "bulb",
        description: "Onboarding guide for new team members",
        defaultContent: `# Getting Started

## Prerequisites
- 

## Installation
\`\`\`bash
# Clone the repository

# Install dependencies

# Start development server
\`\`\`

## Environment Setup
1. 
2. 
3. 

## Common Commands
| Command | Description |
|---------|-------------|
| | |
`,
    },
    {
        type: "decisions",
        title: "Decision Log",
        icon: "edit-list",
        description: "Track important project decisions",
        defaultContent: `# Decision Log

## How to Use
Record important decisions with context, options considered, and rationale.

---

## [Date] - Decision Title

**Status:** Accepted / Proposed / Deprecated

**Context:**
What is the issue that we're seeing that is motivating this decision?

**Options Considered:**
1. Option A
2. Option B

**Decision:**
What is the change that we're proposing and/or doing?

**Consequences:**
What becomes easier or more difficult to do because of this change?
`,
    },
    {
        type: "api-reference",
        title: "API Reference",
        icon: "code",
        description: "Document API endpoints and schemas",
        defaultContent: `# API Reference

## Base URL
\`https://api.example.com/v1\`

## Authentication
All requests require an API key in the header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### GET /resource
**Description:** 

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| | | | |

**Response:**
\`\`\`json
{
  
}
\`\`\`
`,
    },
    {
        type: "changelog",
        title: "Changelog",
        icon: "clock",
        description: "Track project changes over time",
        defaultContent: `# Changelog

All notable changes to this project will be documented here.

## [Unreleased]
### Added
- 

### Changed
- 

### Fixed
- 

---

## [1.0.0] - YYYY-MM-DD
### Added
- Initial release
`,
    },
    {
        type: "roadmap",
        title: "Roadmap",
        icon: "post",
        description: "Plan future features and milestones",
        defaultContent: `# Product Roadmap

## Q1 2025
### Goals
- [ ] 
- [ ] 

### Features
| Feature | Priority | Status |
|---------|----------|--------|
| | High | Planned |

## Q2 2025
### Goals
- [ ] 
- [ ] 

## Future Considerations
- 
`,
    },
    {
        type: "troubleshooting",
        title: "Troubleshooting",
        icon: "question-circle",
        description: "Common issues and solutions",
        defaultContent: `# Troubleshooting Guide

## Common Issues

### Issue: [Problem Description]
**Symptoms:**
- 

**Cause:**


**Solution:**
\`\`\`bash

\`\`\`

---

### Issue: [Another Problem]
**Symptoms:**
- 

**Cause:**


**Solution:**

`,
    },
    {
        type: "meeting-notes",
        title: "Meeting Notes",
        icon: "users",
        description: "Record team meeting summaries",
        defaultContent: `# Meeting Notes

## [Date] - Meeting Title

**Attendees:** 

**Duration:** 

### Agenda
1. 
2. 
3. 

### Discussion Points


### Action Items
- [ ] @person - Task description (Due: )
- [ ] @person - Task description (Due: )

### Next Meeting
- Date: 
- Topics: 
`,
    },
    {
        type: "environment",
        title: "Environment Setup",
        icon: "gear",
        description: "Development environment configuration",
        defaultContent: `# Environment Setup

## Required Tools
- Node.js v18+
- 

## Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| \`DATABASE_URL\` | | Yes |
| \`API_KEY\` | | Yes |

## Local Development
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Fill in your values
\`\`\`

## Staging Environment


## Production Environment

`,
    },
    {
        type: "notes",
        title: "Free-form Notes",
        icon: "edit",
        description: "Quick notes and scratch pad",
        defaultContent: `# Notes

`,
    },
];

export const initialDocs: Document[] = [
    {
        id: "doc-1",
        title: "Architecture Notes",
        icon: "cube",
        type: "architecture",
        content: `# Architecture Notes

## Overview
This project uses a modern serverless architecture with the following components:

- **Frontend**: Next.js 14 with App Router
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk
- **Payments**: Stripe

## Key Decisions

### Why Supabase?
We chose Supabase for its real-time capabilities and excellent developer experience.

### Why Clerk?
Clerk provides a complete auth solution with minimal setup required.
`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "doc-2",
        title: "Getting Started",
        icon: "bulb",
        type: "getting-started",
        content: `# Getting Started

## Prerequisites
- Node.js 18+
- npm or yarn

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "doc-3",
        title: "Decision Log",
        icon: "edit-list",
        type: "decisions",
        content: `# Decision Log

## 2024-01-15 - Database Selection

**Status:** Accepted

**Context:** Need a database solution for the project.

**Decision:** Use Supabase PostgreSQL

**Rationale:** Real-time capabilities, excellent DX, generous free tier.
`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "doc-4",
        title: "Free-form Notes",
        icon: "edit",
        type: "notes",
        content: `# Notes

- Remember to update API keys before launch
- Check performance metrics weekly
`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const commonEmojis = [
    "📝", "📋", "📄", "📑", "📊", "📈", "📉", "📁",
    "💡", "🎯", "🚀", "⚡", "🔧", "⚙️", "🛠️", "🔨",
    "✅", "❌", "⚠️", "💬", "📌", "🔖", "📎", "🗂️",
    "🎨", "🖼️", "🔍", "🔎", "💻", "🖥️", "📱", "🌐",
    "🔐", "🔑", "🛡️", "📦", "🗃️", "📚", "📖", "✨",
];
