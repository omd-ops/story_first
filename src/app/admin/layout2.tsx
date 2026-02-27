import type { Metadata } from "next";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Admin",
  description: `Content management and user administration interface`,
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="admin-layout">
            <section>{children}</section>
        </div>
    )
}