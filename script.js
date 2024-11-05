// if page url is "search.lib.keio.ac.jp*", then find all elements with attribute data-field-selector="ispartof" and get the text of the child of the child of the object


function run(){
  console.log("Starting impact factor");
  var checkExist = setInterval(function() {
      addImpactFactor()
  }, 5000); // check every 2000ms
}

run();

async function addImpactFactor() {
  var elements = document.querySelectorAll('[data-field-selector="ispartof"]');
  // only get elements with less than 3 children
  elements = Array.prototype.filter.call(elements, function(element) {
    return element.children.length < 3;
  });
  var i;
  console.log(`Number of elements: ${elements.length}`);
  for (i = 0; i < elements.length; i++) {
    var journal_name = elements[i].children[0].children[0].innerText.split(',')[0];
    var IF = await searchImpactFactor(journal_name)
    console.log(`${journal_name}, impact factor: ${IF}`);
    // create a new div elements only if there is less than 3 children to the elements[i]
    if (elements[i].children.length < 3){
      var newDiv = document.createElement("div");
      newDiv.setAttribute("id", "impact_factor");
      newDiv.setAttribute("style", "color: red; font-weight: bold; font-size: 20px;");
      newDiv.innerHTML = `Impact Factor: ${IF}`;
      elements[i].appendChild(newDiv); 
    };
 
  }
}

function searchImpactFactor(journalName) {
  const searchUrl = `http://localhost:8090?url=https://www.resurchify.com/find/?query=${encodeURIComponent(journalName)}`;
  console.log(searchUrl);
  // get html with fetch
  var if_promise = fetch(searchUrl)
    .then(response =>response.text())
    .then(text => {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, 'text/html');
      const impactFactor = parseImpactFactor(htmlDocument.body.innerHTML);
      return impactFactor;
    }
  );
  return if_promise;
}

function parseImpactFactor(html) {
  const regex = /Impact Score\: *([0-9.]+)/i;
  const matches = regex.exec(html);
  if (matches && matches.length > 1) {
    return parseFloat(matches[1]);
  }

  return null;
}
