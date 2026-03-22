import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Protection anti-copie pour le web.
 * Bloque : clic droit, Ctrl+C/Ctrl+A, sélection de texte, drag & drop.
 * Ne s'active que sur le web (pas de sens sur mobile natif où selectable={false} suffit).
 */
export function useAntiCopy() {
  useEffect(() => {
    if (Platform.OS !== "web") return;

    // Bloquer le clic droit
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Bloquer Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P, F12
    const blockKeyboard = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "a", "s", "p", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    // Bloquer drag
    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // Bloquer la sélection de texte
    const blockSelect = (e: Event) => {
      e.preventDefault();
    };

    // CSS anti-sélection
    const style = document.createElement("style");
    style.id = "anti-copy-style";
    style.textContent = `
      .article-content, .chapter-reader {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeyboard);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("selectstart", blockSelect);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeyboard);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("selectstart", blockSelect);
      const el = document.getElementById("anti-copy-style");
      if (el) el.remove();
    };
  }, []);
}
