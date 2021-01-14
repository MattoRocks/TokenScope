//These variables are needed between functions
var tokenJSONString;
var asset;

//This swaps the input form
function swapForms() {
  var osHeader = document.getElementById("osHeader");
  var tdHeader = document.getElementById("tdHeader");
  if (osHeader.style.display === "none") {
    osHeader.style.display = "block";
    tdHeader.style.display = "none";
  } else {
    osHeader.style.display = "none";
    tdHeader.style.display = "block";
  }
}

//Opens the full JSON response in a new window
function JSONWindow() {
  var x = window.open();
  x.document.open();
  x.document.write('<html><head><title>JSON Response</title></head><body><pre>' + tokenJSONString + '</pre></body></html>');
  x.document.close();
}

//Token Data form entry
function tokenData() {
  var rawAddress = document.getElementById('tok-con').value;
  var rawTokenId= document.getElementById('tok-id').value;
  var address = DOMPurify.sanitize(rawAddress);
  var tokenId = DOMPurify.sanitize(rawTokenId);
  //Relatively lame address check
  if (address.length != 42 || address.substr(0,2) != "0x") {
    window.alert("That is not a proper Ethereum Address");
    return;
  }
  //build asset
  asset = address + "/" + tokenId;
  OSFetch(asset);
}

//Permalink form entry
function permalink() {
  var rawEntry = document.getElementById('ospl').value;
  var cleanedEntry = DOMPurify.sanitize(rawEntry);
  //Relatively lame URL check
  var urltest = cleanedEntry.substr(0,26); 
  if (urltest != "https://opensea.io/assets/") {
      window.alert("That is not a proper asset permalink");
      return;
  }
  //pulls asset from entry
  var len = cleanedEntry.length;
  asset = cleanedEntry.substr(26, len - 26);
  if (asset.length == (asset.lastIndexOf("/") + 1)) {
    asset = asset.substr(0, asset.length - 1);
  }
  OSFetch(asset);
}


function OSFetch(asset) {
  var apiurl = "https://api.opensea.io/api/v1/asset/" + asset + "/?format=json"; // Use your own free Opensea API Key on this line like this: ... asset + "/?format=json;X-API-KEY=your-key-here";
  //Gets the API
  document.getElementById("hodl").innerHTML = "<h1>Hold... HOLD... HODL!</h1>";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var rawTextResponse = this.responseText;
      var cleanTextResonse = DOMPurify.sanitize(rawTextResponse);
      var tokenJSON = JSON.parse(cleanTextResonse);
      tokenJSONString = JSON.stringify(tokenJSON, null, "    ");
      //Show or Hide stuff
      document.getElementById("hodl").innerHTML = "";
      document.getElementById("inputArea").style.display = "none";
      document.getElementById("tokenData").style.display = "block";
      document.getElementById("startTitle").style.display = "none";
      document.getElementById("restartTitle").style.display = "block";
      //Replace Contract-area HTML
      document.getElementById("creatorContractName").innerHTML = "Name: " + tokenJSON.asset_contract.name;
      document.getElementById("creatorContractSymbol").innerHTML = "Symbol: " + tokenJSON.asset_contract.symbol;
      document.getElementById("creatorContractDescription").innerHTML = "Description: " + tokenJSON.asset_contract.description;
      document.getElementById("creatorContractStandard").innerHTML = "Schema: " + tokenJSON.asset_contract.schema_name;
      document.getElementById("creatorContractAddress").innerHTML = "Address: " + tokenJSON.asset_contract.address;
      document.getElementById("creatorContractURL").innerHTML = "External URL: <a href=\"" + tokenJSON.asset_contract.external_link + "\">" + tokenJSON.asset_contract.external_link + "</a>";
      //Replace Token-area HTML
      document.getElementById("tokenName").innerHTML = "Name: " + tokenJSON.name;
      document.getElementById("tokenID").innerHTML = "Token ID: " + tokenJSON.token_id;
      document.getElementById("tokenURL").innerHTML = "External URL: <a href=\"" + tokenJSON.external_link + "\">" + tokenJSON.external_link + "</a>";
      if (tokenJSON.image_original_url != null) {
        document.getElementById("tokenImage").innerHTML = "<img style=\"height: 100%; width: 100%; object-fit: contain\" src=\"" + tokenJSON.image_original_url + "\" alt=\"token image\"></img><br><br>";
        document.getElementById("tokenImageURL").innerHTML = "Image file: <a href=\"" + tokenJSON.image_original_url + "\">" + tokenJSON.image_original_url + "</a>";
      } else {
        document.getElementById("tokenImageURL").innerHTML = "Image file: null";
      }
      if (tokenJSON.animation_original_url != null) {
        document.getElementById("tokenAnimation").innerHTML = "<br><video style=\"height: 100%; width: 100%; object-fit: contain\" controls><source src=\"" + tokenJSON.animation_original_url + "\"></video><br><br>";
        document.getElementById("tokenAnimationURL").innerHTML = "Animation file: <a href=\"" + tokenJSON.animation_original_url + "\">" + tokenJSON.animation_original_url + "</a>";
      } else {
        document.getElementById("tokenAnimationURL").innerHTML = "Animation file: null";
      }
      var traitQTY = tokenJSON.traits.length;
      document.getElementById("tokenTraitQTY").innerHTML = "Trait quantity: " + traitQTY;
      var traitList = "";
      var traitValue;
      for (i = 0; i < traitQTY; i++) {
        traitValue = tokenJSON.traits[i].value;
        traitList += tokenJSON.traits[i].trait_type + ":" + traitValue;
        if (i != (traitQTY - 1)) {
          traitList += ", "
        }
      }
      document.getElementById("tokenTraitList").innerHTML = "Traits (type:value): " + traitList;
      //Replace Token-Description-area HTML
      var mdContent = "<zero-md><script type=\"text/markdown\">" + tokenJSON.description + "</script></zero-md>";
      document.getElementById("tokenDescription").innerHTML = mdContent;
      //Replace Token-Interaction-area HTML
      var etherscanLink = '<a title=\"Click to open Contract Interaction\" href=\"https://etherscan.io/token/' + asset.substr(0, 42) + '?a=' + asset.substr(43,  (asset.length - 43)) + '#readContract\" target = \"_blank\">Query the contract directly on etherscan.io</a>';
      document.getElementById("tokenInteraction").innerHTML = etherscanLink;
    }
  };
  xmlhttp.open("GET", apiurl, true);
  xmlhttp.send();
}