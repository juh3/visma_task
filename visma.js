// Creating class and assigning 
class VismaURIParser {

  // Initializing object properties and assigning execution logic
  constructor(uri) {
    // Initializing class property uri
    this.uri = uri;

    // Calling class method parseURI that first parses the URI
    this.parseURI();

    // Calling class method validateURI that validates the URI
    this.validateURI();

    // The class returns path and parameters
    return ({
      path: this.path, parameters: this.parameters
    })
  }

  // Class method parseURI
  parseURI() {
    try {
      // Initializing class parameter which is a dictionary
      this.parameters = {}
      // Constructs the URL from string
      let url = new URL(this.uri);

      // Gets path, scheme and parameters from the url
      this.path = url.hostname
      this.scheme = url.protocol

      const searchingparams = new URLSearchParams(url.searchParams)

      // Loops through the url parameters and assigns them to a dictionary for future use
      searchingparams.forEach((value, index) => {
        this.parameters[index] = value
      })
    } catch (e) {
      console.error("Unparseable URL", e)
    }
  }

  // Class method validateURI which validates the URI according to the "rules"
  validateURI() {
    if (this.scheme !== "visma-identity:") {
      throw new Error(`Invalid Scheme, expected visma-identity received ${this.scheme}`)
    }

    // Go through the different pathnames and the parameters associated with it

    switch (this.path) {
      case "login":
        if (!("source" in this.parameters)) {
          throw new Error(`Invalid parameters for the path login`)
        }
        break;

      case "confirm":
        if (!("source" in this.parameters) || !("paymentnumber" in this.parameters)) {
          throw new Error(`Invalid parameters for the path confirm`)
        }
        else {
          if (isNaN(this.parameters["paymentnumber"])) {
            throw new Error(`Invalid parameters for the path confirm`)
          }
          this.parameters["paymentnumber"] = parseInt(this.parameters["paymentnumber"])
        }
        break;

      case "sign":
        if (!("source" in this.parameters) || !("documentid" in this.parameters)) {
          throw new Error(`Invalid parameters for the path sign`)
        }
        break;
    }

  }

  // getPath and getParameters which are helper functions not used in this implementation
  getPath() {
    return this.path;
  }

  getParameters() {
    return this.parameters
  }
}


// Client class that uses the VismaURIParser
class Client {
  request;

  constructor() {
    let uri = "visma-identity://sign?source=netvisor&documentid=322356"
    this.request = new VismaURIParser(uri)
    console.log(this.request)
  }
}

const client = new Client()