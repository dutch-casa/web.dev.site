import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { useCallback, useId } from "react";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  BookIcon,
  StarIcon,
  Calendar01Icon,
  ShoppingCart01Icon,
  Alert01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

type AccordionMode = "single" | "multiple" | "unbounded";

interface AccordionItemBase<T extends string = string> {
  id: T;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface AccordionConfig {
  width?: string;
  expandedRadius?: number;
}

interface AccordionProps<T extends string = string>
  extends Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "onValueChange" | "value" | "defaultValue" | "multiple"> {
  items: ReadonlyArray<AccordionItemBase<T>>;
  value: T | T[] | null;
  onValueChange: (value: T | T[] | null) => void;
  mode?: AccordionMode;
  config?: Partial<AccordionConfig>;
}

const DEFAULT_CONFIG: Required<AccordionConfig> = {
  width: "100%",
  expandedRadius: 20,
};

function Accordion<T extends string>({
  items,
  value,
  onValueChange,
  mode = "single",
  config = {},
  className,
  ...props
}: AccordionProps<T>) {
  const uid = useId();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const isExpanded = useCallback(
    (itemId: T) => {
      if (mode === "multiple" && Array.isArray(value)) {
        return value.includes(itemId);
      }
      return value === itemId;
    },
    [value, mode]
  );

  const handleToggle = useCallback(
    (itemId: T) => {
      if (mode === "unbounded") {
        onValueChange(isExpanded(itemId) ? null : itemId);
        return;
      }
      if (mode === "multiple" && Array.isArray(value)) {
        const newValue = isExpanded(itemId)
          ? value.filter((v) => v !== itemId)
          : [...value, itemId];
        onValueChange(newValue);
        return;
      }
      onValueChange(isExpanded(itemId) ? null : itemId);
    },
    [value, mode, onValueChange, isExpanded]
  );

  return (
    <AccordionPrimitive.Root
      className={cn("flex flex-col w-full max-w-[300px]", className)}
      style={{ width: mergedConfig.width }}
      multiple={mode === "multiple"}
      {...props}
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={`${uid}-item-${item.id}`}
          value={item.id}
          className="relative overflow-hidden px-2 bg-background hover:bg-background/60 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{
            height: isExpanded(item.id) ? 93 : 45,
            borderTopLeftRadius: index === 0 || isExpanded(item.id) ? mergedConfig.expandedRadius : 0,
            borderTopRightRadius: index === 0 || isExpanded(item.id) ? mergedConfig.expandedRadius : 0,
            borderBottomLeftRadius: index === items.length - 1 || isExpanded(item.id) ? mergedConfig.expandedRadius : 0,
            borderBottomRightRadius: index === items.length - 1 || isExpanded(item.id) ? mergedConfig.expandedRadius : 0,
          }}
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              onClick={() => handleToggle(item.id)}
              className="flex h-fit items-center gap-2 pl-3 pt-2.5 w-full cursor-pointer select-none group relative flex-1 text-left"
            >
              <span className="scale-85 shrink-0">{item.icon}</span>
              <span className="text-sm tracking-tight opacity-75">{item.title}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className={cn(
                  "absolute right-4 size-4 shrink-0 transition-transform duration-200 ease-out",
                  isExpanded(item.id) && "rotate-180"
                )}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Panel
            className={cn(
              "px-3 py-2 text-sm opacity-60",
              "data-[expanding]:animate-accordion-down data-[collapsing]:animate-accordion-up"
            )}
          >
            {item.description}
          </AccordionPrimitive.Panel>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

Accordion.Item = AccordionPrimitive.Item;
Accordion.Trigger = AccordionPrimitive.Trigger;
Accordion.Panel = AccordionPrimitive.Panel;

Accordion.Icons = {
  Book: BookIcon,
  Star: StarIcon,
  Calendar: Calendar01Icon,
  Cart: ShoppingCart01Icon,
  Warning: Alert01Icon,
  Wallet: Wallet01Icon,
};

export { Accordion };
export type {
  AccordionProps,
  AccordionItemBase,
  AccordionConfig,
  AccordionMode,
};
