'use client'

import { createContext, useState } from "react";

type NoteProviderContextType = {
    noteText: string;
    setNoteText: (noteText: string) => void;
    noteTitle: string;
    setNoteTitle: (noteTitle: string) => void;
}

export const NoteProviderContext = createContext<NoteProviderContextType>({
    noteText: "",
    setNoteText: () => {},
    noteTitle: "",
    setNoteTitle: () => {},
})

function NoteProvider({ children }: { children: React.ReactNode }) {
    const [noteText, setNoteText] = useState("")
    const [noteTitle, setNoteTitle] = useState("")

    return (
        <NoteProviderContext.Provider value={{ noteText, setNoteText, noteTitle, setNoteTitle }}>
            {children}
        </NoteProviderContext.Provider>
    )
}

export default NoteProvider;
