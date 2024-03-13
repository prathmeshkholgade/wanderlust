


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom:10 , // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h4>${listing.location}</h4><p>Exact location will be provide after booking</p>`)
.setMaxWidth("300px")
)
.addTo(map);



// console.log();