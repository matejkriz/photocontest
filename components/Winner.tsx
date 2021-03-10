import React from 'react';
import { Segment, Card, Image, Header, Icon, Reveal } from 'semantic-ui-react';

type Props = {
  title: string;
  image: string;
  winner: string;
  votes: string;
  description: string;
};
export const Winner: React.FC<Props> = ({
  title,
  image,
  winner,
  votes,
  description,
}) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
      </Card.Content>
      <Reveal animated="move up">
        <Reveal.Content visible>
          <Image src="/static/vitezne/skaut-h.png" size="medium" />
        </Reveal.Content>
        <Reveal.Content hidden>
          <a href={image} target="_blank">
            <Image src={image} size="medium" />
          </a>
          <Segment basic>
            <Header as="h4">
              <Icon name="winner" />
              {winner}
            </Header>
            <Card.Meta>
              <Icon name="star" />
              {votes} hlasů
            </Card.Meta>
            <Card.Description>{description}</Card.Description>
          </Segment>
        </Reveal.Content>
      </Reveal>
    </Card>
  );
};
