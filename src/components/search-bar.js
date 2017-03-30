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
        if(this.state.term.trim() !== "" ) {
            this.props.placeSearch(this.state.term);
            Storage.setKey(this.store, "term", this.state.term);
        }
    };

    render(){
        return (
            <div className="search-bar">
                <form className="input-group" onSubmit={this.onSubmit}>
                    <input className="form-control" id="input-search"
                           type="text" value={this.state.term} onChange={this.onChange}
                           placeholder="Search Google Maps"  />
                    <span className="input-group-btn">
                        <button className="btn btn-default">Go!</button>
                    </span>
                </form>
            </div>
        );
    }
}
