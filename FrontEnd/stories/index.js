import React from 'react';
import { storiesOf } from '@storybook/react';

import RatingItem from '../src/components/items/RatingItem';
import ProducerPost from '../src/components/producer/ProducerPost';
import ProducerHeader from '../src/components/producer/ProducerHeader';

import ProducerUserInteraction from '../src/components/producer/ProducerUserInteraction';
import NewPost from '../src/components/mur/NewPost';

storiesOf('RatingItem', module)
  .add('Default value', () => (
    <RatingItem/>
  ))
  .add('value = 2', () => (
    <RatingItem defaultValue={2}/>
  ))
  .add('value = 10', () => (
    <RatingItem defaultValue={10}/>
  ))
  .add('readOnly = true', () => (
    <RatingItem defaultValue={2} readOnly={true}/>
  ));

const post = 'Nullam sed felis sapien. Sed vitae purus vehicula tortor fringilla dictum. Donec suscipit, nunc et convallis laoreet, arcu leo suscipit est, quis tempus sapien eros sed lectus. Suspendisse et urna in eros scelerisque sodales. Morbi id neque sagittis ante consectetur posuere id sed nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta nisl ipsum, in pulvinar purus porta ac. Nam maximus et leo id auctor. Vivamus rutrum fringilla nunc ac ullamcorper. Suspendisse pulvinar sem auctor, porttitor nisi non, elementum leo. In quis enim interdum, semper purus id, faucibus tellus.';
storiesOf('ProducerPost', module)
  .add('Default', () => (
    <ProducerPost
      name="Nom tres tres tres long dss  dsdsd sdsdssdsds dsdsdsds"
      date="12.12.2014 8h40"
      post={post}
    />
  ));
  
const description = 'Nullam sed felis sapien. Sed vitae purus vehicula tortor fringilla dictum. Donec suscipit, nunc et convallis laoreet, arcu leo suscipit est, quis tempus sapien eros sed lectus. Suspendisse et urna in eros scelerisque sodales. Morbi id neque sagittis ante consectetur posuere id sed nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta nisl ipsum, in pulvinar purus porta ac. Nam maximus et leo id auctor. Vivamus rutrum fringilla nunc ac ullamcorper. Suspendisse pulvinar sem auctor, porttitor nisi non, elementum leo. In quis enim interdum, semper purus id, faucibus tellus.';
storiesOf('ProducerHeader', module)
  .add('Default', () => (
    <ProducerHeader
      name="Un nom"
      description={description}
      ratingValue={1}
      nbRating={100}
    />
  ));

storiesOf('ProducerUserInteraction', module)
  .add('0 folower', () => (
    <ProducerUserInteraction
      followersCount={0}
    />
  ))
  .add('1 folower', () => (
    <ProducerUserInteraction
      followersCount={1}
    />
  ))
  .add('1000 folowers', () => (
    <ProducerUserInteraction
      followersCount={1000}
    />
  ));

storiesOf('NewPost', module)
  .add('Default', () => (
    <NewPost
      maxLenght={24}
    />
  ));