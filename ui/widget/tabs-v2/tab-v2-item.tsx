import { cn } from "@/utils";
import { TabV2ItemDataType } from ".";

const TabsV2Item = ({
  className,
  selected,
  onSelect,
  item,
}: {
  className?: string;
  selectedClassName?: string;
  selected: boolean;
  onSelect: () => void;
  item: TabV2ItemDataType;
}) => {
  return (
    <>
      <div
        className={cn(
          "w-[154px] h-[40px]",
          "font-poppins text-sm",
          "flex items-center justify-center",
          "rounded-lg",
          "cursor-pointer",
          "bg-transparent text-text2",
          !selected && "hover:text-primary",
          className ?? "",
          item.className ?? "",
          selected && "bg-primary text-white",
          selected && (item.selectedClassName ?? "")
        )}
        onClick={onSelect}
      >
        {selected && item.selectedLabel ? item.selectedLabel : item.label}
      </div>
    </>
  );
};

export default TabsV2Item;
