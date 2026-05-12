// "use client"

// import Map, { Marker } from "react-map-gl"
// import "mapbox-gl/dist/mapbox-gl.css"

// export function LiveMap({
//   latitude,
//   longitude,
// }: {
//   latitude: number
//   longitude: number
// }) {
//   return (
//     <div className="h-[500px] rounded-3xl overflow-hidden">
//       <Map
//         mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
//         initialViewState={{
//           latitude,
//           longitude,
//           zoom: 12,
//         }}
//         mapStyle="mapbox://styles/mapbox/dark-v11"
//       >
//         <Marker
//           latitude={latitude}
//           longitude={longitude}
//         />
//       </Map>
//     </div>
//   )
// }