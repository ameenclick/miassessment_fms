
import SignIn from "./SignIn";
import dynamic from 'next/dynamic';
const MyHead  = dynamic(() => import("../components/WebHead"));
const Nav = dynamic(() => import("../components/Nav"));

export default function Home(){
  return(
    <>
     <MyHead />
      <Nav />
      {/* <SignIn /> */}
    </>
    
  )
} 