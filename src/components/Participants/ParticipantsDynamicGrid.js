/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Participant from '../Participant';

const Participants = () => {
  const participants = useSelector((state) => state.participants);
  const totalParticipants = Object.keys(participants).length;

  // TODO: allow to choose the order via prop.
  const orderedParticipants = Object.values(participants).sort((a, b) => {
    return a.display.localeCompare(b.display);
  });

  const [minColumnWidth, setMinColumnWidth] = useState("50%");
  const gridRef = useRef(null);

  const calculateBestMinColumnWidth = (items, width, height) => {
    const sizes = [];

    for (let cols = 1; cols <= 12; cols++) {
      const rows = Math.ceil(items / cols);
      const horizontalMargins = (2 * 8) + ((cols -1) * 4); // paddings + col gap
      const verticalMargins = (2 * 8) + ((rows -1) * 4); // paddings + row gap
      const columnSize = Math.floor((width - horizontalMargins) / cols);
      const rowSize = Math.ceil(columnSize * 0.75); // Let's assume a 4x3 aspect relation
      const verticalSpaceNeeded = Math.ceil((rows * rowSize) + verticalMargins);

      if (verticalSpaceNeeded <= height) {
        const size = Math.min(width / cols, height / rows); // FIXME; use a proper name

        sizes.push({
          // cols,
          // rows,
          columnSize,
          size
        });
      }
    }

    const winner = sizes.reduce((prev, next) => prev.size >= next.size ? prev : next, {});
    return winner.columnSize;
  }

  useEffect(() => {
    const grid = gridRef.current

    if (!grid || totalParticipants < 1) {
      return;
    }

    const { clientWidth: width, clientHeight: height } = grid;

    const columnWidth = calculateBestMinColumnWidth(totalParticipants, width, height);
    setMinColumnWidth(`${columnWidth}px`)
  }, [totalParticipants]);

  // PLEASE, don't kill me. At least, not without explaining this first ;)
  //
  // Those inline styles are here basically because it's needed to build
  // dynamically the grid-template-columns rule.
  //
  // Furthermore, paddings and gaps will be used at the time to calculate the
  // "best" min column size. So, instead of using .getComputedStyle() "later"
  // to query them, seems more reasonable take advantage of the existence of
  // this style object (because of the above reason). Even more, most probably
  // they will became in props.
  //
  // In addition, other CSS props not provided by tailwindcss has been included
  // here too.
  const styles = {
    padding: "8px",
    gap: "4px 4px",
    placeContent: "safe center",
    gridTemplateRows: "max-content",
    gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
  }

  return (
    <div
      ref={gridRef}
      style={styles}
      className="bg-green-200 grid h-full w-full">
      {orderedParticipants.map((participant) => {
        let {
          id,
          display,
          isPublisher,
          isLocalScreen,
          stream_timestamp,
          speaking,
          focus,
          video
        } = participant;

        return (
          <Participant
            key={id}
            id={id}
            username={display}
            isPublisher={isPublisher}
            isLocalScreen={isLocalScreen}
            streamReady={stream_timestamp}
            speaking={speaking}
            focus={focus}
            video={video}
          />
        );
      })}
    </div>
  );
};

export default Participants;
