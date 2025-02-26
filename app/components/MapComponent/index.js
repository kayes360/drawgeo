import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/components/MapComponent/MapComponent'), {
  ssr: false,
});

export { MapComponent };