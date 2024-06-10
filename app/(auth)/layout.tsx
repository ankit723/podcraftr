import LeftSideBar from "@/components/shared/leftSideBar";
import RightSideBar from "@/components/shared/rightSideBar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        {children}
    </main>
  );
}
