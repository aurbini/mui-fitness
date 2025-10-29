import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red, amber } from "@mui/material/colors";
import App from "./Components/App";

const theme = createTheme({
  palette: {
    primary: red,
    secondary: {
      main: amber.A400,
      light: amber[200],
      dark: amber[700],
    },
    mode: "dark",
  },
  spacing: 10,
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
