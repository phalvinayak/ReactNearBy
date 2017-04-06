import React from "react";
import SearchResultListItem from "./search-result-list-item"

export default ({results, mapHelper, selectedMarker}) => {
    let content;
    if(results.length){
        content = results.map((result,index)=> <SearchResultListItem key={result.id} selectedMarker={selectedMarker} result={result} mapHelper={mapHelper} label={index + 1} />);
    } else {
        content = <p className="no-result">No Results, Start with new search...</p>
    }
    return (
        <div className="list-wrapper custom-scroll">
            <div className="list-group">{content}</div>
        </div>
    );
}