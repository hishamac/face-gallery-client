import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Admin Navbar */}
      <header className="sticky top-0 z-40 w-full ">
        <div className="flex justify-center px-4 py-4">
          <AdminNavbar />
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <div className="flex justify-center mt-16">
        <Footer />
      </div>
    </div>
  );
}
