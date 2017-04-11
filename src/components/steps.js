import React from "react";

export default ({steps}) => {
    if(!steps.length){
        return null;
    }
    const content = steps.map((step, index) => <li key={index} className="mb-1"><span dangerouslySetInnerHTML={{__html: step.instructions}} className="desc"></span><span className="distance">{step.distance.text}</span></li>);
    return(
        <ul className="steps">
            {content}
        </ul>
    );
}