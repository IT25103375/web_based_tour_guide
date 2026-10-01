import { Box, Rating, Typography } from "@mui/material";

export default function AverageRating({ value }: { value: number | undefined }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Rating value={value ?? 0} precision={0.1} readOnly size="small" aria-label={value == null ? "Rating unavailable" : `${value.toFixed(1)} out of 5 stars`} />
      <Typography variant="caption" color="text.secondary">
        {value == null ? "Rating unavailable" : value === 0 ? "Not rated yet" : value.toFixed(1)}
      </Typography>
    </Box>
  );
}
