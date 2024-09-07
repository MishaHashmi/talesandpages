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
    <div className="h-screen flex items-center justify-center">
      <div className="text-6xl text-center font-bold text-orange-200">
          TALES AND PAGES
      </div>
    </div>
  );
}
