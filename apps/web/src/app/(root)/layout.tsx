import Footer from "@/components/root/Footer";
import Header from "@/components/root/Header";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Bg*/}
      <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#ffffff33_1px,#0a0a0a_1px)] dark:bg-size-[20px_20px]"></div>

      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
