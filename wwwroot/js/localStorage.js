window.yolArkadasiStorage = {
    get: key => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value)
};

window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
