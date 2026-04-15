'use client'

import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { updateNoteAction } from "@/actions/users";
import { debounceTimeout } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { Textarea } from "./textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./button";

type Props = {
    noteId: string | undefined;
    startingNoteText: string;
}

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
    const noteIdParam = useSearchParams().get("noteId") || "";
    const { noteText, setNoteText } = useNote();
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (noteIdParam === noteId) {
            setNoteText(startingNoteText);
        }
    }, [noteIdParam, noteId, setNoteText, startingNoteText]);

    const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNoteText(text);

        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updateNoteAction(noteId, text);
        }, debounceTimeout);
    };

    const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
    const charCount = noteText.length;

    return (
        <div className="flex h-full w-full max-w-4xl flex-col gap-1">
            <div className="flex justify-end gap-1">
                <Button
                    size="sm"
                    variant={isPreview ? "ghost" : "secondary"}
                    onClick={() => setIsPreview(false)}
                    className="h-7 text-xs"
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant={isPreview ? "secondary" : "ghost"}
                    onClick={() => setIsPreview(true)}
                    className="h-7 text-xs"
                >
                    Preview
                </Button>
            </div>

            {isPreview ? (
                <div className="custom-scrollbar prose prose-neutral dark:prose-invert h-full max-w-none overflow-y-auto rounded-xl border bg-card p-6 text-base shadow-sm">
                    {noteText ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {noteText}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-muted-foreground/50">Nothing to preview</p>
                    )}
                </div>
            ) : (
                <Textarea
                    value={noteText}
                    onChange={handleUpdateNote}
                    placeholder="Start writing... (supports markdown)"
                    className="custom-scrollbar h-full resize-none rounded-xl border bg-card p-6 font-mono text-base leading-relaxed shadow-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
            )}

            <p className="mb-4 text-right text-xs text-muted-foreground">
                {wordCount} {wordCount === 1 ? "word" : "words"} · {charCount} {charCount === 1 ? "character" : "characters"}
            </p>
        </div>
    );
}

export default NoteTextInput;
