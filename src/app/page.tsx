import { getUser } from "@/auth/server";
import { prisma } from "@/components/db/prisma";
import AskAIButton from "@/components/ui/AskAIButton";
import NewNoteButton from "@/components/ui/NewNoteButton";
import NoteTextInput from "@/components/ui/NoteTextInput";

type Props = {
    searchParams: Promise<{[key: string]: string | string[] | undefined }>;
}
async function HomePage({searchParams}: Props) {
    const noteIdParam = (await searchParams).noteId
    const user = await getUser();
    const noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam;

    const note = noteId && user ? await prisma.note.findUnique({
        where: { id: noteId, authorId: user.id },
    }) : null;

    return (
    
    <div className="flex h-full flex-col items-center gap-3">
        <div className="flex w-full max-w-4xl items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
                {note ? "Editing note" : "Select or create a note"}
            </p>
            <div className="flex gap-2">
                <AskAIButton user={user} />
                <NewNoteButton user={user} />
            </div>
        </div>
        <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
    );
}

export default HomePage;