import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta';
// import { usePriceCakeBusd } from 'state/farms/hooks';
import Container from './Container';

const StyledPage = styled(Container)`
  // min-height: calc(100vh);
  // min-height: calc(100vh - 64px);
  padding-top: 0;
  padding-bottom: 100px;
  padding-left: 0;
  padding-right: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 0;
    padding-right: 0;
    padding-top: 60px;
    padding-bottom: 16px;
  }
`;

const PageMeta = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // const cakePriceUsd = usePriceCakeBusd();
  // const cakePriceUsdDisplay = cakePriceUsd.gt(0)
  //   ? `$${cakePriceUsd.toNumber().toLocaleString(undefined, {
  //       minimumFractionDigits: 3,
  //       maximumFractionDigits: 3,
  //     })}`
  //   : '';

  const pageMeta = getCustomMeta(pathname, t) || {};
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta };
  // const pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title;
  const pageTitle = title;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  );
};

export default Page;
