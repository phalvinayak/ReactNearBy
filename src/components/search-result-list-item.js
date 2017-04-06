import React, {PureComponent} from "react";

export default class SearchResultListItem extends PureComponent {
    mouseEnter = e => {
        const index = e.currentTarget.getAttribute("data-index");
        if(index) {
            this.props.mapHelper.highlightMarker(index);
        }
    };

    onClick = e => {
        e.preventDefault();
        const index = e.currentTarget.getAttribute("data-index");
        if(index) {
            this.props.mapHelper.panToMarker(index);
            this.props.selectedMarker(index);
        }
    };

    render() {
        let {result, label} = this.props;
        return (
            <a href="#"
                className="list-group-item-action list-group-item flex-column align-items-start"
                onMouseEnter={this.mouseEnter} data-index={label - 1}
                onClick={this.onClick}>
                <h5 className="w-100 result-item-title">
                    <span className="heading">{result.name}</span>
                    <span className="badge badge-primary float-right">{label}</span>
                </h5>
                <p className="mb-1">{result.vicinity}</p>
                <p className="mb-1">Distance: {result.distance}</p>
                <small>Ratings: {result.rating ? `${result.rating} out of 5` : "No ratings yet"}</small>
            </a>
        );
    }
}
