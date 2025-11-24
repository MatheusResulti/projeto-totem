import { useEffect, useMemo, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type Props = {
  visible: boolean;
  activeElement: HTMLInputElement | HTMLTextAreaElement | null;
  onHeightChange?: (height: number) => void;
  mode?: "alpha" | "numeric";
  onClose?: () => void;
};

const ACCENT_KEYS = ["á", "à", "â", "ã", "é", "ê", "í", "ó", "ô", "õ", "ú"];

export function VirtualKeyboard({
  visible,
  activeElement,
  onHeightChange,
  mode = "alpha",
  onClose,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const keyboardRef = useRef<any>(null);
  const [layoutName, setLayoutName] = useState<
    "default" | "shift" | "accent" | "numeric"
  >("default");
  const [input, setInput] = useState("");

  useEffect(() => {
    setLayoutName(mode === "numeric" ? "numeric" : "default");
  }, [mode]);

  useEffect(() => {
    if (activeElement) {
      setInput(activeElement.value);
      keyboardRef.current?.setInput?.(activeElement.value);
    }
  }, [activeElement]);

  const layout = useMemo(
    () => ({
      default: [
        "1 2 3 4 5 6 7 8 9 0",
        "q w e r t y u i o p",
        "a s d f g h j k l ç",
        "{shift} z x c v b n m {bksp}",
        "{acentos} {space} {enter} {limpar}",
      ],
      shift: [
        "! @ # $ % ^ & * ( )",
        "Q W E R T Y U I O P",
        "A S D F G H J K L Ç",
        "{shift} Z X C V B N M {bksp}",
        "{acentos} {space} {enter} {limpar}",
      ],
      accent: [
        ACCENT_KEYS.join(" "),
        "q w e r t y u i o p",
        "a s d f g h j k l ç",
        "{shift} z x c v b n m {bksp}",
        "{abc} {space} {enter} {limpar}",
      ],
      numeric: ["1 2 3", "4 5 6", "7 8 9", "0 {limpar} {enter}"],
    }),
    []
  );

  const display = {
    "{shift}": "Shift",
    "{bksp}": "Apagar",
    "{space}": "Espaço",
    "{enter}": "Confirmar",
    "{limpar}": "Limpar",
    "{acentos}": "Acentos",
    "{abc}": "ABC",
  };

  const syncInput = (val: string) => {
    setInput(val);
    if (!activeElement) return;
    const proto = Object.getPrototypeOf(activeElement);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    setter?.call(activeElement, val);
    activeElement.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const handleSpecialKey = (button: string) => {
    if (button === "{shift}") {
      if (layoutName === "shift") setLayoutName("default");
      else if (layoutName === "default") setLayoutName("shift");
      else setLayoutName("default");
      return true;
    }
    if (button === "{bksp}") {
      const next = input.slice(0, -1);
      syncInput(next);
      keyboardRef.current?.setInput?.(next);
      return true;
    }
    if (button === "{limpar}") {
      syncInput("");
      keyboardRef.current?.setInput?.("");
      return true;
    }
    if (button === "{enter}") {
      activeElement?.dispatchEvent(new Event("input", { bubbles: true }));

      const targetSelector = activeElement?.getAttribute("data-enter-target");
      if (targetSelector) {
        const btn = document.querySelector(targetSelector) as HTMLElement | null;
        btn?.click();
      }

      const action = activeElement?.getAttribute("data-enter-action");
      if (action === "close-keyboard") {
        onClose?.();
      }

      return true;
    }
    if (button === "{acentos}") {
      setLayoutName("accent");
      return true;
    }
    if (button === "{abc}") {
      setLayoutName("default");
      return true;
    }
    return false;
  };

  const onKeyPress = (button: string) => {
    if (handleSpecialKey(button)) return;
    const next = `${input}${button}`;
    syncInput(next);
    keyboardRef.current?.setInput?.(next);
    if (layoutName === "accent" || layoutName === "shift") {
      setLayoutName("default");
    }
  };

  useEffect(() => {
    if (!onHeightChange) return;
    if (visible && wrapperRef.current) {
      const h = wrapperRef.current.getBoundingClientRect().height;
      onHeightChange(h);
    } else {
      onHeightChange(0);
    }
  }, [visible, onHeightChange]);

  useEffect(() => {
    if (visible) {
      activeElement?.focus();
    }
  }, [visible, activeElement]);

  if (!visible) return null;

  return (
    <div
      className="cc-virtual-kb-wrapper"
      ref={wrapperRef}
      onMouseDown={(e) => {
        e.preventDefault();
        activeElement?.focus();
      }}
      onTouchStart={() => activeElement?.focus()}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        theme={"hg-theme-default myTheme1"}
        onKeyPress={onKeyPress}
        input={input}
        layout={layout}
        display={display}
        buttonTheme={[
          {
            class: "kb-wide",
            buttons: "{space}",
          },
          {
            class: "kb-accent",
            buttons: "{acentos} {abc}",
          },
        ]}
      />
    </div>
  );
}
