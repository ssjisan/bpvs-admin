import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/context/Auth";
export const metadata = { title: "BPVS | Department of Environment" };
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
