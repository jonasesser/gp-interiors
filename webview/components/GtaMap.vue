#https://build-failed.blogspot.com/2012/11/zoomable-image-with-leaflet.html
#https://github.com/Leaflet/Leaflet/issues/2553
<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import ResolvePath from '@utility/pathResolver.js';
import L from 'leaflet';

export default defineComponent({
    name: 'GtaMap',
    props: {
        blips: {
            type: Array as () => Array<{ id: number; name: string; desc: string; type: string; x: number; y: number }>, // Blip Props
            default: () => [],
        },
        centerX: {
            type: Number,
            default: 117.7,
        },
        centerY: {
            type: Number,
            default: 239,
        },
        scaleX: {
            type: Number,
            default: 0.0284,
        },
        scaleY: {
            type: Number,
            default: 0.0284,
        },
        minZoom: {
            type: Number,
            default: 0,
        },
        maxZoom: {
            type: Number,
            default: 6,
        },
        startZoom: {
            type: Number,
            default: 3,
        },
        noWrap: {
            type: Boolean,
            default: true,
        },
        continuousWorld: {
            type: Boolean,
            default: true,
        },
        attribution: {
            type: String,
            default: '© 2024 by gp-core',
        },
        defaultPosition: {
            type: Array as () => number[],
            default: [0, 0],
        },
        layers: {
            type: Array as () => string[], // Korrektur: Typisierung des Arrays
            default: () => ['styleSateliteFull', 'styleSatelite', 'styleAtlas', 'styleBlack', 'styleRoad'],
        },
        showPolygon: {
            type: Boolean,
            default: false,
        },
        defaultLayerName: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            map: null as L.Map | null,
            blipMarkers: [],
            markerMap: null,
            customCRS: null,
        };
    },
    computed: {},
    mounted() {
        this.markerMap = new Map<string, L.Marker>();

        this.customCRS = L.extend({}, L.CRS.Simple, {
            projection: L.Projection.LonLat,
            scale: function (zoom) {
                return Math.pow(2, zoom);
            },
            zoom: function (sc) {
                return Math.log(sc) / 0.6931471805599453;
            },
            distance: function (pos1, pos2) {
                const x_difference = pos2.lng - pos1.lng;
                const y_difference = pos2.lat - pos1.lat;
                return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
            },
            transformation: new L.Transformation(this.scaleX, this.centerX, -this.scaleY, this.centerY),
            infinite: true,
        });

        const url = ResolvePath(`@plugins/images/gp-interiors/${this.layers[0]}/{z}/{x}/{y}.png`);

		
        const defaultLayer: L.TileLayer | null = L.tileLayer(url, {
            id: this.layers[0],
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            noWrap: this.noWrap,
            continuousWorld: this.continuousWorld,
            attribution: this.attribution,
        });

		console.log('defaultLayer', defaultLayer);


        this.map = L.map('map', {
            crs: this.customCRS,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            zoom: this.startZoom,
            maxNativeZoom: this.maxZoom,
            preferCanvas: true,
            layers: [defaultLayer],
            center: this.defaultPosition,
            // maxBounds: [
            //   [-30000, -30000],
            //   [30000, 30000],
            // ],
        });

        // Event-Listener für Layerwechsel
        this.map.on('layeradd', (event) => {
            const addedLayer = event.layer;

            const layerId = addedLayer.options.id; // Hier wird angenommen, dass jeder Layer einen `layerId` hat

            // Hier rufst du die Methode zur Initialisierung des Layers auf
            if (layerId) {
                console.log('test', addedLayer.options.id);
                console.log(`Layer hinzugefügt: ${addedLayer}`);
                this.initializeLayer(this.map, layerId);
            }
        });

        this.map.on('layerremove', (event) => {
            const removedLayer = event.layer;

            // Hier rufst du die Methode zur Bereinigung des Layers auf
            if (removedLayer) {
                console.log(`Layer entfernt 1: ${removedLayer}`);
            }
        });

        // Koordinaten für das Polygon (Beispiel)
        var latlngs = [
            [-400, -522],
            [-311, -522],
            [-310, -551],
            [-310, -700],
            [-400, -700],
        ];

        // Polygon zeichnen
        var polygon = L.polygon(latlngs, { color: 'red' }).addTo(this.map);
        // Popup beim Klicken auf das Polygon
        polygon.bindPopup('Ich bin ein Polygon.');

        var latlngsStreet = [
            [-806.085693359375, 409.27301025390625],
            [-792.0136108398438, 409.1876525878906],
            [-777.7601928710938, 409.1002502441406],
            [-763.513916015625, 409.01214599609375],
            [-749.2335815429688, 408.9240417480469],
            [-735.0087280273438, 408.8374328613281],
            [-720.7284545898438, 408.7493591308594],
            [-706.4577026367188, 408.6610412597656],
            [-692.1990966796875, 408.5730285644531],
            [-677.9541625976562, 408.4870300292969],
            [-668.3827514648438, 408.5252685546875],
            [-668.6680297851562, 408.53863525390625],
            [-674.912841796875, 409.5004577636719],
            [-675.2105712890625, 411.08319091796875],
            [-681.25341796875, 396.6275939941406],
            [-685.6254272460938, 376.2503662109375],
            [-659.5177001953125, 341.49749755859375],
            [-624.1595458984375, 258.04217529296875],
            [-585.5338134765625, 165.7964324951172],
            [-575.5784301757812, 134.88174438476562],
            [-574.780029296875, 132.60720825195312],
            [-575.2349853515625, 111.61500549316406],
            [-601.0135498046875, 83.52952575683594],
            [-674.8003540039062, 55.4785041809082],
            [-741.0925903320312, 29.74745750427246],
            [-743.2191772460938, 25.817808151245117],
            [-734.0936279296875, -29.16130828857422],
            [-711.0869750976562, -95.09467315673828],
            [-711.1044311523438, -95.06275177001953],
            [-711.1047973632812, -95.06171417236328],
            [-711.1047973632812, -95.06171417236328],
            [-711.1051635742188, -95.06173706054688],
            [-712.919921875, -94.88843536376953],
            [-712.5357055664062, -94.82706451416016],
            [-711.1047973632812, -95.06190490722656],
            [-707.789794921875, -103.7675552368164],
            [-682.5853881835938, -169.56016540527344],
            [-662.4132690429688, -224.11985778808594],
            [-660.7727661132812, -228.88043212890625],
            [-660.2211303710938, -230.69541931152344],
            [-654.1998901367188, -262.23870849609375],
            [-650.3189697265625, -349.04498291015625],
            [-650.4454345703125, -466.3587646484375],
            [-649.7608032226562, -598.9523315429688],
            [-648.1751708984375, -717.568603515625],
            [-647.8165283203125, -773.0577392578125],
            [-647.6218872070312, -828.6376953125],
            [-647.80859375, -838.6193237304688],
            [-650.7344970703125, -852.1441650390625],
            [-653.8048706054688, -917.91748046875],
            [-694.5833740234375, -1009.5665283203125],
            [-732.9503784179688, -1062.0692138671875],
            [-734.3313598632812, -1089.8333740234375],
            [-713.5162353515625, -1108.4033203125],
            [-707.95068359375, -1113.2584228515625],
            [-705.7760009765625, -1115.151123046875],
            [-705.7942504882812, -1115.1358642578125],
            [-705.7899780273438, -1115.1395263671875],
            [-695.57275390625, -1123.903564453125],
            [-667.7737426757812, -1095.597412109375],
            [-618.3572387695312, -1020.2171630859375],
            [-567.3916625976562, -919.3150024414062],
            [-541.2578125, -843.9952392578125],
            [-532.0181884765625, -766.3338012695312],
            [-530.6710815429688, -735.3992919921875],
            [-508.47015380859375, -726.2022705078125],
            [-503.74786376953125, -714.2160034179688],
            [-501.29010009765625, -756.598388671875],
            [-510.7403869628906, -838.197021484375],
            [-541.4314575195312, -945.8478393554688],
            [-594.9151000976562, -1057.4661865234375],
            [-657.2019653320312, -1164.328369140625],
            [-710.0682373046875, -1271.2049560546875],
            [-743.8563232421875, -1389.8575439453125],
            [-753.4085083007812, -1509.1981201171875],
            [-727.8345336914062, -1606.927734375],
            [-667.7774047851562, -1708.1900634765625],
            [-587.5516967773438, -1810.3514404296875],
            [-504.05181884765625, -1912.692138671875],
            [-424.635986328125, -2000.564453125],
            [-413.1983337402344, -2014.1531982421875],
            [-411.9244689941406, -2016.8402099609375],
            [-411.7505187988281, -2017.2275390625],
        ];
        var polyline = L.polyline(latlngsStreet, { color: 'red' }).addTo(this.map);
        this.map.fitBounds(polyline.getBounds());

        // if (props.showPolygon) {
        //   const latlngs = [
        //     [-400, -522],
        //     [-311, -522],
        //     [-310, -551],
        //     [-310, -700],
        //     [-400, -700]
        //   ];
        //   L.polygon(latlngs, { color: 'red' }).addTo(map.value).bindPopup("Ich bin ein Polygon.");
        // }

        this.addBlipsToMap();
    },
    methods: {
        addBlipsToMap() {
            for (let i = 0; i < this.blipMarkers.length; i++) {
                if (this.map) {
					console.log("Remove Layer", this.blipMarkers[i]);
                    this.map.removeLayer(this.blipMarkers[i]);
                    // delete this.blipMarkers[i];
                }
            }

			this.blipMarkers = [];

            this.blips.forEach((blip) => {
                const marker = L.marker([blip.y, blip.x], {
                    icon: this.customIcon(blip.type),
                }).addTo(this.map);

                this.blipMarkers.push(marker);
            });
        },
        customIcon(type: string) {
            return L.icon({
                iconUrl: ResolvePath(`@plugins/images/gp-interiors/blips/${type}.png`),
                iconSize: [20, 20],
                iconAnchor: [10, 20],
                popupAnchor: [0, -20],
            });
        },
    },
    watch: {
        blips: {
            handler: function (val) {
                this.addBlipsToMap();
            },
            deep: true,
        },
    },
});
</script>

