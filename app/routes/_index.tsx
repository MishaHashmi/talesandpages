import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Tales&Pages" },
    {
      name: "description",
      content: "Tales and Pages",
    },
  ];
};

export default function Index() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <a href="/login"  className="text-2xl text-center text-orange-200" >Log In</a>
      <a href="/dashboard"  className="text-2xl text-center text-teal-100" >Dashboard</a>
      <div className="text-6xl text-center font-bold text-orange-200  transition ease-in-out delay-150 duration-1000 hover:text-teal-100 ">
      
          TALES AND PAGES
      </div>
    </div>
  );
}
