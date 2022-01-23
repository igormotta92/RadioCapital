const tcp = {
  getUrlBase: () => {
    const url = new URL(document.URL);
    return url.origin;
  },

  /**
   * Retorna a URL do servidor backend
   * @returns String
   */
  getUrlBackend: () => {
    if (process.env.REACT_APP_URL_BACKEND != '') {
      return process.env.REACT_APP_URL_BACKEND;
    }

    const url = new URL(document.URL);
    const port = (process.env.REACT_APP_URL_BACKEND_PORT != '') ? ":" + process.env.REACT_APP_URL_BACKEND_PORT : "";
    const baseUrlPort = [url.protocol + '//', url.hostname, port].join('');

    return baseUrlPort;
  }
}

export default tcp;
