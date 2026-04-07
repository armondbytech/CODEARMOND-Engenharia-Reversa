import { Timestamp } from 'firebase/firestore';

export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type Extension = 'png' | 'svg' | 'jpeg' | 'webp';

export interface QRConfig {
  data: string;
  width: number;
  height: number;
  margin: number;
  image: string | null;
  dotsOptions: {
    color: string;
    type: DotType;
  };
  backgroundOptions: {
    color: string;
  };
  cornersSquareOptions: {
    color: string;
    type: CornerSquareType;
  };
  cornersDotOptions: {
    color: string;
    type: CornerDotType;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
  };
}

export interface QRCodeConfig {
  id: string;
  name: string;
  data: string;
  config: QRConfig;
  createdAt: Timestamp;
}

export const defaultConfig: QRConfig = {
  data: 'https://qr-code-styling.com',
  width: 300,
  height: 300,
  margin: 10,
  image: null,
  dotsOptions: {
    color: '#f97316',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#f97316',
    type: 'extra-rounded',
  },
  cornersDotOptions: {
    color: '#f97316',
    type: 'dot',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
};
