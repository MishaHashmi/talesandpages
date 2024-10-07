import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Tales and Pages" />
        <meta property="og:description" content="Pages full of Tales" />
        <meta property="og:image" content="/talesandpages.png" />  
        <meta property="og:url" content="https://talesandpages.com" />
        <meta property="og:type" content="website" />

        {/* Optional Twitter Card Tags */}
        <meta name="twitter:card" content="Tales and Pages" />
        <meta name="twitter:title" content="Tales and Pages" />
        <meta name="twitter:description" content="Pages full of Tales" />
        <meta name="twitter:image" content="/talesandpages.png" />  
      </head>
      <body className="bg-white dark:bg-gray-800">
      <div className="text-4xl text-center font-black bg-orange-100 dark:bg-sky-300 text-white dark:text-white animation ease-in-out delay-150 duration-1000 hover:text-sky-200 dark:hover:text-sky-300 hover:bg-amber-200  py-6 mb-6">
        <a href="/">TALES AND PAGES</a>
      </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
