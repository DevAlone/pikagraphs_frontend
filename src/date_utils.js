function timestampToString(timestamp) {
    return new Date(timestamp * 1000).toLocaleString("ru-RU");
}

export default timestampToString;
