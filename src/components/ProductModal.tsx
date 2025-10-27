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
  closeOnBackdrop?: boolean;
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
  closeOnBackdrop = false,
  showCloseButton,
  size = "full",
  maxWidthClassName = "max-w-[1200px]",
  maxHeightClassName = "lg:max-h-[800px]",
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
    }, 200);
  }

  const shouldShowCloseButton =
    typeof showCloseButton === "boolean"
      ? showCloseButton
      : Boolean(title?.length) && type !== "recarga";

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!closeOnBackdrop) return;
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      closeModal();
    }
  }

  const content = (
    <div
      className={`fixed inset-0 flex justify-center items-center overflow-hidden p-10${
        classNameWrapper ?? ""
      }`}
      onMouseDown={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        ref={panelRef}
        className={`z-50 flex flex-col relative gap-4 ${
          size === "auto" ? "w-auto" : "w-full"
        } ${maxWidthClassName} h-full ${maxHeightClassName} rounded-xl overflow-hidden bg-white transition-transform ease-in-out duration-250 ${
          showModal ? "translate-y-0" : "translate-y-[1500px]"
        } ${classNamePanel ?? ""}`}
      >
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

  if (typeof window !== "undefined" && document?.body) {
    return createPortal(content, document.body);
  }
  return content;
}
