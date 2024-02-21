"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button"; // Assuming toast and Button are correctly imported

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Slider } from "../ui/slider";
import { toast } from "../ui/use-toast";


const defaultValues = {
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  special: true,
};

// Define the schema for the password generator form
const PasswordSchema = z.object({
  length: z
    .number()
    .min(1, "Password length must be at least 1")
    .max(128, "Password length must be no more than 128"),
  uppercase: z.boolean(),
  lowercase: z.boolean(),
  numbers: z.boolean(),
  special: z.boolean(),
});

const generatePassword = (data: z.infer<typeof PasswordSchema>) => {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?";
  let characterSet = "";

  if (data.uppercase) characterSet += upperChars;
  if (data.lowercase) characterSet += lowerChars;
  if (data.numbers) characterSet += numberChars;
  if (data.special) characterSet += specialChars;

  if (!data.uppercase && !data.lowercase && !data.numbers && !data.special) {
    toast({
      title: "Invalid Password Criteria",
      description: "Please select at least one character set to use",
    });
    return;
  }

  let password = "";
  for (let i = 0; i < data.length; i++) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    password += characterSet[randomIndex];
  }

  toast({
    title: "Password generated",
    description:
      "Your password has been generated and is ready to use: " + password,
  });
  return password;
};

export function PasswordGenerator() {
  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof PasswordSchema>
  >({
    resolver: zodResolver(PasswordSchema),
    defaultValues
  });
  
  const [generatedPassword, setGeneratedPassword] = useState(generatePassword(defaultValues));

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>Generate Password</CardTitle>
        <CardDescription>
          Customize your password criteria and length
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((e)=>setGeneratedPassword(generatePassword(e)))} className="space-y-4">
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
                    onValueChange={(values) => setValue("length", values[0])} // Assuming Slider calls onValueChange with the new value
                    className="w-full" // Adjust your slider's width as needed
                  />
                )}
              />
            </div>
            <Label htmlFor="uppercase">Uppercase</Label>
            <Controller
              name="uppercase"
              control={control}
              render={({ field }) => (
                <Switch
                  id="uppercase"
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("uppercase", checked)}
                />
              )}
            />

            <Label htmlFor="lowercase">Lowercase</Label>
            <Controller
              name="lowercase"
              control={control}
              render={({ field }) => (
                <Switch
                  id="lowercase"
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("lowercase", checked)}
                />
              )}
            />

            <Label htmlFor="numbers">Numbers</Label>
            <Controller
              name="numbers"
              control={control}
              render={({ field }) => (
                <Switch
                  id="numbers"
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("numbers", checked)}
                />
              )}
            />

            <Label htmlFor="special">Special Characters</Label>
            <Controller
              name="special"
              control={control}
              render={({ field }) => (
                <Switch
                  id="special"
                  checked={field.value}
                  onCheckedChange={(checked) => setValue("special", checked)}
                />
              )}
            />
          </div>
          <Button type="submit">Generate Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
