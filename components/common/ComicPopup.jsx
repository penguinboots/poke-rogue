import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSkull,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const ComicPopup = (props) => {
  const { pages, setShowStory, type } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const lastPage = pages.length - 1;

  // Changes comic page if exists, closes story at last page
  function changePage(dir) {
    let nextPage = currentPage + dir;
    if (nextPage >= 0 && nextPage <= lastPage) {
      setCurrentPage(nextPage);
    } else if (nextPage >= pages.length) {
      setShowStory(false);
    }
  }

  return (
    <div className={`popup comic ${type === "end" ? "end-bg" : ""}`}>
      <div className="comic-container">
        <button
          className={`turnPage ${currentPage === 0 ? "disabled" : "active"}`}
          onClick={() => changePage(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <Image
          src={pages[currentPage]}
          alt="Popup Image"
          width="520"
          height="520"
        />
        <button
          className={`turnPage ${currentPage === lastPage ? "next" : "active"}`}
          onClick={() => changePage(1)}
        >
          {currentPage === lastPage ? (
            type === "battle" ? (
              <FontAwesomeIcon icon={faSkull} />
            ) : (
              <FontAwesomeIcon icon={faHeart} />
            )
          ) : (
            <FontAwesomeIcon icon={faArrowRight} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ComicPopup;
