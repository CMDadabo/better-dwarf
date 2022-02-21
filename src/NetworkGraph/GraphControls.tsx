import React from "react";
import {
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";

interface GraphControlsProps {
  showNames: boolean;
  setShowNames(showNames: boolean): void;
}

export default function GraphControls({
  showNames,
  setShowNames,
}: GraphControlsProps) {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Controls
      </Typography>
      <FormGroup>
        <Typography gutterBottom>Included Units:</Typography>
        <FormControlLabel control={<Checkbox />} label="Non-Citizens" />
        <FormControlLabel control={<Checkbox />} label="Dead" />
        <FormControlLabel control={<Checkbox />} label="Deities" />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <FormGroup>
        <Typography gutterBottom>Included Links:</Typography>
        <FormControlLabel control={<Checkbox />} label="Non-Citizens" />
        <FormControlLabel control={<Checkbox />} label="Dead" />
        <FormControlLabel control={<Checkbox />} label="Deities" />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={showNames}
              onChange={() => setShowNames(!showNames)}
            />
          }
          label="Show Names"
        />
      </FormGroup>
    </Card>
  );
}
