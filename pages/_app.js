import "../styles/index.css"
import "../components/WebHead"
import { AuthProvider } from "../context/AuthProvider"


export default function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    )
  }