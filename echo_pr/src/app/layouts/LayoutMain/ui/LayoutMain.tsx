

import Footer from '@/shared/ui/footer/Footer';
import Header from '@/shared/ui/header/Header';
const LayoutMain: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  return (

    <>
        <Header />
          {children}
        <Footer/>
    </>
     
  );
};

export default LayoutMain;