<style scoped>
#map {
    margin-top: 100px;
    position: relative;
    height: 81vh;
    width: 67vw;
}

.leaflet-container {
    background: #00397c;
    outline: 0;
}
</style>

<style>
/* required styles */

.leaflet-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-container,
.leaflet-pane > svg,
.leaflet-pane > canvas,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
    position: absolute;
    left: 0;
    top: 0;
}
.leaflet-container {
    overflow: hidden;
}
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
}
/* Prevents IE11 from highlighting tiles in blue */
.leaflet-tile::selection {
    background: transparent;
}
/* Safari renders non-retina tile on retina better with this, but Chrome is worse */
.leaflet-safari .leaflet-tile {
    image-rendering: -webkit-optimize-contrast;
}
/* hack that prevents hw layers "stretching" when loading new tiles */
.leaflet-safari .leaflet-tile-container {
    width: 1600px;
    height: 1600px;
    -webkit-transform-origin: 0 0;
}
.leaflet-marker-icon,
.leaflet-marker-shadow {
    display: block;
}
/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */
/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */
.leaflet-container .leaflet-overlay-pane svg,
.leaflet-container .leaflet-marker-pane img,
.leaflet-container .leaflet-shadow-pane img,
.leaflet-container .leaflet-tile-pane img,
.leaflet-container img.leaflet-image-layer,
.leaflet-container .leaflet-tile {
    max-width: none !important;
    max-height: none !important;
}

