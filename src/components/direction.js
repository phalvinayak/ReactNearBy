import React, {PureComponent} from "react";
import Steps from "./steps"

export default class Direction extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            steps: []
        }
    }
    closeDirection = e => {
        this.props.mapHelper.removeDirection();
        this.props.closeDirection();
        this.setState({steps: []});
    };

    clickHandler = e => {
        e.preventDefault();
        const pointA = new this.props.mapHelper.map.LatLng(this.props.position.lat, this.props.position.lng);
        this.props.mapHelper.renderDirection(pointA, this.props.selectedResult.geometry.location).then(response => {
            try{
                this.setState({steps: response.routes[0].legs[0].steps});
            } catch(e){/*Do Nothing*/}
        }).catch(error => {
            console.error(error);
        });
    };

    render(){
        const result = this.props.selectedResult;
        let content = <div/>;
        if(result){
            content = <div className="card-block">
                <h5 className="w-100 result-item-title">
                    <span className="heading">{result.name}</span>
                    <span className="badge badge-primary float-right">{this.props.selectedIndex}</span>
                </h5>
                <p className="card-text mb-1">{result.vicinity}</p>
                <small>Air Distance: {result.distance}</small>
                <div className="mt-2">
                    <a href="#" onClick={this.clickHandler} className="btn btn-primary">Get Direction</a>
                </div>
                <Steps steps={this.state.steps} />
            </div>
        }
        return (
            <div className="card direction custom-scroll">
                <div className="card-header">
                    Direction
                    <button type="button" className="close" aria-label="Close" onClick={this.closeDirection}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {content}
            </div>
        );
    }
}