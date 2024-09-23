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
      <a href="/login"  className="text-1xl text-center text-rose-200" >Log In</a>
      <a href="/dashboard"  className="text-1xl text-center text-sky-200" >Dashboard</a>
      <div className="group mt-24">
          <div className="sm:text-6xl text-4xl text-center font-bold text-yellow-100 animation ease-in-out delay-150 duration-1000 group-hover:text-teal-100">
            TALES AND PAGES
          </div>
          <div className="sm:text-6xl text-4xl  text-center font-bold text-amber-100 animation ease-in-out delay-150 duration-1000 group-hover:text-cyan-100 -mt-5 group-hover:-mt-3 ">
            TALES AND PAGES
          </div>
          <div className="sm:text-6xl  text-4xl  text-center font-bold text-orange-100 animation ease-in-out delay-150 duration-1000 group-hover:text-sky-100 -mt-5 group-hover:-mt-3 ">
            TALES AND PAGES
          </div>
      </div>

    </div>
  );
}
