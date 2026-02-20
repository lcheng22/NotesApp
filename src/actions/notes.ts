'use server'

import { getUser } from "@/auth/server";
import { prisma } from "@/components/db/prisma";
import { handleError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("You must be logged in to create a note");

        await prisma.note.create({
            data: {
                id: noteId,
                authorId: user.id,
                text: "",
            }
        });

        revalidatePath("/", "layout");
        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const updateNoteAction = async (noteId: string, text: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("You must be logged in to update a note");

        await prisma.note.update({
            where: { id: noteId },
            data: { text },
        });

        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const deleteNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();

        if (!user) throw new Error("You must be logged in to delete a note");

        await prisma.note.delete({
            where: { id: noteId, authorId: user.id },
        });

        revalidatePath("/", "layout");
        return { errorMessage: null };
    } catch (error) {
        return handleError(error);
    }
}

export const askAIAboutNotesAction = async (newQuestions: string[], responses: string[]): Promise<string> => {
    try {
        const user = await getUser();

        if (!user) throw new Error("You must be logged in to ask a question");

        const notes = await prisma.note.findMany({
            where: { authorId: user.id },
            orderBy: { updatedAt: "desc" },
        });

        const notesText = notes.map((note) => note.text).join("\n\n");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

        const history = [
            {
                role: "user",
                parts: [{ text: `You are a helpful assistant that answers questions about the user's notes. Here are all their notes:\n\n${notesText}` }],
            },
            {
                role: "model",
                parts: [{ text: "I have read your notes and am ready to answer questions about them." }],
            },
            ...responses.flatMap((response, i) => [
                { role: "user", parts: [{ text: newQuestions[i] }] },
                { role: "model", parts: [{ text: response }] },
            ]),
        ];

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(newQuestions[newQuestions.length - 1]);

        return result.response.text();
    } catch (error) {
        const { errorMessage } = handleError(error);
        return errorMessage ?? "An error occurred";
    }
}

