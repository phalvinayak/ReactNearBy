import React, {PureComponent} from "react";
import config from "../config";
import Storage from "../utils/storage";

export default class SearchBar extends PureComponent {
    constructor(props){
        super(props);
        this.store = config.storageKey;
        let term = config.defaultTerm;
        if(Storage.hasKey(this.store, "term")){
            term = Storage.getKey(this.store, "term")
        }
        this.state = {
            term
        };
    }

    onChange = e => {
        this.setState({term: e.target.value});
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.placeSearch(this.state.term);
        Storage.setKey(this.store, "term", this.state.term);
    };

    render(){
        return (
            <div className="col-md-12 search-bar">
                <h1>React Google Maps Place Search API</h1>
                <form className="input-group" onSubmit={this.onSubmit}>
                    <input className="form-control" type="text" value={this.state.term} onChange={this.onChange} placeholder="Start Typing for things here..."  />
                    <span className="input-group-btn">
                        <button className="btn btn-default">Go!</button>
                    </span>
                </form>
            </div>
        );
    }
}
