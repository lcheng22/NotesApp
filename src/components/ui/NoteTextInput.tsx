'use client'

import { ChangeEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { updateNoteAction } from "@/actions/users";
import { debounceTimeout } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { Textarea } from "./textarea";

type Props = {
    noteId: string | undefined;
    startingNoteText: string;
}

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
    const noteIdParam = useSearchParams().get("noteId") || "";
    const { noteText, setNoteText } = useNote();

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

    return (
        <Textarea
            value={noteText}
            onChange={handleUpdateNote}
            placeholder="Start writing..."
            className="custom-scrollbar mb-4 h-full max-w-4xl resize-none rounded-xl border bg-card p-6 text-base leading-relaxed shadow-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
        />
    );
}

export default NoteTextInput;
