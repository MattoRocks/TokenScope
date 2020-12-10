function fetchData() {
  //Relatively lame URL check
  var variable = document.getElementById('ospl').value;
  var urltest = variable.substr(0,26);
  if (urltest != "https://opensea.io/assets/") {
      window.alert("That is not a proper asset permalink");
      return;
  }

  //Builds API Url
  var len = variable.length;
  var asset = variable.substr(26, len - 26);
  if (asset.length == (asset.lastIndexOf("/") + 1)) {
    asset = asset.substr(0, asset.length - 1);
  }

  var apiurl = "https://api.opensea.io/api/v1/asset/" + asset + "/?format=json"; //to use your own free, Opensea.io API, modify this line, like this: ...asset + "/?format=json;X-API-KEY=###..."
  document.getElementById("hodl").innerHTML = "<h1>Hold... HOLD... HODL!</h1>";

  //Gets the API
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var rawTextResponse = this.responseText;
      var cleanTextResonse = DOMPurify.sanitize(rawTextResponse); //This uses the DOMPurify javascript to clean the returned html.

      var tokenJSON = JSON.parse(cleanTextResonse);
      var tokenString = JSON.stringify(tokenJSON, null, "    ");

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
        document.getElementById("tokenImageURL").innerHTML = "Image file: <a href=\"" + tokenJSON.image_original_url + "\">" + tokenJSON.image_original_url + "</a>";
      } else {
        document.getElementById("tokenImageURL").innerHTML = "Image file: null";
      }
      if (tokenJSON.animation_original_url != null) {
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
      var mdContent = "<zero-md><script type=\"text/markdown\">" + tokenJSON.description + "</script></zero-md>"; //zero-md is a javascript library that displays Markdown as html.
      document.getElementById("tokenDescription").innerHTML = mdContent;
    }
  };
  xmlhttp.open("GET", apiurl, true);
  xmlhttp.send();
}
