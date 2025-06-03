import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

function NavBar() {
    const location = useLocation();

    const navItems = [
        { name: "Search", path: "/" },
        { name: "Inverse Doc ID", path: "/inverse-doc-id" },
        { name: "Inverse Doc Term", path: "/inverse-doc-term" }
    ];

    return (
        <nav className="border-b">
            <div className="mx-auto px-7 max-w-3xl sm:max-w-6xl sm:px-16">
                <div className="flex gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "px-4 py-4 text-sm font-medium transition-colors hover:text-primary",
                                location.pathname === item.path ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default NavBar; 