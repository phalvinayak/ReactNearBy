import React, {PureComponent} from "react";

export default class Direction extends PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="card direction">
                <div className="card-header">
                    Featured
                </div>
                <div className="card-block">
                    <h4 className="card-title">Special title treatment</h4>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        );
    }
}