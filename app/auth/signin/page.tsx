import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = cookies();
  const callbackUrl = cookieStore.get("next-auth.callback-url")?.value || "/";

  redirect(callbackUrl);
};

export default Page;
