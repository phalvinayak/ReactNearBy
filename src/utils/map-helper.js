import $script from "scriptjs";
import config from "../config"

export default class mapUtil{
    constructor(){
        this.markers = [];
        this.activeIconIndex = -1;
        this.mapInstance = null;
    }

    initMap(){
        return new Promise((resolve, reject) => {
            $script([
                `https://maps.googleapis.com/maps/api/js?key=${config.mapKey}&libraries=places`
            ],() => {
                if(window.google.maps){
                    this.map = window.google.maps;
                    resolve(this.map);
                } else {
                    reject("Unable to load google map");
                }
            }, () => {
                reject("Unable to load google map");
            });
        });
    }

    setCurrentPosition(coords){
        const marker = new this.map.Marker({
            map: this.mapInstance,
            animation: this.map.Animation.DROP,
            position: coords,
            draggable: true,
            icon: "/icons/pin.png",
            zIndex: this.map.Marker.MAX_ZINDEX + 1
        });
        return marker;
    }

    searchPlaces(coords, query){
        return new Promise((resolve, reject) => {
            const service = new this.map.places.PlacesService(this.mapInstance);
            service.textSearch({
                location: new this.map.LatLng(coords.lat,coords.lng),
                radius: config.searchRadius,
                query
            }, (results, status) => {
                if(status === this.map.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject("Unable to find places in nearby search radius");
                }
            });
        });
    }

    populateResults(results){
        if(this.markers.length){
            this.removeMarkers();
        }

        const bounds = new this.map.LatLngBounds();
        results.forEach((result, index) => {
            const marker = new this.map.Marker({
                position: result.geometry.location,
                icon: `/icons/number_${index+1}.png`,
                map: this.mapInstance
            });
            bounds.extend(marker.position);
            this.markers.push(marker);
        });
        this.mapInstance.fitBounds(bounds);
    }

    removeMarkers(){
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    getCurrentLocation(){
        return new Promise(resolve => {
            if( window.navigator.geolocation ){
                navigator.geolocation.getCurrentPosition( ( position ) => {
                    resolve({lat: position.coords.latitude, lng: position.coords.longitude});
                }, ( error ) => {
                    console.error(`Error occurred. Error code: ${error.code} ${error.message}`);
                    // Unable to get position, Rendering with default position
                    resolve(config.defaultLocation);
                } );
            } else {
                console.error('Geolocation is not supported for this Browser/OS version yet.');
                // Rendering with default position
                resolve(config.defaultLocation);
            }
        });
    }

    renderMap(domElement, coords) {
        this.mapInstance = new this.map.Map(domElement, {
            mapTypeControlOptions: {
                mapTypeIds: [this.map.MapTypeId.ROADMAP, this.map.MapTypeId.HYBRID],
                style: this.map.MapTypeControlStyle.HORIZONTAL_BAR
            },
            zoom: 14,
            maxZoom: 18,
            streetViewControl: false,
            center: coords
        });
    }

    highlightMarker(index){
        if(this.markers[index] && this.markers[index].map) {
            this.activeIconIndex = index;
            this.markers[this.activeIconIndex].setAnimation(this.map.Animation.BOUNCE);
        } else {
            console.log("Trapped in else condition");
        }
    }

    unhighlightMarker(){
        if(this.markers[this.activeIconIndex]) {
            this.markers[this.activeIconIndex].setAnimation(null);
        }
    }

    panToMarker(markerIndex){
        if(this.markers[markerIndex]) {
            const marker = this.markers[markerIndex];
            console.log(marker.getPosition());
            this.mapInstance.panTo(marker.getPosition());
            this.mapInstance.setZoom(14);
        }
    }
}
