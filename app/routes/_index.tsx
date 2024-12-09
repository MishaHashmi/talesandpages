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
    <div className=" flex flex-col items-center justify-center">
      <a href="/login"  className="text-1xl text-center text-rose-200 dark:text-rose-300" >Log In</a>
      <a href="/dashboard"  className="text-1xl text-center text-sky-200 dark:text-sky-300" >Dashboard</a>
      <div className="group mt-24">
          <div className="sm:text-6xl text-4xl text-center font-bold text-yellow-100 dark:text-yellow-300 animation ease-in-out delay-150 duration-1000 group-hover:text-teal-300">
            TALES AND PAGES
          </div>
          <div className="sm:text-6xl text-4xl  text-center font-bold text-amber-100 dark:text-amber-300 animation ease-in-out delay-150 duration-1000 group-hover:text-cyan-300 -mt-5 group-hover:-mt-3 ">
            TALES AND PAGES
          </div>
          <div className="sm:text-6xl  text-4xl  text-center font-bold text-orange-100 dark:text-orange-300 animation ease-in-out delay-150 duration-1000 group-hover:text-sky-300 -mt-5 group-hover:-mt-3 ">
            TALES AND PAGES
          </div>
      </div>

      <div className=" flex flex-col items-center justify-center  mt-24">
        <div className="text-center bg-sky-300 m-2 p-2 text-white">Demo: tale generation</div>
        <img className="w-3/4 box-border border-2 rounded-md border-rose-200 dark:border-rose-300 " src="/screenshot.png" />
      </div>
      
    </div>
  );
}
