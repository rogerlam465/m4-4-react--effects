import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Item from './Item';
import useInterval from '../hooks/use-interval.hook'

import cookieSrc from "../cookie.svg";

const items = [
  { id: "cursor", name: "Cursor", cost: 10, value: 1 },
  { id: "grandma", name: "Grandma", cost: 100, value: 10 },
  { id: "farm", name: "Farm", cost: 1000, value: 80 },
];

// think further upon the logic here

function useKeydown(keypress, callback) {
  function handleKeyPress(ev) {
    if (ev.key === keypress) {
      callback();
    }
  }
  React.useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    }
  })
}

const Game = () => {
  // TODO: Replace this with React state!

  const [numCookies, setNumCookies] = React.useState(100);

  const [purchasedItems, setPurchasedItems] = React.useState({
    cursor: 0,
    grandma: 0,
    farm: 0,
  })

  useKeydown('space', () => setNumCookies(numCookies + 1));

  // this shouldn't be so hard. We just need to do the math.

  function calculateCookiesPerTick(data) {

    let totalCookies = 0;

    items.forEach((item) => {
      totalCookies += item.value * data[item.id];
    })

    return totalCookies;
  }

  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems)

    setNumCookies(numCookies + numOfGeneratedCookies);
    // Add this number of cookies to the total
  }, 1000)

  React.useEffect(() => {
    document.title = `${numCookies} cookies!`;
  })

  function handleKeyPress(ev) {
    if (ev.key === "Space") {
      setNumCookies(numCookies + 1);
    }
  }

  let isFirst = true;



  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          {/* TODO: Calcuate the cookies per second and show it here: */}
          <strong>{calculateCookiesPerTick(purchasedItems)}</strong> cookies per second
        </Indicator>
        <Button onClick={() => {
          setNumCookies(numCookies + 1);
        }}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {/* TODO: add purchase functionality
        move map logic up; this will allow us to pass the isFirst prop down
        */}

        {items.map((item, index) => {

          return <Item
            itemData={item}
            numOwned={purchasedItems[item.id]}
            index={index}
            handleClick={(item) => {
              if (item.cost > numCookies) {
                window.alert("Insufficient cookies!");
              } else {
                setNumCookies(numCookies - item.cost);
                setPurchasedItems({
                  ...purchasedItems,
                  [item.id]: purchasedItems[item.id] + 1,
                });
              }
            }
            } />
        })}

      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper >
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
