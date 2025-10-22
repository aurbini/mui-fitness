import React from "react";
import { Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Catalog from "./Catalog";
import Preview from "./Preview";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: "auto",
  [theme.breakpoints.up("sm")]: {
    marginTop: 5,
    height: "calc(100% - 10px)",
  },
  [theme.breakpoints.down("sm")]: {
    height: "100%",
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    height: "calc(100% - 64px - 48px)",
  },
  [theme.breakpoints.down("sm")]: {
    height: "calc(100% - 56px - 48px)",
  },
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    height: "50%",
  },
}));

const Viewer = () => (
  <StyledGrid container>
    <StyledGridItem item xs={12} sm={6}>
      <StyledPaper>
        <Catalog />
      </StyledPaper>
    </StyledGridItem>
    <StyledGridItem item xs={12} sm={6}>
      <StyledPaper>
        <Preview />
      </StyledPaper>
    </StyledGridItem>
  </StyledGrid>
);

export default Viewer;
