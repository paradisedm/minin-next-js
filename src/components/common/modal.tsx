"use client";

import { Modal, Button } from "@heroui/react";
import { ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}


const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "xl"
}: IProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size={size}>
			{/* <Button>Open Modal</Button> */}
	    <Modal.Backdrop >
        <Modal.Container>
          <Modal.Dialog  className="sm:max-w-[360px]">
            <Modal.CloseTrigger onPress={onClose} />
            <Modal.Header className="border-b">
              <h3 className="text-xl text-black font-semibold">{title}</h3>
            </Modal.Header>
            <Modal.Body className="space-y-4 py-6">
            	{children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
	);
}

export default CustomModal;