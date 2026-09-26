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
      <section className="mt-14  w-full">
        <div
          className="font-bold text-3xl text-gray-800 "

        >
          {title}
        </div>
        <div
          className="mt-10"

        >
          {children}
        </div>
      </section>
    </MainLayout>
  );
};

export default SectionLayout;
