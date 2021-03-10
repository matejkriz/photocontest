import React from 'react';
import Link from 'next/link';
import {
  Card,
  Container,
  Divider,
  Header,
  List,
  Message,
  Image,
  Segment,
} from 'semantic-ui-react';
import { Winner } from '../components/Winner';

const Index = () => {
  return (
    <Container text>
      <Header as="h1" color="yellow">
        FOTOSOUTĚŽ
      </Header>
      <Header as="h2" disabled>
        ...ANEB, HLEDÁ SE FOTKA TŘICETILETÍ
      </Header>
      <Message info>
        Výsledky zveřejněny! Vyhlášení mělo proběhnout v rámci oslav výročí, ale
        vzhledem k nuceným odkladům jsme už nechtěli déle čekat.
      </Message>
      <Header as="h2">VÝSLEDKY</Header>
      <Segment>
        <Header as="h3">VÍTĚZOVÉ KATEGORIÍ – JAK JSTE HLASOVALI</Header>
        Kdo zvítězil v jednotlivých kategoriích se dozvíš odkrytím fotoskautů.
        Celkové pořadí se dozvíš{' '}
        <Link href="/results">
          <a>na záložce s Výsledky.</a>
        </Link>
        <Divider hidden />
        <Card.Group centered>
          <Winner
            title="Dobrodružství"
            image="/static/vitezne/dobrodruzstvi.png"
            winner="Karel Pašek - Stop."
            votes="37"
            description="Zrzek na vyhlídce při Cestě za záhadou - polární výpravě
                      do Raspenavy v Jizerských horách, Velikonoce 1994. Tato
                      fotka byla otištěna na titulní straně časopisu Skauting č.
                      8 1995."
          />
          <Winner
            title="Humor"
            image="/static/vitezne/humor.png"
            winner="Alžběta Křížová – Flíček"
            votes="36"
            description="Velikonoční výprava do Dobrušky, rok 2013. Rekonstrukční foto foceno u klubovny, 2019. Na fotce zleva: Méďa, Můra, Eda, Jára, Ríša"
          />
          <Winner
            title="Přátelství"
            image="/static/vitezne/pratelstvi.png"
            winner="Eliška Pašková Teddy"
            votes="26"
            description="Výprava skautek do Zbraslavic 1994"
          />
          <Winner
            title="Zlomové okamžiky"
            image="/static/vitezne/zlomove_okamziky.png"
            winner="Luboš Berka"
            votes="37"
            description="První středisková velikonoční výprava 1991 – Tanvald."
          />
        </Card.Group>
        <Header as="h3" block>
          Vítěz každé kategorie vyhrál výtisk fotoknihy vytvořený k výročí 30
          let Uraganu
        </Header>
        <a href="http://www.uragan-zbraslav.cz/fotokniha2020/" target="_blank">
          <Image src="/static/vyhra.png" centered alt="Fotokniha jako výhra" />
        </a>
        <Divider hidden />
        <Message info>
          <Header as="h3">
            Kolik hlasů získaly tvé fotky a jak se umístily tvé oblíbené?
            <br />
            <Link href="/results">
              <a>Koukni na záložku Výsledky.</a>
            </Link>
          </Header>
        </Message>
      </Segment>
      <Divider />
      <Header as="h2">PRAVIDLA</Header>
      <Message color="yellow">
        <Message.Header>
          K příležitosti oslav třicetiletého výročí našeho střediska, jsme
          vyhlásili fotografickou soutěž.
        </Message.Header>
        <p>
          Možná právě ty jsi autorem fotky třicetiletí, tak neváhej a vydej se
          vstříc svému fotoarchivu!
        </p>
      </Message>
      <Divider />
      <Header as="h3">TERMÍNY</Header>
      <List as="ul">
        <List.Item as="li">Přihlašování fotografií již skončilo.</List.Item>
        <List.Item as="li">Hlasování je již ukončeno.</List.Item>
        <List.Item as="li">Vítězové a celkové výsledky zveřejněny.</List.Item>
      </List>
      <Divider />
      <Header as="h3">KATEGORIE</Header>
      Hledali jsme fotografie spojené s existencí našeho střediska a
      přihlašovali je do následujících kategorií:
      <List as="ul">
        <List.Item as="li">Dobrodružství</List.Item>
        <List.Item as="li">Zlomové okamžiky</List.Item>
        <List.Item as="li">Humor</List.Item>
        <List.Item as="li">Přátelství</List.Item>
      </List>
      Kategorie by měly být chápány volně.
      <Message>
        Fotografie byly hodnoceny vždy v rámci dané kategorie, každá kategorie
        má tedy svého vítěze. Do kategorie Humor bylo možné přihlásit i soubor
        dvou fotografií, kdy jedna je rekonstrukcí té druhé, staré fotografie.
        Takovýto soubor je považován za jednu přihlášenou fotografii. (např. na
        jedné fotografii jsou tři děti ve stanu, na druhé fotografii jsou titíž
        lidé, jen o 30 let později…)
      </Message>
      <Divider />
      <Header as="h3">FOTOGRAFIE</Header>
      <List as="ul">
        <List.Item as="li">
          Do soutěže každý mohl přihlásit maximálně{' '}
          <strong>10 fotografií</strong> napříč kategoriemi.
        </List.Item>
        <List.Item as="li">
          Fotografie jsme měli nahrávat v co nejvyšší kvalitě. Bylo samozřejmě
          možné přihlásit i sken staré fotografie, kterou nemáš v digitální
          podobě.
        </List.Item>
        <List.Item as="li">
          K přihlašovaným fotografiím jsme se měli pokusit zjistit co nepřesněji
          co zachycuje (akce, termín, jména lidí, kteří jsou na fotografii…)
          Tyto údaje, pokud byly uvedené v popisu fotografie, jsou uveřejněny.
        </List.Item>
        <List.Item as="li">
          Přihlášením fotografie jsme dávali souhlas k jejímu uveřejnění v rámci
          oslav. (Zvětšení na stěnu, uveřejnění v kalendáři či jiných
          památečních publikacích.
        </List.Item>
        <List.Item as="li">
          S ohledem na výše uvedené, měl každý přihlašovatel fotografie
          zajistit, že osoby zachycené na soutěžním snímku, souhlasí se
          zveřejněním dané fotografie a jejím použitím dle pravidel fotosoutěže.
        </List.Item>
        <List.Item as="li">
          Přihlásit šlo i fotografii, jiného autora. A to pouze v případě, že
          nešlo autora dohledat, nebo se autor fotografie nechtěl zúčastnit a
          dal svolení k přihlášení.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3">HLASOVÁNÍ</Header>
      <List as="ul">
        <List.Item as="li">
          Možnost rozhodnout o vítězi měli všichni současní i bývalí členové
          střediska.
        </List.Item>
        <List.Item as="li">
          Každý, kdo chtěl hlasovat, si na webových stránkách soutěže musel
          vytvořit účet pod svým jménem skrze který se fotky hodnotily.
        </List.Item>
        <List.Item as="li">
          Každý měl <b>5 hlasů</b> pro jednu kategorii. Hlasy mohly být
          rozděleny libovolným způsobem. Bylo tedy možné udělit všech 5 hlasů
          jedné fotografii, či je rozdělit a udělit po jednom hlasu pěti
          fotografiím.
        </List.Item>
        <List.Item as="li">
          Bylo možné hlasovat i pro svou vlastní fotografii.
        </List.Item>
        <List.Item as="li">
          Průběžné výsledky hlasování nebyly u fotografií zveřejněny.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3">WEB SOUTĚŽE</Header>
      <List as="ul">
        <List.Item as="li">
          Na těchto stránkách bylo možné fotografie do soutěže jak přihlásit,
          tak hodnotit.
        </List.Item>
        <List.Item as="li">
          Za tímto účelem si prosím{' '}
          <Link href="/login">
            <a>zřiď jednoduchý účet</a>
          </Link>{' '}
          pod svým vlastním jménem, který bude sloužit i jako ověření, že jsi
          byl, nebo stále jsi členem střediska.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3">OSTATNÍ</Header>
      <List as="ul">
        <List.Item as="li">
          Soutěžili jsme o věcné ceny a věčnou slávu!
        </List.Item>
        <List.Item as="li">
          Pokud bys v rámci procházení svého archivu narazil na další zajímavé
          fotografie, mapující život střediska, které by neměly upadnout v
          zapomnění a nechtěl jsi je do soutěže přihlásit, předej je prosím co
          nejdříve Matějovi nebo Flíčkovi. Fotografie budou využity pro účely
          výstavy a brožury o historii střediska.
        </List.Item>
        <List.Item as="li">
          Není potřeba zdůrazňovat, že se všichni zúčastnění budou chovat čestně
          a nebudou mít snahu pravidla soutěže obcházet. Vytváření duplicitních
          účtů, na jméno někoho jiného, s cílem hlasovat víckrát je samozřejmě
          zakázáno.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3">KONTAKTY</Header>
      <List as="ul">
        <List.Item as="li">Pořadateli soutěže jsou Flíček a Matěj.</List.Item>
        <List.Item as="li">
          Pokud byste měli jakékoliv otázky, neváhejte nás kontaktovat:
          <List.List>
            <List.Item>Flíček - 607535669, krizova.bety@gmail.com</List.Item>
            <List.Item>Matěj - 775224369, matej@skaut.cz</List.Item>
          </List.List>
        </List.Item>
      </List>
      <Divider />
    </Container>
  );
};

export default Index;
