import * as React from "react";

function SvgEyeOfJudgementEllipse(props) {
    var prefix = props.id || "";
    var eee = {...props};
    delete eee.id;

    return (
        <svg width={279.107} height={141.12} viewBox="0 0 209.33 105.84" {...eee}>
            <defs>
                <radialGradient
                    id={`${prefix}_eyeOfJudgementEllipse_svg__a`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                >
                    <stop offset="0%" stopColor="var(--inner-color, #00f3ff)" />
                    <stop offset="100%" stopColor="var(--base-color, #ff00fe)" />
                </radialGradient>
            </defs>
            <path
                d="M10.384 52.74c64.32 61.2 127.2 61.2 188.64 0-63.36-60.72-126.24-60.72-188.64 0z"
                fill="none"
                stroke="var(--base-color, #ff00fe)"
                strokeDashoffset={15.84}
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth={14.4}
            />
            <circle
                cx={104.7}
                cy={52.92}
                fill={`url(#${prefix}_eyeOfJudgementEllipse_svg__a)`}
                fillRule="evenodd"
                r={37.44}
            />
        </svg>
    );
}

export default SvgEyeOfJudgementEllipse;