(function() {
  const makeOptions = (parent, numOptions) => {
    for (let i = 0; i <= numOptions; i++) {
      parent.append($(`<option value="${i}">${i}</option>`));
    }
  }
  
  window.HELPERS = {
    makeOptions
  }
})();
