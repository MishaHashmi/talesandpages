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
        <meta property="og:image" content="/logo.png" />  
        <meta property="og:url" content="https://talesandpages.com" />
        <meta property="og:type" content="website" />

        {/* Optional Twitter Card Tags */}
        <meta name="twitter:card" content="Tales and Pages" />
        <meta name="twitter:title" content="Tales and Pages" />
        <meta name="twitter:description" content="Pages full of Tales" />
        <meta name="twitter:image" content="/logo.png" />  
      </head>
      <body>ß
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
