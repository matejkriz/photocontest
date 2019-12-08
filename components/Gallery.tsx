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
          original: photo.viewFilePath,
          thumbnail: photo.thumbFilePath,
          description: photo.description,
        }))}
        infinite={false}
        showPlayButton={false}
        showIndex
        lazyLoad
        thumbnailPosition="top"
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
