"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

type Props = {
    projectId: string;
};

const Docs = ({ projectId }: Props) => {
    const [activeDoc, setActiveDoc] = useState("architecture");
    const [content, setContent] = useState(`# Architecture Notes

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
`);

    const docs = [
        { id: "architecture", title: "Architecture Notes", icon: "cube" },
        { id: "getting-started", title: "Getting Started", icon: "bulb" },
        { id: "decisions", title: "Decision Log", icon: "edit-list" },
        { id: "notes", title: "Free-form Notes", icon: "edit" },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3">Docs & Notes</h2>
                <Button isSecondary>
                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                    New Document
                </Button>
            </div>

            <div className="flex gap-6 max-md:flex-col">
                <div className="w-48 shrink-0 max-md:w-full">
                    <div className="space-y-1">
                        {docs.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => setActiveDoc(doc.id)}
                                className={`flex items-center w-full px-3 py-2 rounded-xl text-left text-small transition-all ${
                                    activeDoc === doc.id
                                        ? "bg-b-surface2 text-t-primary fill-t-primary"
                                        : "text-t-secondary fill-t-secondary hover:bg-b-surface2"
                                }`}
                            >
                                <Icon className="mr-2 !w-4 !h-4" name={doc.icon} />
                                {doc.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-6 rounded-4xl bg-b-surface2">
                    <textarea
                        className="w-full h-96 bg-transparent text-body text-t-primary resize-none focus:outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing..."
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-stroke-subtle">
                        <span className="text-xs text-t-tertiary">Markdown supported</span>
                        <span className="text-xs text-t-tertiary">Auto-saved</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;
