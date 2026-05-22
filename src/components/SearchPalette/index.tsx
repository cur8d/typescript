"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { Modal, ModalDialog, ModalBody, useOverlayState } from "@heroui/react";
import { Search } from "lucide-react";

export function SearchPalette() {
  const state = useOverlayState();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        state.toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [state]);

  return (
    <Modal state={state}>
      <ModalDialog className="p-0 overflow-hidden">
        <ModalBody className="p-0">
          <Command className="flex h-full w-full flex-col overflow-hidden rounded-md bg-background">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
              <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
              <Command.Group heading="Suggestions" className="px-2 py-1 text-xs font-medium text-muted-foreground">
                <Command.Item className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden aria-selected:bg-accent aria-selected:text-accent-foreground">
                  Dashboard
                </Command.Item>
                <Command.Item className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden aria-selected:bg-accent aria-selected:text-accent-foreground">
                  Settings
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </ModalBody>
      </ModalDialog>
    </Modal>
  );
}
