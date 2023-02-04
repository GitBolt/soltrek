import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    body: `'Inter', sans-serif`,
    heading: `'Inter', sans-serif`,
  },
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
      300: "#2E2C48", // Only to override default chakra's gray 300
    },
    error: "#B02A2A"
  },
  components: {
    Input: {
      baseStyle: {
        field: {
          _focus: {
            outline: "none"
          },
          _focusVisible: {
            border: 'none'
          },
          color: 'blue.500',
          _placeholder: {
            color: 'blue.500',
            opacity: '45%',
          },
          _disabled: {
            color: 'gray.200',
            opacity: '80%',
          },
          _hover: {
            borderColor: 'blue.100',
          }
        },
      },
      defaultProps: {
        errorBorderColor: 'error',
        focusBorderColor: "blue.200",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "600",
        boxShadow: "4px 4px 0px -1px rgba(0, 0, 0, 0.15)",
        _active: {
          transform: "scale(0.95)",
        }
      },
      variants: {
        filled: {
          bg: 'blue.400',
          color: 'white',
          w: "9rem",
          h: "3.8rem",
          fontSize: "1.9rem",
          borderRadius: "0.6rem",
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
          w: "9rem",
          h: "3.8rem",
          fontSize: "1.9rem",
          borderRadius: "0.6rem",
          _hover: {
            bg: "transparent",
            filter: "brightness(120%)",
            _disabled: {
              bgColor: 'blue.500',
            },
          },
          _active: {
            bg: "transparent",
          }
        },
        sidebar: {
          fontSize: "1.8rem",
          justifyContent: "space-between",
          padding: "0 2rem",
          w: "100%",
          boxShadow: "none",
          h: "3.8rem",
          transition: "100ms",
          bg: 'transparent',
          color: 'blue.200',
          _hover: {
            bg: "bg.300",
          },
          _active: {
            filter: "brightness(110%)",
            transform: "none",
          }
        },
      },
    },
  },
});
