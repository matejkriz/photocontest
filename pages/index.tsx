import React from 'react';
import {
  Container,
  Divider,
  Header,
  List,
  Message,
  Image,
} from 'semantic-ui-react';

const Index = () => {
  return (
    <Container text>
      <Header as="h1" inverted color="yellow">
        FOTOSOUTĚŽ
      </Header>
      <Header as="h2" disabled inverted>
        ...ANEB, HLEDÁ SE FOTKA TŘICETILETÍ
      </Header>
      <Image
        src="/static/skaut.png"
        centered
        alt="Skaut s foťákem místo hlavy"
      />
      <Header as="h2" inverted>
        PRAVIDLA
      </Header>
      <Message color="black">
        K příležitosti oslav třicetiletého výročí našeho střediska, vyhlašujeme
        fotografickou soutěž. Možná právě ty jsi autorem fotky třicetiletí, tak
        neváhej a vydej se vstříc svému fotoarchivu!
      </Message>
      <Divider />
      <Header as="h3" inverted>
        TERMÍNY
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">
          Přihlašování fotografií je již spuštěno, ukončeno bude 30. 9. 2019.
          {/* FIXME datum */}
        </List.Item>
        <List.Item as="li">
          Hlasování bude spuštěno začátkem října a ukončeno 29. 2. 2019.d
          {/* FIXME datum */}
        </List.Item>
        <List.Item as="li">
          Vyhlášení vítězů proběhne v rámci oslav 4. 4. 2020.d
        </List.Item>
      </List>
      <Divider />
      <Header as="h3" inverted>
        KATEGORIE
      </Header>
      Hledej fotografie spojené s existencí našeho střediska a přihlašuj je do
      následujících kategorií:
      <List as="ul" inverted>
        <List.Item as="li">Dobrodružstvíd</List.Item>
        <List.Item as="li">Zlomové okamžikyd</List.Item>
        <List.Item as="li">Humord</List.Item>
        <List.Item as="li">Přátelstvíd</List.Item>
      </List>
      <Message color="black">
        Fotografie budou hodnoceny vždy v rámci dané kategorie, každá kategorie
        bude mít tedy svého vítěze. Do kategorie Humor můžeš přihlásit i soubor
        dvou fotografií, kdy jedna bude rekonstrukcí té druhé, staré fotografie.
        Takovýto soubor se bude považovat za jednu přihlášenou fotografii.
        (např. na jedné fotografii budou tři děti ve stanu, na druhé fotografii
        budou titíž lidé, jen o 30 let později…)
      </Message>
      <Divider />
      <Header as="h3" inverted>
        FOTOGRAFIE
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">
          Do soutěže můžeš přihlásit maximálně <b>10 fotografií</b> napříč
          kategoriemi. Je tedy na tobě, zda do jedné kategorie přihlásíš fotek 9
          a do druhé jen 1.
        </List.Item>
        <List.Item as="li">
          Fotografie nahrávej v plné kvalitě. Je samozřejmě možné přihlásit i
          sken staré fotografie, kterou nemáš v digitální podobě.
        </List.Item>
        <List.Item as="li">
          K přihlašovaným fotografiím se pokusit zjistit co nepřesněji co
          zachycuje (akce, termín, jména lidí, kteří jsou na fotografii…) Tyto
          údaje se budou uvádět do popisu fotografie a budou uveřejněny.
        </List.Item>
        <List.Item as="li">
          Přihlášením fotografie dáváš souhlas k jejímu uveřejnění v rámci
          oslav. (Zvětšení na stěnu, uveřejnění v kalendáři či jiných
          památečních publikacích.
        </List.Item>
        <List.Item as="li">
          S ohledem na výše uvedené, jako přihlašovatel fotografie zajistíš, že
          osoby zachycené na soutěžním snímku, souhlasí se zveřejněním dané
          fotografie a jejím použitím dle pravidel fotosoutěže.
        </List.Item>
        <List.Item as="li">
          Přihlásit lze i fotografii, jiného autora. A to pouze v případě, že
          nelze autora dohledat, nebo se autor fotografie nechce zúčastnit a dá
          ti svolení k přihlášení.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3" inverted>
        HLASOVÁNÍ
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">
          Možnost rozhodnout o vítězi budou mít všichni současní i bývalí
          členové střediska.
        </List.Item>
        <List.Item as="li">
          Každý, kdo bude chtít hlasovat, si na webových stránkách soutěže
          vytvoří účet pod svým jménem skrze který bude fotky hodnotit.
        </List.Item>
        <List.Item as="li">
          Každý má <b>5 hlasů</b> pro jednu kategorii. Hlasy můžou být rozděleny
          libovolným způsobem. Je tedy možné udělit všech 5 hlasů jedné
          fotografii, či je rozdělit a udělit po jednom hlasu pěti fotografiím.
        </List.Item>
        <List.Item as="li">
          Lze hlasovat i pro svou vlastní fotografii.
        </List.Item>
        <List.Item as="li">
          Průběžné výsledky hlasování nebudou u fotografií zveřejněny.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3" inverted>
        WEB SOUTĚŽE
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">
          Na těchto stránkách je možné fotografie do soutěže jak přihlásit, tak
          hodnotit.
        </List.Item>
        <List.Item as="li">
          Za tímto účelem si prosím zřiď jednoduchý účet pod svým vlastním
          jménem, který bude sloužit i jako ověření, že jsi byl, nebo stále jsi
          členem střediska.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3" inverted>
        OSTATNÍ
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">Soutěžíme o věcné ceny!</List.Item>
        <List.Item as="li">
          Pokud bys v rámci procházení svého archivu narazil na další zajímavé
          fotografie, mapující život střediska, které by neměly upadnout v
          zapomnění a nechceš je do soutěže přihlásit, předej je prosím Matějovi
          nebo Flíčkovi. Fotografie budou využity pro účely výstavy.
        </List.Item>
        <List.Item as="li">
          Není potřeba zdůrazňovat, že se všichni zúčastnění budou chovat čestně
          a nebudou mít snahu pravidla soutěže obcházet. Vytváření duplicitních
          účtů, na jméno někoho jiného, s cílem hlasovat víckrát je samozřejmě
          zakázáno.
        </List.Item>
      </List>
      <Divider />
      <Header as="h3" inverted>
        KONTAKTY
      </Header>
      <List as="ul" inverted>
        <List.Item as="li">Pořadateli soutěže jsou Flíček a Matěj.</List.Item>
        <List.Item as="li">
          Pokud byste měli jakékoliv otázky, neváhejte nás kontaktovat:
          <List.List>
            <List.Item>Flíček - 607535669, krizova.bety@gmail.com</List.Item>
            <List.Item>Matěj - 775224369, matej@matejkriz.cz</List.Item>
          </List.List>
        </List.Item>
      </List>
    </Container>
  );
};

export default Index;
