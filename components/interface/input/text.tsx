import { UseControllerProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScreenType } from "@/form/types";

interface GenericInputProps extends UseControllerProps {
  screen: ScreenType;
}

export function InputText(props: Omit<GenericInputProps, "name">) {
  const { screen, control, defaultValue } = props;
  const { screenKey, type } = screen;
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={screenKey}
      render={({ field }) => (
        <FormItem>
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
