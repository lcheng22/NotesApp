import Link from "next/link";
import { Note } from "@prisma/client";
import { getUser } from "@/auth/server";
import { prisma } from "@/components/db/prisma";
import SidebarGroupContent from "@/components/ui/SidebarGroupContent";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

async function AppSidebar() {
  const user = await getUser();

  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
                "Your Notes"
            ) : (
                <p>
                    <Link href="/login" className="underline">
                        Login
                    </Link>{" "}
                </p>
            )}
        </SidebarGroupLabel>
        {user && <SidebarGroupContent notes ={notes} />}
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
