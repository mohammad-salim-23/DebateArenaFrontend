import Banner from "@/components/Banner/Banner";
import Debates from "@/components/Debates/DebateforHome";


export default function Home() {
  return (
   <div>
    <Banner/>
    <div className="container mx-auto px-3 my-10 lg:my-20">
     <Debates/>
    </div>
   </div>
  );
}
