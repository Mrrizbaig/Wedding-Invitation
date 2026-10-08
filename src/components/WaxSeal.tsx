import React, { useState } from "react";

interface WaxSealProps {
    onPress: () => void;
    cracked?: boolean;
}

export default function WaxSeal({
                                    onPress,
                                }: WaxSealProps) {
    const [pressed, setPressed] = useState(false);

    const handleClick = () => {
        if (pressed) {
            return;
        }

        setPressed(true);
        onPress();
    };

    return (
        <button
            type="button"
            className="ref-wax-seal"
            onClick={handleClick}
            aria-label="Open wedding invitation"
        >
            <span className="sr-only">
                Open wedding invitation
            </span>
        </button>
    );
}