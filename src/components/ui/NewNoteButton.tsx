'use client'

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createNoteAction } from "@/actions/notes";
import { Button } from "./button";

type Props = {
    user: User | null
}

function NewNoteButton({ user }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClickNewNoteButton = async () => {
        if (!user) {
            router.push("/login");
        } else {
            setLoading(true);

            const uuid = uuidv4();
            const { errorMessage } = await createNoteAction(uuid);

            if (errorMessage) {
                toast.error("Error", { description: errorMessage });
            } else {
                router.push(`/?noteId=${uuid}`);
                toast.success("New Note Created", {
                    description: "You have created a new note",
                });
            }

            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClickNewNoteButton}
            variant="secondary"
            className="w-24"
            disabled={loading}
        >
            {loading ? <Loader2 className="animate-spin" /> : "New Note"}
        </Button>
    );
}

export default NewNoteButton;
