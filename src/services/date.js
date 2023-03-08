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

export function isDateUpToToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  // Remove time information from dates to compare only date information
  const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return dateWithoutTime >= todayWithoutTime;
}

export function isFinishAfterStart(startDate, finishDate) {
  const start = new Date(startDate);
  const finish = new Date(finishDate);

  return finish > start;
}
