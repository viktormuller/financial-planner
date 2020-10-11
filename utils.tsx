export default function findDomain(myDATA){
  const yDomain = myDATA.reduce(
  (res, row) => {
    return {
      max: Math.max(res.max, row.y),
      min: 0
    };
  },
  {max: -Infinity, min: 0}
);
}