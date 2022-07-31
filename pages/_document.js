import { Html, Head, Main, NextScript } from "next/document";

export default function Document(){
    return(
        <Html>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="./images/Logo.png" />
                <meta name="theme-color" content="#000000" />
                <meta
                name="description"
                content="Multiple Intelligence Assessment Franchise Management System"
                />

                {/* <!-- Bootstrap CSS --> */}
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/>
                {/* <!-- Option 1: Bootstrap Bundle with Popper --> */}
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
                {/* <!--Font Awesome--> */}
                <script src="https://kit.fontawesome.com/0c22a872da.js" crossOrigin="anonymous"></script>
                {/* Animations from W3 */}
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
             </Head>
             <Main />
             <NextScript />
        </Html>
    )
}