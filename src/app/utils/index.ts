export function dist_lat_lng(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
  if (!coord1 || !coord2) {
    return Infinity;
  }

  const R = 6371e3; // radius of earth
  const rlat1 = coord1.lat * Math.PI / 180;
  const rlat2 = coord2.lat * Math.PI / 180;
  const dlat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dlng = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(rlat1) * Math.cos(rlat2) *
            Math.sin(dlng / 2) * Math.sin(dlng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function is_defined(prop, ...props: any[]) {
  for (let i = 0; i < props.length; ++i) {
    const tmp = props[i];
    if (tmp === null || tmp === undefined) {
      return false;
    }
  }

  return (prop !== null && prop !== undefined);
}
