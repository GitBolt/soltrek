import { ReactNode, createContext, useContext } from 'react';
import { useDisclosure } from '@chakra-ui/react';

type ModalContextType = {
  savedPg: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  cmdPalette: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  accessModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
};

export const ModalContext = createContext<ModalContextType>({
  savedPg: {
    isOpen: false,
    onOpen: () => { },
    onClose: () => { },
  },
  cmdPalette: {
    isOpen: false,
    onOpen: () => { },
    onClose: () => { },
  },
  accessModal: {
    isOpen: false,
    onOpen: () => { },
    onClose: () => { },
  },
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const savedPg = useDisclosure();
  const cmdPalette = useDisclosure();
  const accessModal = useDisclosure();

  return (
    <ModalContext.Provider value={{ savedPg, cmdPalette, accessModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useCustomModal = () => {
  return useContext(ModalContext)
};
