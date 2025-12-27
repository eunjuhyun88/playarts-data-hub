import { createContext, useContext, useState, ReactNode } from "react";

export type DataItem = {
  id: number;
  type: "code" | "prompt";
  title: string;
  content: string;
  lang: string;
  time: string;
  source: string;
  tokens: number;
  hash: string;
};

type DataSelectionContextType = {
  selectedItems: DataItem[];
  addItem: (item: DataItem) => void;
  removeItem: (id: number) => void;
  clearSelection: () => void;
  isSelected: (id: number) => boolean;
  toggleSelection: (item: DataItem) => void;
};

const DataSelectionContext = createContext<DataSelectionContextType | undefined>(undefined);

export const DataSelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItems, setSelectedItems] = useState<DataItem[]>([]);

  const addItem = (item: DataItem) => {
    setSelectedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isSelected = (id: number) => {
    return selectedItems.some((item) => item.id === id);
  };

  const toggleSelection = (item: DataItem) => {
    if (isSelected(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <DataSelectionContext.Provider
      value={{ selectedItems, addItem, removeItem, clearSelection, isSelected, toggleSelection }}
    >
      {children}
    </DataSelectionContext.Provider>
  );
};

export const useDataSelection = () => {
  const context = useContext(DataSelectionContext);
  if (!context) {
    throw new Error("useDataSelection must be used within DataSelectionProvider");
  }
  return context;
};
