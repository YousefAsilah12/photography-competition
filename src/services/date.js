import moment from "moment";
export function extractDateTime(datetimeStr) {
  const datetimeObj = moment(datetimeStr);
  const dateStr = datetimeObj.format("DD-MM-YYYY");
  const timeStr = datetimeObj.format("HH:mm");
  return {
    date: dateStr,
    time: timeStr
  };
}