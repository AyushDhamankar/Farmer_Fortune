import * as React from "react";

export const Skeletoncard = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg max-w-[360px]">
      <div className="self-center bg-gray max-w-full rounded-lg h-[134px] w-[331px]" />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a52a8c68d8cc0891ac6d5679760a1a815c100501e3d70895c9a5cc421f891adb?"
        className="mt-2.5 w-full aspect-[1.25]"
      />
    </div>
  );
};
