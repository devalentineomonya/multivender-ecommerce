import MainLayout from "../main/main-layout";

interface SectionLayoutProps {
  children: React.ReactNode;
  title: string;
  overflow?: boolean;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  title,
  overflow = false,
}) => {
  return (
    <MainLayout className={overflow ? "overflow-visible" : ""}>
      <section className="mt-14 w-full">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <div className="mt-10">{children}</div>
      </section>
    </MainLayout>
  );
};

export default SectionLayout;