.leaflet-container.leaflet-touch-zoom {
    -ms-touch-action: pan-x pan-y;
    touch-action: pan-x pan-y;
}
.leaflet-container.leaflet-touch-drag {
    -ms-touch-action: pinch-zoom;
    /* Fallback for FF which doesn't support pinch-zoom */
    touch-action: none;
    touch-action: pinch-zoom;
}
.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
    -ms-touch-action: none;
    touch-action: none;
}
.leaflet-container {
    -webkit-tap-highlight-color: transparent;
}
.leaflet-container a {
    -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
}
.leaflet-tile {
    filter: inherit;
    visibility: hidden;
}
.leaflet-tile-loaded {
    visibility: inherit;
}
.leaflet-zoom-box {
    width: 0;
    height: 0;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 800;
}
/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
.leaflet-overlay-pane svg {
    -moz-user-select: none;
}

.leaflet-pane {
    z-index: 400;
}

.leaflet-tile-pane {
    z-index: 200;
}
.leaflet-overlay-pane {
    z-index: 400;
}
.leaflet-shadow-pane {
    z-index: 500;
}
.leaflet-marker-pane {
    z-index: 600;
}
.leaflet-tooltip-pane {
    z-index: 650;
}
.leaflet-popup-pane {
    z-index: 700;
}

