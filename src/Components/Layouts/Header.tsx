import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import CreateDialog from "../Exercises/Dialog";
import { styled } from "@mui/material/styles";

const StyledTypography = styled(Typography)({
  flex: 1,
});

interface HeaderProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <StyledTypography variant="h4" color="inherit">
          Fitness Tracker
        </StyledTypography>
        <Box sx={{ flexGrow: 1 }} />
        <Tabs
          value={currentTab}
          onChange={onTabChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Exercises" />
          <Tab label="Workouts" />
        </Tabs>
        {currentTab === 0 && <CreateDialog />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
