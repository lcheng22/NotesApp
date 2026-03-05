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
        <SidebarGroupLabel className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {user ? (
                "Your Notes"
            ) : (
                <Link href="/login" className="underline">Login to see notes</Link>
            )}
        </SidebarGroupLabel>
        {user && <SidebarGroupContent notes ={notes} />}
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
