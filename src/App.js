import React, { Component } from 'react';
import SearchBar from "./components/search-bar";
import SearchResultList from "./components/search-result-list";
import Direction from "./components/direction";
import MapHelper from "./utils/map-helper";
import Storage from "./utils/storage";
import config from "./config";

export default class App extends Component {
    constructor(){
        super();
        this.mapHelper = new MapHelper();
        this.state = {
            position: {},
            map: null,
            term: "",
            results: [],
            mapHelper: this.mapHelper,
            isSearching: false
        };
        this.initMap();
    }

    initMap(){
        this.mapHelper.initMap().then(map => {
            this.setState({map});
            this.mapHelper.getCurrentLocation().then(position => {
                this.mapHelper.renderMap(document.getElementById("map-canvas"), position);
                this.mapHelper.setCurrentPosition(this.masInstace, position);
                this.setState({position}, () => {
                    this.setPositionMarker();
                });
            });
        }).catch(error => {
            console.error(error);
        });
    }

    setPositionMarker(){
        this.currentPosMarker = this.mapHelper.setCurrentPosition(this.state.position);
        this.state.map.event.addListener(this.currentPosMarker, "dragend", event => {
            this.setState({position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            }}, () => {
                this.search();
            });
        });
        this.restoreLastSearch();
    }

    restoreLastSearch(){
        let term = Storage.getKey(config.storageKey, "term");
        if(term){
            this.placeSearch(term);
        }
    }

    placeSearch = term => {
        this.setState({term}, () => {
            this.search()
        });
    };

    search(){
        if(this.state.term){
            this.setState({isSearching: true});
            this.mapHelper.searchPlaces(this.state.position, this.state.term).then(results => {
                this.setState({results});
                this.mapHelper.populateResults(results);
            }).catch(error => {
                this.mapHelper.removeMarkers();
                this.setState({results: []});
            }).then(()=>{ // Similar to always in jQuery...
                this.setState({isSearching: false});
            });
        } else{
            console.error("No search term to start a search");
        }
    }

    directionMarker = markerIndex => {

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <SearchBar placeSearch={this.placeSearch} />
                </div>
                <div className="row map-results">
                    <div className="col-md-8 map">
                        <div id="map-canvas">
                            <span className="loading"></span>
                        </div>
                    </div>
                    <div className="col-md-4 search-results">
                        <SearchResultList results={this.state.results} mapHelper={this.mapHelper} />
                    </div>
                    { /* <Direction/> */ }
                    <div className={`load-wrap ${this.state.isSearching ? "" : "hide"}`}>
                        <span className="loading"></span>
                    </div>
                </div>
            </div>
        );
    }
}
