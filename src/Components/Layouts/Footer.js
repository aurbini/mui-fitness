import React from "react";
import { AppBar, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import { useExercises } from "../../context";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { muscles, category, onCategorySelect } = useExercises();

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

export default Footer;
