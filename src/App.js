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
            isSearching: false,
            selectedResult: null,
            selectedIndex: null
        };
        this.initMap();
    }

    initMap(){
        this.mapHelper.initMap().then(map => {
            this.setState({map});
            this.mapHelper.getCurrentLocation().then(position => {
                this.mapHelper.renderMap(document.getElementById("map-canvas"), position);
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

    selectedMarker = markerIndex => {
        this.setState({
            selectedResult: this.state.results[markerIndex],
            selectedIndex: parseInt(markerIndex, 10) + 1
        });
    };

    closeDirection = () => {
        this.setState({selectedResult: null, selectedIndex: null});
    };

    render() {
        return (

            <div className="app-wrapper map-results">
                <div id="map-canvas">
                    <span className="loading"></span>
                </div>
                <div className="card search-result-box">
                    <SearchBar placeSearch={this.placeSearch} />
                    <div className={`result-wrapper${this.state.selectedResult ? ' show-direction' : ''}`}>
                        <SearchResultList
                                results={this.state.results}
                                selectedMarker={this.selectedMarker}
                                mapHelper={this.mapHelper}>
                        </SearchResultList>
                        <Direction
                            position={this.state.position}
                            selectedResult={this.state.selectedResult}
                            closeDirection={this.closeDirection}
                            selectedIndex={this.state.selectedIndex}
                            mapHelper={this.mapHelper}>
                        </Direction>
                    </div>
                </div>
                <div className={`load-wrap ${this.state.isSearching ? "" : "hide"}`}>
                    <span className="loading"></span>
                </div>
                <a href="https://github.com/phalvinayak/ReactNearBy" target="_blank">
                    <img style={{position: "absolute", top: 0, right: 0,border: 0}} src="/icons/ribbon.png" alt="Fork me on GitHub" />
                </a>
            </div>
        );
    }
}
