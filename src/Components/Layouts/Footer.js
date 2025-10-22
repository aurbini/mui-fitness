import React from "react";
import { AppBar, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import { withContext } from "../../context";

const Footer = ({ muscles, category, onCategorySelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const muscleGroups = ["", ...muscles];

  const onIndexSelect = (e, index) => {
    onCategorySelect(muscleGroups[index]);
  };

  const getIndex = () => {
    return muscleGroups.indexOf(category);
  };

  return (
    <AppBar position="static">
      <Tabs
        value={getIndex()}
        onChange={onIndexSelect}
        indicatorColor="secondary"
        textColor="secondary"
        variant={isMobile ? "scrollable" : "standard"}
        centered={!isMobile}
      >
        {muscleGroups.map((group) => (
          <Tab key={group} label={group || "All"} />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default withContext(Footer);
