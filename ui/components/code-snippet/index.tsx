// components/SolidityCodeSnippet.js

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

const SolidityCodeSnippet = ({ code }: any) => {
  return (
    <div className="rounded-[20px] overflow-hidden">
      <SyntaxHighlighter
        language="solidity"
        style={vs}
        useInlineStyles
        customStyle={{
          background: "#1F2020",
          color: "#fff",
          border: "none",
          borderRadius: "20px",
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default SolidityCodeSnippet;
