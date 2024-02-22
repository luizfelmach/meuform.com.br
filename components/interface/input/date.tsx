import { UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScreenType } from "@/form/types";

interface GenericInputProps extends UseControllerProps {
  screen: ScreenType;
}

export function InputDate(props: Omit<GenericInputProps, "name">) {
  const { screen, control, defaultValue } = props;
  const { screenKey, type } = screen;
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={screenKey}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormControl>
            <Input
              className="w-full h-11 border-none bg-accent text-accent-foreground"
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
