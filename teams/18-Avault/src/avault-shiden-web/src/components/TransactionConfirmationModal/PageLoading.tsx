import React, { useRef } from 'react';
import styled from 'styled-components';
import lottie from 'lottie-web';
import { useEffect } from 'react';

const Wrapper = styled.div``;

function PageLoading() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg' as any,
      loop: true,
      autoplay: true,
      path: '/media/pageLoading.json',
    });

    return () => animation.destroy();
  }, []);

  return <Wrapper ref={ref}></Wrapper>;
}

export default PageLoading;
