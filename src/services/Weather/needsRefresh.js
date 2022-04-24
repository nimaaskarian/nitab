const needsRefresh = (city, data, minutesToExpire = 30) => {
  if (data && data.time) {
    if (data.city !== city) {
      return true;
    }
    if (new Date().getTime() < data.time + minutesToExpire * 60000) {
      return false;
    }
  }
  return true;
};
export default needsRefresh;
