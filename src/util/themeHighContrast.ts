import { extendTheme } from '@chakra-ui/react';

export const themeHighContrast = extendTheme({
  fonts: {
    body: `'Inter', sans-serif`,
    heading: `'Inter', sans-serif`,
  },
  colors: {
    white: {
      100: "#DEDEE2"
    },
    bg: {
      100: '#070810',
      200: '#04050A',
      300: "#111221",
      400: "#04050A",
      "gradient": "linear-gradient(96.6deg, #171622 2.37%, #131125 2.38%, #0A091A 101.12%);",
    },
    blue: {
      100: "#6052FF",
      200: "#7266FF",

      300: "#7166EACC",
      400: "#3E369B",
      500: "#7058FF",
      "gradient": 'linear-gradient(268.02deg, #33335E 0.24%, #2D2D56 97.53%);'
    },
    magenta: {
      100: "#DD117F",
      200: "#FF55B1",
      300: "#BF0073",
      400: "#BF007333"
    },
    gray: {
      100: "#22212E",
      200: "#2A2842",
      300: "#514D6D",
    },
    error: "#B02A2A"

  },
  components: {

    NumberInput: {
      baseStyle: {
        field: {
          h: "2.8rem",
          bg: "transparent",
          border: "1px solid",
          borderColor: "gray.200",
          color: "blue.100",
          _placeholder: {
            color: "blue.300",
            opacity: "30%",
          },
          _focus: {
            borderColor: "blue.400",
            outline: "none",
            border: "1px solid",
          },
          _focusVisible: {
            border: "none"
          },
          _hover: {
            borderColor: "gray.300",
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
          borderBottomColor: "bg.200",
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
      variants: {
        node: {
          field: {
            h: "2.8rem",
            bg: "transparent",
            border: "1px solid",
            borderColor: "gray.200",
            color: "blue.100",
            _placeholder: {
              color: "blue.300",
              opacity: "30%",
            },
            _focus: {
              borderColor: "blue.400"
            }
          },
        }
      },
      defaultProps: {
        errorBorderColor: "error",
        focusBorderColor: "bg.300",
      },
    },
    Button: {
      baseStyle: {
        minWidth: "fit-content",
        fontWeight: "600",
        boxShadow: "4px 4px 0px -1px rgba(0, 0, 0, 0.15)",
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
          _active: {
            transform: "scale(90%)",
          }
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
            transform: "scale(90%)",
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

        magenta: {
          fontSize: "1.5rem",
          borderRadius: "0.5rem",
          variant: "filled",
          color: "white",
          bg: "magenta.100",
          _active: {
            transform: "scale(90%)",
          }
        }
      },
    },

    Alert: {
      baseStyle: (props: any) => {
        const { status } = props;

        const base = {
          container: {
            m: "0 2rem",
            padding: "1rem 1rem",
            width: "5rem",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.5)",
          },
          icon: {
            width: "2rem",
            height: "2rem"
          },
          closeButton: {
            color: "white",
            _hover: {
              background: "white",
            },
          },
          title: {
            mt: "1px",
            fontSize: "1.8rem",
            color: "#e3e3e3",
            fontWeight: "500"
          }
        };

        const successBase = status === "success" && {
          container: {
            ...base.container,
            background: "linear-gradient(45deg, #29494f, #1a7558)",
          },
          icon: {
            ...base.icon,
            color: "#00D70F"
          },
          title: {
            ...base.title,
          },
        };

        const infoBase = status === "info" && {
          container: {
            ...base.container,
            background: "linear-gradient(45deg,#2d2d97, #5858a8)",
          },
          icon: {
            ...base.icon,
            color: "blue.100"
          },
          title: {
            ...base.title,
          },
        };

        const errorBase = status === "error" && {
          container: {
            ...base.container,
            background: "linear-gradient(45deg,#732020, #bb5050)",
          },
          icon: {
            ...base.icon,
            color: "red"
          },
          title: {
            ...base.title,
          },
        };

        const loadingBase = status === "loading" && {
          container: {
            ...base.container,
            background: "linear-gradient(45deg,#2d2d97, #5858a8)",
          },
          spinner: {
            ...base.icon,
            color: "white",

          },
          title: {
            ...base.title,
          },
        };
        return {
          ...base,
          ...successBase,
          ...infoBase,
          ...errorBase,
          ...loadingBase,
        };
      },
    },


  },
});
