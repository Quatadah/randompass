import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";
import { PasswordSchema } from "./password-generator";

const ValidatedSwitch = ({ control, watch, setValue, name }: any) => {
  return (
    <>
      <Label htmlFor={name}>{name}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => {
              const validationResult = PasswordSchema.safeParse({
                ...watch(),
                [name]: checked,
              });
              if (!validationResult.success) {
                toast({
                  title: "Invalid password choice",
                  description: validationResult.error?.errors[0].message,
                  variant: "destructive",
                });
                return;
              }
              setValue(name, checked);
            }}
          />
        )}
      />
    </>
  );
};

export default ValidatedSwitch;
