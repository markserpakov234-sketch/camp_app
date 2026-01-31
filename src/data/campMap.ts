export const CAMP_CENTER = {
  lat: 44.981423,
  lng: 37.258266,
};

export type CampPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export const CAMP_POINTS: CampPoint[] = [
  {
    id: 'corpus-1',
    name: 'Корпус №1',
    lat: 44.98152,
    lng: 37.25812,
  },
  {
    id: 'canteen',
    name: 'Столовая',
    lat: 44.9813,
    lng: 37.25845,
  },
];
