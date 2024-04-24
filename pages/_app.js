import 'styles/globals.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from 'next-auth/react';
const queryClient = new QueryClient();
import 'styles/Halaqa.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