.leaflet-map-pane canvas {
    z-index: 100;
}
.leaflet-map-pane svg {
    z-index: 200;
}

.leaflet-vml-shape {
    width: 1px;
    height: 1px;
}
.lvml {
    behavior: url(#default#VML);
    display: inline-block;
    position: absolute;
}

/* control positioning */

.leaflet-control {
    position: relative;
    z-index: 800;
    pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
    pointer-events: auto;
}
.leaflet-top,
.leaflet-bottom {
    position: absolute;
    z-index: 1000;
    pointer-events: none;
}
.leaflet-top {
    top: 0;
}
.leaflet-right {
    right: 0;
}
.leaflet-bottom {
    bottom: 0;
}
.leaflet-left {
    left: 0;
}
.leaflet-control {
    float: left;
    clear: both;
}
.leaflet-right .leaflet-control {
    float: right;
}
.leaflet-top .leaflet-control {
    margin-top: 10px;
}
.leaflet-bottom .leaflet-control {
    margin-bottom: 10px;
}
.leaflet-left .leaflet-control {
    margin-left: 10px;
}
.leaflet-right .leaflet-control {
    margin-right: 40px;
}

/* zoom and fade animations */

.leaflet-fade-anim .leaflet-tile {
    will-change: opacity;
}
.leaflet-fade-anim .leaflet-popup {
    opacity: 0;
    -webkit-transition: opacity 0.2s linear;
    -moz-transition: opacity 0.2s linear;
    transition: opacity 0.2s linear;
}
.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
    opacity: 1;
}
.leaflet-zoom-animated {
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
}
.leaflet-zoom-anim .leaflet-zoom-animated {
    will-change: transform;
}
.leaflet-zoom-anim .leaflet-zoom-animated {
    -webkit-transition: -webkit-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
    -moz-transition: -moz-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
    transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1);
}
.leaflet-zoom-anim .leaflet-tile,
.leaflet-pan-anim .leaflet-tile {
    -webkit-transition: none;
    -moz-transition: none;
    transition: none;
}

.leaflet-zoom-anim .leaflet-zoom-hide {
    visibility: hidden;
}

/* cursors */

.leaflet-interactive {
    cursor: pointer;
}
.leaflet-grab {
    cursor: -webkit-grab;
    cursor: -moz-grab;
    cursor: grab;
}
.leaflet-crosshair,
.leaflet-crosshair .leaflet-interactive {
    cursor: crosshair;
}
.leaflet-popup-pane,
.leaflet-control {
    cursor: auto;
}
.leaflet-dragging .leaflet-grab,
.leaflet-dragging .leaflet-grab .leaflet-interactive,
.leaflet-dragging .leaflet-marker-draggable {
    cursor: move;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
    cursor: grabbing;
}

/* marker & overlays interactivity */
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-image-layer,
.leaflet-pane > svg path,
.leaflet-tile-container {
    pointer-events: none;
}

