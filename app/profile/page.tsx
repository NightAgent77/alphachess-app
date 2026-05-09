import AuthForm from "@/components/AuthForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <AuthForm />
    </div>
  );
}
