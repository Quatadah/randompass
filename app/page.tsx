import { PasswordGenerator } from "@/components/component/password-generator";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <PasswordGenerator />
    </div>
  );
}
