import { alpha, createTheme, type Palette } from "@mui/material/styles";

/* -------------------------------------------------------------------------- */
/* TypeScript: Custom MUI Variants                                            */
/* -------------------------------------------------------------------------- */

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    fill: true;
    ghost: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    fill: true;
    ghost: true;
  }

  interface ChipPropsSizeOverrides {
    large: true;
  }

  interface ChipPropsColorOverrides {
    inherit: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    success: true;
  }
}

/* -------------------------------------------------------------------------- */
/* Design Tokens                                                              */
/* -------------------------------------------------------------------------- */

const tokens = {
  primary: "#086B50",
  primaryLight: "#DDF3E9",
  primaryDark: "#064E3B",

  grey: "#637381",
  greyDark: "#454F5B",
  greyLight: "#F4F6F8",
  greyBorder: "#DFE3E8",

  info: "#0DCAF0",
  success: "#198754",
  warning: "#FFC107",
  error: "#DC3545",

  text: "#060415",
  textSecondary: "#637381",
  textDisabled: "#919EAB",

  border: "#DFE3E8",
  divider: "#E6EAEE",

  background: "#F7F9FA",
  backgroundSoft: "#F1F4F6",
  surface: "#FFFFFF",
  surfaceHover: "#F8FAFB",
};

/* -------------------------------------------------------------------------- */
/* Shared Helpers                                                             */
/* -------------------------------------------------------------------------- */

type SemanticColor =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "secondary"
  | "inherit";

const getSemanticColor = (
  color: SemanticColor,
  palette: Palette,
) => {
  if (color === "inherit") {
    return {
      main: tokens.grey,
      light: tokens.greyLight,
      dark: tokens.greyDark,
      contrastText: tokens.greyDark,
    };
  }

  const selected = palette[color];

  return {
    main: selected.main,
    light: selected.light,
    dark: selected.dark,
    contrastText: selected.contrastText,
  };
};

