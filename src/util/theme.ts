import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    body: `'Inter', sans-serif`,
    heading: `'Inter', sans-serif`,
  },
  colors: {

    white: {
      100: "#DEDEE2"
    },
    bg: {
      100: '#14141B',
      200: '#121218',
      300: "#1C1F2B",
      400: "#101018",
    },
    blue: {
      100: "#6052FF",
      200: "#7266FF",

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
      100: "#22212E",
      200: "#2E2C48",
      300: "#2E2C48", // Only to override default chakra's gray 300
    },
    error: "#B02A2A"
    
  },
  components: {

    NumberInput: {
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
    Input: {
      baseStyle: {
        field: {
          color: "blue.100",
          borderBottomColor:"bg.200",
          _placeholder: {
            color: "blue.100",
            opacity: "30%",
          },
          _disabled: {
            color: "gray.200",
            opacity: "80%",
          },

        },
      },
      defaultProps: {
        errorBorderColor: "error",
        focusBorderColor: "bg.300",
        variant: "flushed"
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "600",
        boxShadow: "4px 4px 0px -1px rgba(0, 0, 0, 0.15)",
        _active: {
          transform: "scale(0.98)",
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
          fontSize: "1.6rem",
          justifyContent: "space-between",
          padding: "0rem 2rem",
          w: "100%",
          boxShadow: "none",
          h: "4rem",
          transition: "100ms",
          bg: 'transparent',
          fontWeight: "500",
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
