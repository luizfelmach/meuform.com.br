import { UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ScreenType } from "@/form/types";

interface GenericInputProps extends UseControllerProps {
  screen: ScreenType;
  handleNext?: () => void;
}

export function InputRadio(props: Omit<GenericInputProps, "name">) {
  const { screen, control, defaultValue, handleNext } = props;
  const { screenKey, options } = screen;
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={screenKey}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={(e) => {
                field.onChange(e);
                if (handleNext) handleNext();
              }}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((option, index) => (
                <FormItem
                  key={index}
                  className={cn(
                    "inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                    "bg-accent text-accent-foreground rounded-lg gap-4 pr-4",
                    ""
                  )}
                >
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel className="w-full min-h-11 pb-2 flex items-center px-4 cursor-pointer">
                    <p className="text-sm font-medium leading-none">{option}</p>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
