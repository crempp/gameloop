export function onReady(cb) {
  if (document.readyState === "complete") {
    cb(...arguments);
  } else {
    const prevORSC = document.onreadystatechange;  //save previous event
    document.onreadystatechange = function () {
      if (typeof(prevORSC) === "function"){
        prevORSC();
      }
      if (document.readyState === "complete") {
        cb(...arguments);
      }
    };
  }
}
