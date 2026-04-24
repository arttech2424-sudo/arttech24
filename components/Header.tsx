import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Our Work" },
  { href: "/explore", label: "Explore Ideas" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          Art<span>Tech</span>24
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/calculator" className="btn btn-primary btn-sm">
          Get Free Estimate
        </Link>
      </div>
    </header>
  );
}