.leaflet-marker-icon.leaflet-interactive,
.leaflet-image-layer.leaflet-interactive,
.leaflet-pane > svg path.leaflet-interactive,
svg.leaflet-image-layer.leaflet-interactive path {
    pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
    pointer-events: auto;
}

/* visual tweaks */

.leaflet-container {
    background: #ddd;
    outline: 0;
}
.leaflet-container a {
    color: #0078a8;
}
.leaflet-container a.leaflet-active {
    outline: 2px solid orange;
}
.leaflet-zoom-box {
    border: 2px dotted #38f;
    background: rgba(255, 255, 255, 0.5);
}

/* general typography */
.leaflet-container {
    font:
        12px/1.5 'Helvetica Neue',
        Arial,
        Helvetica,
        sans-serif;
}

/* general toolbar styles */

.leaflet-bar {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
    border-radius: 4px;
}
.leaflet-bar a,
.leaflet-bar a:hover {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    text-align: center;
    text-decoration: none;
    color: black;
}
.leaflet-bar a,
.leaflet-control-layers-toggle {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    display: block;
}
.leaflet-bar a:hover {
    background-color: #f4f4f4;
}
.leaflet-bar a:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.leaflet-bar a:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: none;
}
.leaflet-bar a.leaflet-disabled {
    cursor: default;
    background-color: #f4f4f4;
    color: #bbb;
}

.leaflet-touch .leaflet-bar a {
    width: 30px;
    height: 30px;
    line-height: 30px;
}
.leaflet-touch .leaflet-bar a:first-child {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
}
.leaflet-touch .leaflet-bar a:last-child {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
}

/* zoom control */

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
    font:
        bold 18px 'Lucida Console',
        Monaco,
        monospace;
    text-indent: 1px;
}

.leaflet-touch .leaflet-control-zoom-in,
.leaflet-touch .leaflet-control-zoom-out {
    font-size: 22px;
}

/* layers control */
.leaflet-control-layers {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    background: #fff;
    border-radius: 5px;
}
.leaflet-control-layers-toggle {
    background-image: url('./plugins/images/gp-interiors/images/layers.png');
    width: 36px;
    height: 36px;
}
.leaflet-retina .leaflet-control-layers-toggle {
    background-image: url('./plugins/images/gp-interiors/images/iconLayers2c.png');
    background-size: 26px 26px;
}
.leaflet-touch .leaflet-control-layers-toggle {
    width: 44px;
    height: 44px;
}
.leaflet-control-layers .leaflet-control-layers-list,
.leaflet-control-layers-expanded .leaflet-control-layers-toggle {
    display: none;
}
.leaflet-control-layers-expanded .leaflet-control-layers-list {
    display: block;
    position: relative;
}
.leaflet-control-layers-expanded {
    padding: 6px 10px 6px 6px;
    color: #333;
    background: #fff;
}
.leaflet-control-layers-scrollbar {
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 5px;
}
.leaflet-control-layers-selector {
    margin-top: 2px;
    position: relative;
    top: 1px;
}
.leaflet-control-layers label {
    display: block;
}
.leaflet-control-layers-separator {
    height: 0;
    border-top: 1px solid #ddd;
    margin: 5px -10px 5px -6px;
}

/* Default icon URLs */
.leaflet-default-icon-path {
    background-image: url('./plugins/images/gp-interiors/images/marker-icon.png');
}

/* attribution and scale controls */

