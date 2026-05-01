"use client";

import { Note } from "@prisma/client";
import { SidebarGroupContent as SidebarGrupContentShadCN, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react";
import { Input } from "./input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
import PinNoteButton from "./PinNoteButton";

type Props = {
    notes: Note[];
}

function SidebarGroupContent({ notes }: Props) {
    const [searchText, setSearchText] = useState("");
    const [localNotes, setLocalNotes] = useState(notes);

    useEffect(() => {
        setLocalNotes(notes)
    }, [notes])

    const fuse = useMemo(() => {
        return new Fuse(localNotes, {
            keys: ["text"],
            threshold: 0.4,
        })
    }, [localNotes])

    const filteredNotes = searchText ? fuse.search(searchText).map(r => r.item) : localNotes;

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
    });

    const deleteNoteLocally = (noteId: string) => {
        setLocalNotes((prevNotes) =>
            prevNotes.filter((note) => note.id !== noteId)
        );
    };

    const pinNoteLocally = (noteId: string, isPinned: boolean) => {
        setLocalNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === noteId ? { ...note, isPinned } : note
            )
        );
    };

    return <SidebarGrupContentShadCN>
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-2"/>
            <Input
            className="bg-muted pl-8"
            placeholder="Search your notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
        </div>

        <SidebarMenu className="mt-4">{sortedNotes.map((note) => (
            <SidebarMenuItem key={note.id} className="group/item">
                <SelectNoteButton note={note}/>
                <PinNoteButton
                    noteId={note.id}
                    isPinned={note.isPinned}
                    onPin={pinNoteLocally}
                />
                <DeleteNoteButton noteId={note.id}
                deleteNoteLocally={deleteNoteLocally}/>
            </SidebarMenuItem>
        ))}</SidebarMenu>
    </SidebarGrupContentShadCN>;
}

export default SidebarGroupContent;
