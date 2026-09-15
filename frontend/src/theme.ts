import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B4332",
      light: "#2D6A4F",
      dark: "#0A2818",
      contrastText: "#fff",
    },
    secondary: {
      main: "#D4A017",
      light: "#E8C35A",
      dark: "#A67C00",
      contrastText: "#fff",
    },
    background: {
      default: "#F7F4EF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#5C5C5C",
    },
    error: { main: "#C62828" },
    success: { main: "#2E7D32" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: "#1B4332", color: "#fff" },
      },
    },
  },
});

export default theme;
