import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ProductModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  children: React.ReactNode;
  title?: string;
  type?: "default" | "recarga";
  onClose?: () => void;
  showCloseButton?: boolean;
  size?: "auto" | "full";
  maxWidthClassName?: string;
  maxHeightClassName?: string;
  classNameWrapper?: string;
  classNamePanel?: string;
  classNameTitle?: string;
  classNameContent?: string;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function ProductModal({
  openModal,
  setOpenModal,
  children,
  title,
  type = "default",
  onClose,
  showCloseButton,
  size = "full",
  maxWidthClassName = "max-w-[1200px]",
  maxHeightClassName = "max-h-[800px]",
  classNameWrapper,
  classNamePanel,
  classNameTitle,
  classNameContent,
  headerRight,
  footer,
}: ProductModalProps) {
  const [showModal, setShowModal] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [idPermissao, setIdPermissao] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIdPermissao(localStorage.getItem("idPermissao"));
    }
  }, []);

  useEffect(() => {
    setShowModal(openModal);
  }, [openModal]);

  useEffect(() => {
    if (!openModal) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [openModal]);

  function closeModal() {
    setShowModal(false);
    setTimeout(() => {
      setOpenModal(false);
      onClose?.();
    }, 300);
  }

  const shouldShowCloseButton =
    typeof showCloseButton === "boolean"
      ? showCloseButton
      : Boolean(title?.length) && type !== "recarga";

  const content = (
    <div
      className={`fixed inset-0 z-150 flex justify-center items-center overflow-hidden p-10 ${
        classNameWrapper ?? ""
      }`}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        ref={panelRef}
        className={`z-160 flex flex-col relative gap-4 ${
          size === "auto" ? "w-auto" : "w-full"
        } ${maxWidthClassName} h-full ${maxHeightClassName} rounded-xl overflow-hidden bg-white transition-transform ease-in-out duration-250 ${
          showModal ? "translate-y-0" : "translate-y-[1500px]"
        } ${classNamePanel ?? ""}`}
        style={{ maxHeight: "calc(100vh - var(--kb-offset, 0px))" }}
      >
        {" "}
        {title && title.length ? (
          <div className="flex items-center justify-between pr-10">
            <span
              className={`text-xl text-text-color font-medium w-full ${
                classNameTitle ?? ""
              }`}
            >
              {title}
            </span>
            {headerRight ? <div className="ml-2">{headerRight}</div> : null}
          </div>
        ) : null}
        {shouldShowCloseButton && (
          <button
            className="p-1 rounded-full outline-none text-gray-500 absolute top-3 right-3 border-2 border-gray-300 touchable"
            onClick={closeModal}
          >
            <X size={26} />
          </button>
        )}
        {type === "recarga" && idPermissao === "2" ? (
          <button
            className="p-1 rounded-full outline-none text-gray-500 absolute top-3 right-3 hover:bg-neutral-100 transition-all ease-in-out duration-300"
            onClick={closeModal}
          />
        ) : null}
        <div
          className={`flex flex-col flex-1 overflow-hidden ${
            classNameContent ?? ""
          }`}
        >
          {children}
        </div>
        {footer ? <div className="pt-2">{footer}</div> : null}
      </div>
    </div>
  );

  if (
    (openModal || showModal) &&
    typeof window !== "undefined" &&
    document?.body
  ) {
    return createPortal(content, document.body);
  }
  return null;
}
