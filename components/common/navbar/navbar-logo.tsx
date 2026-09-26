import logo from "@/public/images/logo.svg";
import Image from "next/image";
import Link from "next/link"
const NavbarLogo = () => (
  <Link href="/" className="flex justify-center items-center gap-x-3 text-customGreen">
    <Image className="sm:w-full sm:min-w-[200px] w-40" src={logo} alt="Logo" loading="lazy" />
  </Link>
);

export default NavbarLogo;
