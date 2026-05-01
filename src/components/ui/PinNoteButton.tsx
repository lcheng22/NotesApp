'use client'

import { Button } from "./button";
import { Pin, PinOff } from "lucide-react";
import { useTransition } from "react";
import { pinNoteAction } from "@/actions/notes";
import { toast } from "sonner";

type Props = {
    noteId: string;
    isPinned: boolean;
    onPin: (noteId: string, isPinned: boolean) => void;
}

function PinNoteButton({ noteId, isPinned, onPin }: Props) {
    const [isPending, startTransition] = useTransition();

    const handlePin = () => {
        startTransition(async () => {
            const { errorMessage } = await pinNoteAction(noteId, !isPinned);

            if (!errorMessage) {
                onPin(noteId, !isPinned);
                toast.success(isPinned ? "Note unpinned" : "Note pinned");
            } else {
                toast.error("Error", { description: errorMessage });
            }
        });
    };

    return (
        <Button
            className={`absolute right-9 top-1/2 -translate-y-1/2 size-7 p-0 [&_svg]:size-3 ${isPinned ? "opacity-100 text-primary" : "opacity-0 group-hover/item:opacity-100"}`}
            variant="ghost"
            onClick={handlePin}
            disabled={isPending}
        >
            {isPinned ? <PinOff /> : <Pin />}
        </Button>
    );
}

export default PinNoteButton;
