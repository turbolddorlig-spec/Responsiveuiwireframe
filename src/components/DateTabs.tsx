import { Button } from "./ui/button";

type DateTabsProps = {
  selectedDate: "today" | "yesterday" | "dayBefore" | "tomorrow";
  onSelectDate: (date: "today" | "yesterday" | "dayBefore" | "tomorrow") => void;
  getMongolianTime?: () => Date;
};

export function DateTabs({ selectedDate, onSelectDate, getMongolianTime }: DateTabsProps) {
  // Get Mongolian dates for each tab
  const getDateLabel = (offset: number) => {
    const date = getMongolianTime ? getMongolianTime() : new Date();
    date.setDate(date.getDate() + offset);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const tabs = [
    { key: "today", label: "Өнөөдөр", dateLabel: getDateLabel(0) },
    { key: "yesterday", label: "Өчигдөр", dateLabel: getDateLabel(-1) },
    { key: "dayBefore", label: "Уржигдар", dateLabel: getDateLabel(-2) },
    { key: "tomorrow", label: "Маргааш", dateLabel: getDateLabel(1) }
  ] as const;

  return (
    <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={selectedDate === tab.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onSelectDate(tab.key as any)}
          className="text-sm"
        >
          {tab.label} <span className="ml-1 text-xs opacity-70">({tab.dateLabel})</span>
        </Button>
      ))}
    </div>
  );
}