import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CodeId = "cgi" | "social" | "hydrocarbures" | "douanier";

type ActiveCodeContextType = {
  activeCode: CodeId;
  setActiveCode: (code: CodeId) => void;
};

const ActiveCodeContext = createContext<ActiveCodeContextType>({
  activeCode: "cgi",
  setActiveCode: () => {},
});

export function ActiveCodeProvider({ children }: { children: ReactNode }) {
  const [activeCode, setActiveCode] = useState<CodeId>("cgi");
  return (
    <ActiveCodeContext.Provider value={{ activeCode, setActiveCode }}>
      {children}
    </ActiveCodeContext.Provider>
  );
}

export function useActiveCode() {
  return useContext(ActiveCodeContext);
}
