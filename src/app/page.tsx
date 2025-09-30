import "reflect-metadata";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
