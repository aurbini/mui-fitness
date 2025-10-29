import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import CreateDialog from "../Exercises/Dialog";
import { styled } from "@mui/material/styles";

const StyledTypography = styled(Typography)({
  flex: 1,
});

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <StyledTypography variant="h4" color="inherit">
          Exercise Database
        </StyledTypography>
        <CreateDialog />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
