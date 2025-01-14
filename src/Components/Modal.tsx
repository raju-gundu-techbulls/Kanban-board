import { forwardRef, useImperativeHandle, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

// Define the interface for the Modal's imperative handle
export interface ModalHandle {
    open: () => void;
    close: () => void;
}

// Define the props type if there are any additional props required (currently empty)
interface ModalProps {
    children?: ReactNode;
}

const Modal = forwardRef<ModalHandle, ModalProps>(function Modal({children}, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
        open() {
            dialogRef.current?.showModal();
        },
        close() {
            dialogRef.current?.close()
        },
    }));

    return createPortal(
        <dialog ref={dialogRef}>
           {children}
        </dialog>,
        document.getElementById("modal-root") as HTMLElement
    );
});

export default Modal;
