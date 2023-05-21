// ThemeProvider.js
import { themeDark } from '@/util/themeDark';
import { themeHighContrast } from '@/util/themeHighContrast';
import { Button, ChakraProvider } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useState } from 'react';


interface ThemeContextValue {
  setTheme: (theme: any) => void;
  theme: string,
}

export const ThemeContext = createContext<ThemeContextValue>({
  setTheme: () => { },
  theme: 'default_dark'
});

type Props = {
  children?: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState('default_dark');

  useEffect(() => {
    const localData = localStorage.getItem("theme")
    if (localData) {
      setTheme(localData)

      const elem = document.querySelector(".react-flow") as HTMLElement
      if (!elem) return

      if (localData == "default_dark") elem.style.background = themeDark.colors.bg["100"]
      if (localData == "high_contrast") elem.style.background = themeHighContrast.colors.bg["100"]

    }

  }, [])
  const th = theme == "default_dark" ? themeDark : themeHighContrast;

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ChakraProvider theme={th}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
}


export const useCustomTheme = () => {
  return useContext(ThemeContext)
};
