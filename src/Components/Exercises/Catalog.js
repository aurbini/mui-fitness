import React, { Fragment } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit, Delete } from "@mui/icons-material";
import { withContext } from "../../context";

const StyledTypography = styled(Typography)({
  textTransform: "capitalize",
});

const Catalog = ({
  exercisesByMuscles,
  category,
  onSelect,
  onDelete,
  onSelectEdit,
}) =>
  exercisesByMuscles.map(
    ([group, exercises]) =>
      (!category || category === group) && (
        <Fragment key={group}>
          <StyledTypography color="secondary" variant="h5">
            {group}
          </StyledTypography>
          <List component="ul">
            {exercises.map(({ id, title }) => (
              <ListItem key={id} disablePadding>
                <ListItemButton onClick={() => onSelect(id)}>
                  <ListItemText primary={title} />
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEdit(id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Fragment>
      )
  );

export default withContext(Catalog);
