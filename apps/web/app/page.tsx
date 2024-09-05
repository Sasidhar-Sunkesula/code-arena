import { getServerSession } from "next-auth";
import { Appbar } from "../components/app-bar";
import { authOptions } from "@/lib/auth";

async function getUser() {
  const user = await getServerSession(authOptions);
  return user;
}
export default async function Home() {
  const user = await getUser();
  return (
    <div>
      hi there
      <Appbar />
      {JSON.stringify(user)}
    </div>
  );
}
