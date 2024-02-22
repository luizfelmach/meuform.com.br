import { UseControllerProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScreenType } from "@/form/types";
import { Checkbox } from "@/components/ui/checkbox";

interface GenericInputProps extends UseControllerProps {
  screen: ScreenType;
}

export function InputCheckBox(props: Omit<GenericInputProps, "name">) {
  const { screen, control, defaultValue } = props;
  const { options, screenKey } = screen;
  return (
    <FormField
      control={control}
      defaultValue={defaultValue}
      name={screenKey}
      render={() => (
        <FormItem>
          <div className="space-y-3">
            {options.map((option) => (
              <FormField
                key={option}
                control={control}
                defaultValue={""}
                name={screenKey}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option}
                      className={cn(
                        "inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                        "bg-accent text-accent-foreground rounded-lg gap-4 pr-4",
                        "flex space-x-3 space-y-0",
                        "min-h-14"
                      )}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: any) => value !== option
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="w-full min-h-11 flex items-center px-1 cursor-pointer ">
                        <p className="text-sm font-medium leading-none py-2">
                          {option}
                        </p>
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
