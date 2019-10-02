import React from 'react';

// TODO fix gallery styles on mobile

export const GalleryStyles = () => (
  <style global jsx>{`
    @font-face {
      font-family: 'Ionicons';
      src: url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.eot?v=2.0.0');
      src: url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.eot?v=2.0.0#iefix')
          format('embedded-opentype'),
        url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.ttf?v=2.0.0')
          format('truetype'),
        url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.woff?v=2.0.0')
          format('woff'),
        url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.svg?v=2.0.0#Ionicons')
          format('svg');
      font-weight: normal;
      font-style: normal;
    }

    .image-gallery-fullscreen-button::before,
    .image-gallery-play-button::before,
    .image-gallery-left-nav::before,
    .image-gallery-right-nav::before {
      display: inline-block;
      font-family: 'Ionicons';
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      text-rendering: auto;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .image-gallery {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .image-gallery.fullscreen-modal {
      background: #000;
      bottom: 0;
      height: 100%;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 5;
    }
    .image-gallery.fullscreen-modal .image-gallery-content {
      top: 50%;
      transform: translateY(-50%);
    }

    .image-gallery-content {
      position: relative;
      line-height: 0;
      top: 0;
    }
    .image-gallery-content.fullscreen {
      background: #000;
    }
    .image-gallery-content.fullscreen .image-gallery-slide {
      background: #000;
    }

    .image-gallery-slide-wrapper {
      position: relative;
    }
    .image-gallery-slide-wrapper.left,
    .image-gallery-slide-wrapper.right {
      display: inline-block;
      width: calc(100% - 113px);
    }
    @media (max-width: 768px) {
      .image-gallery-slide-wrapper.left,
      .image-gallery-slide-wrapper.right {
        width: calc(100% - 84px);
      }
    }
    .image-gallery-slide-wrapper.image-gallery-rtl {
      direction: rtl;
    }

    .image-gallery-fullscreen-button,
    .image-gallery-play-button,
    .image-gallery-left-nav,
    .image-gallery-right-nav {
      appearance: none;
      background-color: transparent;
      border: 0;
      cursor: pointer;
      outline: none;
      position: absolute;
      z-index: 4;
    }
    .image-gallery-fullscreen-button::before,
    .image-gallery-play-button::before,
    .image-gallery-left-nav::before,
    .image-gallery-right-nav::before {
      color: #fff;
      line-height: 0.7;
      text-shadow: 0 2px 2px #1a1a1a;
      transition: color 0.2s ease-out;
    }
    .image-gallery-fullscreen-button:hover::before,
    .image-gallery-play-button:hover::before,
    .image-gallery-left-nav:hover::before,
    .image-gallery-right-nav:hover::before {
      color: #337ab7;
    }
    @media (max-width: 768px) {
      .image-gallery-fullscreen-button:hover::before,
      .image-gallery-play-button:hover::before,
      .image-gallery-left-nav:hover::before,
      .image-gallery-right-nav:hover::before {
        color: #fff;
      }
    }

    .image-gallery-fullscreen-button,
    .image-gallery-play-button {
      bottom: 0;
    }
    .image-gallery-fullscreen-button::before,
    .image-gallery-play-button::before {
      font-size: 2.7em;
      padding: 15px 20px;
      text-shadow: 0 1px 1px #1a1a1a;
    }
    @media (max-width: 768px) {
      .image-gallery-fullscreen-button::before,
      .image-gallery-play-button::before {
        font-size: 2.4em;
      }
    }
    @media (max-width: 480px) {
      .image-gallery-fullscreen-button::before,
      .image-gallery-play-button::before {
        font-size: 2em;
      }
    }
    .image-gallery-fullscreen-button:hover::before,
    .image-gallery-play-button:hover::before {
      color: #fff;
      transform: scale(1.1);
    }
    @media (max-width: 768px) {
      .image-gallery-fullscreen-button:hover::before,
      .image-gallery-play-button:hover::before {
        transform: none;
      }
    }

    .image-gallery-fullscreen-button {
      right: 0;
    }
    .image-gallery-fullscreen-button::before {
      content: '';
    }
    .image-gallery-fullscreen-button.active::before {
      content: '';
    }
    .image-gallery-fullscreen-button.active:hover::before {
      transform: scale(0.9);
    }

    .image-gallery-play-button {
      left: 0;
    }
    .image-gallery-play-button::before {
      content: '';
    }
    .image-gallery-play-button.active::before {
      content: '';
    }

    .image-gallery-left-nav,
    .image-gallery-right-nav {
      color: #fff;
      font-size: 5em;
      padding: 50px 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    .image-gallery-left-nav[disabled],
    .image-gallery-right-nav[disabled] {
      cursor: disabled;
      opacity: 0.6;
      pointer-events: none;
    }
    @media (max-width: 768px) {
      .image-gallery-left-nav,
      .image-gallery-right-nav {
        font-size: 3.4em;
        padding: 20px 15px;
      }
    }
    @media (max-width: 480px) {
      .image-gallery-left-nav,
      .image-gallery-right-nav {
        font-size: 2.4em;
        padding: 0 15px;
      }
    }

    .image-gallery-left-nav {
      left: 0;
    }
    .image-gallery-left-nav::before {
      content: '';
    }

    .image-gallery-right-nav {
      right: 0;
    }
    .image-gallery-right-nav::before {
      content: '';
    }

    .image-gallery-slides {
      line-height: 0;
      overflow: hidden;
      position: relative;
      white-space: nowrap;
    }

    .image-gallery-slide {
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }
    .image-gallery-slide.center {
      position: relative;
    }

    .image-gallery-slide .image-gallery-description {
      background: rgba(0, 0, 0, 0.4);
      bottom: 70px;
      color: #fff;
      left: 0;
      line-height: 1;
      padding: 10px 20px;
      position: absolute;
      white-space: normal;
    }
    @media (max-width: 768px) {
      .image-gallery-slide .image-gallery-description {
        bottom: 45px;
        font-size: 0.8em;
        padding: 8px 15px;
      }
    }

    .image-gallery-bullets {
      bottom: 20px;
      left: 0;
      margin: 0 auto;
      position: absolute;
      right: 0;
      width: 80%;
      z-index: 4;
    }
    .image-gallery-bullets .image-gallery-bullets-container {
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .image-gallery-bullets .image-gallery-bullet {
      appearance: none;
      background-color: transparent;
      border: 1px solid #fff;
      border-radius: 50%;
      box-shadow: 0 1px 0 #1a1a1a;
      cursor: pointer;
      display: inline-block;
      margin: 0 5px;
      outline: none;
      padding: 5px;
    }
    @media (max-width: 768px) {
      .image-gallery-bullets .image-gallery-bullet {
        margin: 0 3px;
        padding: 3px;
      }
    }
    @media (max-width: 480px) {
      .image-gallery-bullets .image-gallery-bullet {
        padding: 2.7px;
      }
    }
    .image-gallery-bullets .image-gallery-bullet.active {
      background: #fff;
    }

    .image-gallery-thumbnails-wrapper {
      position: relative;
    }
    .image-gallery-thumbnails-wrapper.thumbnails-wrapper-rtl {
      direction: rtl;
    }
    .image-gallery-thumbnails-wrapper.left,
    .image-gallery-thumbnails-wrapper.right {
      display: inline-block;
      vertical-align: top;
      width: 108px;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnails-wrapper.left,
      .image-gallery-thumbnails-wrapper.right {
        width: 81px;
      }
    }
    .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
    .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
      height: 100%;
      width: 100%;
      left: 0;
      padding: 0;
      position: absolute;
      top: 0;
    }
    .image-gallery-thumbnails-wrapper.left
      .image-gallery-thumbnails
      .image-gallery-thumbnail,
    .image-gallery-thumbnails-wrapper.right
      .image-gallery-thumbnails
      .image-gallery-thumbnail {
      display: block;
      margin-right: 0;
      padding: 0;
    }
    .image-gallery-thumbnails-wrapper.left
      .image-gallery-thumbnails
      .image-gallery-thumbnail
      + .image-gallery-thumbnail,
    .image-gallery-thumbnails-wrapper.right
      .image-gallery-thumbnails
      .image-gallery-thumbnail
      + .image-gallery-thumbnail {
      margin-left: 0;
    }
    .image-gallery-thumbnails-wrapper.left {
      margin-right: 5px;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnails-wrapper.left {
        margin-right: 3px;
      }
    }
    .image-gallery-thumbnails-wrapper.right {
      margin-left: 5px;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnails-wrapper.right {
        margin-left: 3px;
      }
    }

    .image-gallery-thumbnails {
      overflow: hidden;
      padding: 5px 0;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnails {
        padding: 3px 0;
      }
    }
    .image-gallery-thumbnails .image-gallery-thumbnails-container {
      cursor: pointer;
      text-align: center;
      transition: transform 0.45s ease-out;
      white-space: nowrap;
    }

    .image-gallery-thumbnail {
      display: inline-block;
      border: 4px solid transparent;
      transition: border 0.3s ease-out;
      width: 100px;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnail {
        border: 3px solid transparent;
        width: 75px;
      }
    }
    .image-gallery-thumbnail + .image-gallery-thumbnail {
      margin-left: 2px;
    }
    .image-gallery-thumbnail .image-gallery-thumbnail-inner {
      position: relative;
    }
    .image-gallery-thumbnail img {
      vertical-align: middle;
      width: 100%;
    }
    .image-gallery-thumbnail.active {
      border: 4px solid #337ab7;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnail.active {
        border: 3px solid #337ab7;
      }
    }

    .image-gallery-thumbnail-label {
      box-sizing: border-box;
      color: white;
      font-size: 1em;
      left: 0;
      line-height: 1em;
      padding: 5%;
      position: absolute;
      top: 50%;
      text-shadow: 1px 1px 0 black;
      transform: translateY(-50%);
      white-space: normal;
      width: 100%;
    }
    @media (max-width: 768px) {
      .image-gallery-thumbnail-label {
        font-size: 0.8em;
        line-height: 0.8em;
      }
    }

    .image-gallery-index {
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      line-height: 1;
      padding: 10px 20px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 4;
    }
    @media (max-width: 768px) {
      .image-gallery-index {
        font-size: 0.8em;
        padding: 5px 10px;
      }
    }
    .image-gallery-image {
      height: 680px;
      text-align: center;
    }
    .image-gallery-image img {
      max-height: 100%;
      max-width: 100%;
    }
  `}</style>
);
