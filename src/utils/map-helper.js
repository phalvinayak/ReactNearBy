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
                `https://maps.googleapis.com/maps/api/js?key=${config.mapKey}&libraries=geometry,places`
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
        const location = new this.map.LatLng(coords.lat,coords.lng);
        return new Promise((resolve, reject) => {
            const service = new this.map.places.PlacesService(this.mapInstance);
            service.nearbySearch({
                location: location,
                keyword: query,
                rankBy: this.map.places.RankBy.DISTANCE
            }, (results, status) => {
                if(status === this.map.places.PlacesServiceStatus.OK) {
                    // console.log("Resutls: ", results);
                    let distance = 0;
                    results.forEach( result => {
                        distance = parseFloat(this.map.geometry.spherical.computeDistanceBetween(location, result.geometry.location)/1000, 2);
                        result.distance = `${String(distance.toFixed(2))}km`;
                    });
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
        this.directionsService = new this.map.DirectionsService();
        this.directionsDisplay = new this.map.DirectionsRenderer({
            map: this.mapInstance
        });
    }

    highlightMarker(index){
        this.unhighlightMarker();
        if(this.markers[index] && this.mapInstance.getBounds().contains(this.markers[index].getPosition())) {
            this.activeIconIndex = index;
            this.markers[this.activeIconIndex].setAnimation(this.map.Animation.BOUNCE);
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
            this.mapInstance.panTo(marker.getPosition());
            if(this.mapInstance.getZoom() < 15) {
                this.mapInstance.setZoom(15);
            }
            // this.mapRecenter();
            if(markerIndex !== this.activeIconIndex) {
                this.unhighlightMarker();
                this.highlightMarker(markerIndex);
            }
        }
    }

    mapRecenter(offsetx = 100, offsety = 0) {
        let point1 = this.mapInstance.getProjection().fromLatLngToPoint(this.mapInstance.getCenter());
        let point2 = new this.map.Point(
            ( (typeof(offsetx) === 'number' ? offsetx : 0) / Math.pow(2, this.mapInstance.getZoom()) ) || 0,
            ( (typeof(offsety) === 'number' ? offsety : 0) / Math.pow(2, this.mapInstance.getZoom()) ) || 0
        );
        this.mapInstance.setCenter(this.mapInstance.getProjection().fromPointToLatLng(new this.map.Point(
            point1.x - point2.x,
            point1.y + point2.y
        )));
    } 

    renderDirection(pointA, pointB){
        return new Promise((resolve, reject) => {
            this.directionsService.route({
                origin: pointA,
                destination: pointB,
                avoidTolls: true,
                avoidHighways: false,
                travelMode: this.map.TravelMode.DRIVING
            }, (response, status) => {
                if(status === this.map.DirectionsStatus.OK) {
                    this.directionsDisplay.setDirections(response);
                    resolve(response);
                } else {
                    reject(`Directions request failed due to ${status}`);
                }
            });
        });
    }

    removeDirection(){
        this.directionsDisplay.set('directions', null);
    }
}
