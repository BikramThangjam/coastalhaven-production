import React from "react";
import { Grid, Skeleton, Stack } from "@mui/material";

const SkeletonLoader = () => {
  const counts = [1, 2, 3, 4];
  return (
    <>
      {counts.map((_, index) => (
        <Stack spacing={1} key={index}>
          <Skeleton variant="rounded" width={270} height={230} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </Stack>
      ))}
    </>
  );
};

export default SkeletonLoader;
