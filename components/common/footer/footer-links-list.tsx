import Link from "next/link";

interface LinkItem {
  name: string;
  href: string;
}

interface FooterLinksListProps {
  title: string;
  links?: LinkItem[];
}

const FooterLinksList: React.FC<FooterLinksListProps> = ({ title, links }) => {
  return (
    <div className="footer-links-content">
      <h3 className="text-xl font-bold text-gray-700 mb-5">{title}</h3>
      <ul>
        {links?.map((link) => (
          <li key={link.name} className="text-[14px] font-semibold text-gray-500 mt-2">
            <Link href={link.href} title={link.name} aria-label={link.name}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinksList;
