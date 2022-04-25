import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import Balance from 'components/Balance';
import { HistorySection } from 'components/History';
import { StreamSection } from 'components/Stream';
import { NO_BANNER } from 'utils/banner';

interface HomePageProps {
  noBanner: boolean;
}

const Home: NextPage<HomePageProps> = ({ noBanner }) => {
  return (
    <Layout className="mx-auto flex w-full flex-col items-center space-y-[30px]" noBanner={noBanner}>
      <Balance />
      <StreamSection />
      <HistorySection />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  if (!locale) {
    return {
      props: {},
    };
  }

  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`../translations/${locale}.json`)).default,
      noBanner: req.cookies[NO_BANNER] ?? false,
    },
  };
};

export default Home;
