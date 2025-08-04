const AIIcon = ({
  className,
  selected = false,
}: {
  className: string;
  selected?: boolean;
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        className={className}
      >
        <path
          d="M8.80957 0.650391C8.80957 8.65039 8.80957 8.65039 16.8096 8.65039C8.80957 8.65039 8.80957 8.65039 8.80957 16.6504C8.80957 8.65039 8.80957 8.65039 0.809571 8.65039C8.80957 8.65039 8.80957 8.65039 8.80957 0.650391Z"
          fill={selected ? "currentColor" : "url(#paint0_linear_1021_14783)"}
        />
        <defs>
          <linearGradient
            id="paint0_linear_1021_14783"
            x1="7.71866"
            y1="7.55948"
            x2="6.25834"
            y2="6.09916"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ADDF7C" stopOpacity="0.88" />
            <stop offset="1" stopColor="#BB981C" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default AIIcon;
