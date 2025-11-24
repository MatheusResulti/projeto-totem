import { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type Props = {
  visible: boolean;
  activeElement: HTMLInputElement | HTMLTextAreaElement | null;
  onClose: () => void;
  onHeightChange?: (height: number) => void;
};

export function VirtualKeyboard({
  visible,
  activeElement,
  onClose,
  onHeightChange,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const keyboardRef = useRef<any>(null);
  const [layoutName, setLayoutName] = useState("default");
  const [input, setInput] = useState("");

  useEffect(() => {
    if (activeElement) {
      setInput(activeElement.value);
      keyboardRef.current?.setInput(activeElement.value);
    }
  }, [activeElement]);

  const onChange = (val: string) => {
    setInput(val);

    if (!activeElement) return;

    const proto = Object.getPrototypeOf(activeElement);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    setter?.call(activeElement, val);

    const ev = new Event("input", { bubbles: true });
    activeElement.dispatchEvent(ev);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
      return;
    }

    if (button === "{bksp}") {
      const next = input.slice(0, -1);
      setInput(next);
      if (activeElement) {
        const proto = Object.getPrototypeOf(activeElement);
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
        setter?.call(activeElement, next);
        activeElement.dispatchEvent(new Event("input", { bubbles: true }));
      }
      keyboardRef.current?.setInput(next);
    }
  };

  const handleShift = () => {
    setLayoutName((prev) => (prev === "default" ? "shift" : "default"));
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
      <div className="cc-virtual-kb-header"></div>

      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        theme={"hg-theme-default myTheme1"}
        onChange={onChange}
        onKeyPress={onKeyPress}
        input={input}
      />
    </div>
  );
}
