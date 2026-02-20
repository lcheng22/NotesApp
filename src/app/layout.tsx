import type { Metadata } from "next";
import React from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/Providers/ThemeProvider";
import NoteProvider from "@/Providers/NoteProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/ui/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/AppSiderbar";

export const metadata: Metadata = {
  title: "Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NoteProvider>
                <SidebarProvider>
                <AppSidebar />
                <div className="flex min-h-screen w-full flex-col">
                    <Header />
                    
                    <main className="flex flex-1 flex-col px-4 pt-10 pt-10 xl:px-8">
                        {children}
                        </main>
                        </div>
            </SidebarProvider>
            <Toaster />
            </NoteProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
