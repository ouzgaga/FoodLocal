import React from 'react';
import { storiesOf } from '@storybook/react';

import RatingItem from '../src/components/items/RatingItem';
import ProducerPost from '../src/components/producer/ProducerPost';
import ProducerHeader from '../src/components/producer/ProducerHeader';

import ProducerUserInteraction from '../src/components/producer/ProducerUserInteraction';
import NewPost from '../src/components/mur/NewPost';
import AdressContainer from '../src/components/items/AdressContainer';
import CenteredPaper from '../src/components/items/CenteredPaper';
import StatusForm from '../src/components/newUser/StatusForm';
import InformationsForm from '../src/components/newUser/InformationsForm';
import GeneralsConditionForm from '../src/components/newUser/GeneralsConditionForm';
import InputPassword from '../src/components/items/InputPassword';
import BoxWithHeader from '../src/components/items/BoxWithHeader';
import BorderedTextField from '../src/components/items/fields/BorderedTextField';
import BorderedPasswordField from '../src/components/items/fields/BorderedPasswordField';
import BoxLeftRight from '../src/components/accouontCRUD/BoxLeftRight';
import TableProducerItem from '../src/components/admin/TableProducerItem';
import BorderedCountField from '../src/components/items/fields/BorderedCountField';
import DropZone from '../src/components/items/DropZone';
import BadgeMax from '../src/components/items/BadgeMax';


storiesOf('RatingItem', module)
  .add('Default value', () => (
    <RatingItem />
  ))
  .add('value = 2', () => (
    <RatingItem defaultValue={2} />
  ))
  .add('value = 10', () => (
    <RatingItem defaultValue={10} />
  ))
  .add('readOnly = true', () => (
    <RatingItem defaultValue={2} readOnly={true} />
  ));

const post = 'Nullam sed felis sapien. Sed vitae purus vehicula tortor fringilla dictum. Donec suscipit, nunc et convallis laoreet, arcu leo suscipit est, quis tempus sapien eros sed lectus. Suspendisse et urna in eros scelerisque sodales. Morbi id neque sagittis ante consectetur posuere id sed nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta nisl ipsum, in pulvinar purus porta ac. Nam maximus et leo id auctor. Vivamus rutrum fringilla nunc ac ullamcorper. Suspendisse pulvinar sem auctor, porttitor nisi non, elementum leo. In quis enim interdum, semper purus id, faucibus tellus.';
storiesOf('ProducerPost', module)
  .add('Default', () => (
    <ProducerPost
      firstname="Antoine"
      lastname="Rochat"
      date="1997-07-16T19:20:30.45+01:00"
      post={post}
    />
  ))
  .add('With location', () => (
    <ProducerPost
      firstname="Antoine"
      lastname="Rochat"
      date="1997-07-16T19:20:30.45+01:00"
      post={post}
      location={{ latitude: 46.7833, longitude: 6.65 }}
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

storiesOf('AdressContainer', module)
  .add('Default', () => (
    <AdressContainer
      road="Route 1"
      city="2230 dfees"
      country="Suisse"
    />
  ));

storiesOf('CenteredPaper', module)
  .add('Text element', () => (
    <CenteredPaper>
      Hello
    </CenteredPaper>
  ))
  .add('Single div', () => (
    <CenteredPaper>
      <div>Hello</div>
    </CenteredPaper>
  ))
  .add('Multiple div', () => (
    <CenteredPaper>
      <div>Hello</div>
      <div>Word</div>
    </CenteredPaper>
  ));



storiesOf('InformationsForm', module)
  .add('InformationsForm', () => (
    <InformationsForm
      onChange={e => e}
    />
  ));

storiesOf('StatusForm', module)
  .add('StatusForm', () => (
    <StatusForm
      onChange={e => e}
    />
  ));

storiesOf('InputPassword', module)
  .add('Default', () => (
    <InputPassword
      onChange={e => e}
    />
  ))
  .add('label + required', () => (
    <InputPassword
      label='Mot de passe'
      required
      onChange={e => e}
    />
  ));

storiesOf('GeneralsConditionForm', module)
  .add('GeneralsConditionForm', () => (
    <GeneralsConditionForm
      onChange={e => e}
    />
  ));

storiesOf('BoxWithHeader', module)
  .add('empty', () => (
    <BoxWithHeader />
  )).add('no header', () => (
    <BoxWithHeader>hello word</BoxWithHeader>
  )).add('header + body', () => (
    <BoxWithHeader
      header="Informations personnels"
    >
      Ceci est un test.
    </BoxWithHeader>
  ));


storiesOf('BorderedTextField', module)
  .add('no data', () => (
    <BorderedTextField />
  ))
  .add('Default value', () => (
    <BorderedTextField
      defaultValue=""
    />
  ))
  .add('fullWidth', () => (
    <BorderedTextField
      defaultValue=""
      fullWidth
    />
  ));

storiesOf('BorderedPasswordField', module)
  .add('no data', () => (
    <BorderedPasswordField />
  ))
  .add('Default value', () => (
    <BorderedPasswordField
      defaultValue="Hello word"
    />
  ))
  .add('fullWidth', () => (
    <BorderedPasswordField
      defaultValue="Hello word"
      fullWidth
    />
  ));

storiesOf('BorderedCountField', module)
  .add('BorderedCountField', () => (
    <BorderedCountField
      value="test"

    />
  ))

storiesOf('BoxLeftRight', module)
  .add('BoxLeftRight', () => (
    <BoxLeftRight
      title="hello"
    >
      world
    </BoxLeftRight>
  ));


storiesOf('TableProducerItem', module)
  .add('producer item', () => (
    <TableProducerItem id={1234} name="La Ferme Du Bois" />
  ));

storiesOf('DropZone', module)
  .add('Dropzone', () => (
    <DropZone />
  ));

storiesOf('NotificationBagde', module)
.add('No notifications', () => (
  <BadgeMax value={0} />
))
.add('10 notifications', () => (
  <BadgeMax value={10} />
))
.add('> max value (99)', () => (
  <BadgeMax value={100} />
));