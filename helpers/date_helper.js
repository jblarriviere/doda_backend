// récupère l'heure d'une date et la met au format "HHmm"
const getTime = strDate => {
  let date = new Date(strDate);
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString();
  let minuts = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();
  return hours + minuts;
}

// transforme les occurences d'un évent Ville de Paris au format google periods
const parseOccurrences = str => {
  str.split(';').map(occurrence => {
    let date = new Date(occurrence.split('_')[0]);
    let day = date.getDay();
    let start = getTime(occurrence.split('_')[0]);
    let end = getTime(occurrence.split('_')[1]);
    return {
      close: {
        day,
        time: end
      },
      open: {
        day,
        time: start
      }
    }
  })
}

const parseDate = strDate => {
  let newStr = strDate.split('/')
    .reverse()
    .join('-');
  let date = new Date(newStr);
  return date;
}

module.exports = { parseOccurrences, parseDate };

