import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
} from 'react';
import 'firebase/firestore';
import {
  Container,
  Menu,
  Message,
  Header,
  Item,
  Segment,
  Button,
  Icon,
  Table,
} from 'semantic-ui-react';
import { AskForAuthorization } from '../components/AskForAuthorization';
import { Categories } from '../components/Categories';
import { FirebaseType } from '../components/Firebase';
import { useStateValue, Photo } from '../components/StateProvider';
import { groupBy } from '../lib/arrays';
import { getSafe } from '../lib';
import { colors } from '../theme/colors';
import { results } from '../results';

interface Props {
  firebase?: FirebaseType;
}

interface PhotosByUid {
  [key: string]: Array<Photo>;
}

interface PhotoWithVotes extends Photo {
  user?: string;
  votes?: number;
}

const groupByUid = groupBy('uid');

async function fetchPhotos(
  firebase: FirebaseType,
  photos: MutableRefObject<PhotosByUid>,
  forceUpdate: Dispatch<{}>,
) {
  const db = await firebase.firestore();
  const ref = await db.collection('photos').where('public', '==', true);
  const snapshot = await ref.get();

  const allPhotos = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Photo),
  }));

  photos.current = groupByUid(allPhotos);

  forceUpdate({}); // rerender children
}

async function fetchUsers(
  firebase: FirebaseType,
  users: MutableRefObject<any>,
  forceUpdate: Dispatch<{}>,
) {
  const db = await firebase.firestore();
  const ref = await db.collection('users');
  const snapshot = await ref.get();

  const allUsers = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  }));

  users.current = allUsers.reduce(
    (acc, curr) => ({ ...acc, [curr.uid]: { ...curr } }),
    {},
  );
  forceUpdate({}); // rerender children
}

const getActiveCategory = (
  category?: string,
):
  | 'dobrodruzstvi'
  | 'humor'
  | 'pratelstvi'
  | 'zlomove_okamziky'
  | undefined => {
  switch (category) {
    case 'dobrodruzstvi':
      return 'dobrodruzstvi';
    case 'humor':
      return 'humor';
    case 'pratelstvi':
      return 'pratelstvi';
    case 'zlomove_okamziky':
      return 'zlomove_okamziky';
    default:
      return undefined;
  }
};

const VotingPage = ({ firebase }: Props) => {
  const [{ user }] = useStateValue();
  const [, forceUpdate] = useState();
  const [selectedCategory, selectCategory] = useState<string>();
  const photos = useRef<PhotosByUid>({});
  const users = useRef<any>({});
  useEffect(() => {
    if (firebase && user.isSignedIn) {
      fetchPhotos(firebase, photos, forceUpdate);
      fetchUsers(firebase, users, forceUpdate);
    }
  }, [firebase, user.isSignedIn]);
  const activeCategory = getActiveCategory(selectedCategory);
  return (
    <Container>
      {user.isSignedIn && user.name ? (
        <Categories firebase={firebase}>
          {categories => (
            <>
              <Menu tabular stackable inverted>
                <Menu.Item header>Kategorie:</Menu.Item>
                {categories.map(({ key, value, text }) => (
                  <Menu.Item
                    key={key}
                    name={value}
                    active={selectedCategory === value}
                    onClick={() => selectCategory(value)}
                  >
                    {text}
                  </Menu.Item>
                ))}
              </Menu>
              {activeCategory ? (
                <Item.Group divided>
                  {(results[activeCategory] as Array<PhotoWithVotes>).map(
                    ({ uid, author, description, user, votes }) => {
                      const {
                        thumbFilePath = undefined,
                        viewFilePath = undefined,
                      } =
                        (uid &&
                          photos.current[uid] &&
                          photos.current[uid][0]) ||
                        {};
                      return (
                        <Item key={uid}>
                          {!!thumbFilePath && (
                            <Item.Image src={thumbFilePath} />
                          )}
                          <Item.Content>
                            <Segment>
                              <Table basic="very" celled collapsing>
                                <Table.Body>
                                  <Table.Row>
                                    <Table.Cell>
                                      <Header as="h4" image>
                                        <Header.Content>Autor</Header.Content>
                                      </Header>
                                    </Table.Cell>
                                    <Table.Cell>{author}</Table.Cell>
                                  </Table.Row>
                                  <Table.Row>
                                    <Table.Cell>
                                      <Header as="h4" image>
                                        <Header.Content>Popis</Header.Content>
                                      </Header>
                                    </Table.Cell>
                                    <Table.Cell>{description}</Table.Cell>
                                  </Table.Row>
                                  {!!user && (
                                    <Table.Row>
                                      <Table.Cell>
                                        <Header as="h4" image>
                                          <Header.Content>
                                            Nahrál
                                          </Header.Content>
                                        </Header>
                                      </Table.Cell>
                                      <Table.Cell>
                                        {users.current[user].name}
                                      </Table.Cell>
                                    </Table.Row>
                                  )}
                                  <Table.Row>
                                    <Table.Cell>
                                      <Header as="h4" image>
                                        <Header.Content>Hlasy</Header.Content>
                                      </Header>
                                    </Table.Cell>
                                    <Table.Cell>{votes}</Table.Cell>
                                  </Table.Row>
                                </Table.Body>
                              </Table>
                              <Item.Extra>
                                <Button positive basic type="button">
                                  <a
                                    href={viewFilePath}
                                    download={
                                      `${author}-${description}`
                                        .replace(/[^a-z0-9]/gi, '_')
                                        .toLowerCase() + '.jpg'
                                    }
                                  >
                                    <Icon name="cloud download" /> Stáhnout
                                  </a>
                                </Button>
                              </Item.Extra>
                            </Segment>
                          </Item.Content>
                        </Item>
                      );
                    },
                  )}
                </Item.Group>
              ) : (
                <Message
                  warning
                  onClick={() =>
                    selectCategory(
                      getSafe(() => categories[0].value, undefined),
                    )
                  }
                >
                  Vyberte libovolnou kategorii.
                </Message>
              )}
            </>
          )}
        </Categories>
      ) : (
        <AskForAuthorization />
      )}
      <style jsx global>
        {`
          html body {
            background-color: ${colors.black};
            color: ${colors.whiteDirty};
          }
        `}
      </style>
    </Container>
  );
};

export default VotingPage;
