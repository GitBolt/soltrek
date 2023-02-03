import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    bg: {
      100: '#14131F',
      200: '#14131F99',
      300: '#232139',
      400: '#1B192F',
    },
    blue: {
      100: "#847DD4",
      200: "#7166EA",
      300: "#7166EACC",
      400: "#3E369B",
      500: "#7058FF",
      600: "#322F58"
    },
    magenta: {
      100: "#DD117F",
      200: "#FF55B1",
      300: "#BF0073",
      400: "#BF007333"
    },
    gray: {
      100: "#322F58",
      200: "#2E2C48",
    },
    error: "#B02A2A"
  },
  components: {
    Input: {
      parts: ['field'],
      baseStyle: {
        field: {
          color: 'blue.500',
          _placeholder: {
            color: 'blue.500',
            opacity: '45%',
          },
          _disabled: {
            color: 'gray.200',
            opacity: '80%',
          },
        },
      },
      defaultProps: {
        errorBorderColor: 'error',
      },
    },
    Button: {
      variants: {
        filled: {
          bg: 'blue.400',
          color: 'white',
          _hover: {
            filter: "brightness(120%)",
            _disabled: {
              bgColor: 'blue.500',
            },
          },
        },
        outline: {
          bg: 'transparent',
          color: 'blue.400',
          border: "1px solid",
          borderColor: "blue.400",
          _hover: {
            filter: "brightness(120%)",
            _disabled: {
              bgColor: 'blue.500',
            },
          },
        },
        sidebar: {
          fontSize: "1.5rem",
          textAlign: "start",
          w:"100%",
          h:"3.8rem",
          bg: 'transparent',
          color: 'blue.200',
          _hover: {
            bg: "bg.300",
          },
        },
      },
    },
  },
});
