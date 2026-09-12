import React from "react";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Props = {
    isVerified: boolean;
};

const VerifiedBadge = ({ isVerified }: Props) => {
    if (!isVerified) return null;

    return (
        <Chip
            label="Verified"
            color="success"
            icon={<CheckCircleIcon />}
            variant="outlined"
            size="small"
            style={{ marginRight: 5 }}
        />
    );
};

export default VerifiedBadge;