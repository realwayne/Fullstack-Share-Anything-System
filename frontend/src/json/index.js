import barangays from "./barangays";
import cities from "./cities";
import provinces from "./provinces";
import regions from "./regions";

function getProvincesForRegion(regionCode) {
  return provinces.filter(province => {
    return province.regCode === regionCode
  })
}

function getCitiesForProvince(provinceCode) {
  return cities.filter(city => {
    return city.provCode === provinceCode
  })
}

function getBarangaysForCity(cityCode) {
  return barangays.filter(barangay => {
    return barangay.citymunCode === cityCode
  })
}
function getRegionName(regionCode) {
  const region = regions.find(region => region.regCode === regionCode);
  return region.regDesc;
}
function getProvinceName(provinceCode) {
  const province = provinces.find(province => (province.provCode === provinceCode));
  return province.provDesc;
}
function getCityName(cityCode) {
  const city = cities.find(city => (city.citymunCode === cityCode));
  return city.citymunDesc;
}
function getBarangayName(barangayCode) {
  const barangay = barangays.find(barangay => barangay.brgyCode === barangayCode);
  return barangay.brgyDesc;
}
export default regions;
export { getBarangaysForCity, getCitiesForProvince, getProvincesForRegion, getRegionName, getProvinceName, getCityName, getBarangayName };