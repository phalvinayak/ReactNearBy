import React from "react";
import SearchResultListItem from "./search-result-list-item"

export default ({results, mapHelper}) => {
    let content;
    if(results.length){
        content = results.map((result,index)=> <SearchResultListItem key={result.id} result={result} mapHelper={mapHelper} label={index + 1} />);
    } else {
        content = <p>Start with search...</p>
    }
    return (
        <div className="list-group">{content}</div>
    );
}