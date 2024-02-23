"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import generatePassword from "generate-password";
import QRCode from "qrcode.react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { toast } from "../ui/use-toast";
import ValidatedSwitch from "./validated-switch";

const defaultValues = {
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

export const PasswordSchema = z
  .object({
    length: z
      .number()
      .min(1, "Password length must be at least 1")
      .max(128, "Password length must be no more than 128"),
    uppercase: z.boolean(),
    lowercase: z.boolean(),
    numbers: z.boolean(),
    symbols: z.boolean(),
  })
  .refine(
    (data) => {
      const { uppercase, lowercase, numbers, symbols } = data;
      return uppercase || lowercase || numbers || symbols;
    },
    { message: "at least one field must be true" }
  );

const copyToClipboard = (password: string) => {
  navigator.clipboard
    .writeText(password)
    .then(() => {
      toast({
        title: "Password copied to the clipboard",
        description:
          "Your password has been copied to the clipboard: " + password,
      });
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
};

export function PasswordGenerator() {
  const { control, watch, setValue } = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues,
  });

  const [generatedPassword, setGeneratedPassword] = useState<string>(
    generatePassword.generate(defaultValues)
  );

  const handleGenerate = () => {
    const values = watch();
    const validationResult = PasswordSchema.safeParse(values);
    if (validationResult.success) {
      const password = generatePassword.generate(values);
      setGeneratedPassword(password);
      copyToClipboard(password);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="flex justify-center items-center gap-4 w-full px-10">
      <Card className="w-3/4">
        <CardHeader className="space-y-1">
          <CardTitle>Generate Password</CardTitle>
          <CardDescription>
            Customize your password criteria and length
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onChange={handleGenerate}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="password">Your Password</Label>
              <Input
                id="password"
                readOnly
                type="text"
                value={generatedPassword}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="length">Password Length</Label>
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={128}
                      step={1}
                      onValueChange={(values) => setValue("length", values[0])}
                      className="w-full"
                    />
                  )}
                />
              </div>
              <ValidatedSwitch
                name="uppercase"
                control={control}
                watch={watch}
                setValue={setValue}
              />
              <ValidatedSwitch
                name="lowercase"
                watch={watch}
                control={control}
                setValue={setValue}
              />
              <ValidatedSwitch
                name="numbers"
                watch={watch}
                control={control}
                setValue={setValue}
              />
              <ValidatedSwitch
                name="symbols"
                watch={watch}
                control={control}
                setValue={setValue}
              />
            </div>
            <Button type="submit">Generate new Password</Button>
          </form>
        </CardContent>
      </Card>
      <div className="w-1/4 flex items-center justify-center">
        <QRCode value={generatedPassword} />
      </div>
    </div>
  );
}
