import React from 'react';
import Link from 'next/link';
import { Message } from 'semantic-ui-react';
import ImageGallery from 'react-image-gallery';
import { GalleryStyles } from './GalleryStyles';
import { Photo } from './StateProvider';

interface Props {
  photos: Array<Photo>;
}

export const Gallery = ({ photos }: Props) =>
  photos && photos.length ? (
    <>
      <ImageGallery
        items={photos.map(photo => ({
          original: decodeURIComponent(photo.url),
          thumbnail: decodeURIComponent(photo.url),
        }))}
        infinite={false}
        showPlayButton={false}
        showIndex
        lazyLoad
      />
      <GalleryStyles />
    </>
  ) : (
    <Message warning>
      Zatím zde nejsou žádné fotografie. Což takhle nějakou{' '}
      <Link href="/upload">
        <a>nahrát</a>
      </Link>
      ?
    </Message>
  );
