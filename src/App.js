import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

//Hooks
import useGetImages from "./hooks/useGetImages";

//Components
import Button from "./components/Button";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const { images } = useGetImages();

  //Add new components moveable with initial values
  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
      },
    ]);
  };

  //removes the selected component
  const deleteMoveableSelected = () => {
    const newMoveables = moveableComponents.filter(({ id }) => id != selected);
    setMoveableComponents(newMoveables);
    setSelected(null);
  };

  //updates component when dragged
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  return (
    <main
      style={{
        maxHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          title={`Add Moveable ${moveableComponents.length + 1}`}
          action={addMoveable}
          bg={"linear-gradient(to bottom left,#1d8cf8,#3358f4,#1d8cf8)"}
        />
        <Button
          title="Delete Moveable Selected"
          action={deleteMoveableSelected}
          bg={"linear-gradient(to bottom left,#fd5d93,#ec250d,#fd5d93)"}
        />
      </div>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            images={images}
            numIMage={index}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  numIMage,
  images,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    //ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    updateMoveable(id, {
      top: top + translateY,
      left: left + translateX,
      width: newWidth,
      height: newHeight,
      color,
    });

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${images[numIMage]?.url})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: images[numIMage] ? "" : color,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          const newTop = Math.max(parentBounds.top, e.top);
          const newLeft = Math.max(parentBounds.left, e.left);
          const maxTop = parentBounds.bottom - e.height;
          const maxLeft = parentBounds.right - e.width;
          const newTopAdjusted = Math.min(newTop, maxTop);
          const newLeftAdjusted = Math.min(newLeft, maxLeft);

          updateMoveable(id, {
            top: newTopAdjusted + -64,
            left: newLeftAdjusted - 8,
            width,
            height,
            color,
          });
        }}
        onResize={onResize}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        verticalGuidelines={[0, 100, 200, 300]}
      />
    </>
  );
};
