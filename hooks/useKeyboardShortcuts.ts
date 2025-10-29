import React from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          event.key.toLowerCase() === s.key.toLowerCase() &&
          !!event.ctrlKey === !!s.ctrlKey &&
          !!event.shiftKey === !!s.shiftKey &&
          !!event.altKey === !!s.altKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};

// Common shortcuts for task management
export const useTaskShortcuts = (actions: {
  createTask: () => void;
  createCategory: () => void;
  openSearch: () => void;
  toggleSidebar: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: "n",
      ctrlKey: true,
      action: actions.createTask,
      description: "Create new task",
    },
    {
      key: "k",
      ctrlKey: true,
      action: actions.openSearch,
      description: "Open search",
    },
    {
      key: "b",
      ctrlKey: true,
      action: actions.toggleSidebar,
      description: "Toggle sidebar",
    },
    {
      key: "c",
      ctrlKey: true,
      shiftKey: true,
      action: actions.createCategory,
      description: "Create new category",
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};
