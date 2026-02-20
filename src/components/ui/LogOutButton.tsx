"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { logOutAction } from "@/actions/users";
import { Button } from './button';

function LogOutButton() {
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleLogOut = async () => {
        setLoading(true);
        const { errorMessage } = await logOutAction();

        if (!errorMessage) {
            toast.success("Logged out", {
                description: "You have been successfully logged out",
            });
            router.push("/");
        } else {
            toast.error("Error", {
                description: errorMessage,
            })
        }
        setLoading(false);
    };
    
    return (
        <Button
            variant="outline"
            onClick={handleLogOut}
            disabled={loading}
            className="w-24"
        >
            {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
        </Button>
    );
}

export default LogOutButton;