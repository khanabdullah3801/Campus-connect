import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventForm from "./EventForm";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const allowedRoles = ["ADMIN", "SOCIETY_HEAD", "FACULTY"];
  
  if (!allowedRoles.includes(userRole)) {
    redirect("/events");
  }

  return <EventForm />;
}
