import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Story First ",
  description: `Storytelling is treated as innate rather than learnable; no rigorous programs teach it as daily practice. Sonny Caberwal developed a curriculum for daily micro-learning, inspired by Duolingo, Wordle, Strava.
  Adults who want to improve their storytelling skills need a way to practice consistently because storytelling is treated as an innate talent rather than a learnable skill. Currently, there are no rigorous programs that train storytelling systematically.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
