function getTimestamp() {
  return new Date().toLocaleTimeString(["en-GB"], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default getTimestamp;
