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
      <img src="/talesandpages.png" alt="Logo" className="block h-36 w-36" />
      <div className="text-6xl text-center font-bold text-orange-200  transition ease-in-out delay-150 duration-1000 hover:text-teal-100 ">
      
          TALES AND PAGES
      </div>
    </div>
  );
}