.leaflet-container .leaflet-control-attribution {
    background: #fff;
    background: rgba(255, 255, 255, 0.7);
    margin: 0;
}
.leaflet-control-attribution,
.leaflet-control-scale-line {
    padding: 0 5px;
    color: #333;
}
.leaflet-control-attribution a {
    text-decoration: none;
}
.leaflet-control-attribution a:hover {
    text-decoration: underline;
}
.leaflet-container .leaflet-control-attribution,
.leaflet-container .leaflet-control-scale {
    font-size: 11px;
}
.leaflet-left .leaflet-control-scale {
    margin-left: 5px;
}
.leaflet-bottom .leaflet-control-scale {
    margin-bottom: 5px;
}
.leaflet-control-scale-line {
    border: 2px solid #777;
    border-top: none;
    line-height: 1.1;
    padding: 2px 5px 1px;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    background: #fff;
    background: rgba(255, 255, 255, 0.5);
}
.leaflet-control-scale-line:not(:first-child) {
    border-top: 2px solid #777;
    border-bottom: none;
    margin-top: -2px;
}
.leaflet-control-scale-line:not(:first-child):not(:last-child) {
    border-bottom: 2px solid #777;
}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
    box-shadow: none;
}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
    border: 2px solid rgba(0, 0, 0, 0.2);
    background-clip: padding-box;
}

/* popup */

.leaflet-popup {
    position: absolute;
    text-align: center;
    margin-bottom: 20px;
}
.leaflet-popup-content-wrapper {
    padding: 1px;
    text-align: left;
    border-radius: 12px;
}
.leaflet-popup-content {
    margin: 13px 19px;
    line-height: 1.4;
}
.leaflet-popup-content p {
    margin: 18px 0;
}
.leaflet-popup-tip-container {
    width: 40px;
    height: 20px;
    position: absolute;
    left: 50%;
    margin-left: -20px;
    overflow: hidden;
    pointer-events: none;
}
.leaflet-popup-tip {
    width: 17px;
    height: 17px;
    padding: 1px;

    margin: -10px auto 0;

    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
    background: white;
    color: #333;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}
.leaflet-container a.leaflet-popup-close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 4px 0 0;
    border: none;
    text-align: center;
    width: 18px;
    height: 14px;
    font:
        16px/14px Tahoma,
        Verdana,
        sans-serif;
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
}
.leaflet-container a.leaflet-popup-close-button:hover {
    color: #999;
}
.leaflet-popup-scrolled {
    overflow: auto;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
}

.leaflet-oldie .leaflet-popup-content-wrapper {
    -ms-zoom: 1;
}
.leaflet-oldie .leaflet-popup-tip {
    width: 24px;
    margin: 0 auto;

    -ms-filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)';
    filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
}
.leaflet-oldie .leaflet-popup-tip-container {
    margin-top: -1px;
}

.leaflet-oldie .leaflet-control-zoom,
.leaflet-oldie .leaflet-control-layers,
.leaflet-oldie .leaflet-popup-content-wrapper,
.leaflet-oldie .leaflet-popup-tip {
    border: 1px solid #999;
}

/* div icon */

.leaflet-div-icon {
    background: #fff;
    border: 1px solid #666;
}

/* Tooltip */
/* Base styles for the element that has a tooltip */
.leaflet-tooltip {
    position: absolute;
    padding: 6px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 3px;
    color: #222;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.leaflet-tooltip.leaflet-clickable {
    cursor: pointer;
    pointer-events: auto;
}
.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
    position: absolute;
    pointer-events: none;
    border: 6px solid transparent;
    background: transparent;
    content: '';
}

/* Directions */

.leaflet-tooltip-bottom {
    margin-top: 6px;
}
.leaflet-tooltip-top {
    margin-top: -6px;
}
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-top:before {
    left: 50%;
    margin-left: -6px;
}
.leaflet-tooltip-top:before {
    bottom: 0;
    margin-bottom: -12px;
    border-top-color: #fff;
}
.leaflet-tooltip-bottom:before {
    top: 0;
    margin-top: -12px;
    margin-left: -6px;
    border-bottom-color: #fff;
}
.leaflet-tooltip-left {
    margin-left: -6px;
}
.leaflet-tooltip-right {
    margin-left: 6px;
}
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
    top: 50%;
    margin-top: -6px;
}
.leaflet-tooltip-left:before {
    right: 0;
    margin-right: -12px;
    border-left-color: #fff;
}
.leaflet-tooltip-right:before {
    left: 0;
    margin-left: -12px;
    border-right-color: #fff;
}
</style>