/* -------------------------------------------------------------------------- */
/* Theme                                                                       */
/* -------------------------------------------------------------------------- */

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      light: tokens.primaryLight,
      main: tokens.primary,
      dark: tokens.primaryDark,
      contrastText: "#FFFFFF",
    },

    secondary: {
      light: "#E2E8F0",
      main: tokens.grey,
      dark: tokens.greyDark,
      contrastText: "#FFFFFF",
    },

    info: {
      light: "#CFF4FC",
      main: tokens.info,
      dark: "#0AA2C0",
      contrastText: tokens.text,
    },

    success: {
      light: "#D1E7DD",
      main: tokens.success,
      dark: "#146C43",
      contrastText: "#FFFFFF",
    },

    warning: {
      light: "#FFF3CD",
      main: tokens.warning,
      dark: "#CC9A06",
      contrastText: tokens.text,
    },

    error: {
      light: "#F8D7DA",
      main: tokens.error,
      dark: "#B02A37",
      contrastText: "#FFFFFF",
    },

    text: {
      primary: tokens.text,
      secondary: tokens.textSecondary,
      disabled: tokens.textDisabled,
    },

    divider: tokens.divider,

    background: {
      default: tokens.background,
      paper: tokens.surface,
    },

    action: {
      hover: "#F4F6F8",
      selected: "#EAF0F2",
      disabled: tokens.textDisabled,
      disabledBackground: tokens.greyLight,
      focus: alpha(tokens.primary, 0.16),
    },
  },

  typography: {
    fontFamily: "var(--font-inter), Arial, sans-serif",

    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
    },

    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },

    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },

    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },

    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },

    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },

    subtitle1: {
      fontSize: "0.9375rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },

    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },

    body1: {
      fontSize: "0.9375rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.55,
    },

    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    overline: {
      fontSize: "0.6875rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },

    button: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.2,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    /* ---------------------------------------------------------------------- */
    /* Buttons                                                                */
    /* ---------------------------------------------------------------------- */

    MuiButton: {
      defaultProps: {
        variant: "fill",
        color: "primary",
        disableElevation: true,
      },

      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const height =
            ownerState.size === "large"
              ? 48
              : ownerState.size === "small"
                ? 28
                : 36;

          const color = getSemanticColor(
            (ownerState.color ?? "primary") as SemanticColor,
            theme.palette,
          );

          const isInherited = ownerState.color === "inherit";
          const variant = ownerState.variant;

          const disabled = {
            backgroundColor: tokens.greyLight,
            color: tokens.textDisabled,
            borderColor: tokens.greyBorder,
            boxShadow: "none",
          };

          const base = {
            minHeight: height,
            height,
            padding: "0 16px",
            borderRadius: "8px",
            fontWeight: 500,
            whiteSpace: "nowrap" as const,
            transition:
              "background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease",

            "&.Mui-focusVisible": {
              outline: `3px solid ${alpha(color.main, 0.22)}`,
              outlineOffset: 2,
            },

            "&.Mui-disabled": disabled,
          };

          if (variant === "fill") {
            return {
              ...base,

              backgroundColor: isInherited
                ? alpha(color.main, 0.12)
                : color.main,

              color: color.contrastText,

              border: "1px solid transparent",

              "&:hover": {
                backgroundColor: isInherited
                  ? alpha(color.main, 0.2)
                  : color.dark,
              },

              "&.Mui-disabled": {
                ...disabled,
                backgroundColor: tokens.greyLight,
              },
            };
          }

          if (variant === "ghost") {
            return {
              ...base,

              backgroundColor: alpha(color.main, isInherited ? 0.08 : 0.12),

              color: color.main,

              border: "1px solid transparent",

              "&:hover": {
                backgroundColor: alpha(color.main, isInherited ? 0.14 : 0.2),
              },
            };
          }

          if (variant === "outlined") {
            return {
              ...base,

              backgroundColor: "transparent",
              color: color.main,

              border: `1px solid ${alpha(
                color.main,
                isInherited ? 0.35 : 0.5,
              )}`,

              "&:hover": {
                backgroundColor: alpha(color.main, isInherited ? 0.06 : 0.08),
                borderColor: color.main,
              },
            };
          }

          return base;
        },

        outlined: {
          borderWidth: 1,

          "&:hover": {
            borderWidth: 1,
          },
        },
      },
    },

    /* ---------------------------------------------------------------------- */
    /* Chips                                                                  */
    /* ---------------------------------------------------------------------- */

    MuiChip: {
      defaultProps: {
        variant: "fill",
        color: "primary",
        size: "small",
      },

      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const isLarge = ownerState.size === "large";
          const isInherited = ownerState.color === "inherit";
          const variant = ownerState.variant;

          const color = getSemanticColor(
            (ownerState.color ?? "primary") as SemanticColor,
            theme.palette,
          );

          const height = isLarge ? 32 : 24;

          const fillBackground = isInherited
            ? alpha(color.main, 0.12)
            : color.main;

          const fillText = isInherited ? tokens.greyDark : color.contrastText;

          const variantStyles =
            variant === "fill"
              ? {
                  backgroundColor: fillBackground,
                  color: fillText,
                  border: "1px solid transparent",
                }
              : variant === "ghost"
                ? {
                    backgroundColor: alpha(
                      color.main,
                      isInherited ? 0.07 : 0.12,
                    ),
                    color: color.main,
                    border: "1px solid transparent",
                  }
                : {
                    backgroundColor: "transparent",
                    color: color.main,

                    border: `1px solid ${alpha(
                      color.main,
                      isInherited ? 0.35 : 0.5,
                    )}`,
                  };

          return {
            height,
            borderRadius: "4px",
            fontWeight: 600,
            fontSize: isLarge ? "0.8125rem" : "0.6875rem",
            letterSpacing: "0.01em",
            transition: "background-color 150ms ease, border-color 150ms ease",

            ...variantStyles,

            "& .MuiChip-label": {
              paddingLeft: isLarge ? "12px" : "8px",
              paddingRight: isLarge ? "12px" : "8px",
            },

            "&.Mui-disabled": {
              backgroundColor: tokens.greyLight,
              color: tokens.textDisabled,
              borderColor: tokens.greyBorder,
              opacity: 0.7,
            },
          };
        },
      },
    },

    /* ---------------------------------------------------------------------- */
    /* Text Fields                                                            */
    /* ---------------------------------------------------------------------- */

    MuiTextField: {
      defaultProps: {
        size: "medium",
        fullWidth: true,
        variant: "outlined",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            color: "#a2a3a3",
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const height = ownerState.size === "small" ? 40 : 56;

          return {
            borderRadius: "8px",

            "&:not(.MuiInputBase-multiline)": {
              height,
            },

            "& .MuiOutlinedInput-input": {
              padding: "0 14px",
              height: "100%",
              boxSizing: "border-box",

              "& .MuiOutlinedInput-input::placeholder": {
                color: "#0b1d2d !important",
                opacity: "1 !important",
              },

              "& .MuiSelect-select": {
                color: "#051b2e",
              },
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: tokens.border,
              transition: "border-color 150ms ease",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.secondary,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },

            "&.Mui-focused": {
              boxShadow: "none",
            },

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.error.main,
            },

            "&.Mui-disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
            },
          };
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: "#637381",

          "&.Mui-focused": {
            color: "#086B50",
          },

          "&.Mui-error": {
            color: "#DC3545",
          },

          "&.Mui-disabled": {
            color: "#919EAB",
          },
        },
      },
    },
    /* -------------------------------------------------------------------------- */
    /* Table Cells                                                                */
    /* -------------------------------------------------------------------------- */

    MuiTableContainer: {
      styleOverrides: {
        root: {
          padding: "16px",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflowX: "auto",
          overflowY: "hidden",

          // Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "#C4CDD5 transparent",

          // Chrome, Edge, Safari
          "&::-webkit-scrollbar": {
            height: "6px",
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#C4CDD5",
            borderRadius: "10px",
          },

          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#919EAB",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },

        head: {
          color: tokens.text,
          fontWeight: 600,
          fontSize: "13px",
          whiteSpace: "nowrap",
          backgroundColor: "#ebebeb",
          paddingTop: "12px",
          paddingBottom: "12px",

          // Round only the two outer corners of the header
          "&:first-of-type": {
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          },

          "&:last-of-type": {
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
          },
        },

        body: {
          color: tokens.text,
          fontSize: "13px !important",
          borderBottom: `1px solid ${tokens.divider}`,
        },
      },
    },
    /* ---------------------------------------------------------------------- */
    /* Surfaces and Dividers                                                  */
    /* ---------------------------------------------------------------------- */

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: tokens.divider,
        },
      },
    },
  },
});

export default theme;
