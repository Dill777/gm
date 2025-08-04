import moment from "moment";
export const formatExpirationDate = (
  timestamp: string,
  r2l: boolean = true
) => {
  const date = new Date(Number(timestamp) * 1000);
  const formattedDate = r2l
    ? `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
    : `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  return formattedDate;
};

export const getThisYear = () => {
  const now = new Date();
  return now.getFullYear();
};
export const getDatesFromTimestamp = function (timestamp: string | undefined) {
  if (!timestamp) timestamp = "0";
  const tempDate = new Date(Number(timestamp) * 1000);

  const mome = moment(tempDate);
  return {
    yearfull: mome.format("YYYY"),
    yearshort: mome.format("YY"),
    quarter: mome.format("Q"),
    monthfull: mome.format("MM"),
    monthshort: mome.format("M"),
    monthfullname: mome.format("MMMM"),
    monthshortname: mome.format("MMM"),
    dayfull: mome.format("DD"),
    dayshort: mome.format("D"),
    datenormal: mome.format("MMMM D, YYYY"),
    dateshortname: mome.format("DD MMMM YYYY"),
    dateLong: mome.format("MMM Do YYYY"),
    timeShort: mome.format("HH:mm"),
    datefull: mome.format("DD MMMM YYYY HH:mm"),
    isValid: true,
  };
};

export const getDates = function (timestamp: string | undefined) {
  if (!timestamp) timestamp = new Date().toString();
  const tempDate = new Date(timestamp);

  const mome = moment(tempDate);
  return {
    yearfull: mome.format("YYYY"),
    yearshort: mome.format("YY"),
    quarter: mome.format("Q"),
    monthfull: mome.format("MM"),
    monthshort: mome.format("M"),
    monthfullname: mome.format("MMMM"),
    monthshortname: mome.format("MMM"),
    dayfull: mome.format("DD"),
    dayshort: mome.format("D"),
    datenormal: mome.format("MMMM D, YYYY"),
    dateshortname: mome.format("DD MMMM YYYY"),
    dateLong: mome.format("MMM Do YYYY"),
    timeShort: mome.format("HH:mm"),
    datefull: mome.format("DD MMMM YYYY HH:mm"),
    monthYear: mome.format("MMMM, YYYY"),
    isValid: true,
  };
};
