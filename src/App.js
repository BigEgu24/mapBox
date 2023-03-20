import ReactMapGL, { Layer, Marker, Popup } from "react-map-gl";
import { useState } from "react";
import { Room } from "@material-ui/icons";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import CubeScene from "./components/CubeScene";

const TOKEN = process.env.REACT_APP_TOKEN;

function App() {
  const [newPlace, setNewPlace] = useState(null);
  const [images, setImages] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 28.6448,
    longitude: 77.216721,
    zoom: 10,
  });
  const [showCube, setShowCube] = useState(false);

  const exportImage = async (latitude, longitude) => {
    try {
      let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},${viewport?.zoom},0/400x280?access_token=${TOKEN}`;
      const response = await axios.get(url, {
        responseType: "blob",
      });
      if (response) {
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = function () {
          var imageDataUrl = reader.result;
          setImages(imageDataUrl);
        };
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddClick = (e) => {
    setShowCube(false);
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
    exportImage(latitude, longitude);
  };

  const parkLayer = {
    id: "landuse_park",
    type: "fill",
    source: "mapbox",
    "source-layer": "landuse",
    filter: ["==", "class", "park"],
    paint: {
      "fill-color": "#4E3FC8",
    },
  };

  return (
    <div id="app" style={{ height: "100vh", width: "100%", zIndex: 999 }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={TOKEN}
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/sankarr/clffwqnm700jl01mr0lnc1z2s"
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={handleAddClick}
        attributionControl={true}
      >
        <Layer {...parkLayer} />
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <button
                  style={{ margin: "0.5rem" }}
                  className="button register"
                  onClick={() => setShowCube(!showCube)}
                >
                  Show 3D Tile
                </button>
                {showCube ? <CubeScene img={images} /> : null}
              </div>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
