import React, {Component} from "react";
import $script from "scriptjs";
import config from "../config";

export default class MapView extends Component {
    constructor(props){
        super(props);
    }

    renderCurrentLocation(){
        if( window.navigator.geolocation ){
            navigator.geolocation.getCurrentPosition( ( position ) => {
                let posObject = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.props.setPosition(posObject);
                this.renderMap(posObject);
            }, ( error ) => {
                console.error(`Error occurred. Error code: ${error.code} ${error.message}`);
                // Unable to get position, Rendering with default position
                this.renderMap(config.defaultLocation);
            } );
        } else {
            this.mapUtils.showMessage( this.data.messages.noGeocodeSupport );
            console.error('Geolocation is not supported for this Browser/OS version yet.');
            // Rendering with default position
            this.renderMap(config.defaultLocation);
        }
    }

    renderMap(coords){
        this.mapInstance = new this.map.Map( document.getElementById( "map-canvas" ), {
            mapTypeControlOptions: {
                mapTypeIds: [this.map.MapTypeId.ROADMAP, this.map.MapTypeId.HYBRID],
                style: this.map.MapTypeControlStyle.HORIZONTAL_BAR
            },
            zoom: 14,
            maxZoom: 18,
            streetViewControl: false,
            center: coords
        } );

        this.props.setMapInstace(this.mapInstance);
    }

    componentWillReceiveProps(props) {
        if(props.map && !this.map){
            this.map = props.map;
            this.renderCurrentLocation();
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render(){
        return (
            <div className="col-md-8 map">
                <div id="map-canvas">
                    <span className="loading"></span>
                </div>
            </div>
        );
    }
}
