import type { Route } from "next";
import { redirect } from "next/navigation";

export default function ContentKitPage() {
  redirect("/dashboard" as Route);
}
